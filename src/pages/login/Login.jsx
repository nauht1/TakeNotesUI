import React, { useState } from "react";
import {axiosToken, axiosNoToken} from "../../config/ApiConfig.js";
import "./login.scss";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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

  const onGoogleLoginSuccess = async (tokenResponse) => {
    try {
      const { credential } = tokenResponse;
      const googleLoginResponse = await axiosNoToken.post("/auth/oauth2/login", {
        tokenId: credential,
      });
  
      const { accessToken, refreshToken } = googleLoginResponse.data;
      if (!accessToken || !refreshToken) {
        throw new Error("Failed to retrieve tokens");
      }
  
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
  
      const profileResponse = await axiosToken.get("/user/profile");
      const userProfile = profileResponse.data.body;
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
  
      toast.success("Login successful!");
      navigate('/');
      onLogin(userProfile);
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const onGoogleLoginFailure = (error) => {
    console.error(error);
    toast.error("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
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
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={onGoogleLoginSuccess}
              onError={onGoogleLoginFailure}
            />
          </div>
          <span className="register-account">
            Don't have an account? <a href="/signup">Sign up</a>
          </span>
        </form>
        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login;