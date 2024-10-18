import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';  
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import Profile from './pages/Profile';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './components/Dashboard';
import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from './components/ForgotPassword'; 

const App = () => {
  const { user } = useSelector((state) => state.auth);  

  // if(user) {
  //   console.log(user.role);
  // }
  
  return (
    <div className="min-h-screen  pb-4" style={{backgroundColor:"#e0f7fa"}}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Role-based routing */}
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin-login" />} 
          />
          <Route 
            path="/dashboard" 
            element={user?.role === 'user' ? <Dashboard /> : <Navigate to="/login" />}  
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
