import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import GroupChatModel from "./groupchatstuff/GroupChatModel";
import { useContext } from "react";
import { MyContext } from "./ContextApi/Context";

function ChatList({ clickfn }) {
  //   const [selectedChat, setSelectedChat] = useState("");
  const { selectedChat, setSelectedChat, fetchChat, setfetchChat } =
    useContext(MyContext);
  const [chat, setChat] = useState([]);

  const [isChat, setIsChat] = useState(false); //for selected chat bg

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/chat", {
        withCredentials: true,
      });
      //   console.log("fetch chats data: ", data);
      setChat(data);
      setIsChat(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);
  useEffect(() => {
    fetchChats();
  }, [fetchChat]);

  const getSender = (e) => {
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(loggedUser.name);
    const filteredUser = e.users.filter((user) => {
      return user.name !== loggedUser.name && user.email !== loggedUser.email;
    });
    // console.log(filteredUser[0].name);
    return filteredUser[0]?.name.toUpperCase();
  };

  const clicked = (e) => {
    // setSelectedChat(e._id);
    setSelectedChat(e);
    localStorage.setItem("selectedChat", e._id);
    clickfn();
  };

  useEffect(() => {
    if (chat.length > 0 && !selectedChat) {
      const storedChatId = localStorage.getItem("selectedChat");
      if (storedChatId) {
        const chatToSelect = chat.find((e) => e._id === storedChatId);
        if (chatToSelect) {
          // console.log(chatToSelect);
          setSelectedChat(chatToSelect);
        }
      }
    }
  }, [chat, selectedChat]);
  // useEffect(() => {
  //   const storedChatId = localStorage.getItem("selectedChat");
  //   if (storedChatId) {
  //     // console.log(storedChatId);
  //     // console.log("chat @ is: ", chat);
  //     try {
  //       const chatToSelect = chat?.find((e) => e._id === storedChatId);
  //       console.log(chatToSelect);
  //       setSelectedChat(chatToSelect._id);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   // if (chat.length > 0 && !selectedChat) {
  //   //   const storedChatId = localStorage.getItem("selectedChat");
  //   //   if (storedChatId) {
  //   //     const chatToSelect = chat?.find((e) => e._id === storedChatId);
  //   //     if (chatToSelect) {
  //   //       // console.log(chatToSelect);
  //   //       setSelectedChat(chatToSelect._id);
  //   //     }
  //   //   }
  //   // }
  // }, [isChat]);

  return (
    <>
      {/* chat section user list */}
      {chat?.map((e) => (
        <Flex
          key={e._id}
          //   onClick={() => setSelectedChat(e)}
          onClick={() => clicked(e)}
          margin={"10px 0px"}
          //   border={"1px solid red"}
          padding={"20px"}
          //   bg={"#212121"}
          bg={
            selectedChat && selectedChat._id === e._id ? "#d93a3a" : "#212121"
          }
          borderRadius={"17px"}
          cursor={"pointer"}
        >
          <Avatar src="" />
          <Box ml="3" color={"white"}>
            <Text fontWeight="bold" letterSpacing="1px">
              {e.isGroupChat ? e.chatName?.toUpperCase() : getSender(e)}
            </Text>
            {/* <Text fontSize="sm">{e.latestMessage.content}</Text> */}
            <Text fontSize="sm">
              <span style={{ fontWeight: "bold", color: "#ffca51" }}>
                {e.users.find((u) => u._id === e.latestMessage?.sender)?.name}
              </span>
              : {e.latestMessage?.content}
            </Text>
          </Box>
        </Flex>
      ))}
    </>
  );
}

export default ChatList;
