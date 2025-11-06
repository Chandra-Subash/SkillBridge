import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DashboardHomeForvol.css'; 

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const OpportunityCard = ({ opp }) => (
  <div className="opportunity-preview-card">
    <div className="card-header">
      <h3>{opp.title}</h3>
      <span className={`status-badge status-${opp.status}`}>{opp.status}</span>
    </div>
    
 
    <span className="ngo-id">{opp.ngo?.organization_name || 'NGO'}</span> 
    
    <p className="description">{opp.description}</p>
    <div className="tags-container">
      

      {opp.required_skills.map((skill, index) => (
        <span key={index} className="skill-tag">{skill}</span>
      ))}
    </div>
    
   
    <Link to={`/dashboard/find-oppurt`} className="view-details-link">
      View details &gt;
    </Link>
  </div>
);


function DashboardHomeForvol() { 
  const [stats, setStats] = useState({});
  const [opportunities, setOpportunities] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("Not authorized. Please log in.");
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/users/dashboard`, { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch dashboard data');
        }
        
        
        setStats(data.stats || {});
        setOpportunities(data.Oppurtunities || []); 

      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className="loading-message">Loading Dashboard...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="volunteer-home-main">
      <h1>Dashboard</h1>
      
     
      <div className="dashboard-section-card">
        <h2 className="card-title">Your Impact</h2>
        <div className="impact-card-grid">
          <div className="impact-card stat-blue">
            <p>{stats.applications || 0}</p>
            <h2>Application</h2>
          </div>
          <div className="impact-card stat-green">
            <p>{stats.accepted || 0}</p>
            <h2>Accepted</h2>
          </div>
          <div className="impact-card stat-pending">
            <p>{stats.pending || 0}</p>
            <h2>Pending</h2>
          </div>
          <div className="impact-card stat-yellow">
            <p>{stats.skills || 0}</p>
            <h2>Skills</h2>
          </div>
        </div>
      </div>

     
      <div className="dashboard-section-card">
        <div className="card-header">
          <h2 className="card-title">Find Opportunities</h2>
          <Link to="/dashboard/find-opportunities" className="view-all-link">View All</Link>
        </div>
        <p className="card-subtitle">Discover volunteering opportunities that match your skills and interests.</p>
        <Link to="/dashboard/find-oppurt" className="browse-all-btn">
          Browse All Opportunities
        </Link>
        <div className="opportunity-list">
          
          {(opportunities && opportunities.length > 0) ? (
            opportunities.map(opp => (
            
              <OpportunityCard key={opp._id} opp={opp} />
            ))
          ) : (
            <p className="no-messages">No opportunities found.</p>
          )}
        </div>
      </div>

      
      <div className="dashboard-section-card">
        <div className="card-header">
          <h2 className="card-title">Recent Messages</h2>
        </div>
        <p className="no-messages">No recent messages</p>
        <Link to="/dashboard/messages" className="view-all-btn">
          View All Messages
        </Link>
      </div>

    </div>
  );
}

export default DashboardHomeForvol;

