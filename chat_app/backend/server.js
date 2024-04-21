require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./Routes/auth");
const cookieParser = require("cookie-parser");
const authVerify = require("./Middelware/authMiddelware");
const messageRouter = require("./Routes/message");
const cors = require("cors");
const chatRouter = require("./Routes/chat");

// parse json and url-data (are Middelwares)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // origin: "http://[ip]",
    credentials: true,
  })
);
app.use(cookieParser());

//connect to mongoDB
const DB =process.env.DB_URI;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to database");
    //server start
    // const server = app.listen(8000, "{ip}", () => {
    //   console.log("server has started at port: 8000");
    // });
    const server = app.listen(8000, () => {
      console.log("server has started at port: 8000");
    });

    const io = require("socket.io")(server, {
      pinTimeout: 60000,
      cors: {
        // origin: "http://{ip}",
        origin: process.env.FRONTEND_URL,
      },
    });

    io.on("connection", (socket) => {
      console.log("connected to socket.io");

      socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("userDATA.id: ", userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined Room: ", room);
      });

      socket.on("new message", (newMessageRecieved) => {
        // console.log(newMessageRecieved);
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
          if (user == newMessageRecieved.sender._id) {
            return;
          }
          console.log("user@#! ", user);
          socket.in(user).emit("message recieved", newMessageRecieved);
        });
      });
    });
  })
  .catch((e) => {
    console.log("erroR: ", e);
  });

//Routes
app.use("/auth", authRouter);
app.use("/api", messageRouter);
app.use("/chat", chatRouter);

// app.get('/testDisplay', authVerify)

//just a test: this below one only!
app.post("/user", authVerify, (req, res) => {
  // console.log("huehue token : ");
  // console.log(req.cookies.token);
  // console.log(req.user);
  const user = req.user;
  res.json({ user });
});
