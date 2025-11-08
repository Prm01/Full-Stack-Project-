import React, { use, useEffect } from 'react'
import { assets, doctors } from '../assets/assets'
import { useNavigate } from 'react-router-dom';

export default function Banner() {
    const navigate = useNavigate();
   
    
    return (
        <div className='flex bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-16 py-10 justify-between items-center gap-5 lg:gap-20 mx-5 lg:mx-20 my-20'>
            {/* left side */}
            <div className='flex-1 py-8 text-white'>
                <p className='text-lg sm:text-xl font-medium mb-2'>Book Appointment</p>
                <p className='text-2xl sm:text-3xl lg:text-4xl font-bold'>With 100+ Trusted Doctors</p>
                <p className='text-teal-100 mt-3 text-sm sm:text-base'>
                    Get instant access to qualified healthcare professionals
                </p>
            </div>

            {/* CTA Button */}
            <button 
                onClick={() => { 
                    navigate('/login'); 
                    window.scrollTo(0, 0); 
                }} 
                className='bg-white text-teal-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap'
            >
                Create Account
            </button>

            {/* right side */}
            <div className='hidden md:block w-1/2 lg:w-1/3 relative'>
                <img 
                    className='w-full absolute bottom-0 right-0 max-w-md' 
                    src={assets.appointment_img} 
                    alt="Doctor appointment" 
                />
            </div>
        </div>
    )
}

// import React, { use } from 'react'
// import { assets } from '../assets/assets'
// import { useNavigate } from 'react-router-dom';

// export default function Banner() {
//     const navigate=useNavigate();
//   return (
//     <div className='flex bg-blue-500 rounded-lg px-6 sm:px-10 md:px-14 lg:px-50 py-10 justify-between items-center gap-5 lg:gap-20 mx-5 lg:mx-20 my-20'>
//       {/* left side */}
//       <div className='flex-1 py-8 '>
//      <p>Book Appointment</p>
//      <p>With 100+ Trusted Doctors</p>

//       </div>
//       <button onClick={()=>{navigate('/login');scrollTo(0,0)}} className=' bg-white hover:'>Create Accounts</button>

//        {/* right side */}

//        <div className='hidden md:block w-1/2 lg:w-1/3 relative'>
//       <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
//        </div>
//     </div>
//   )
// }


