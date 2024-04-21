import React, { useState } from "react";

const MyContext = React.createContext();

function ContextProvider({ children }) {
  const [selectedChat, setSelectedChat] = useState("");
  const [chatName, setChatName] = useState("");
  const [fetchChat, setfetchChat] = useState(false);
  return (
    <MyContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chatName,
        setChatName,
        fetchChat,
        setfetchChat,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
export { MyContext, ContextProvider };
