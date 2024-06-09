import React from "react";
import "./sidebar.scss";

import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({isCollapsed}) => {
  const location = useLocation();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <Link to="/home" className={`sidebar-item ${isCollapsed ? 'collapsed' : ''} 
          ${location.pathname === "/home" ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <i className="fa-solid fa-lightbulb"></i>
        </div>
        <span>Ghi chú</span>
      </Link>
      <Link to="/reminders" className={`sidebar-item ${isCollapsed ? 'collapsed' : ''} 
          ${location.pathname === "/reminders" ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <i className="fa-solid fa-bell"></i>
        </div>
        <span>Lời nhắc</span>
      </Link>
      <Link to="/labels" className={`sidebar-item ${isCollapsed ? 'collapsed' : ''} 
          ${location.pathname === "/labels" ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <i className="fa-solid fa-pen"></i>
        </div>
        <span>Chỉnh sửa nhãn</span>
      </Link>
      <Link to="/archive" className={`sidebar-item ${isCollapsed ? 'collapsed' : ''} 
          ${location.pathname === "/archive" ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <i className="fa-solid fa-box-archive"></i>
        </div>
        <span>Lưu trữ</span>
      </Link>
      <Link to="/trash" className={`sidebar-item ${isCollapsed ? 'collapsed' : ''} 
          ${location.pathname === "/trash" ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <i className="fa-solid fa-trash"></i>
        </div>
        <span>Thùng rác</span>
      </Link>
    </div>
  )
}

export default Sidebar;