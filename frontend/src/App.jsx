import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Assestdiscovery from './pages/asset-discovery'
import Admin from './pages/admin'
import Login from './pages/login'
import Header from './components/Header'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <div>
      <Header/>
      <div className="pt-20">
        <Routes>
          <Route path='/' element={<Homepage/> }/>
          <Route path='/assets' element={<Assestdiscovery/> }/>
          <Route path='/login' element={<Login/> }/>
          <Route path='/admin' element={
            <ProtectedRoute>
              <Admin/>
            </ProtectedRoute>
          }/>
        </Routes>
      </div>
    </div>
  )
}

export default App