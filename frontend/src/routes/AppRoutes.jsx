import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import RegisterForNgo from "../pages/RegisterForNgo";
import RegisterForVolunteer from "../pages/RegisterForVolunteer";
import ProfileEditFormForNgo from "../pages/ProfileEditFormForNgo";
import DashboardForNgo from "../pages/DashboardForNgo";
import ProfileForNgo from "../pages/ProfileForNgo";

import DashboardHome from "../pages/DashboardHome";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterForNgo />} /> 
        <Route path="/volunteer" element={<RegisterForVolunteer/>}/>
        <Route path="/login" element={<Login/>}/>
        
        
      

        <Route path="/dashboard" element={<DashboardForNgo/>}>
          <Route index element={<DashboardHome/>}/>

          <Route path="home" element={<DashboardHome/>}/>
          <Route path="profile" element={<ProfileForNgo/>}/>
          <Route path="profile/edit" element={<ProfileEditFormForNgo/>}/>
        </Route>


       
        <Route path="/" element={<Navigate replace to="/login"/>}/>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
