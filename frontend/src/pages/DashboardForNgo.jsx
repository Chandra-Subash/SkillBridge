import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import './DashboardForNgo.css';

import logo from '../assets/images/logo.png';


import { FaTachometerAlt, FaRegLightbulb, FaEnvelope, FaFileAlt, FaUser, FaBell } from 'react-icons/fa';

function DashboardForNgo() {
  
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    
    <div className="dashboard-container">

      
      <nav className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="SkillBridge Logo" className="logo" />
        </div>

        <ul className="nav-list">
          
          <li className={isActive('/dashboard/home') ? 'active' : ''}>
            <Link to="/dashboard/home"> 
              <FaTachometerAlt /> <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/Applications') ? 'active' : ''}>
            <Link to="/dashboard/Applications">
              <FaRegLightbulb /> <span>Opportunities</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/messages') ? 'active' : ''}>
            <Link to="/dashboard/messages">
              <FaEnvelope /> <span>Messages</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/applications') ? 'active' : ''}>
            <Link to="/dashboard/applications">
              <FaFileAlt /> <span>Applications</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/profile') ? 'active' : ''}>
            <Link to="/dashboard/profile">
              <FaUser /> <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      
      <main className="main-content">
        
        
        <header className="header">
          <div className="header-right">
            <span className="ngo-badge">NGO</span>
            <FaBell className="header-icon" />
            
          </div>
        </header>

        
        <div className="page-content">
          <Outlet /> 
        </div>
        
      </main>
    </div>
  );
}

export default DashboardForNgo;