import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileForNgo.css'; 

import defaultAvatar from '../assets/images/pic.png'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function ProfileForNgo() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
   
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken'); 


      if (!token) {
        setError("Not authorized. Please log in.");
        setIsLoading(false);
        
        return; 
      }

      try {
        console.log("Fetching profile data from API...");
        
        
        const response = await fetch(`${API_URL}/users/profile`, {
          method: 'GET',
          headers: {
           
            'Authorization': `Bearer ${token}` 
          }
        });

        
        const data = await response.json();

        
        if (!response.ok) {
        
          throw new Error(data.error || 'Failed to fetch profile data');
        }
        
        
        console.log("Profile data received:", data.user);
        setProfileData(data); 

      } catch (err) {
        
        console.error("Error loading profile:", err);
        setError(err.message);
      } finally {
       
        setIsLoading(false);
      }
    };
    
    
    loadProfile();
    
  }, []);

  
  const handleEditClick = () => {
    navigate('/dashboard/profile/edit'); 
  };

  
  if (isLoading) {
    return <div className="loading-message">Loading Profile...</div>;
  }

  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
 
  if (!profileData) {
    return <div className="error-message">Could not load profile data.</div>;
  }

 
  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">Profile</h1>

      <div className="profile-card">
        
        <div className="profile-card-header">
          
          <img src={profileData.avatarUrl || defaultAvatar} alt="Avatar" className="profile-avatar" />
          <div className="profile-user-info">
        
            <h2>{profileData.organization_name || profileData.name}</h2> 
            <span>{profileData.username}</span>
            <span>{profileData.email}</span>
            <span className="role-badge">Role: {profileData.role}</span> 
          </div>
        </div>

      
        <div className="profile-card-body">
          <div className="info-block">
            <label>Location</label>
            <p>{profileData.location || 'Not specified'}</p>
          </div>
        
          {profileData.role === 'ngo' && (
            <>
              <div className="info-block">
                <label>Website</label>
                {profileData.website_url ? (
                   <a href={profileData.website_url} target="_blank" rel="noopener noreferrer" className="website-link">
                     {profileData.website_url}
                   </a>
                ) : (
                  <p>Not specified</p>
                )}
              </div>
              <div className="info-block">
                <label>Description</label>
                <p>{profileData.organization_description || 'Not specified'}</p>
              </div>
            </>
          )}
          
           {profileData.role === 'volunteer' && profileData.skills && profileData.skills.length > 0 && (
             <div className="info-block">
               <label>Skills</label>
               <p>{profileData.skills.join(', ')}</p> 
             </div>
           )}
           {profileData.bio && (
             <div className="info-block">
               <label>Bio</label>
               <p>{profileData.bio}</p> 
             </div>
           )}
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


