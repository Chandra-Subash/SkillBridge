import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterForNgo.css';


import logo from '../assets/images/logo.png';
import sideImage from '../assets/images/Home.jpg';

function RegisterForNgo() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    location: '',
    orgName: '',
    orgDescription: '',
    website: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate =useNavigate();
  
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

  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    navigate('/login');
  };

  return (
    <div className="register-container">
     
      <div className="register-form-section">
        <div className="form-wrapper">
          <div className="logo-container">
            <img src={logo} alt="SkillBridge Logo" className="logo-image" />
          </div>

          <h2>Register</h2>

          <form onSubmit={handleSubmit}>
           
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your Full name or organization name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            
            <div className="form-group">
              <label htmlFor="role">I am a</label>
              <input
                type="text"
                id="role"
                name="role"
                value="NGO /Organization"
                readOnly
                className="read-only-input"
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="eg. New york, NY"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="orgName">Organisation Name</label>
              <input
                type="text"
                id="orgName"
                name="orgName"
                placeholder="Enter your organisation name"
                value={formData.orgName}
                onChange={handleChange}
                required
              />
            </div>

           
            <div className="form-group">
              <label htmlFor="orgDescription">Organization Description</label>
              <textarea
                id="orgDescription"
                name="orgDescription"
                placeholder="Tell us About your organization's mission and goals"
                value={formData.orgDescription}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="website">Website URL</label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="eg. https://www.yourorganization.org"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            
            <button type="submit" className="register-btn">
              Register
            </button>
          </form>

          <p className="login-link">
            If you already have an account! You can <Link to="/Login">Login here !</Link>
          </p>
        </div>
      </div>
      
      
      <div className="info-image-container">
        <div className="image-overlay-text"><p>Join SkillBridge to connext with NGOs and Volunteering oppurtunities</p></div>
        <img src={sideImage} alt="Volunteering" />
      </div>

     
      <div className="info-section">
        <h1 className="info-text">
          
        </h1>
      </div>
    </div>
  );
}

export default RegisterForNgo;