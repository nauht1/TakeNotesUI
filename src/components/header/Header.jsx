import React, { useRef, useState, useEffect } from "react";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import {axiosToken, axiosNoToken} from "../../config/ApiConfig.js";
import { useNotes } from "../../context/NotesContext.jsx";
import Search from "../seach/Search.jsx";

const Header = ({onMenuClick, userProfile, onLogout}) => {
  const inputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { fetchNotes } = useNotes();
  const dropdownRef = useRef(null);

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

  // Close dropdown menu when clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

	return (
    <header className="header">
      <div className="container-first">
        <div className="menu" onClick={onMenuClick}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <Link to = "/home">
          <div className="logo"></div>
        </Link>
        <Search />
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
            <div className="dropdown-menu" ref={dropdownRef}>
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