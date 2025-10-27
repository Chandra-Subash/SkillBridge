import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import './ProfileEditFormForNgo.css';

import defaultAvatar from '../assets/images/pic.png';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function ProfileEditFormForNgo() {
   
    const [formData, setFormData] = useState({
        organization_name: '',
        organization_description: '', 
        website_url: '', 
        name: '', 
        username: '',
        email: '',
        location: '',
        avatarUrl: defaultAvatar
       
    });
    
   
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    const [imagePreview, setImagePreview] = useState(defaultAvatar); 
    
    const navigate = useNavigate();

   
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken'); 

            if (!token) {
              setError("Not authorized. Please log in.");
              setIsLoading(false);
              
              // navigate('/login'); 
              return; 
            }

            try {
                
                const response = await fetch(`${API_URL}/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch profile data');
                }
                
                setFormData({
                    organization_name: data.user.organization_name || '',
                    organization_description: data.user.organization_description || '',
                    website_url: data.user.website_url || '',
                    name: data.user.name || '',
                    username: data.user.username || '',
                    email: data.user.email || '',
                    location: data.user.location || '',
                    avatarUrl: data.user.avatarUrl || defaultAvatar // Use fetched or default avatar
                });
                
                setImagePreview(data.user.avatarUrl || defaultAvatar);
                
            } catch (err) {
                setError(err.message);
                console.error("Fetch profile error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

           
            const reader = new FileReader();
            reader.onloadend = () => {
               
                setFormData(prev => ({
                    ...prev,
                    avatarUrl: reader.result 
                }));
               
            };
            reader.readAsDataURL(file); 
        }
    };

    
    const handleSubmit = async (e) => { 
        e.preventDefault();
        setIsLoading(true); 
        setError(null);    
        const token = localStorage.getItem('authToken'); 

        if (!token) {
            setError("Not authorized. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
           
            const response = await fetch(`${API_URL}/users/profile`, { 
                method: 'PUT', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData) 
            });
            

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            
            console.log('Profile updated successfully:', data);
            
           

            navigate('/dashboard/profile'); 

        } catch (err) {
         
            console.error("Update Profile Error:", err);
            setError(err.message); 

        } finally {
          
            setIsLoading(false);
        }
    };

    
    if (isLoading && !formData.email) { 
         return <div className="loading-message">Loading form...</div>;
    }

    
    return (
        <form onSubmit={handleSubmit}>
          
            {error && <p className="error-message">{error}</p>} 
            
            <div className="container">
               
                <div className="container-left">
                    <div className="form-pic">
                        <img src={imagePreview} alt="profile Avatar" className="avatar-preview" />
                        <label className="avatar-edit-btn" htmlFor="avatar-upload"><FaEdit /></label>
                        <input type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                            disabled={isLoading} 
                        />
                    </div>

                    <div className="form">
                        <label htmlFor="organization_name">Organisation</label> 
                        <input type="text"
                            name="organization_name"
                            id="organization_name"   
                            placeholder="Enter new Organisation name"
                            value={formData.organization_name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="organization_description">Description</label>
                        <textarea
                            placeholder="Enter Organisation Description"
                            name="organization_description" 
                            id="organization_description"  
                            value={formData.organization_description}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="website_url">URL</label>
                        <input type="url"
                            placeholder="Eg: https://www.example.com"
                            name="website_url" 
                            id="website_url"   
                            value={formData.website_url}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                
                <div className="container-right">
                    <div className="form">
                        <label htmlFor="name">Full Name</label> 
                        <input type="text"
                            name="name" 
                            id="name"   
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="username">User Name</label>
                        <input type="text"
                            name="username" 
                            id="username"   
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter new Username"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="email">Email</label>
                        <input type="email"
                            name="email" 
                            id="email"  
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            disabled={isLoading}
                            readOnly
                        />
                    </div>
                    <div className="form">
                        <label htmlFor="location">Location</label>
                        <input type="text"
                            name="location" 
                            id="location"   
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter new Location"
                            disabled={isLoading}
                        />
                    </div>

                   
                    <button type="submit" className="btn" disabled={isLoading}>
                         {isLoading ? 'Saving...' : 'Save & Continue'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ProfileEditFormForNgo;

