

import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContex'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
   
  const { aToken, adminLogout } = useContext(AdminContext)
  const { dToken, doctorLogout } = useContext(DoctorContext)
  
  // Determine which panel to show
  const showAdminPanel = aToken
  const showDoctorPanel = dToken
  
  // Show nothing if no user is logged in
  if (!showAdminPanel && !showDoctorPanel) {
    return null
  }

  const handleLogout = () => {
    if (showAdminPanel) {
      adminLogout?.()
    } else if (showDoctorPanel) {
      doctorLogout?.()
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 flex flex-col'>
      {/* Admin Panel */}
      {showAdminPanel && (
        <div className='p-6 flex-1'>
          {/* Sidebar Header */}
          <div className='mb-8'>
            <h1 className='text-xl font-bold text-white'>Admin Panel</h1>
            <p className='text-gray-400 text-sm mt-1'>Management Dashboard</p>
          </div>

          {/* Navigation Menu */}
          <nav>
            <ul className='space-y-2'>
              <li>
                <NavLink 
                  end
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/admin-dashboard'}
                >
                  <img src={assets.home_icon} alt="Dashboard" className='w-5 h-5' />
                  <span className='font-medium'>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/all-appointments'}
                >
                  <img src={assets.appointment_icon} alt="Appointments" className='w-5 h-5' />
                  <span className='font-medium'>Appointments</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/add-doctor'}
                >
                  <img src={assets.add_icon} alt="Add Doctor" className='w-5 h-5' />
                  <span className='font-medium'>Add Doctor</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/doctor-list'}
                >
                  <img src={assets.patients_icon} alt="Doctor List" className='w-5 h-5' />
                  <span className='font-medium'>Doctor List</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Doctor Panel */}
      {showDoctorPanel && (
        <div className='p-6 flex-1'>
          {/* Sidebar Header */}
          <div className='mb-8'>
            <h1 className='text-xl font-bold text-white'>Doctor Panel</h1>
            <p className='text-gray-400 text-sm mt-1'>Medical Dashboard</p>
          </div>

          {/* Navigation Menu */}
          <nav>
            <ul className='space-y-2'>
              <li>
                <NavLink 
                  end
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/doctor-dashboard'}
                >
                  <img src={assets.home_icon} alt="Dashboard" className='w-5 h-5' />
                  <span className='font-medium'>Dashboard</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/doctor-appointments'}
                >
                  <img src={assets.appointment_icon} alt="Appointments" className='w-5 h-5' />
                  <span className='font-medium'>Appointments</span>
                </NavLink>
              </li>

              <li>
                <NavLink 
                  className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`} 
                  to={'/doctor-profile'}
                >
                  <img src={assets.patients_icon} alt="Doctor profile" className='w-5 h-5' />
                  <span className='font-medium'>Profile</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Bottom Section - Common for both panels */}
      <div className='p-6 border-t border-gray-700'>
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 mb-4"
        >
          <img src={assets.logout_icon} alt="Logout" className='w-5 h-5' />
          <span className='font-medium'>Logout</span>
        </button>

        {/* Version Info */}
        <div className='text-center'>
          <p className='text-gray-400 text-sm'>
            {showAdminPanel ? 'Admin Portal' : 'Doctor Portal'}
          </p>
          <p className='text-gray-500 text-xs mt-1'>v1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
// import React, { useContext } from 'react'
// import { AdminContext } from '../context/AdminContex'
// import { NavLink } from 'react-router-dom'
// import { assets } from '../assets/assets'
// import { DoctorContext } from '../context/DoctorContext'

// const Sidebar = () => {
   
//   const {aToken} = useContext(AdminContext)
//   const {dToken}=useContext(DoctorContext)
  
  
//   return (
//     <div className='min-h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white w-64'>
//       {
//         aToken && (
//           <div className='p-6'>
//             {/* Sidebar Header */}
//             <div className='mb-8'>
//               <h1 className='text-xl font-bold text-white'>Admin Panel</h1>
//               <p className='text-gray-400 text-sm mt-1'>Management Dashboard</p>
//             </div>

//             {/* Navigation Menu */}
//             <ul className='space-y-2'>
//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/admin-dashboard'}
//                 >
//                   <img src={assets.home_icon} alt="Dashboard" className='w-5 h-5' />
//                   <span className='font-medium hidden md:block'>Dashboard</span>
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/all-appointments'}
//                 >
//                   <img src={assets.appointment_icon} alt="Appointments" className='w-5 h-5' />
//                   <span className='font-medium '>Appointments</span>
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/add-doctor'}
//                 >
//                   <img src={assets.add_icon} alt="Add Doctor" className='w-5 h-5' />
//                   <span className='font-medium'>Add Doctor</span>
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/doctor-list'}
//                 >
//                   <img src={assets.patients_icon} alt="Doctor List" className='w-5 h-5' />
//                   <span className='font-medium'>Doctor List</span>
//                 </NavLink>
//               </li>
//             </ul>

//             {/* Bottom Section */}
//             <div className='mt-8 pt-6 border-t border-gray-700'>
//               <div className='text-center'>
//                 <p className='text-gray-400 text-sm'>Admin Portal</p>
//                 <p className='text-gray-500 text-xs mt-1'>v1.0.0</p>
//               </div>
//             </div>
//           </div>
//         )
//       }

//       {
//         dToken && (
//           <div className='p-6'>
//             {/* Sidebar Header */}
//             <div className='mb-8'>
//               <h1 className='text-xl font-bold text-white'>Doctor Panel</h1>
//               <p className='text-gray-400 text-sm mt-1'>Management Dashboard</p>
//             </div>

//             {/* Navigation Menu */}
//             <ul className='space-y-2'>
//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/doctor-dashboard'}
//                 >
//                   <img src={assets.home_icon} alt="Dashboard" className='w-5 h-5' />
//                   <span className='font-medium'>Dashboard</span>
//                 </NavLink>
//               </li>

//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/doctor-appointments'}
//                 >
//                   <img src={assets.appointment_icon} alt="Appointments" className='w-5 h-5' />
//                   <span className='font-medium'>Appointments</span>
//                 </NavLink>
//               </li>

//               {/* <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/add-doctor'}
//                 >
//                   <img src={assets.add_icon} alt="Add Doctor" className='w-5 h-5' />
//                   <span className='font-medium'>Add Doctor</span>
//                 </NavLink>
//               </li> */}

//               <li>
//                 <NavLink 
//                   className={({isActive}) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
//                     isActive 
//                       ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
//                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }`} 
//                   to={'/doctor-profile'}
//                 >
//                   <img src={assets.patients_icon} alt="Doctor profile" className='w-5 h-5' />
//                   <span className='font-medium'>Profile</span>
//                 </NavLink>
//               </li>
//             </ul>

//             {/* Bottom Section */}
//             <div className='mt-8 pt-6 border-t border-gray-700'>
//               <div className='text-center'>
//                 <p className='text-gray-400 text-sm'>Doctor Portal</p>
//                 <p className='text-gray-500 text-xs mt-1'>v1.0.0</p>
//               </div>
//             </div>
//           </div>
//         )
//       }
//     </div>
//   )
// }

// export default Sidebar
// import React, { useContext } from 'react'
// import { AdminContext } from '../context/AdminContex'
// import { NavLink } from 'react-router-dom'
// import { assets } from '../assets/assets'

// const Sidebar = () => {
   
//   const {aToken}=useContext(AdminContext)
//   return (
//     <div className='min-h-screen'>
//    {
//     aToken && <ul className='text-[#515151] mt-5'>


//       <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 min-w-772 cursor-pointer ${isActive? 'bg-[#f2f3]'}`} to={'/admin-dashboard'}>
//         <img src={assets.home_icon} alt="" />
//         <p>Dashboard</p>
//       </NavLink >
//       <NavLink to={'/all-appointments'}>
//         <img src={assets.appointment_icon} alt="" />
//         <p>Appointment</p>
//       </NavLink>
//       <NavLink to={'/add-doctor'}>
//         <img src={assets.add_icon} alt="" />
//         <p>Add Doctor</p>
//       </NavLink>
//       <NavLink to={'/doctor-list'}>
//         <img src={assets.patients_icon} alt="" />
//         <p>Doctor List</p>
//       </NavLink>
//     </ul>
//    }
//     </div>
//   )
// }

// export default Sidebar
