import React, { useRef, useState } from "react";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import {axiosToken, axiosNoToken} from "../../config/ApiConfig.js";
import { useNotes } from "../../context/NotesContext.jsx";

const Header = ({onMenuClick, userProfile, onLogout}) => {
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { fetchNotes } = useNotes();

  const handleInputFocus = () => {
    setShowCloseIcon(true);
  }

  const handleInputBlur = () => {
    if (inputRef.current.value === "") {
      setShowCloseIcon(false);
    }
  }

  const handleCloseClick = () => {
    setShowCloseIcon(false);
    inputRef.current.value = "";
    inputRef.current.blur();
  }

  const handleUserClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await axiosToken.post("/auth/logout");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userProfile');
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleRefreshClick = () => {
    // animation for loading refresh button
    const refreshButton = document.querySelector(".refresh");
    refreshButton.classList.add("spin");

    setTimeout(() => {
      refreshButton.classList.remove("spin");
    }, 2000);
    
    fetchNotes();
  };

	return (
    <header className="header">
      <div className="container-first">
        <div className="menu" onClick={onMenuClick}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <Link to = "/home">
          <div className="logo"></div>
        </Link>
        <div className="search-bar">
          <div className="search-input">
            <div className="seacrh-icon">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input type="text" 
              placeholder="Search" 
              onFocus={handleInputFocus} 
              onBlur={handleInputBlur} 
              ref={inputRef} />
            
            {showCloseIcon && (
              <div className="close-icon" onClick={handleCloseClick}>
                <i className="fa-solid fa-xmark"></i>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container-second">
        <div className="refresh" onClick={handleRefreshClick}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </div>
        <div className="setting">
          <i className="fa-solid fa-gear"></i>
        </div>
        <div className="user" onClick={handleUserClick}>
          <img src={userProfile?.avatar_url || "/vite.svg"} alt="user_avatar" />
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/profile"className="menu-item" >
                <i className="fa-solid fa-address-card menu-icon"></i><span>Profile</span>
              </Link>
              <div className="menu-item" onClick={handleLogout}>
                <i className="fa-solid fa-power-off menu-icon"></i><span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
	)
}

export default Header;