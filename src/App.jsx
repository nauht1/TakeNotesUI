import { useState, useEffect } from 'react'
import './App.scss'
import Header from './components/header/Header.jsx'
import Home from './pages/home/Home.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import Login from './pages/login/Login.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Trash from './pages/trash/Trash.jsx'
import NotFound from './pages/notFound/NotFound.jsx';
import Profile from './pages/profile/Profile.jsx';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  }, []);

  const handleMenuClick = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogin = (profile) => {
    setIsAuthenticated(true);
    setUserProfile(profile);
  }
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const ProtectedComponent = ({ children }) => {
    return (
      <ProtectedRoute
        element={
          <div className="main-layout">
            <Header onMenuClick={handleMenuClick} userProfile={userProfile} onLogout={handleLogout} />
            <Sidebar isCollapsed={isSidebarCollapsed} />
            <div className={`content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              {children}
            </div>
          </div>
        }
      />
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />}
        />
        <Route
          path="/"
          element={<Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={<ProtectedComponent><Home /></ProtectedComponent>}
        />
        <Route
          path="/trash"
          element={<ProtectedComponent><Trash /></ProtectedComponent>}
        />
         <Route
          path="/profile"
          element={<ProtectedComponent><Profile userProfile={userProfile} /></ProtectedComponent>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
