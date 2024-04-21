import { Box, Button, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../ContextApi/Context";
import { InfoIcon } from "@chakra-ui/icons";
import ChatInfo from "./ChatInfo";

function Header() {
  const { selectedChat, chatName, setChatName } = useContext(MyContext);
  //   const [chatName, setChatName] = useState("");

  const getSender = async (e) => {
    if (e.isGroupChat == false) {
      const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

      const filteredUser = await e?.users.filter((user) => {
        return user.name !== loggedUser.name && user.email !== loggedUser.email;
      });
      console.log(filteredUser[0].name);
      if (filteredUser) {
        setChatName(filteredUser[0].name.toUpperCase());
      }
    } else if (e.isGroupChat) {
      setChatName(e.chatName);
    }
  };

  useEffect(() => {
    getSender(selectedChat);
    // console.log(selectedChat);
  }, [selectedChat]);

  const clickInfo = () => {
    console.log(selectedChat);
    if (selectedChat.isGroupChat) {
      render;
    }
  };

  return (
    <Box
      color={"white"}
      //   border={"2px solid red"}
      mt={1}
      mx={2}
      height={8}
      borderRadius={10}
      padding={"2px 10px"}
      flex={"1"}
      bgColor={"black"}
    >
      {selectedChat && (
        <Box textAlign={"center"}>
          {chatName}
          <ChatInfo>
            <InfoIcon float={"right"} mt={1} cursor={"pointer"} />
          </ChatInfo>
        </Box>
      )}
    </Box>
  );
}

export default Header;
