const Chat = require("../Models/chatSchema");

const OneToOneChat = async (req, res) => {
  const senderId = req.user._id;
  const recieverId = req.body.userId;

  if (!recieverId) {
    console.log("user id is not sent from frontend");
    return res.status(400).json({ error: "user id is not sent from frontend" });
  }

  //to check if the chat with user already exist
  try {
    var isChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [senderId, recieverId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");
  } catch (error) {
    return res.status(400).json({ error: error });
  }

  if (isChat.length > 0) {
    return res.status(200).json({ chat: isChat[0] });
  } else {
    var newChat = new Chat({
      isGroupChat: false,
      users: [senderId, recieverId],
    });
  }

  const createChat = await newChat.save();
  const populatedChat = await createChat.populate("users", "-password");
  return res.status(200).json({ chaxst: populatedChat });
};

const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.send(chats);
  } catch (error) {
    console.log(error);
  }
};

const groupChats = async (req, res) => {
  if (!req.body.groupName || !req.body.members) {
    return res
      .status(400)
      .json({ error: " group name or members can't be empty" });
  }

  var members = JSON.parse(req.body.members);

  if (members.length < 2) {
    return res
      .status(400)
      .send("more than 2 users required to form group chat.");
  }

  members.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.groupName,
      isGroupChat: true,
      users: members,
      groupAdmin: req.user,
    });

    const chatConsole = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(chatConsole);
    console.log("added group chat");
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const groupRename = async (req, res) => {
  const { groupId, groupNewName } = req.body;

  if (!groupNewName) {
    return res.status(400).json({ error: "group new name cannot be empty." });
  }

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { chatName: groupNewName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) {
      return res.status(404).json({ error: "Group chat not found" });
    }
    return res.status(200).json({ group: updatedGroup });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const groupAdd = async (req, res) => {
  const { groupId, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "select a user, can't be empty" });
  }

  try {
    const groupChat = await Chat.findById(groupId);
    const isMember = groupChat.users.includes(userId);
    if (isMember) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    groupChat.users.push(userId);

    const updatedGroup = await groupChat.save();
    const populatedGroup = await Chat.findById(groupChat)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({ groupChat: populatedGroup });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const groupRemove = async (req, res) => {
  const { groupId, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "select a user, can't be empty" });
  }

  try {
    const groupChat = await Chat.findById(groupId);
    const isMember = groupChat.users.includes(userId);
    if (!isMember) {
      return res.status(400).json({ error: "User is not in the group" });
    }

    groupChat.users.pull(userId);

    const updatedGroup = await groupChat.save();
    const populatedGroup = await Chat.findById(groupChat)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({ groupChat: populatedGroup });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

// exports.OneToOneChat = OneToOneChat;

// exports.fetchChats = fetchChats;
module.exports = {
  OneToOneChat,
  fetchChats,
  groupChats,
  groupRename,
  groupAdd,
  groupRemove,
};
