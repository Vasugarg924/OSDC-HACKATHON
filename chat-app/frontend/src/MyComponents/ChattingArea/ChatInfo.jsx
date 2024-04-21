import {
  Badge,
  Box,
  Button,
  FormControl,
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
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { MyContext } from "../ContextApi/Context";
import axios from "axios";
import UserList from "../UserList";
import { CloseIcon } from "@chakra-ui/icons";

function ChatInfo({ children }) {
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayTwo />);

  const {
    selectedChat,
    setSelectedChat,
    chatName,
    setChatName,
    fetchChat,
    setfetchChat,
  } = useContext(MyContext);

  const [groupName, setGroupName] = useState("");

  const handleRename = async () => {
    if (!groupName) {
      return;
    }
    const selectedchatId = selectedChat._id;
    try {
      const { data } = await axios.put(
        // "http://localhost:8000/api/group-rename",
        import.meta.env.VITE_BACKEND_URL + "/api/group-name",
        {
          groupId: selectedchatId,
          groupNewName: groupName,
        },
        {
          withCredentials: true,
        }
      );
      //   console.log(data.group);
      setfetchChat(!fetchChat);
      setSelectedChat(data.group);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const [name, setName] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [addedUser, setAddedUser] = useState([]);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const userAdd = async (u) => {
    // console.log(u);

    if (selectedChat.users.find((e) => e._id === u._id)) {
      alert("user already in group");
      return;
    }

    const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
    console.log(loggedUser);
    if (loggedUser._id === selectedChat.groupAdmin._id) {
      try {
        const { data } = await axios.put(
          import.meta.env.VITE_BACKEND_URL + "/api/group-add",
          {
            groupId: selectedChat._id,
            userId: u._id,
          },
          {
            withCredentials: true,
          }
        );

        console.log("added data@#!: ", data.groupChat);
        setfetchChat(!fetchChat);
        setSelectedChat(data.groupChat);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("you are not admin");
    }
  };

  const userRemove = async (u) => {
    // console.log(u);
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"));

    if (loggedUser._id === selectedChat.groupAdmin._id) {
      try {
        const { data } = await axios.put(
          import.meta.env.VITE_BACKEND_URL + "/api/group-remove",
          {
            groupId: selectedChat._id,
            userId: u._id,
          },
          {
            withCredentials: true,
          }
        );

        console.log("added data@#!: ", data.groupChat);
        setfetchChat(!fetchChat);
        setSelectedChat(data.groupChat);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("you are not admin");
    }
  };

  const leaveGroup = async () => {
    const loggedUser = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const { data } = await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/group-remove",
        {
          groupId: selectedChat._id,
          userId: loggedUser._id,
        },
        {
          withCredentials: true,
        }
      );

      console.log("added data@#!: ", data.groupChat);
      setfetchChat(!fetchChat);
      setSelectedChat();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span
        onClick={() => {
          setOverlay(<OverlayTwo />);
          onOpen();
        }}
      >
        {children}
      </span>

      {selectedChat.isGroupChat ? (
        //group chat

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <ModalHeader>{selectedChat.chatName.toUpperCase()}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box display={"flex"}>
                <Text mb={5} fontWeight={600} mr={2}>
                  Group Admin:
                </Text>
                {selectedChat.groupAdmin.name.toUpperCase()}
              </Box>
              <Stack direction="row" flexWrap={"wrap"}>
                {selectedChat.users.map((e) => (
                  <Badge variant="solid" bg={"#463bd7"} padding={"2px 8px"}>
                    {e.name}
                    <CloseIcon
                      // color={"red"}
                      ml={1}
                      mr={1}
                      mb={"2.5px"}
                      boxSize={2}
                      cursor={"pointer"}
                      onClick={() => userRemove(e)}
                    />
                  </Badge>
                ))}
              </Stack>
              <FormControl display={"flex"} mt={4}>
                <Input
                  placeholder="New Group Name"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button ml={1} bg={"green.300"} onClick={handleRename}>
                  Update
                </Button>
              </FormControl>

              {/* //add user */}
              <FormControl mt={3}>
                <Input
                  value={userInput}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>

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
              <Button colorScheme="red" onClick={leaveGroup}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        //single chat

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <ModalHeader>User Info</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{chatName}</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default ChatInfo;
