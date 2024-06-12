import React, { useState, useEffect } from 'react'
import './App.scss'
import Header from './components/header/Header.jsx'
import Home from './pages/home/Home.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import Trash from './pages/trash/Trash.jsx'
import NotFound from './pages/notFound/NotFound.jsx'
import ProtectedRoute from './components/router/ProtectedRoute.jsx'
import Profile from './pages/profile/Profile.jsx'

const MainLayout = ({ isSidebarCollapsed, onMenuClick, userProfile, onLogout, children }) => {
  return (
    <div className="main-layout">
      <Header onMenuClick={onMenuClick} userProfile={userProfile} onLogout={onLogout}/>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedProfile = localStorage.getItem('userProfile');
    if (token) {
      setIsAuthenticated(true);

      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        console.log('Failed to fetch user profile');
      }
    }
    setIsLoading(false);
  }, []);

  const handleMenuClick = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  const handleLogin = (profile) => {
    setIsAuthenticated(true);
    setUserProfile(profile);
  }
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout 
                isSidebarCollapsed={isSidebarCollapsed} 
                onMenuClick={handleMenuClick} 
                userProfile={userProfile}
                onLogout={handleLogout}>
                <Profile userProfile={userProfile}/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout 
                isSidebarCollapsed={isSidebarCollapsed} 
                onMenuClick={handleMenuClick} 
                userProfile={userProfile}
                onLogout={handleLogout}>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout 
                isSidebarCollapsed={isSidebarCollapsed} 
                onMenuClick={handleMenuClick} 
                userProfile={userProfile}
                onLogout={handleLogout}>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trash" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout 
                isSidebarCollapsed={isSidebarCollapsed} 
                onMenuClick={handleMenuClick} 
                userProfile={userProfile}
                onLogout={handleLogout}>
                <Trash />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
