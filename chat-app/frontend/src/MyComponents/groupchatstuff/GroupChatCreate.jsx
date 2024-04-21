import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import GroupChatModel from "./GroupChatModel";
import { AddIcon } from "@chakra-ui/icons";

function GroupChatCreate() {
  return (
    <Box
      color={"white"}
      display={"flex"}
      justifyContent={"space-between"}
      // border={"2px solid green"}
      padding={"18px"}
      bg={"#000000"}
      borderRadius={"10px"}
      mb={"10px"}
    >
      <Text fontSize={"22px"}>Chats</Text>
      <GroupChatModel>
        <Button height={"38px"} _hover={{ backgroundColor: "red" }}>
          <Text mr={"15px"}>Group Chat</Text>
          <AddIcon />
        </Button>
      </GroupChatModel>
    </Box>
  );
}

export default GroupChatCreate;
