import React from "react";
import "./profile.scss";

const Profile = ({ userProfile }) => {
  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <img src={userProfile.avatar_url || "/vite.svg"} alt="Avatar" />
        <div className="profile-info">
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Full Name:</strong> {userProfile.fullName}</p>
          <p><strong>Phone:</strong> {userProfile.phone || "N/A"}</p>
          <p><strong>Birthday:</strong> {userProfile.birthday || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
