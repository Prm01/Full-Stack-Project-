import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            About <span className="text-teal-600">US</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img 
                src={assets.about_image} 
                alt="Healthcare Team" 
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-500 rounded-2xl -z-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              Welcome to <span className="font-semibold text-teal-600">Prescripto</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-500 pl-6 py-4 rounded-r-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            WHY <span className="text-teal-600">CHOOSE US</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Discover what makes Prescripto the preferred choice for modern healthcare management
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full mb-12"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Efficiency */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">EFFICIENCY</h3>
            <p className="text-gray-600 leading-relaxed">
              Streamlined appointment scheduling that fits into your busy lifestyle. Book appointments in minutes, not hours.
            </p>
          </div>

          {/* Convenience */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">CONVENIENCE</h3>
            <p className="text-gray-600 leading-relaxed">
              Access to a network of trusted healthcare professionals in your area. Find the right specialist near you.
            </p>
          </div>

          {/* Personalization */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">PERSONALIZATION</h3>
            <p className="text-gray-600 leading-relaxed">
              Tailored recommendations and reminders to help you stay on top of your health goals and appointments.
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users who have simplified their healthcare journey with Prescripto.
          </p>
          <button className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  )
}

export default About

// import React from 'react'
// import { assets } from '../assets/assets'

// const about = () => {
//   return (
//     <div>
//      <div>
//       <p>About <span>US</span></p>
//       <div>
//         <img src={assets.about_image} alt="" />
//       </div>
//       <div>
//         <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
//         <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
//         <b>Our Vision</b>
//         <p>Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
//       </div>
//      </div>
//      <div>
//       <p>WHY CHOOSE US</p>
//      </div>
//      <div>
//       <div>
//       <h2>EFFICIENCY:</h2>
//       <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
//       </div>
//       <div>
//      <h2>CONVENIENCE:</h2>
//      <p>Access to a network of trusted healthcare professionals in your area.</p>
//       </div>
//       <div>
//       <h2>PERSONALIZATION:</h2>
//       <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
//       </div>
//      </div>
//     </div>
//   )
// }

// export default about
