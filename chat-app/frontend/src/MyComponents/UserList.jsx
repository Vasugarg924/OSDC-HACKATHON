import {
  Avatar,
  Box,
  Flex,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { color } from "framer-motion";
import React from "react";

function UserList({ user, accessChat, class23 }) {
  const accessChat2 = (userId) => {
    accessChat(userId);
    // console.log("hela");
  };
  return (
    // <Box
    //   display={"flex"}
    //   flexDir={"column"}
    //   p={"10px"}
    //   // bg={"#b4f5ff"}
    //   bg={class23 == "groupResult" ? "rgb(250 242 0)" : "blue"}
    //   m={"10px"}
    //   borderRadius={"8px"}
    //   _hover={{ bg: "orange", cursor: "pointer" }}
    //   onClick={() => accessChat2(user._id)}
    // >
    //   {user.name}
    //   <span>email: {user.email}</span>
    // </Box>
    <Flex
      key={user._id}
      margin={"10px 0px"}
      padding={"15px"}
      bg={class23 == "groupResult" ? "#5b4d3166" : "#212121"}
      color={class23 == "groupResult" ? "gold" : "white"}
      borderRadius={"8px"}
      cursor={"pointer"}
      _hover={{ bg: "orange", cursor: "pointer" }}
      onClick={() => accessChat2(user._id)}
    >
      <Avatar src="" />
      <Box ml="3" color={"white"} display={"flex"}>
        <Text fontWeight="bold" letterSpacing="1px" margin={"auto"}>
          {user.name}
        </Text>
        {/* <Text fontSize="sm">email: {user.email}</Text> */}
      </Box>
    </Flex>
  );
}

export default UserList;
