import React from 'react'
import { Link } from 'react-router-dom'
import { specialityData } from '../assets/assets'

function SpecialityMenu() {
  return (
    <div id='speciality' className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Find by Speciality
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simply browse, book, and consult with ease.
            <br />
            Your health, our priority.
          </p>
        </div>

        {/* Specialities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {specialityData.map((item, index) => (
            <Link  onClick={()=>scroll(0,0)}
              to={`/doctors/${item.speciality}`} 
              key={index} 
              className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 group"
            >
              {/* Icon Container */}
              <div className="w-20 h-20 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:from-teal-100 group-hover:to-blue-100 transition-all duration-300">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-10 h-10 object-contain"
                />
              </div>
              
              {/* Speciality Name */}
              <p className="text-center font-medium text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
                {item.speciality}
              </p>
              
              {/* Hover Arrow */}
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

       
         
        
      </div>
    </div>
  )
}

export default SpecialityMenu