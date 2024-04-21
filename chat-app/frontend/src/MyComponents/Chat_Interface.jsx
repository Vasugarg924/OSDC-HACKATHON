import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { json, useNavigate } from "react-router";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import UserList from "./UserList";
import ChatList from "./ChatList";
import SearchLoading from "./SearchLoading";
import Chatting from "./ChattingArea/Chatting";
import Header from "./ChattingArea/Header";
import GroupChatCreate from "./groupchatstuff/GroupChatCreate";
import { MyContext } from "./ContextApi/Context";
import { Link } from "react-router-dom";

function Chat_Interface() {
  const { fetchChat, setfetchChat } = useContext(MyContext);
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const test = async () => {
    const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/user", null, {
      withCredentials: true,
    });
    // console.log(res);
    setUser(res.data.user);
  };
  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate("/");
    }
    test();
  }, []);

  //code for components
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const btnRef = React.useRef();

  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    console.log(search);
    if (!search) {
      alert("you have to input in search field");
    }

    setLoading(true);
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user?search=${search}`,
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      const result = await data.data.user.filter((e) => {
        return (
          e.email != JSON.parse(localStorage.getItem("userInfo")).email
          // console.log(e.email)
        );
      });

      // console.log(result);
      setSearchResult(result);
      console.log(searchResult);
    } catch (error) {
      console.log(error);
    }
  };

  //responsive
  const boxDisplay = useBreakpointValue({ base: "none", md: "flex" });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [largerthan425] = useMediaQuery("(min-width: 425px)");

  const firstDrawerDisclosure = useDisclosure();
  const secondDrawerDisclosure = useDisclosure();

  const handleOpenFirstDrawer = () => {
    firstDrawerDisclosure.onOpen();
  };

  const handleOpenSecondDrawer = () => {
    secondDrawerDisclosure.onOpen();
  };

  const handleToggleDrawer = () => {
    boxDisplay.base("flex");
  };

  const [loadingChats, setLoadingChats] = useState(false);
  const accessChat = async (userId) => {
    setLoadingChats(true);
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/chat",
        { userId },
        {
          withCredentials: true,
        }
      );
      // console.log(data);
      setLoadingChats(false);
      await firstDrawerDisclosure.onClose();
      await secondDrawerDisclosure.onClose();
      // window.location.reload();
      setfetchChat(!fetchChat);
    } catch (error) {
      console.log(console.log(error));
    }
  };

  return (
    <div>
      {user ? (
        <Box
          height={"100vh"}
          width={"100vw"}
          // border={"2px solid red"}
          padding={"10px"}
          bg={"black"}
        >
          <Flex>
            {/* left-container ----------------------------------------------------------------------*/}
            <Box
              height={"98vh"}
              // border={"2px solid red"}
              flex={"0.34"}
              marginRight={"6px"}
              borderRadius={"6px"}
              p={"10px"}
              bg={""}
              display={boxDisplay}
              // display={"none"}
              flexDirection={"column"}
            >
              {/* search-box ------------------------------*/}
              <Box bg={"#121212"} p={"10px"} borderRadius={"6px"} mb={"10px"}>
                <Tooltip
                  hasArrow
                  label="Search User"
                  bg="#6cffff"
                  color={"black"}
                >
                  <Button
                    onClick={handleOpenFirstDrawer}
                    width={"100%"}
                    bg={"#1c1c1c"}
                    color={"#b9b9b9"}
                    borderRadius={"24px"}
                  >
                    <Text mr={"14px"}>Search User</Text>
                    <SearchIcon />
                  </Button>
                </Tooltip>
              </Box>
              {/* search-box-drawer big screen------------------- */}
              <Drawer
                isOpen={firstDrawerDisclosure.isOpen}
                onClose={firstDrawerDisclosure.onClose}
                placement="left"
              >
                <DrawerOverlay />
                <DrawerContent bg={"black"} color={"white"}>
                  {/* <DrawerCloseButton /> */}
                  <DrawerHeader bg={"#1d1d1d"} m={"8px"} borderRadius={"8px"}>
                    Search User
                  </DrawerHeader>

                  <DrawerBody color={"black"}>
                    <Flex>
                      <Input
                        color={"white"}
                        mr={"6px"}
                        flex={"1"}
                        placeholder="Type here..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Button bg={"#1d1d1d"} flex={"0"} onClick={handleSearch}>
                        <SearchIcon color={"white"} />
                      </Button>
                    </Flex>
                    {loading ? (
                      <SearchLoading />
                    ) : (
                      searchResult?.map((user) => (
                        <UserList
                          key={user._id}
                          user={user}
                          accessChat={accessChat}
                        />
                      ))
                    )}
                    {loadingChats && <Spinner color="red" float={"right"} />}
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

              {/* User-chat --------------------------------------------- */}
              <GroupChatCreate />
              <Box
                bg={"#121212"}
                p={"10px"}
                borderRadius={"6px"}
                flex={"1"}
                overflowX={"hidden"}
                // border={"2px solid green"}
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
                <ChatList />
              </Box>
            </Box>
            {/* small screen drawer--------------- */}

            <Drawer
              isOpen={secondDrawerDisclosure.isOpen}
              onClose={secondDrawerDisclosure.onClose}
              placement="left"
            >
              <DrawerOverlay />
              <DrawerContent bg={"black"} color={"white"}>
                {/* <DrawerHeader bg={"#1d1d1d"} m={"8px"} borderRadius={"8px"}> */}
                {/* <Button
                  onClick={handleOpenFirstDrawer}
                  width={"100%"}
                  bg={"#1c1c1c"}
                  color={"#b9b9b9"}
                  borderRadius={"24px"}
                > */}
                {/* <Text mr={"14px"}>Search User</Text> */}
                {/* </Button> */}
                <Box
                  style={{
                    // border: "2px solid green",
                    margin: "14px 14px",
                    backgroundColor: "#111111b8",
                    padding: "10px",
                    alignItems: "center",
                  }}
                  onClick={handleOpenFirstDrawer}
                >
                  <span style={{ top: "30%", position: "relative" }}>
                    Search User
                  </span>
                  <SearchIcon m={"20px"} float={"right"} boxSize={5} />
                </Box>
                {/* </DrawerHeader> */}

                {/* <DrawerCloseButton /> */}
                <GroupChatCreate />
                <Box
                  bg={"#121212"}
                  p={"10px"}
                  borderRadius={"6px"}
                  flex={"1"}
                  overflowX={"hidden"}
                  // border={"2px solid green"}
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
                  <ChatList clickfn={() => secondDrawerDisclosure.onClose()} />
                </Box>
              </DrawerContent>
            </Drawer>

            {/* right-container */}
            <Box
              height={"96.6vh"}
              // border={"1px solid aqua"}
              borderBottom={"1px solid green"}
              flex={"1"}
              borderRadius={"6px"}
              bg={"#121212"}
            // padding={"10px"}
            >
              <Flex
                direction={"column"}
                // border={"2px solid blue"}
                height={"96vh"}
              >
                <Box
                // flex={"0.8"}
                // border={"2px solid green"}
                >
                  <Flex>
                    <Box>
                      {isMobile && (
                        <IconButton
                          bgColor={"black"}
                          // border={"2px solid green"}
                          icon={<HamburgerIcon />}
                          aria-label="Open Drawer"
                          // position="absolute"
                          // top="1rem"
                          // left="1rem"
                          ml={1}
                          mt={1}
                          fontSize="20px"
                          size="sm"
                          colorScheme="#1d1d1d"
                          onClick={handleOpenSecondDrawer}
                        />
                      )}
                    </Box>
                    <Header />
                  </Flex>
                </Box>
                <Chatting />
                {/* <Box flex={"1"} border={"2px solid pink"}></Box> */}
              </Flex>
            </Box>
          </Flex>
        </Box>
      ) : (
        // <Box
        //   height={"100vh"}
        //   width={"100vw"}
        //   border={"2px solid red"}
        //   padding={"8px"}
        //   bg={"grey"}
        // >
        //   <Flex>
        //     <div
        //       style={{
        //         backgroundColor: "black",
        //         padding: "8px",
        //         borderRadius: "14px",
        //         flex: "0.4",
        //       }}
        //     >
        //       <Tooltip hasArrow label="Search places" bg="red.600">
        //         <Button onClick={onOpen}>Search User</Button>
        //       </Tooltip>
        //     </div>
        //     <div
        //       style={{
        //         backgroundColor: "black",
        //         padding: "8px",
        //         borderRadius: "14px",
        //         flex: "1",
        //       }}
        //     >
        //       <Tooltip hasArrow label="Search places" bg="red.600">
        //         <Button onClick={onOpen}>Search User</Button>
        //       </Tooltip>
        //     </div>
        //   </Flex>
        //   <Drawer
        //     isOpen={isOpen}
        //     placement="right"
        //     onClose={onClose}
        //     // finalFocusRef={btnRef}
        //   >
        //     <DrawerOverlay />
        //     <DrawerContent>
        //       {/* <DrawerCloseButton /> */}
        //       <DrawerHeader>Search User</DrawerHeader>

        //       <DrawerBody>
        //         <Flex>
        //           <Input
        //             placeholder="Type here..."
        //             value={search}
        //             onChange={(e) => setSearch(e.target.value)}
        //           />
        //           <Button onClick={handleSearch}>search</Button>
        //         </Flex>
        //         {searchResult?.map((user) => (
        //           <UserList key={user._id} user={user} />
        //         ))}
        //       </DrawerBody>
        //     </DrawerContent>
        //   </Drawer>
        //   Chat-Interface
        //   <h3>hello {user.name}</h3>
        //   <p>email is::: {user.email}</p>
        // </Box>
        <div
          style={{
            color: "red",
            background: "black",
            height: "100vh",
            width: "100vw",
            textAlign: "center",
            fontSize: "3vw",
          }}
        >
          Do Login then come here
          <div style={{ color: "white" }}>
            <Link to={"/"}>
              <Button _hover={{ backgroundColor: "grey", color: "white" }}>
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat_Interface;
