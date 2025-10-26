import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import './ProfileEditFormForNgo.css';


import profile from '../assets/images/pic.png';

function ProfileEditFormForNgo() {
    const [formData, setFormData] = useState(()=>{
        const savedData=localStorage.getItem('userProfile');
        if(savedData){
            return JSON.parse(savedData);
        }else{
            return{

        Organisation: '',
        Description: '',
        url: '',
        fullname: '',
        username: '',
        email: '',

        location: '',
        avatarUrl:profile
            };
        }
    });

    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(formData.avatarUrl);
    const [imageFile, setImageFile] = useState(null);

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
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            const reader =new FileReader();
            reader.onloadend=()=>{
                setFormData(prev=>({
                    ...prev,
                    avatarUrl:reader.result
                }));

            };
            reader.readAsDataURL(file);
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('userProfile',JSON.stringify(formData));
        console.log("form submitted", formData);
        navigate('/dashboard/profile');

    };

    return (
        <form onSubmit={handleSubmit}>
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
                        ></input>

                    </div>

                    <div className="form">                        <label>Organisation</label>
                        <input type="text"
                            name="Organisation"
                            id="Organisation"
                            placeholder="enter new Organisation name"
                            value={formData.Organisation}
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="form">

                        <label>Description</label>
                        <textarea type="text"
                            placeholder="Enter Organisation Description"
                            name="Description"
                            id="Description"
                            value={formData.Description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="form">

                        <label>URL</label>
                        <input type="url"
                            placeholder="Eg:https://www.vit.com"
                            name="url"
                            id="url"
                            value={formData.url}
                            onChange={handleChange}
                        ></input>
                    </div>
                </div>
                <div className="container-right">
                    <div className="form">

                        <label>Full Name</label>
                        <input type="text"
                            name="fullname"
                            id="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="enter full name"
                        ></input>
                    </div>
                    <div className="form">

                        <label>User Name</label>
                        <input type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter new Username"
                        ></input>
                    </div>
                    <div className="form">

                        <label>email</label>
                        <input type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="enter email"
                        ></input>
                    </div>
                    <div className="form">

                        <label>Location</label>
                        <input type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="enter new Location"
                        ></input>
                    </div>

                    <button type="submit" className="btn">Save & Continue</button>


                </div>




            </div>
        </form>
    )



}
export default ProfileEditFormForNgo;