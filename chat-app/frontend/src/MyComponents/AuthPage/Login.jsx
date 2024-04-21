import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        // "http://localhost:8000/auth/login",
        import.meta.env.VITE_BACKEND_URL + "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      console.log(response);
      console.log(document.cookie);
      // localStorage.setItem("userIn", response.data.user.name);
      // const { token } = response.data;
      // localStorage.setItem("token", token);
      navigate("/chat");
    } catch (error) {
      console.log(error);
      window.alert(error.response.data.error)
      // console.log(error.response.data.error);
      // document.getElementById("alert").style.visibility = "visible";
      // document.getElementById("alert").innerText = error.response.data.error;
      // setTimeout(() => {
      //   document.getElementById("alert").style.visibility = "hidden";
      // }, 1500);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-button" onClick={submit}>
            Login
          </button>
        </form>
        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
      <div id="alert">email format is wrong</div>
    </div>
  );
}

export default Login;
