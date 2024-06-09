import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import Header from './components/header/Header.jsx'
import Home from './pages/home/Home.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <Header onMenuClick={handleMenuClick}/>
      <div className="main-layout">
        <Sidebar isCollapsed={isSidebarCollapsed}/>
        <div className={`content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
