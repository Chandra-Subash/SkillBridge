import React from 'react';
import './DashboardHome.css';
import { FaPlus, FaRegCommentDots } from 'react-icons/fa';


function DashboardHome() {
  return (
    <div className='main'>
      <h1>Main Dashboard Overview</h1>
      <div className='container-top'>
        <div className='head'>
          <h1>Overview</h1>
        </div>
        <div className='first'>
          <p>3</p>
          <h2>Active Applications</h2>
        </div>
        <div className='sec'>
          <p>2</p>
          <h2>Applications Recieved</h2>
        </div>

        <div className='third'>
          <p>0</p>
          <h2>Active Volunteers</h2>
        </div>
        <div className='forth'>
          <p>5</p>
          <h2>Pending Applications</h2>
        </div>
      </div>

      <div className='container-middle'>
        <div className='head'>
          <h1>Recent Applications</h1>
        </div>
        <div className='first-application'>
          <h3>name</h3>
          <label>Applied for:</label>
          <p>Role</p>
          <div className='desc'>
            <p>i have 5 years of exp</p>
          </div>
        </div>
      </div>


      <div className='container-last'>
        <div className='head'>
          <h1>Quick Actions</h1>
        </div>
        <div className='action'>
          <a href='#' className='create'>
            <FaPlus className='action-box'/>
          <h2>Create New Oppurtunity</h2>
          </a>

          <a href='#' className='view-msg'>
            <FaRegCommentDots className='action-box'/>
          <h2>View Messages</h2>  
          </a>
        </div>
          
       

      </div>

    </div>
  );
}

export default DashboardHome;
