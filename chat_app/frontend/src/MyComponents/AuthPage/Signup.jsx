import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const signup = await axios.post(
        // "http://192.168.144.107:8000/auth/signup",
        // "http://localhost:8000/auth/signup",
        import.meta.env.VITE_BACKEND_URL + "/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      navigate('/')
    } catch (error) {
      //   console.log(error);
      console.log(error.response.data.error);
      document.getElementById("alert").style.visibility = "visible";
      document.getElementById("alert").innerText = error.response.data.error;
      setTimeout(() => {
        document.getElementById("alert").style.visibility = "hidden";
      }, 1500);
      //   if (error.response.data.error == "missing required field") {
      //     // alert("missing required field");
      //     document.getElementById("alert").style.visibility = "visible";
      //     document.getElementById("alert").innerText = error.response.data.error;
      //   setTimeout(() => {
      //     document.getElementById("alert").style.visibility = "hidden";
      //   }, 1500);
      //   }
      //   if (error.response.data.error == "email format is wrong") {
      //     document.getElementById("alert").style.visibility = "visible";
      //     document.getElementById("alert").innerText = error.response.data.error;
      //     // alert("email format is wrong");
      //   }
    }
  };
  return (
    <div className="Rbackground">
      <div className="Rcontainer">
        <h2 classNameName="Rh2">Register</h2>
        <form>
          <div className="Rform-group">
            <input
              type="name"
              id="Rname"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="Rform-group">
            <input
              type="email"
              id="Remail"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="Rform-group">
            <input
              type="password"
              id="Rpassword"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="Rform-group">
            <a href="#" className="Rforgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="Rlogin-button" onClick={submit}>
            Register
          </button>
        </form>
        <p className="Rsignup-text">
          Don't have an account?{" "}
          <Link to="/" className="Rsignup-link">
            Login
          </Link>
        </p>
      </div>

      <div id="alert">email format is wrong</div>
    </div>
  );
}

export default Signup;
