import { Box, FormControl, Input } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { MyContext } from "../ContextApi/Context";
import ChattingArea from "./chattingArea";

function Chatting() {
  const { selectedChat } = useContext(MyContext);
  const { loading, setLoading } = useState(false);

  return (
    <Box
      // border={"2px solid pink"}
      bg={"#171717"}
      flex={1}
      color={"white"}
      // padding={3}
      display={"flex"}
      flexDir={"column"}
    >
      {selectedChat ? (
        <ChattingArea />
      ) : (
        // <FormControl>
        //   <Input
        //     placeholder="send message"
        //     position={"relative"}
        //     bottom={"0"}
        //   />
        // </FormControl>
        <Box
          color={"white"}
          textAlign={"center"}
          position={"relative"}
          top={"40vh"}
          margin={"auto"}
          fontSize={20}
        >
          No chat selected
        </Box>
      )}
    </Box>
  );
}

export default Chatting;
