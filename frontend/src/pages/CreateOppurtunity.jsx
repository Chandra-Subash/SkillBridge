import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateOppurtunity.css'; 
import { FaArrowLeft } from 'react-icons/fa'; 


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const CreateOpportunity = () => {
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        location: '',
        status: 'open'
    });
    
   
    const [currentSkill, setCurrentSkill] = useState('');
    const [skillsList, setSkillsList] = useState([]);

   
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

   
    const handleAddSkill = () => {
        const trimmedSkill = currentSkill.trim();
        if (trimmedSkill && !skillsList.includes(trimmedSkill)) {
            setSkillsList([...skillsList, trimmedSkill]);
            setCurrentSkill('');
        }
    };
    
   
    const handleRemoveSkill = (skillToRemove) => {
        setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
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

       
        const opportunityData = {
            ...formData,
            skills: skillsList
        };

        try {
            
            const response = await fetch(`${API_URL}/opportunities`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(opportunityData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create opportunity');
            }

            console.log('Opportunity created:', data);
            navigate('/dashboard/applications');

        } catch (err) {
            console.error("Create Opportunity Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

   
    return (
       
        <div className="main-content"> 
            
           
            <div className="header-section d-flex align-items-center mb-4">
                <button onClick={() => navigate(-1)} className="back-arrow-btn me-3">
                    <FaArrowLeft />
                </button>
                <h1 className="fw-semibold m-0">Create New Opportunity</h1>
            </div>

            <div className="create-form-container p-4 rounded shadow-sm bg-white mb-4">
               
                {error && <div className="alert alert-danger">{error}</div>}

                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                       
                        <label htmlFor="title" className="form-label fw-semibold">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="e.g. Website Redesign"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label fw-semibold">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description" 
                            rows="3"
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="Provide details about the opportunity"
                            required
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="skillInput" className="form-label fw-semibold">Required Skills</label>
                        <div className="d-flex align-items-center gap-2">
                            <div className="grow">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="skillInput"
                                    placeholder="e.g. Web Development"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary" 
                                onClick={handleAddSkill} 
                                disabled={isLoading}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    
                    <div className="skill-tags-list mb-3">
                        {skillsList.map((skill, index) => (
                            <div key={index} className="skill-tag">
                                <span>{skill}</span>
                                <button type="button" onClick={() => handleRemoveSkill(skill)}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex gap-3 mb-3">
                        <div className="flex-fill">
                            <label htmlFor="duration" className="form-label fw-semibold">Duration</label>
                            <input
                                type="text"
                                className="form-control"
                                id="duration"
                                name="duration" 
                                value={formData.duration} 
                                onChange={handleChange} 
                                placeholder="e.g. 2–3 weeks, Ongoing"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex-fill">
                            <label htmlFor="location" className="form-label fw-semibold">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="e.g. New York, NY"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="status" className="form-label fw-semibold">Status</label>
                        <select
                            className="form-select"
                            id="status"
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            onClick={() => navigate(-1)} 
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        
                        <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateOpportunity;

