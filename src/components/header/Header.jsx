import React, { useRef, useState } from "react";
import "./header.scss";
import { Link } from "react-router-dom";

const Header = ({onMenuClick}) => {
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const inputRef = useRef(null);

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
        <div className="refresh">
          <i className="fa-solid fa-arrows-rotate"></i>
        </div>
        <div className="setting">
          <i className="fa-solid fa-gear"></i>
        </div>
        <div className="user">
          <img src="/vite.svg" alt="user_avatar" />
        </div>
      </div>
    </header>
	)
}

export default Header;