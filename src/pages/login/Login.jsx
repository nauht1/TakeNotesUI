import React, { useState } from "react";
import axios from "axios";
import "./login.scss";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/v1/auth/authenticate", {
        email,
        password
      });

      const {accessToken, refreshToken} = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      onLogin();
    }
    catch (error) {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>TakeNotes</h2>
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
        <span className="register-account">
          Don't have an account? Sign up
        </span>
        <button type="button">
          <i className="fa-brands fa-google"></i>
          Log in with Google
        </button>
      </form>
    </div>
  )
}

export default Login;