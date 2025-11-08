import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-teal-50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Left Section */}
          <div className="text-center md:text-left">
            <img 
              src={assets.logo} 
              alt="Company Logo" 
              className="w-44 mx-auto md:mx-0 mb-4"
            />
            <p className="text-gray-600 leading-relaxed text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors duration-300">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors duration-300">
                <span className="text-white text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors duration-300">
                <span className="text-white text-sm">in</span>
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors duration-300">Home</li>
              <li className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors duration-300">About us</li>
              <li className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors duration-300">Delivery</li>
              <li className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors duration-300">Privacy policy</li>
              <li className="text-gray-600 hover:text-teal-600 cursor-pointer transition-colors duration-300">Terms & Conditions</li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">GET IN TOUCH</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📞</span>
                </div>
                <span>+91 112996903</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✉️</span>
                </div>
                <span>greatstackdev@gmail.com</span>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm text-center md:text-left mb-2 md:mb-0">
              Copyright 2024 @ Greatstack.dev - All Right Reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="hover:text-teal-600 cursor-pointer transition-colors duration-300">Privacy Policy</span>
              <span className="hover:text-teal-600 cursor-pointer transition-colors duration-300">Terms of Service</span>
              <span className="hover:text-teal-600 cursor-pointer transition-colors duration-300">Cookies Settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

// import React from 'react'
// import { assets } from '../assets/assets'

// const Footer = () => {
//   return (
//     <div>
//       <div>
//         {/* left section */}
//         <div>
//        <img src={assets.logo} alt="" />
//        <p>
//         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
//        </p>
//         </div>
//          {/* centre section */}
//          <div>
//         <p>Company</p>
//         <ul>
//             <li>Home</li>
//             <li>About us</li>
//             <li>Delivery</li>
//             <li>Privacy policy</li>
//         </ul>
//          </div>
//           {/* rightsection */}
//           <div>
//          <p>GET IN TOUCH</p>
//          <li>+91 112996903</li>
//          <li>greatstackdev@gmail.com</li>
//           </div>
//       </div>
//       <div>
//         {/* Copywrigt text*/}
//         <hr />
//         <p>Copyright 2024 @ Greatstack.dev - All Right Reserved.</p>
//       </div>
//     </div>
//   )
// }

// export default Footer
