
import React, { useEffect } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Assestdiscovery from './pages/asset-discovery'
import Admin from './pages/admin'
import Header from './components/Header'
const App = () => {
  
  return (
    <div>
    <Header/>
    <Routes>
      <Route path='/' element={<Homepage/> }/>
      <Route path='/assets' element={<Assestdiscovery/> }/>
      <Route path='/admin' element={<Admin/> }/>
    </Routes>
  </div>
  )
}

export default App