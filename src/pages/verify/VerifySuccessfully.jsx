import React from "react";
import "./success.scss";
import { useNavigate } from "react-router-dom";

const VerifySuccessfully = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  }

  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-notification">Verify successfully</h1>
        <p>Your account has been verified successfully.</p>
        <p>You can now login to your account.</p>
        <button className="success-btn" type="button" onClick={navigateToLogin}>Login now</button>
      </div>
    </div>
  )
}

export default VerifySuccessfully;