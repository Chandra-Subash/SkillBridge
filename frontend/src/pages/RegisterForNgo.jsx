import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterForNgo.css'; // Make sure this CSS file exists and has styles

import logo from '../assets/images/logo.png';
import sideImage from '../assets/images/Home.jpg';

// Get API URL from environment variables or use fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function RegisterForNgo() {
    // --- State for Form Data ---
    const [formData, setFormData] = useState({
        // Renamed to match backend expected field 'name'
        name: '', 
        username: '',
        email: '',
        password: '',
        location: '',
        // Renamed to match backend expected field 'organization_name'
        organization_name: '', 
        // Renamed to match backend expected field 'organization_description'
        organization_description: '', 
        // Renamed to match backend expected field 'website_url'
        website_url: '', 
    });

    // --- State for UI ---
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // --- Event Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // --- Handle Form Submission (API Call) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Prepare data matching the backend User model
        const registrationData = {
            ...formData,
            role: 'ngo' // Explicitly set the role for this registration form
        };
        // Clean up empty optional fields if needed by backend (e.g., website_url)
        if (!registrationData.website_url) {
            delete registrationData.website_url;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // --- Registration Successful ---
            console.log('Registration successful:', data);
            
            // Optionally store token/role right away, but usually login is required next
            // localStorage.setItem('authToken', data.token);
            // localStorage.setItem('userRole', data.role);
            
            // Navigate to the login page after successful registration
            navigate('/login');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">

            {/* --- Left Column: Form --- */}
            <div className="register-form-section">
                <div className="form-wrapper">
                    <div className="logo-container">
                        <img src={logo} alt="SkillBridge Logo" className="logo-image" />
                    </div>

                    <h2>Register</h2>
                    
                    {/* Display Error Message */}
                    {error && <p className="error-message">{error}</p>} 

                    <form onSubmit={handleSubmit}>

                        {/* Full Name (maps to 'name' in state/backend) */}
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name" // Match state key
                                placeholder="Enter your Full name or organization name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* User Name */}
                        <div className="form-group">
                            <label htmlFor="username">User Name</label>
                            <input
                                type="text"
                                id="username"
                                name="username" // Match state key
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email" // Match state key
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password" // Match state key
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        {/* I am a (Read Only) */}
                        <div className="form-group">
                            <label htmlFor="role">I am a</label>
                            <input
                                type="text"
                                id="role"
                                name="role-display" // Different name to avoid conflict
                                value="NGO / Organization" // Display value
                                readOnly
                                className="read-only-input"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Location */}
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location" // Match state key
                                placeholder="eg. New york, NY"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Organisation Name (maps to organization_name) */}
                        <div className="form-group">
                            <label htmlFor="organization_name">Organisation Name</label>
                            <input
                                type="text"
                                id="organization_name"
                                name="organization_name" // Match state key
                                placeholder="Enter your organisation name"
                                value={formData.organization_name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Organization Description (maps to organization_description) */}
                        <div className="form-group">
                            <label htmlFor="organization_description">Organization Description</label>
                            <textarea
                                id="organization_description"
                                name="organization_description" // Match state key
                                placeholder="Tell us About your organization's mission and goals"
                                value={formData.organization_description}
                                onChange={handleChange}
                                rows="4"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Website URL (maps to website_url) */}
                        <div className="form-group">
                            <label htmlFor="website_url">Website URL</label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url" // Match state key
                                placeholder="eg. https://www.yourorganization.org"
                                value={formData.website_url}
                                onChange={handleChange}
                                disabled={isLoading} 
                                // Not required
                            />
                        </div>

                        {/* Register Button */}
                        <button type="submit" className="register-btn" disabled={isLoading}>
                             {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <p className="login-link">
                        If you already have an account! You can <Link to="/login">Login here !</Link> {/* Ensure path is lowercase */}
                    </p>
                </div>
            </div>

            {/* --- Right Column: Image --- */}
            <div className="info-image-container">
                <div className="image-overlay-text"><p>Join SkillBridge to connect with NGOs and Volunteering opportunities</p></div>
                <img src={sideImage} alt="Volunteering" />
            </div>

            <div className="info-section">
                {/* Info text can be placed here if needed */}
            </div>
        </div>
    );
}

export default RegisterForNgo;