import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileForNgo.css';

import defaultAvatar from '../assets/images/pic.png'; 

// --- THIS IS YOUR FALLBACK MOCK DATA ---
// It will only be used if localStorage is empty
const getMockData = () => {
  return {
    Organisation: "Helping Hands Foundation",
    username: "@helpinghands",
    email: "helpinghands@gmail.com",
    role: "NGO",
    location: "New York, NY",
    website: "https://helpinghands.org",
    Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    avatarUrl: defaultAvatar,
    fullname: "Helping Hands"
  };
};
// ----------------------------------------

function ProfileForNgo() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    function loadProfile() {
      try {
        console.log("Loading profile...");
        
        // 1. Try to get the profile from localStorage
        const savedData = localStorage.getItem('userProfile');
        
        if (savedData) {
          // If we found saved data, use it
          console.log("Found saved data!");
          setProfileData(JSON.parse(savedData));
        } else {
          // 2. If no data is saved, load the mock data
          console.log("No saved data, loading mock data.");
          const mockData = getMockData();
          setProfileData(mockData);
          
          // And save the mock data to localStorage for next time
          localStorage.setItem('userProfile', JSON.stringify(mockData));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, []); // The empty [] means this runs only ONCE

  const handleEditClick = () => {
    navigate('/dashboard/profile/edit'); 
  };

  if (isLoading) {
    return <div className="loading-message">Loading Profile...</div>;
  }

  if (!profileData) {
    return <div className="error-message">Could not load profile.</div>;
  }

  // 3. This return part is the same, but it now shows the saved data
  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">Profile</h1>
      <div className="profile-card">
        <div className="profile-card-header">
          {/* This will now show your new Base64 image! */}
          <img src={profileData.avatarUrl} alt="Avatar" className="profile-avatar" />
          <div className="profile-user-info">
            <h2>{profileData.Organisation}</h2>
            <span>{profileData.username}</span>
            <span>{profileData.email}</span>
            <span className="role-badge">Role: NGO</span>
          </div>
        </div>
        <div className="profile-card-body">
          <div className="info-block">
            <label>Location</label>
            <p>{profileData.location}</p>
          </div>
          <div className="info-block">
            <label>Website</label>
            <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="website-link">
              {profileData.website}
            </a>
          </div>
          <div className="info-block">
            <label>Description</label>
            <p>{profileData.Description}</p>
          </div>
        </div>
        <div className="profile-card-footer">
          <button className="edit-button" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileForNgo;