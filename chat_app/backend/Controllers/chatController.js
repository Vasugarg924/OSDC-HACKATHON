const Chat = require("../Models/chatSchema");
const Message = require("../Models/messageSchema");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ error: "content/chatid is empty" });
  }

  const newMessage = new Message({
    sender: req.user._id,
    content: content,
    chat: chatId,
  });

  try {
    let message = await newMessage.save();

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.status(200).json(message);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
const fetcMessage = async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");

    res.status(200).json({ message: message });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
module.exports = { sendMessage, fetcMessage };
