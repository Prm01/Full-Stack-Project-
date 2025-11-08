import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContex";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotDateFormate, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Overview of your healthcare platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Doctors Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{dashData.doctors || 0}</p>
                  <p className="text-gray-600 font-medium mt-2">Total Doctors</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <img 
                    src={assets.doctor_icon} 
                    alt="Doctors" 
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Active professionals
              </div>
            </div>

            {/* Appointments Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{dashData.appointments || 0}</p>
                  <p className="text-gray-600 font-medium mt-2">Total Appointments</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <img 
                    src={assets.appointment_icon} 
                    alt="Appointments" 
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Total bookings
              </div>
            </div>

            {/* Patients Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{dashData.patients || 0}</p>
                  <p className="text-gray-600 font-medium mt-2">Total Patients</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <img 
                    src={assets.patients_icon} 
                    alt="Patients" 
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                Registered users
              </div>
            </div>

            {/* Earnings Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{currency}{dashData.earning || 0}</p>
                  <p className="text-gray-600 font-medium mt-2">Total Earnings</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-amber-600 font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                Platform revenue
              </div>
            </div>
          </div>

          {/* Latest Bookings Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <img 
                      src={assets.list_icon} 
                      alt="Bookings" 
                      className="w-6 h-6 filter brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Latest Bookings</h2>
                    <p className="text-gray-500 mt-1">Recent appointment requests and activities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last updated</p>
                  <p className="text-sm font-semibold text-gray-900">Just now</p>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="divide-y divide-gray-100">
              {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
                dashData.latestAppointments.map((item, index) => (
                  <div key={index} className="px-8 py-6 hover:bg-blue-50/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      {/* Left Section - Doctor & Patient Info */}
                      <div className="flex items-center space-x-6">
                        {/* Doctor Avatar */}
                        <div className="relative">
                          <img 
                            src={item.docData?.image || '/default-doctor.png'} 
                            alt={item.docData?.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/default-doctor.png';
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        
                        {/* Appointment Details */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              Dr. {item.docData?.name || 'Unknown Doctor'}
                            </h3>
                            {item.cancelled ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Cancelled
                              </span>
                            ) : item.isCompleted ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Confirmed
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{slotDateFormate(item.slotDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{item.slotTime}</span>
                            </div>
                            {item.userData && (
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{item.userData.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Action & Amount */}
                      <div className="flex items-center space-x-4">
                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {currency}{item.amount || item.docData?.fees || '0'}
                          </p>
                          <p className="text-sm text-gray-500">Appointment Fee</p>
                        </div>

                        {/* Action Button */}
                        {!item.cancelled && !item.isCompleted && (
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-red-200"
                            title="Cancel Appointment"
                          >
                            <img
                              src={assets.cancel_icon}
                              alt="Cancel"
                              className="w-4 h-4 filter brightness-0 invert"
                            />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="px-8 py-16 text-center">
                  <div className="text-gray-300 mb-4">
                    <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent bookings</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Appointments will appear here as they are booked by patients.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 && (
              <div className="border-t border-gray-200 px-8 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{dashData.latestAppointments.length}</span> recent bookings
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold transition-all duration-300 transform hover:translate-x-1 flex items-center space-x-1">
                    <span>View all appointments</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;

// import React from "react";
// import { useContext } from "react";
// import { AdminContext } from "../../context/AdminContex";
// import { useEffect } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";

// const Dashboard = () => {
//   const { aToken, getDashData, cancelAppointment, dashData } =
//     useContext(AdminContext);
//   const { slotDateFormate } = useContext(AppContext);

//   useEffect(() => {
//     if (aToken) {
//       getDashData();
//     }
//   }, [aToken]);

//   return (
//     dashData && (
//       <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//             <p className="text-gray-600 mt-2">Overview of your healthcare platform</p>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {/* Doctors Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-3xl font-bold text-gray-900">{dashData.doctors || 0}</p>
//                   <p className="text-gray-600 font-medium mt-1">Doctors</p>
//                 </div>
//                 <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
//                   <img 
//                     src={assets.doctor_icon} 
//                     alt="Doctors" 
//                     className="w-8 h-8 text-blue-500"
//                   />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-green-600">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Active professionals
//               </div>
//             </div>

//             {/* Appointments Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-3xl font-bold text-gray-900">{dashData.appointments || 0}</p>
//                   <p className="text-gray-600 font-medium mt-1">Appointments</p>
//                 </div>
//                 <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
//                   <img 
//                     src={assets.appointment_icon} 
//                     alt="Appointments" 
//                     className="w-8 h-8 text-green-500"
//                   />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-blue-600">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                 </svg>
//                 Total bookings
//               </div>
//             </div>

//             {/* Patients Card */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-3xl font-bold text-gray-900">{dashData.patients || 0}</p>
//                   <p className="text-gray-600 font-medium mt-1">Patients</p>
//                 </div>
//                 <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
//                   <img 
//                     src={assets.patients_icon} 
//                     alt="Patients" 
//                     className="w-8 h-8 text-purple-500"
//                   />
//                 </div>
//               </div>
//               <div className="mt-4 flex items-center text-sm text-purple-600">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
//                 </svg>
//                 Registered users
//               </div>
//             </div>
//           </div>

//           {/* Latest Bookings Section */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//             {/* Section Header */}
//             <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
//                   <img 
//                     src={assets.list_icon} 
//                     alt="Bookings" 
//                     className="w-5 h-5 text-orange-500"
//                   />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Latest Bookings</h2>
//                   <p className="text-sm text-gray-500">Recent appointment requests</p>
//                 </div>
//               </div>
//             </div>

//             {/* Bookings List */}
//             <div className="divide-y divide-gray-100">
//               {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
//                 dashData.latestAppointments.map((item, index) => (
//                   <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
//                     <div className="flex items-center justify-between">
//                       {/* Doctor Info */}
//                       <div className="flex items-center space-x-4">
//                         <img 
//                           src={item.docData?.image || '/default-doctor.png'} 
//                           alt={item.docData?.name}
//                           className="w-12 h-12 rounded-xl object-cover border border-gray-200"
//                           onError={(e) => {
//                             e.target.src = '/default-doctor.png';
//                           }}
//                         />
//                         <div>
//                           <h3 className="font-semibold text-gray-900">
//                             Dr. {item.docData?.name || 'Unknown Doctor'}
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-1">
//                             📅 {slotDateFormate(item.slotDate)} • {item.slotTime}
//                           </p>
//                           {item.userData && (
//                             <p className="text-xs text-gray-400 mt-1">
//                               Patient: {item.userData.name}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Action */}
//                       <div className="flex items-center space-x-3">
//                         {item.cancelled ? (
//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
//                             <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                             Cancelled
//                           </span>
//                         ) : (
//                           <button
//                             onClick={() => cancelAppointment(item._id)}
//                             className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md border border-red-200"
//                             title="Cancel Appointment"
//                           >
//                             <img
//                               src={assets.cancel_icon}
//                               alt="Cancel"
//                               className="w-4 h-4"
//                             />
//                             <span>Cancel</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 /* Empty State */
//                 <div className="px-6 py-12 text-center">
//                   <div className="text-gray-400 mb-4">
//                     <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                   </div>
//                   <h3 className="text-sm font-medium text-gray-900 mb-1">No recent bookings</h3>
//                   <p className="text-sm text-gray-500">Appointments will appear here as they are booked</p>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             {dashData.latestAppointments && dashData.latestAppointments.length > 0 && (
//               <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
//                 <div className="flex justify-between items-center text-sm text-gray-500">
//                   <span>Showing {dashData.latestAppointments.length} recent bookings</span>
//                   <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
//                     View all appointments →
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default Dashboard;


// import React from "react";
// import { useContext } from "react";
// import { AdminContext } from "../../context/AdminContex";
// import { useEffect } from "react";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";

// const Dashboard = () => {
//   const { aToken, getDashData, cancelAppointment, dashData } =
//     useContext(AdminContext);
//   const { slotDateFormate } = useContext(AppContext);

//   useEffect(() => {
//     if (aToken) {
//       getDashData();
//     }
//   }, [aToken]);

//   return (
//     dashData && (
//       <div>
//         <div>
//           <img src={assets.doctor_icon} alt="" />
//           <div>
//             <p>{dashData.doctors}</p>
//             <p>Doctors</p>
//           </div>
//         </div>
//         <div>
//           <img src={assets.appointment_icon} alt="" />
//           <div>
//             <p>{dashData.appointments}</p>
//             <p>Appointments</p>
//           </div>
//         </div>
//         <div>
//           <img src={assets.patients_icon} alt="" />
//           <div>
//             <p>{dashData.patients}</p>
//             <p>Patients</p>
//           </div>
//         </div>

//         <div>
//           <div>
//             <img src={assets.list_icon} alt="" />
//             <p>Latest Booking</p>
//           </div>

//           <div>
//             {dashData.latestAppointments.map((item, index) => (
//               <div key={index}>
//                 <img src={item.docData.image} alt="" />
//                 <div>
//                   <p>{item.docData.name}</p>
//                   <p>{slotDateFormate(item.slotDate)}</p>
//                 </div>
//                 {item.cancelled ? (
//                   <p className="text-xs text-red-600 font-medium">Cancelled</p>
//                 ) : (
//                   <button
//                     onClick={() => cancelAppointment(item._id)}
//                     className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors duration-200 group"
//                     title="Cancel Appointment"
//                   >
//                     <img
//                       src={assets.cancel_icon}
//                       alt="Cancel"
//                       className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
//                     />
//                     <span className="text-xs font-medium group-hover:underline">
//                       Cancel
//                     </span>
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default Dashboard;
