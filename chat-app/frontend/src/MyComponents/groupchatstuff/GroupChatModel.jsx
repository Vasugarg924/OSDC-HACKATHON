import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import UserList from "../UserList";
import UserBadge from "./UserBadge";
import { MyContext } from "../ContextApi/Context";

function GroupChatModel({ children }) {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  //form
  const [name, setName] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [addedUser, setAddedUser] = useState([]);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchChat, setfetchChat } = useContext(MyContext);

  const handleSearch = async (e) => {
    if (!e) {
      setUserInput(e);
      return;
    }
    setUserInput(e);
    console.log(userInput.length);
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user?search=${e}`,
        {
          withCredentials: true,
        }
      );
      setSearchUsers(data.user);
      //   console.log(searchUsers);
      //   console.log(data);
      setLoading(false);

      //   console.log(data.user.length);
    } catch (error) {
      console.log(error);
    }
  };

  const userAdd = (userToAdd) => {
    if (addedUser.includes(userToAdd)) {
      alert("this user already added");
      return;
    }
    setAddedUser([...addedUser, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setAddedUser(addedUser.filter((e) => e._id !== userToDelete._id));
  };

  const groupSubmit = async (but) => {
    if (!name || !addedUser) {
      alert("name or userlist can't be empty");
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/group-create`,
        {
          groupName: name,
          members: JSON.stringify(addedUser.map((e) => e._id)),
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      await onClose();
      // window.location.reload();
      setfetchChat(!fetchChat);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent bg={"#1e1e1e"} color={"#f2f2f2"}>
          <ModalHeader color={"#fffa03"}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={"20px"}>
              <FormLabel color={"#b9b9b9"}>Name</FormLabel>
              <Input
                autoComplete="off"
                type="name"
                onChange={(e) => setName(e.target.value)}
                focusBorderColor="yellow"
              />
            </FormControl>
            <FormControl>
              <FormLabel color={"#b9b9b9"}>Members</FormLabel>
              <Input
                autoComplete="off"
                type="members"
                focusBorderColor="yellow"
                value={userInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* rendering selected user badge */}
            <Flex>
              {addedUser?.map((e) => (
                <UserBadge
                  key={e._id}
                  e={e}
                  handleDelete={() => handleDelete(e)}
                />
              ))}
            </Flex>

            {/* rendering userlist */}
            <Box>
              {loading ? (
                <Spinner
                  mt={"10px"}
                  thickness="2px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="orange.500"
                  size="sm"
                />
              ) : searchUsers.length > 0 ? (
                searchUsers.map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    // accessChat={accessChat}
                    class23={"groupResult"}
                    accessChat={() => userAdd(user)}
                  />
                ))
              ) : searchUsers.length === 0 && userInput.length > 0 ? (
                <Text color={"red"}>No user found !</Text>
              ) : (
                ""
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={groupSubmit} bg={"#ffe2001f"} color={"#fffa03"}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
        {/* <Box>
          {users?.map((e) => (
            <UserList user={e} />
          ))}
        </Box> */}
      </Modal>
    </>
  );
}

export default GroupChatModel;
