import React, { useContext } from 'react'
import { doctors } from '../assets/assets'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontex'

function TopDoctor() {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  
  return (
    <div id="doctors" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Top Doctors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors and book your appointment with confidence
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {doctors.slice(0, 10).map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              {/* Doctor Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {/* <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> */}
                     <span className={`w-2 h-2 rounded-full mr-2 ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    Available
                  </span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-teal-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{item.speciality}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(124)</span>
                </div>

                {/* Experience */}
                <div className="text-sm text-gray-500">
                  <span>⭐ 5+ years experience</span>
                </div>
              </div>

              {/* Book Button */}
              <div className="px-4 pb-4">
                <button 
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* More Button */}
        <div className="text-center">
          <div 
            onClick={() => { 
              navigate('/doctors'); 
              window.scrollTo(0, 0); 
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            View More Doctors
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopDoctor;