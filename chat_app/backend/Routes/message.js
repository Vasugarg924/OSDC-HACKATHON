const express = require("express");
const authVerify = require("../Middelware/authMiddelware");
const User = require("../Models/userSchema");
const {
  OneToOneChat,
  fetchChats,
  groupChats,
  groupRename,
  groupAdd,
  groupRemove,
} = require("../Controllers/messageController");
// const OneToOneChat = require("../Controllers/messageController");
const router = express.Router();

//Search User   (/api/user?search=user_name)
router.get("/user", authVerify, async (req, res, next) => {
  const searchUser = req.query.search;

  if (!searchUser) {
    return res.status(400).json({ error: "query empty" });
  }

  console.log(searchUser);

  try {
    const userList = await User.find({
      $or: [
        { name: { $regex: searchUser, $options: "i" } },
        { email: { $regex: searchUser, $options: "i" } },
      ],
    }).select("-password");

    //   console.log(userList);
    res.json({ user: userList });
  } catch (error) {
    return res.status(400).json({ error: "user not found" });
  }
});

router.post("/chat", authVerify, OneToOneChat);
router.get("/chat", authVerify, fetchChats);

router.post("/group-create", authVerify, groupChats);
router.put("/group-rename", authVerify, groupRename);

router.put("/group-add", authVerify, groupAdd);
router.put("/group-remove", authVerify, groupRemove);

module.exports = router;
