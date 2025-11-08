import React from 'react'
import { assets } from '../assets/assets'

function Header() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* ------------ Left Side ------------ */}
          <div className="flex-1 text-center lg:text-left">
            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Book Appointments
              <br />
              With <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">Trusted Doctors</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Simply browse, book, and consult with ease.
              <br />
              Your health, our priority.
            </p>

            {/* Trusted Users Section */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="flex -space-x-3">
                <img 
                  src={assets.group_profiles} 
                  alt="Trusted users" 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                />
                <div className="w-12 h-12 rounded-full bg-teal-500 border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2K+</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">500+</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Trusted by thousands of patients
                </p>
                <p className="text-xs text-gray-500">
                  and hundreds of doctors
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href="#speciality" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Book Appointments
              <img 
                src={assets.arrow_icon} 
                alt="" 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>

            {/* Stats Section */}
            <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-teal-600">500+</div>
                <div className="text-sm text-gray-600">Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-teal-600">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>

          {/* ------------ Right Side ------------ */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Image */}
              <img 
                src={assets.header_img} 
                alt="Doctor and patient" 
                className="w-full max-w-lg lg:max-w-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white px-4 py-3 rounded-xl shadow-lg border border-teal-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Online Now</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 rounded-xl shadow-lg border border-blue-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">98%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -z-10 top-10 -right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header