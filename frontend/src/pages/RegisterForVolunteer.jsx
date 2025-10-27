import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterForVolunteer.css'; // Ensure this CSS file exists

import logo from '../assets/images/logo.png';
import sideImage from '../assets/images/Home.jpg';

// Get API URL from environment variables or use fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function RegisterForVolunteer() {
    // --- State for Form Data ---
    const [formData, setFormData] = useState({
        // Use 'name' to match backend model directly
        name: '',
        // Use 'username' to match backend model directly
        username: '',
        email: '',
        password: '',
        location: '',
        // Keep 'skill' for the input field, we'll convert it before sending
        skill: '',
        // Add bio if you want to collect it (optional)
        // bio: '',
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

        // --- Prepare data for the backend ---
        // 1. Convert comma-separated skill string to an array
        const skillsArray = formData.skill ? formData.skill.split(',').map(s => s.trim()).filter(s => s) : [];

        // 2. Construct the payload matching the backend User model
        const registrationData = {
            name: formData.name, // Use 'name' from state
            username: formData.username, // Use 'username' from state
            email: formData.email,
            password: formData.password,
            role: 'volunteer', // Explicitly set role
            location: formData.location,
            skills: skillsArray, // Send skills as an array
            // bio: formData.bio, // Include bio if you collect it
        };
        // ------------------------------------

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
            console.log('Volunteer registration successful:', data);
            
            // Navigate to the login page
            navigate('/login');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='register-container'>
            {/* --- Left Column: Form --- */}
            <div className='register-form-section'>
                <div className='form-wrapper'>
                    <div className='logo-container'>
                        <img src={logo} alt="SkillBridge Logo" className='logo-image' />
                    </div>
                    <h2>Register</h2>
                    
                    {/* Display Error Message */}
                    {error && <p className="error-message">{error}</p>} 

                    <form onSubmit={handleSubmit}>
                        {/* Full Name (maps to 'name') */}
                        <div className='form-group'>
                            <label htmlFor='name'>Full Name</label> {/* Use htmlFor */}
                            <input type='text'
                                id='name'         // Match label
                                name='name'       // Match state key 'name'
                                placeholder='Enter full name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {/* User name (maps to 'username') */}
                        <div className='form-group'>
                            <label htmlFor='username'>User name</label> {/* Use htmlFor */}
                            <input type='text'
                                id='username'     // Match label
                                name='username'   // Match state key 'username'
                                placeholder='Choose a username'
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {/* Email */}
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label> {/* Use htmlFor */}
                            <input type='email'
                                id='email'        // Match label
                                name='email'      // Match state key
                                placeholder='Enter your email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {/* Password */}
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label> {/* Use htmlFor */}
                            <div className='password-wrapper'>
                                <input type={showPassword ? 'text' : 'password'}
                                    id='password'    // Match label
                                    name='password'  // Match state key
                                    placeholder='Create password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                                {/* Use correct class from previous CSS */}
                                <span onClick={togglePasswordVisibility} className='password-toggle-icon'> 
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {/* I am a (Read Only) */}
                        <div className='form-group'>
                            <label>I am a</label>
                            <input type='text'
                                value='Volunteer' // Display value
                                readOnly
                                className='read-only-input' // Use consistent class
                                disabled={isLoading}
                            />
                        </div>
                        {/* Location */}
                        <div className='form-group'>
                            <label htmlFor='location'>Location</label> {/* Use htmlFor */}
                            <input type='text'
                                id='location'     // Match label
                                name='location'   // Match state key
                                placeholder='Enter your city, state'
                                value={formData.location}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {/* Skills (maps to 'skill' state, sent as 'skills' array) */}
                        <div className='form-group'>
                            <label htmlFor='skill'>Skills</label> {/* Use htmlFor */}
                            <input type='text'
                                id='skill'        // Match label
                                name='skill'      // Match state key 'skill'
                                placeholder='Enter skills (comma-separated)'
                                value={formData.skill}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                             <small>Enter multiple skills separated by commas (e.g., teaching, coding, design)</small>
                        </div>

                        {/* Register Button */}
                        <button type='submit' className='register-btn' disabled={isLoading}>
                             {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </form>

                    <p className='login-link'>If you already have an account! <Link to="/login">Login here</Link></p> {/* Ensure path is lowercase */}
                </div>
            </div>
            {/* --- Right Column: Image --- */}
            <div className="info-image-container">
                <div className="image-overlay-text"><p>Join SkillBridge to connect with NGOs and Volunteering opportunities</p></div>
                <img src={sideImage} alt="Volunteering" />
            </div>
            <div className="info-section">
                {/* Optional info text */}
            </div>
        </div>
    );
}

export default RegisterForVolunteer;


