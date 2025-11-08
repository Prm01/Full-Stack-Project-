import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Doctors from './pages/doctors';
import Login from './pages/login';
import About from './pages/about';
import Contact from './pages/contact';
import MyProfile from './pages/myprofile.jsx';
import MyAppointments from './pages/myappointment.jsx';
import Appointment from './pages/appointment';
import Doctor from './pages/doctors.jsx';
import Navbar from './Components/navbar';
import Footer from './Components/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myappointment" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
