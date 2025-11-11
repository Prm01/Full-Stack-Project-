import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContex'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        dToken && setDToken('')
        dToken && localStorage.removeItem('dToken')

    }

    return (
        <div className='flex justify-between items-center px-6 sm:px-8 lg:px-12 py-4 border-b border-gray-200 bg-white shadow-sm'>
            {/* Left Section - Logo and Badge */}
            <div className='flex items-center gap-3'>
  {/* Text Logo */}
  <div className="cursor-pointer transition-transform hover:scale-105 duration-200">
    <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      QuickMed
    </h1>
    <p className="text-xs text-gray-400 font-medium tracking-wide">INSTANT APPOINTMENTS</p>
  </div>
  
  {/* Badge */}
  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${
    aToken 
      ? 'bg-purple-100 text-purple-800 border-purple-300' 
      : 'bg-teal-100 text-teal-800 border-teal-300'
  } transition-all duration-300`}>
    {aToken ? '👨‍💼 Admin' : '👨‍⚕️ Doctor'}
  </div>
</div>
            {/* <div className='flex items-center gap-3'>
                <img 
                    className='w-32 sm:w-36 lg:w-40 cursor-pointer transition-transform hover:scale-105 duration-200' 
                    src={assets.admin_logo} 
                    alt="Admin Logo" 
                />
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${
                    aToken 
                        ? 'bg-purple-100 text-purple-800 border-purple-300' 
                        : 'bg-teal-100 text-teal-800 border-teal-300'
                } transition-all duration-300`}>
                    {aToken ? '👨‍💼 Admin' : '👨‍⚕️ Doctor'}
                </div>
            </div> */}

            {/* Right Section - Logout Button */}
            <button 
                onClick={logout}
                className='
                    bg-rose-500 
                    hover:bg-rose-600
                    text-white 
                    px-6 py-2.5 
                    rounded-lg 
                    font-semibold 
                    text-sm
                    shadow-md 
                    hover:shadow-lg 
                    transform 
                    hover:scale-105 
                    active:scale-95
                    transition-all 
                    duration-200 
                    ease-in-out
                    flex 
                    items-center 
                    gap-2
                '
            >
                <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                </svg>
                Logout
            </button>
        </div>
    )
}

export default Navbar