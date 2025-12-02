import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './DashboardForNgo.css';

import logo from '../assets/images/logo.png';
import { 
  FaTachometerAlt, 
  FaSignOutAlt, 
  FaRegLightbulb, 
  FaEnvelope, 
  FaFileAlt, 
  FaUser, 

  FaBriefcase 
} from 'react-icons/fa';
import Notification from './Notification.jsx';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function DashboardForNgo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  //  Load logged-in NGO profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.clear();
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const isActive = (path) => location.pathname.startsWith(path);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* ===== Sidebar ===== */}
      <nav className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="SkillBridge Logo" className="logo" />
        </div>

        <div className="sidebar-profile">
          {user ? (
            <>
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="sidebar-avatar"
              />
              <h3 className="sidebar-profile-name">{user.name}</h3>
              <p className="sidebar-profile-role">{user.role}</p>
            </>
          ) : (
            <p className="sidebar-profile-role">Loading profile...</p>
          )}
        </div>

        <ul className="nav-list">
          <li className={isActive('/dashboard/home') ? 'active' : ''}>
            <Link to="/dashboard/home">
              <FaTachometerAlt /> <span>Dashboard</span>
            </Link>
          </li>

          <li className={isActive('/dashboard/opportunities') ? 'active' : ''}>
            <Link to="/dashboard/opportunities">
              <FaBriefcase /> <span>Opportunities</span>
            </Link>
          </li>

          <li className={isActive('/dashboard/applications') ? 'active' : ''}>
            <Link to="/dashboard/applications">
              <FaFileAlt /> <span>Applications</span>
            </Link>
          </li>

          <li className={isActive('/dashboard/messages') ? 'active' : ''}>
            <Link to="/dashboard/messages">
              <FaEnvelope /> <span>Messages</span>
            </Link>
          </li>

          <li className={isActive('/dashboard/profile') ? 'active' : ''}>
            <Link to="/dashboard/profile">
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

      {/* ===== Main Content ===== */}
      <main className="main-content">
        <header className="header">
          <div className="header-right">
            <span className="ngo-badge">NGO</span>
            <Notification/>
            <img
              src={user?.avatarUrl}
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

export default DashboardForNgo;
