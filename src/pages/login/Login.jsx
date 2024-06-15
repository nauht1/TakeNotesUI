import React, { useState } from "react";
import {axiosToken, axiosNoToken} from "../../config/ApiConfig.js";
import "./login.scss";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosNoToken.post("auth/authenticate", {
        email,
        password
      });

      const {accessToken, refreshToken} = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const profileResponse = await axiosToken.get("/user/profile");
      const userProfile = profileResponse.data.body;
      localStorage.setItem('userProfile', JSON.stringify(userProfile));

      onLogin(userProfile);
      navigate('/');
    }
    catch (error) {
      toast.error("Invalid credentials")
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1 className="login-text">TakeNotes</h1>
        <h2>Sign In</h2>
        <div className="login-content">
          <input
            type="text"
            placeholder="Email"
            className="content-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="content-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <span className="forgot-password">
          Forgot password?
        </span>
        <button type="submit">SIGN IN</button>
        <br />
        <hr className="divider" data-divider="or"></hr>
        <button type="button" className="btn-option-google">
          <i className="fa-brands fa-google icon-google"></i>
          Log in with Google
        </button>
        <span className="register-account">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login;