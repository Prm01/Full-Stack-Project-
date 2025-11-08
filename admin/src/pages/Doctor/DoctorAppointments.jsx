import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, loading, getDashData } = useContext(DoctorContext)
  const { calculateAge, slotDateFormate, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
      getDashData()
    }
  }, [dToken])

  // Handle complete appointment
  const handleCompleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to mark this appointment as completed?')) {
      await completeAppointment(appointmentId)
    }
  }

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(appointmentId)
    }
  }

  // Refresh appointments
  const handleRefresh = () => {
    getAppointments()
  }

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Cancelled
        </span>
      )
    } else if (appointment.isCompleted) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Completed
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Confirmed
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              My Appointments
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Manage your patient appointments and schedule</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center mb-8 border border-gray-200">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Loading appointments...</p>
            <p className="text-gray-500 mt-2">Please wait while we fetch your schedule</p>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Appointments */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">{appointments?.length || 0}</p>
                    <p className="text-gray-600 font-medium mt-2">Total Appointments</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  All scheduled appointments
                </div>
              </div>
              
              {/* Active Appointments */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">
                      {appointments?.filter(apt => !apt.cancelled && !apt.isCompleted)?.length || 0}
                    </p>
                    <p className="text-gray-600 font-medium mt-2">Active</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Pending consultations
                </div>
              </div>
              
              {/* Completed Appointments */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">
                      {appointments?.filter(apt => apt.isCompleted)?.length || 0}
                    </p>
                    <p className="text-gray-600 font-medium mt-2">Completed</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-purple-600 font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Finished consultations
                </div>
              </div>
              
              {/* Cancelled Appointments */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">
                      {appointments?.filter(apt => apt.cancelled)?.length || 0}
                    </p>
                    <p className="text-gray-600 font-medium mt-2">Cancelled</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-red-600 font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancelled appointments
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-6 px-8 py-6 bg-gradient-to-r from-gray-50 to-teal-50 border-b border-gray-200 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Patient</div>
                <div className="col-span-1">Payment</div>
                <div className="col-span-1">Age</div>
                <div className="col-span-2">Date & Time</div>
                <div className="col-span-1">Fees</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {appointments && appointments.length > 0 ? (
                  appointments.map((item, index) => (
                    <div key={item._id || index} className="grid grid-cols-12 gap-6 px-8 py-6 items-center hover:bg-teal-50/50 transition-all duration-300 group">
                      {/* Serial Number */}
                      <div className="col-span-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>

                      {/* Patient Info */}
                      <div className="col-span-2">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img 
                              src={item.userData?.image || '/default-avatar.png'} 
                              alt={item.userData?.name}
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/default-avatar.png'
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                              {item.userData?.name || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">
                              {item.userData?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="col-span-1">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                          item.payment 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.payment ? 'Online' : 'CASH'}
                        </span>
                      </div>

                      {/* Age */}
                      <div className="col-span-1">
                        <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
                          <p className="text-sm font-bold text-blue-700">
                            {item.userData?.dob ? `${calculateAge(item.userData.dob)}y` : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="col-span-2">
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">
                            {slotDateFormate(item.slotDate) || 'N/A'}
                          </p>
                          <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                            {item.slotTime || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Fees */}
                      <div className="col-span-1">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 text-center">
                          <p className="text-sm font-bold text-green-700">
                            {currency}{item.amount || '0'}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        {getStatusBadge(item)}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        {item.cancelled ? (
                          <span className="text-red-600 text-sm font-medium">Cancelled</span>
                        ) : item.isCompleted ? (
                          <span className="text-green-600 text-sm font-medium">Completed</span>
                        ) : (
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleCompleteAppointment(item._id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                              <img src={assets.tick_icon} alt="Complete" className="w-4 h-4 filter brightness-0 invert" />
                              Complete
                            </button>
                            <button 
                              onClick={() => handleCancelAppointment(item._id)}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                              <img src={assets.cancel_icon} alt="Cancel" className="w-4 h-4 filter brightness-0 invert" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-8 py-16 text-center">
                    <div className="text-gray-300 mb-4">
                      <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You don't have any appointments scheduled at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            {appointments && appointments.length > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 bg-white rounded-xl py-3 px-6 inline-block border border-gray-200">
                  Showing <span className="font-semibold text-gray-700">{appointments.length}</span> appointment{appointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments
 
// import React from 'react'
// import { useContext } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
// import { useEffect } from 'react'
// import { AppContext } from '../../context/AppContext'
// import { assets } from '../../assets/assets'

// const DoctorAppointments = () => {
//   const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, loading, dashData, setdashData, getDashData } = useContext(DoctorContext)
//   const { calculateAge, slotDateFormate, currency } = useContext(AppContext)

//   useEffect(() => {
//     if (dToken) {
//       getDashData(dashData)
//     }
//   }, [dToken])

//   useEffect(() => {
//     if (dToken) {
//       getAppointments()
//     }
//   }, [dToken])

//   // Handle complete appointment
//   const handleCompleteAppointment = async (appointmentId) => {
//     if (window.confirm('Are you sure you want to mark this appointment as completed?')) {
//       await completeAppointment(appointmentId)
//     }
//   }

//   // Handle cancel appointment
//   const handleCancelAppointment = async (appointmentId) => {
//     if (window.confirm('Are you sure you want to cancel this appointment?')) {
//       await cancelAppointment(appointmentId)
//     }
//   }

//   // Refresh appointments
//   const handleRefresh = () => {
//     getAppointments()
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Refresh Button */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Doctor Appointments</h1>
//             <p className="text-gray-600 mt-2">Manage your patient appointments</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
//           >
//             <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="bg-white rounded-lg shadow p-8 text-center mb-6">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
//             <p className="text-gray-600 mt-4">Loading appointments...</p>
//           </div>
//         )}

//         {/* Stats Cards */}
//         {!loading && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-blue-100 p-3">
//                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Total Appointments</p>
//                     <p className="text-2xl font-semibold text-gray-900">{appointments?.length || 0}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-green-100 p-3">
//                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Active</p>
//                     <p className="text-2xl font-semibold text-gray-900">
//                       {appointments?.filter(apt => !apt.cancelled && apt.status !== 'completed')?.length || 0}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-purple-100 p-3">
//                     <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Completed</p>
//                     <p className="text-2xl font-semibold text-gray-900">
//                       {appointments?.filter(apt => apt.status === 'completed')?.length || 0}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center">
//                   <div className="rounded-full bg-red-100 p-3">
//                     <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">Cancelled</p>
//                     <p className="text-2xl font-semibold text-gray-900">
//                       {appointments?.filter(apt => apt.cancelled)?.length || 0}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Appointments Table */}
//             <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {appointments && appointments.length > 0 ? (
//                       appointments.map((item, index) => (
//                         <tr key={item._id || index} className="hover:bg-gray-50 transition-colors duration-150">
//                           {/* Serial Number */}
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {index + 1}
//                           </td>

//                           {/* Patient Info */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10">
//                                 <img
//                                   className="h-10 w-10 rounded-full object-cover"
//                                   src={item.userData?.image || '/default-avatar.png'}
//                                   alt={item.userData?.name}
//                                   onError={(e) => {
//                                     e.target.src = '/default-avatar.png'
//                                   }}
//                                 />
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {item.userData?.name || 'N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500">
//                                   {item.userData?.email || 'N/A'}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Payment Method */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               item.payment 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-blue-100 text-blue-800'
//                             }`}>
//                               {item.payment ? 'Online' : 'CASH'}
//                             </span>
//                           </td>

//                           {/* Age */}
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}
//                           </td>

//                           {/* Date & Time */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900 font-medium">
//                               {slotDateFormate(item.slotDate)}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {item.slotTime || 'N/A'}
//                             </div>
//                           </td>

//                           {/* Fees */}
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
//                             {currency}{item.amount || 'N/A'}
//                           </td>

//                           {/* Status */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               item.cancelled 
//                                 ? 'bg-red-100 text-red-800'
//                                 : item.status === 'completed'
//                                 ? 'bg-green-100 text-green-800'
//                                 : item.status === 'confirmed'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {item.cancelled ? 'Cancelled' : 
//                                item.status === 'completed' ? 'Completed' :
//                                item.status === 'confirmed' ? 'Confirmed' : 'Pending'}
//                             </span>
//                           </td>

//                           {/* Actions */}
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex space-x-2">
//                               {/* Cancelled - Show only status */}
//                               {item.cancelled && (
//                                 <span className="text-red-600 text-xs font-medium px-2 py-1 bg-red-50 rounded-full">Cancelled</span>
//                               )}
                              
//                               {/* Completed - Show only status */}
//                               {item.status === 'completed' && (
//                                 <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full">Completed</span>
//                               )}
                              
//                               {/* Active appointments - Show action buttons */}
//                               {!item.cancelled && item.status !== 'completed' && (
//                                 <>
//                                   <button 
//                                     onClick={() => handleCompleteAppointment(item._id)}
//                                     className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-md transition-colors duration-200"
//                                     title="Complete Appointment"
//                                   >
//                                     <img src={assets.tick_icon} alt="Complete" className="w-5 h-5" />
//                                   </button>
//                                   <button 
//                                     onClick={() => handleCancelAppointment(item._id)}
//                                     className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors duration-200"
//                                     title="Cancel Appointment"
//                                   >
//                                     <img src={assets.cancel_icon} alt="Cancel" className="w-5 h-5" />
//                                   </button>
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="8" className="px-6 py-12 text-center">
//                           <div className="text-gray-500">
//                             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                             </svg>
//                             <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
//                             <p className="mt-1 text-sm text-gray-500">No appointments scheduled yet.</p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Footer Info */}
//             {appointments && appointments.length > 0 && (
//               <div className="mt-4 text-center">
//                 <p className="text-sm text-gray-500">
//                   Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
//                 </p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default DoctorAppointments

// import React from 'react'
// import { useContext } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
// import { useEffect } from 'react'
// import { AppContext } from '../../context/AppContext'
// import { assets } from '../../assets/assets'

// const DoctorAppointments = () => {
//   const {dToken,appointments,getAppointments}=useContext(DoctorContext)
//   const {calculateAge,slotDateFormate,currency}=useContext(AppContext)
  
   
//   useEffect(()=>{
//   if(dToken){
//     getAppointments()
//   }
//   },[dToken])

//   return (
//     <div>
      
//       <p>All Appointments</p>

//       <div>
//         <div>
//           <p>#</p>
//           <p>Patient</p>
//           <p>Paymet</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p> Fees</p>
//           <p>Action</p>
//         </div>
//       </div>

//       {
//         appointments.map((item,index)=>{
//           <div key={index}>

//             <p>{index}+1</p>

//             <div>
//               <img src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
//             </div>
//             <div>
//               <p>
//                 {item.payment?'Online':"CASH"}
//               </p>
//             </div>
            
//             <p>
//               {calculateAge(item.userData.dob)}
//             </p>
//             <p>{slotDateFormate(item.slotDate)},{item.slotTime}</p>
//             <p>{currency}{item.amount}</p>

//             <div>
//               <img src={assets.cancel_icon} alt="" />
//               <img src={assets.tick_icon} alt="" />
//             </div>
//             </div>
          
//         })
//       }
//     </div>
//   )
// }

// export default DoctorAppointments
