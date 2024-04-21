const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
// const cookieParser = require("cookie-parser");

const authVerify = async (req, res, next) => {
  // console.log(req.cookies.token);
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "token is not valid" });
    }
    const verify = jwt.verify(token, "this is secret key");
    // console.log(verify);

    if (!verify) {
      return res.status(400).json({ error: "invalid secret key" });
    }

    const user = await User.findOne({ _id: verify.userId }).select("-password");
    // console.log(user.name);
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    req.user = user;
  } catch (error) {
    res.status(400).json({ error: error });
  }
  next();
};

module.exports = authVerify;
