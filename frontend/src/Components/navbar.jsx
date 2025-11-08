import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontex';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const {token,setToken,userData}=useContext(AppContext)
  const Logout=()=>{
    setToken(false)
    localStorage.removeItem('token')
  }
  
  // const [token,setToken] = useState(true); // Set to false for demo, you can manage this with your auth logic

 

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
       <div className="flex-shrink-0">
  <NavLink to="/">
    <div 
      onClick={() => navigate('/')}
      className="flex items-center space-x-3 cursor-pointer group"
    >
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform group-hover:scale-105 transition-all duration-300">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
      </div>
      <div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          QuickMed
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-wide">INSTANT APPOINTMENTS</p>
      </div>
    </div>
  </NavLink>
</div>
          {/* <div className="flex-shrink-0">
            <NavLink to="/">
              <img  onClick={()=>navigate('/')}
                src={assets.logo} 
                alt="logo" 
                className="w-44 cursor-pointer hover:opacity-90 transition-opacity duration-200"
              />
            </NavLink>
          </div> */}

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink 
                to="/"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-b-2 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/doctor"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-b-2 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                All Doctors
              </NavLink>
              <NavLink 
                to="/about"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-b-2 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/contact"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-b-2 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {token && userData ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-teal-50 transition-colors duration-200"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <img 
                    src={userData.image} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <img 
                    src={assets.dropdown_icon} 
                    alt="Dropdown" 
                    className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button 
                      onClick={() => {
                        navigate('/myprofile');
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/myappointment');
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                    >
                      My Appointments
                    </button>
                    <hr className="my-1" />
                    <button 
                      onClick={()=>setToken(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create account
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
            >
              <svg 
                className="h-6 w-6" 
                stroke="currentColor" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
              <NavLink 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-l-4 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/doctors"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-l-4 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                All Doctors
              </NavLink>
              <NavLink 
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-l-4 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-teal-600 bg-teal-50 border-l-4 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                  }`
                }
              >
                Contact
              </NavLink>
              
              {/* Mobile Auth Buttons */}
              <div className="px-3 py-2 space-y-2">
                {token ? (
                  <>
                    <button 
                      onClick={() => {
                        navigate('/myprofile');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/myappointment');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
                    >
                      My Appointments
                    </button>
                    <button 
                      onClick={Logout}
                      className="w-full text-left px-3 py-2 rounded-md text-base text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }} 
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-2.5 rounded-full text-base font-semibold shadow-lg transition-all duration-200"
                  >
                    Create account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* <img onClick={()=>setIsMenuOpen(true)} src={assets.menu_icon} alt="" /> */}
      </div>
    </nav>
  );
};

export default Navbar;