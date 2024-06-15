import React, {useState, useEffect} from "react";
import { axiosNoToken } from "../../config/ApiConfig.js";
import "./signUp.scss";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

const SignUp = ({onSignUp}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Disable button and form
    setLoading(true);

    // clear head and tail spaces of email
    const trimmedEmail = email.trim();

    // Check if password is matched
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    if (password.length <= 6 || /\s/.test(password) || !/\d/.test(password)) {
      toast.error("Password must be more than 6 characters, contain no spaces, and include at least one number.");
      setLoading(false);
      return;
    }

    try {
      await axiosNoToken.post("auth/register", {
        email: trimmedEmail,
        password,
        fullName
      });
      
      setShowVerificationMessage(true);
    }
    catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
      setLoading(false);
    }
  }

  // Show/hide password input
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  }

  const backToLogin = () => {
    navigate('/login');
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h1 className="signup-text">TakeNotes</h1>
        <h2>Sign Up</h2>
        {showVerificationMessage ? (
          <div className="verification-message">
            <p>Registration successful. Please check your email to verify your account.</p>
            <p>If you don't see your email, please check the spam folder !</p>
            <button className="btn-backToLogin" onClick={backToLogin} disabled={loading}>Back to login</button>
          </div>
        ) : (
          <>
            <div className="signup-content">
              <input
                type="text"
                placeholder="Full Name"
                className="content-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Email"
                className="content-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="content-input"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                className="content-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  Show password
                  {passwordVisible ? <i className="fa-solid fa-eye eye-icon"></i> : 
                                    <i className="fa-solid fa-eye-slash eye-icon"></i>}
                </span>
            </div>
            <button type="submit" disabled={loading}>SIGN UP</button>
            <span className="login-account">
              Already have an account? <Link to="/login">Log in</Link>
            </span>
          </>
        )}
      </form>
      <ToastContainer />
    </div>
  )
}

export default SignUp;