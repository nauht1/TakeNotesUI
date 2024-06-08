import React, { useRef, useState } from "react";
import "./header.scss";

const Header = () => {
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
        <div className="menu">
          <i class="fa-solid fa-bars"></i>
        </div>
        <div className="logo"></div>
        <div className="search-bar">
          <div className="search-input">
            <div className="seacrh-icon">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <input type="text" 
              placeholder="Search" 
              onFocus={handleInputFocus} 
              onBlur={handleInputBlur} 
              ref={inputRef} />
            
            {showCloseIcon && (
              <div className="close-icon" onClick={handleCloseClick}>
                <i class="fa-solid fa-xmark"></i>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container-second">
        <div className="refresh">
          <i class="fa-solid fa-arrows-rotate"></i>
        </div>
        <div className="setting">
          <i class="fa-solid fa-gear"></i>
        </div>
        <div className="user">
          <img src="/vite.svg" alt="user_avatar" />
        </div>
      </div>
    </header>
	)
}

export default Header;