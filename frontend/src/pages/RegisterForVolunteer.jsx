import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterForVolunteer.css';

import logo from '../assets/images/logo.png';
import sideImage from '../assets/images/Home.jpg';

function RegisterForVolunteer() {
    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        location: '',
        skill: '',

    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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
        <div className='register-container'>
            <div className='register-form-section'>
                <div className='form-wrapper'>
                    <div className='logo-container'><img src={logo} className='logo-image' alt=''></img></div>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label >Full Name</label>
                            <input type='text'
                                id='fullName'
                                name='fullName'
                                placeholder='Enter full name'
                                value={formData.fullName}
                                onChange={handleChange}
                                required></input>
                        </div>
                        <div className='form-group'>
                            <label>User name</label>
                            <input type='text'
                                id='username'
                                name='userName'
                                placeholder='enter username'
                                value={formData.userName}
                                onChange={handleChange}
                            ></input>
                        </div>
                        <div className='form-group'>
                            <label>Email</label>
                            <input type='email'
                                id='email'
                                name='email'
                                placeholder='enter your email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            ></input>

                        </div>
                        <div className='form-group'>
                            <label >Password</label>
                            <div className='password-wrapper'>
                                <input type={showPassword?'text':'password'}
                                    id='password'
                                    name='password'
                                    placeholder='Set password'
                                    value={formData.password}
                                    onChange={handleChange}
                                ></input>
                                <span onClick={togglePasswordVisibility} className='pass-toggle'>
                                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        <div className='form-group'>
                            <label>I am a</label>
                            <input type='text'
                                id='volunteer'
                                name='volunteer'
                                placeholder='Volunteer'
                                readOnly
                                className='volunteer'
                            ></input>
                        </div>
                        <div className='form-group'>
                            <label>Location</label>
                            <input type='text'
                                id='location'
                                name='location'
                                placeholder='enter your address'
                                value={formData.location}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <div className='form-group'>
                            <label>Skills</label>
                            <input type='text'
                                id='skill'
                                name='skill'
                                placeholder='enter your skills'
                                value={formData.skill}
                                onChange={handleChange}
                                required
                            ></input>
                        </div>
                        <button type='submit' className='register-btn'>
                            Register
                        </button>
                    </form>
                    <p className='login-link'>if you have already account! please,<Link to="/Login">Login here</Link></p>


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
    )


}
export default RegisterForVolunteer;