const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");
const secret_key = "this is secret key";

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "missing required field" });
  }

  const emailRegex = /^[^\s@]+@gmail\.com$/;

  console.log("Email:", email);
  console.log("Is email valid? ", emailRegex.test(email));

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "email format is wrong" });
  }

  //checking if user already exist
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(404).json({ message: "user already exist" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error });
  }

  //adding the user to database
  const user = new User({
    name,
    email,
    password,
  });

  try {
    await user.save();
    return res.json({ message: "user saved", user: user });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required field" });
  }

  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
      if (password === userFound.password) {
        //token and http cookie
        const token = jwt.sign({ userId: userFound._id }, secret_key);

        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ message: "you are logged in", user: userFound });
      } else {
        return res.status(400).json({ error: "wrong password" });
      }
    } else {
      // return res.status(400).json({ error: "user not found!" });
      return res.status(400).json({ error: "user not found!" });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

exports.signUp = signUp;
exports.login = login;
