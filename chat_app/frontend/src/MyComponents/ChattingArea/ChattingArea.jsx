import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  border,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../ContextApi/Context";
import axios from "axios";
import io from "socket.io-client";

const EndPoint = `${import.meta.env.VITE_BACKEND_URL}`;
var socket, selectedChatCompare;

function ChattingArea() {
  const [newMessage, setNewMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const { selectedChat } = useContext(MyContext);

  const [chatLoading, setChatLoading] = useState(false);
  const messagesBoxRef = useRef(null);
  const [placeholdername, setPlaceholdername] = useState("");
  useEffect(() => {
    const handlePlaceholderName = () => {
      console.log("selec2@# ", selectedChat);
      const reciever = selectedChat.users.find((e) => e._id != loggedUserId);
      console.log("reciever@#@ ", reciever);
      setPlaceholdername(reciever.name);
    };

    handlePlaceholderName();
  }, [selectedChat]);

  const [setsocketConnected, setSetsocketConnected] = useState(false);

  const loggedUserId = JSON.parse(localStorage.getItem("userInfo"))._id;
  const loggedUserName = JSON.parse(localStorage.getItem("userInfo")).name;
  const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      //   console.log(e);
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/chat/send",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          {
            withCredentials: true,
          }
        );
        setNewMessage("");
        socket.emit("new message", data);
        setAllMessage([...allMessage, data]);

        console.log(allMessage);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
    socket.emit("setup", loggedUser);
    socket.on("connection", () => setsocketConnected(true));

    messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
  }, []);

  const fetchMessage = async () => {
    setChatLoading(true);
    if (!selectedChat) {
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/chat/fetch/${selectedChat._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      setAllMessage(data.message);

      setChatLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessage();
    console.log("selctedchat@# ", selectedChat);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // useEff
  useEffect(() => {
    messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
  }, [allMessage]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // console.log(newMessageRecieved);

      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
      } else {
        setAllMessage([...allMessage, newMessageRecieved]);
      }
    });
  });

  const inputHandler = (e) => {
    setNewMessage(e.target.value);
    // console.log(e.target.value);
  };
  return (
    <>
      {chatLoading ? (
        <Box
          // style={{ border: "2px solid blue", color: "aqua" }}
          flex={"1"}
          maxHeight={"85vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="red.100"
            color="red.500"
            size="xl"
            height={"30vh"}
            width={"30vh"}
          />
        </Box>
      ) : (
        <>
          <Box
            // m={2}
            // border={"2px solid pink"}
            flex={"1"}
            maxHeight={"85vh"}
            p={3}
            display={"flex"}
            flexDir={"column"}
            overflow={"auto"}
            ref={messagesBoxRef}
            css={{
              "&::-webkit-scrollbar": {
                width: "6px",
                backgroundColor: "#2f3136",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#202225",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#17181b",
              },
            }}
          >
            {allMessage.map((e) => (
              <span>
                {/* {console.log('its e@#@" ', e)} */}
                {/* {selectedChat.isGroupChat ? <span>{e.sender.name}</span> : ""} */}
                {selectedChat.isGroupChat ? (
                  e.sender._id !== loggedUserId ? (
                    <span
                      style={{
                        color: "#ff7b31",
                        fontSize: "12px",
                        marginRight: "8px",
                      }}
                    >
                      {e.sender.name} :
                    </span>
                  ) : null
                ) : null}
                <Text
                  my={1}
                  color={"black"}
                  bg={e.sender._id == loggedUserId ? "#c02921" : "#d1d1d1"}
                  display={"inline-block"}
                  float={e.sender._id == loggedUserId ? "right" : ""}
                  padding={"10px"}
                  //border radius:
                  borderBottomRightRadius={
                    e.sender._id == loggedUserId ? "0px" : "10px"
                  }
                  borderBottomLeftRadius={
                    e.sender._id == loggedUserId ? "10px" : "0px"
                  }
                  borderTopLeftRadius={"10px"}
                  borderTopRightRadius={"10px"}
                >
                  {e.content}
                </Text>
              </span>
            ))}
          </Box>

          <Box
            // border={"1px solid aqua"}
            flex={"0.07"}
            // flex={"1"}
            // p={1}
            pt={1}
            bg={"black"}
            position={"relative"}
            bottom={"0"}
            height={"10px"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <FormControl
              display={"flex"}
              flexDirection={"row"}
              px={2}
              onKeyDown={sendMessage}
              isRequired
              mt={"0.5"}
            //   border={"2px solid red"}
            >
              <Input
                placeholder={
                  !selectedChat.isGroupChat
                    ? "Message @" + placeholdername
                    : "Chat in: " + selectedChat.chatName.toUpperCase()
                }
                onChange={(e) => inputHandler(e)}
                value={newMessage}
                bg={"#212121"}
                height={10}
              />
            </FormControl>
          </Box>
        </>
      )}
    </>
  );
}

export default ChattingArea;
