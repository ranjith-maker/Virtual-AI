import React, { useContext } from 'react'
import {Routes , Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Customize from './pages/Customize'
import { userDataContext } from './Context/UserContext'
import { Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Shimmer from './pages/Shimmer'





export default function App() {
  const { userDetails, appLoading } = useContext(userDataContext);
  const hasAssistant = userDetails?.assistantImg && userDetails?.assistantName;

if (appLoading) {
  return <Shimmer />;
}

return (
  <Routes>
    {/* If userDetails is present, do not let them see login/signup layouts */}
    <Route path="/signup" element={!userDetails ? <SignUp /> : <Navigate to="/customize" />} />
    <Route path="/login" element={!userDetails ? <Login /> : <Navigate to="/customize" />} />
    
    {/* Protected Routes */}
    <Route path="/customize" element={userDetails ? <Customize /> : <Navigate to="/login" />} />
    <Route path="/" element={userDetails ? (hasAssistant ? <Home /> : <Navigate to="/customize" />) : <Navigate to="/login" />} />
    
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);
}





