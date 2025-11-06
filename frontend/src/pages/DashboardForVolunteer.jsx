import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './DashboardForVolunteer.css'; 

import logo from '../assets/images/logo.png';
import defaultAvatar from '../assets/images/pic.png'; 

import { FaTachometerAlt, FaRegLightbulb, FaEnvelope, FaUser, FaBell, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function DashboardForVolunteer() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
      
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.clear(); 
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]); 

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path; 

  return (
    <div className="volunteer-dashboard-container">

      <nav className="volunteer-sidebar">
        <div className="sidebar-logo-container">
          <img src={logo} alt="SkillBridge Logo" className="sidebar-logo" />
        </div>

       
        <div className="sidebar-profile">
          {user ? (
            <>
              <img src={user.avatarUrl || defaultAvatar} alt="User Avatar" className="sidebar-avatar" />
              <h3 className="sidebar-profile-name">{user.name}</h3>
              <p className="sidebar-profile-role">{user.role}</p>
            </>
          ) : (
            <p className="sidebar-profile-role">Loading profile...</p>
          )}
        </div>

        <ul className="nav-list">
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <FaTachometerAlt /> <span>Dashboard</span>
            </Link>
          </li>
         
          <li className={isActive('/dashboard/find-opportunities') ? 'active' : ''}>
            <Link to="/dashboard/find-oppurt">
              <FaRegLightbulb /> <span>Find Opportunities</span>
            </Link>
          </li>
          
          <li className={isActive('/dashboard/messages') ? 'active' : ''}>
            <Link to="/dashboard/messages">
              <FaEnvelope /> <span>Messages</span>
            </Link>
          </li>
         
          <li className={isActive('/dashboard/profile-volunteer') ? 'active' : ''}>
            <Link to="/dashboard/profile-vol">
              <FaUser /> <span>Profile</span>
            </Link>
          </li>
        </ul>

       
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <header className="header">
          <div className="header-right">
            <span className="volunteer-badge">Volunteer</span>
            <FaBell className="header-icon" />
            <img 
              src={user?.avatarUrl || defaultAvatar} 
              alt="Avatar" 
              className="header-avatar" 
              
            />
          </div>
        </header>

        <div className="page-content">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

export default DashboardForVolunteer;