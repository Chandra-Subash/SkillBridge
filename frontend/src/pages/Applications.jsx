import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Applications.css';
import { FaPlus, FaChevronDown } from 'react-icons/fa';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';


const fetchMockData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {

            const data = [
                {
                    id: 1,
                    applicant: {
                        name: "John Doe",
                    },
                    opportunity: {
                        title: "Website Redesign for Local shelter",
                        ngoId: "NGO ID: 2",
                        description: "Help us redesign our website to improve our online presence and reach more potential adopters.",
                        skills: ["Web Development", "Web Design"],
                        location: "New York, NY",
                        duration: "2-3 weeks"
                    },
                    status: "pending"
                },
                {
                    id: 2,
                    applicant: {
                        name: "Jane Smith",
                    },
                    opportunity: {
                        title: "Traditional of Education Materials",
                        ngoId: "NGO ID: 2",
                        description: "Transite educational materials from English to Spanish, French, or Arabic to support our global literacy program",
                        skills: ["Web Development", "Translation"],
                        location: "Remote",
                        duration: "Ongoing"
                    },
                    status: "pending"
                }
            ];
            resolve(data);
        }, 1000);
    });
};

const ApplicationCard = ({ app }) => {
    return (
        <div className="application-card">
            <h3>{app.opportunity.title}</h3>

            <span className="applicant-name">Applicant: {app.applicant.name}</span>
            <span className="ngo-id">{app.opportunity.ngoId}</span>
            <p className="description">{app.opportunity.description}</p>

            <div className="tags-container">
                {app.opportunity.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                ))}
            </div>

            <div className="details-row">
                <span>{app.opportunity.location}</span>
                <span>{app.opportunity.duration}</span>
            </div>

            <Link to={`/dashboard/applications/${app.id}`} className="view-details-link">
                View details &gt;
            </Link>
        </div>
    );
};

function Applications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {

        const loadApplications = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');

            if (!token) {
                setError("Not authorized. Please log in.");
                setIsLoading(false);
                return;
            }

            try {
                console.log("Fetching recent applications...");

                // --- REAL FETCH (commented out) ---
                // const response = await fetch(`${API_URL}/applications/recent`, { // Example URL
                //   headers: { 'Authorization': `Bearer ${token}` }
                // });
                // const data = await response.json();
                // if (!response.ok) {
                //   throw new Error(data.error || 'Failed to fetch applications');
                // }
                // setApplications(data.applications);

                // --- MOCK FETCH (using fake function) ---
                const data = await fetchMockData();
                setApplications(data);

            } catch (err) {
                console.error("Error loading applications:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadApplications();

    }, []);

    return (
        <div className="opportunities-page">


            <div className="page-header">
                <div className="header-text">
                    <h1>Your Applications</h1>

                </div>

                <Link to="/dashboard/opportunities/create" className="create-btn">
                    <FaPlus /> <span>Create New Opportunity</span>
                </Link>
            </div>


            <div className="filter-bar">
                <div className="tabs">

                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'open' ? 'active' : ''}`}
                        onClick={() => setActiveTab('open')}
                    >
                        Open(3)
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'closed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('closed')}
                    >
                        Closed(0)
                    </button>
                </div>
                <div className="filter-dropdown">
                    <span>All Opportunity</span>
                    <FaChevronDown />
                </div>
            </div>


            <div className="application-list-section">
                <h2>Recent Applications</h2>


                {isLoading && <div className="loading-message">Loading applications...</div>}
                {error && <div className="error-message">{error}</div>}


                {!isLoading && !error && (
                    <div className="card-list">
                        {applications.length > 0 ? (
                            applications.map(app => (
                                <ApplicationCard key={app.id} app={app} />
                            ))
                        ) : (
                            <p>No recent applications found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Applications;

