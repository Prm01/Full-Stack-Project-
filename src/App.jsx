import React from 'react'
// import Login from './pages/login'
import Login from './pages/Login';
  import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';

import { AdminContext } from './context/AdminContex';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import Doctorlist from './pages/admin/Doctorlist';
import AllAppointments from './pages/admin/AllAppointment';
import AddDoctor from './pages/admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

// gfghghggh

const App = () => {

  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)

  return aToken || dToken ?(
    <div className='bg-[#F8F9FD]'>
     
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>

        <Routes>
            {/*  Admin Routes*/ }
          <Route path='/' element={<></>}/>
           <Route path='/admin-dashboard' element={<Dashboard/>}/>
        <Route path='/all-appointments' element={<AllAppointments/>}/>
        <Route path='/add-doctor' element={<AddDoctor/>}/>
        <Route path='/doctor-list' element={<Doctorlist/>}/>
        {/*  Doctor Routes*/ }
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/doctor-list' element={<Doctorlist/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>

        
        </Routes>
      </div>
    </div>
  )
  :
  (
    <>
    <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
