import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MembershipForm from './pages/MembershipForm/index';
import AdminDashboard from './pages/AdminDashboard';
import MemberDetails from './pages/MemberDetails/index';
import PaymentInfo from './pages/PaymentInfo';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile/index';
import Settings from './pages/Settings';
import Users from './pages/Users/index';
import AdminSettings from './pages/admin/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/admin/settings" element={
              <PrivateRoute requireAdmin>
                <AdminSettings />
              </PrivateRoute>
            } />
            <Route path="/adhesion" element={
              <PrivateRoute>
                <MembershipForm />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute requireAdmin>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/users" element={
              <PrivateRoute requireAdmin>
                <Users />
              </PrivateRoute>
            } />
            <Route path="/member/:id" element={
              <PrivateRoute requireAdmin>
                <MemberDetails />
              </PrivateRoute>
            } />
            <Route path="/payment/:id" element={
              <PrivateRoute>
                <PaymentInfo />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;