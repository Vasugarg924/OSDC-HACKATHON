import "./App.css";
import Login from "./MyComponents/AuthPage/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./MyComponents/AuthPage/Signup";
import Chat_Interface from "./MyComponents/Chat_Interface";
import { ContextProvider } from "./MyComponents/ContextApi/Context";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/chat" element={<Chat_Interface />}></Route>
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
