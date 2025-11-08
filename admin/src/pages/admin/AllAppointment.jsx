import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContex'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
   const { aToken, appointments, getAllAppointments, cancelAppointment, completeAppointment } = useContext(AdminContext)
   const { calculateAge, slotDateFormate, currency } = useContext(AppContext)
   const [filterStatus, setFilterStatus] = useState('all')
   const [searchTerm, setSearchTerm] = useState('')

   useEffect(() => {
      if (aToken) {
         getAllAppointments()
      }
   }, [aToken])

   // Filter appointments
   const filteredAppointments = appointments?.filter(appointment => {
      const matchesStatus = filterStatus === 'all' || 
         (filterStatus === 'active' && !appointment.cancelled && !appointment.isCompleted) ||
         (filterStatus === 'completed' && appointment.isCompleted) ||
         (filterStatus === 'cancelled' && appointment.cancelled)
      
      const matchesSearch = searchTerm === '' || 
         appointment.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         appointment.docData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         appointment.userData?.email?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesSearch
   })

   const handleCompleteAppointment = async (appointmentId) => {
      console.log('🔄 Completing appointment:', appointmentId);
      await completeAppointment(appointmentId);
   }

   const handleCancelAppointment = async (appointmentId) => {
      console.log('🔄 Cancelling appointment:', appointmentId);
      await cancelAppointment(appointmentId);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
               <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All Appointments
               </h1>
               <p className="text-gray-600 mt-3 text-lg">Manage and view all patient appointments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-gray-600">Total</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{appointments?.length || 0}</p>
                     </div>
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-gray-600">Active</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                           {appointments?.filter(apt => !apt.cancelled && !apt.isCompleted)?.length || 0}
                        </p>
                     </div>
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                           {appointments?.filter(apt => apt.isCompleted)?.length || 0}
                        </p>
                     </div>
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-gray-600">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                           {appointments?.filter(apt => apt.cancelled)?.length || 0}
                        </p>
                     </div>
                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </div>
                  </div>
               </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
               <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                  <div className="flex flex-wrap gap-3">
                     {['all', 'active', 'completed', 'cancelled'].map((status) => (
                        <button
                           key={status}
                           onClick={() => setFilterStatus(status)}
                           className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                              filterStatus === status 
                                 ? status === 'all' ? 'bg-gray-800 text-white shadow-lg' 
                                 : status === 'active' ? 'bg-blue-600 text-white shadow-lg'
                                 : status === 'completed' ? 'bg-green-600 text-white shadow-lg'
                                 : 'bg-red-600 text-white shadow-lg'
                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                           }`}
                        >
                           {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                     ))}
                  </div>
                  
                  <div className="w-full lg:w-80">
                     <div className="relative">
                        <input
                           type="text"
                           placeholder="Search patients or doctors..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors duration-300"
                        />
                        <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                     </div>
                  </div>
               </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
               {/* Table Header */}
               <div className="grid grid-cols-12 gap-6 px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  <div className="col-span-1">#</div>
                  <div className="col-span-2">Patient</div>
                  <div className="col-span-1">Age</div>
                  <div className="col-span-2">Date & Time</div>
                  <div className="col-span-2">Doctor</div>
                  <div className="col-span-1">Fees</div>
                  <div className="col-span-3">Status & Actions</div>
               </div>

               {/* Table Body */}
               <div className="divide-y divide-gray-100">
                  {filteredAppointments && filteredAppointments.length > 0 ? (
                     filteredAppointments.map((item, index) => (
                        <div key={item._id || index} className="grid grid-cols-12 gap-6 px-8 py-6 items-center hover:bg-blue-50/50 transition-all duration-300 group">
                           {/* Serial Number */}
                           <div className="col-span-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                       {item.userData?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate max-w-[140px]">
                                       {item.userData?.email || 'N/A'}
                                    </p>
                                 </div>
                              </div>
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

                           {/* Doctor Info */}
                           <div className="col-span-2">
                              <div className="flex items-center space-x-4">
                                 <div className="relative">
                                    <img 
                                       src={item.docData?.image || '/default-doctor.png'} 
                                       alt={item.docData?.name} 
                                       className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-400 rounded-full border-2 border-white"></div>
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                       Dr. {item.docData?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                       {item.docData?.speciality || 'N/A'}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           {/* Fees */}
                           <div className="col-span-1">
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200 text-center">
                                 <p className="text-sm font-bold text-green-700">
                                    {currency}{item.amount || item.docData?.fees || '0'}
                                 </p>
                              </div>
                           </div>

                           {/* Status & Actions */}
                           <div className="col-span-3">
                              <div className="flex items-center justify-between">
                                 {/* Status Badge */}
                                 <div className="flex-1">
                                    {getStatusBadge(item)}
                                 </div>

                                 {/* Action Buttons */}
                                 {!item.cancelled && !item.isCompleted && (
                                    <div className="flex gap-2 ml-4">
                                       <button 
                                          onClick={() => handleCompleteAppointment(item._id)}
                                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                                       >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Complete
                                       </button>
                                       <button 
                                          onClick={() => handleCancelAppointment(item._id)}
                                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                                       >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                          Cancel
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="px-8 py-16 text-center">
                        <div className="text-gray-300 mb-4">
                           <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                           {searchTerm || filterStatus !== 'all' 
                              ? 'Try adjusting your search criteria or filters' 
                              : 'No appointments have been scheduled yet.'}
                        </p>
                     </div>
                  )}
               </div>
            </div>

            {/* Footer Info */}
            {filteredAppointments && filteredAppointments.length > 0 && (
               <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 bg-white rounded-xl py-3 px-6 inline-block border border-gray-200">
                     Showing <span className="font-semibold text-gray-700">{filteredAppointments.length}</span> of{' '}
                     <span className="font-semibold text-gray-700">{appointments?.length || 0}</span> appointment{appointments?.length !== 1 ? 's' : ''}
                  </p>
               </div>
            )}
         </div>
      </div>
   )
}

export default AllAppointments

// import React, { useState, useEffect } from 'react'
// import { useContext } from 'react'
// import { AdminContext } from '../../context/AdminContex'
// import { AppContext } from '../../context/AppContext'
// import { assets } from '../../assets/assets'

// const AllAppointments = () => {
//    const { aToken, appointments, getAllAppointments, cancelAppointment, completeAppointment } = useContext(AdminContext)
//    const { calculateAge, slotDateFormate, currency } = useContext(AppContext)

//    useEffect(() => {
//       if (aToken) {
//          getAllAppointments()
//       }
//    }, [aToken])

//    const handleCompleteAppointment = async (appointmentId) => {
//       console.log('🔄 Completing appointment:', appointmentId);
//       await completeAppointment(appointmentId);
//    }

//    const handleCancelAppointment = async (appointmentId) => {
//       console.log('🔄 Cancelling appointment:', appointmentId);
//       await cancelAppointment(appointmentId);
//    }

//    return (
//       <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//          <div className="max-w-7xl mx-auto">
//             {/* Header */}
//             <div className="mb-8">
//                <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
//                <p className="text-gray-600 mt-2">Manage and view all patient appointments</p>
//             </div>

//             {/* Appointments Table */}
//             <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//                {/* Table Header */}
//                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
//                   <div className="col-span-1 text-sm">#</div>
//                   <div className="col-span-2 text-sm">Patient</div>
//                   <div className="col-span-1 text-sm">Age</div>
//                   <div className="col-span-2 text-sm">Date & Time</div>
//                   <div className="col-span-2 text-sm">Doctor</div>
//                   <div className="col-span-1 text-sm">Fees</div>
//                   <div className="col-span-3 text-sm">Status & Actions</div>
//                </div>

//                {/* Table Body */}
//                <div className="divide-y divide-gray-200">
//                   {appointments && appointments.length > 0 ? (
//                      appointments.map((item, index) => (
//                         <div key={item._id || index} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150">
//                            {/* Serial Number */}
//                            <div className="col-span-1">
//                               <p className="text-sm font-medium text-gray-900">{index + 1}</p>
//                            </div>

//                            {/* Patient Info */}
//                            <div className="col-span-2">
//                               <div className="flex items-center space-x-3">
//                                  <img 
//                                     src={item.userData?.image || '/default-avatar.png'} 
//                                     alt={item.userData?.name} 
//                                     className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                                  />
//                                  <div>
//                                     <p className="text-sm font-medium text-gray-900">
//                                        {item.userData?.name || 'N/A'}
//                                     </p>
//                                  </div>
//                               </div>
//                            </div>

//                            {/* Age */}
//                            <div className="col-span-1">
//                               <p className="text-sm text-gray-900">
//                                  {item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}
//                               </p>
//                            </div>

//                            {/* Date & Time */}
//                            <div className="col-span-2">
//                               <p className="text-sm font-medium text-gray-900">
//                                  {slotDateFormate(item.slotDate) || 'N/A'}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                  {item.slotTime || 'N/A'}
//                               </p>
//                            </div>

//                            {/* Doctor Info */}
//                            <div className="col-span-2">
//                               <div className="flex items-center space-x-3">
//                                  <img 
//                                     src={item.docData?.image || '/default-doctor.png'} 
//                                     alt={item.docData?.name} 
//                                     className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                                  />
//                                  <div>
//                                     <p className="text-sm font-medium text-gray-900">
//                                        Dr. {item.docData?.name || 'N/A'}
//                                     </p>
//                                  </div>
//                               </div>
//                            </div>

//                            {/* Fees */}
//                            <div className="col-span-1">
//                               <p className="text-sm font-semibold text-gray-900">
//                                  {currency}{item.amount || item.docData?.fees || 'N/A'}
//                               </p>
//                            </div>

//                            {/* Status & Actions */}
//                            <div className="col-span-3">
//                               <div className="flex items-center gap-4">
//                                  {/* Status Display */}
//                                  <div className="flex-1">
//                                     {item.cancelled ? (
//                                        <span className="text-red-600 text-sm font-medium">Cancelled</span>
//                                     ) : item.isCompleted ? (
//                                        <span className="text-green-600 text-sm font-medium">Completed</span>
//                                     ) : (
//                                        <span className="text-blue-600 text-sm font-medium">Active</span>
//                                     )}
//                                  </div>

//                                  {/* Action Buttons */}
//                                  {!item.cancelled && !item.isCompleted && (
//                                     <div className="flex gap-3">
//                                        <button 
//                                           onClick={() => handleCompleteAppointment(item._id)}
//                                           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
//                                        >
//                                           Complete
//                                        </button>
//                                        <button 
//                                           onClick={() => handleCancelAppointment(item._id)}
//                                           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
//                                        >
//                                           Cancel
//                                        </button>
//                                     </div>
//                                  )}
//                               </div>
//                            </div>
//                         </div>
//                      ))
//                   ) : (
//                      <div className="px-6 py-12 text-center">
//                         <div className="text-gray-400 mb-4">
//                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                            </svg>
//                         </div>
//                         <h3 className="text-sm font-medium text-gray-900 mb-1">No appointments</h3>
//                         <p className="text-sm text-gray-500">No appointments have been booked yet.</p>
//                      </div>
//                   )}
//                </div>
//             </div>
//          </div>
//       </div>
//    )
// }

// export default AllAppointments

// import React from 'react'
// import { useContext } from 'react'
// import { AdminContext } from '../../context/AdminContex'
// import { useEffect } from 'react'
// import { AppContext } from '../../context/AppContext'
// import { assets } from '../../assets/assets' // Make sure to import assets

// const AllAppointments = () => {
//    const {aToken, appointments, getAllAppointments, cancelAppointment,completeAppointment} = useContext(AdminContext)
//    const {calculateAge, slotDateFormate, currency} = useContext(AppContext)

//    useEffect(() => {
//     if(aToken){
//       getAllAppointments()
//     }
//    }, [aToken])

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
//           <p className="text-gray-600 mt-2">Manage and view all patient appointments</p>
//         </div>

//         {/* Stats Summary */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm font-medium text-gray-600">Total Appointments</p>
//             <p className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm font-medium text-gray-600">Active</p>
//             <p className="text-2xl font-bold text-green-600">
//               {appointments?.filter(apt => !apt.cancelled)?.length || 0}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm font-medium text-gray-600">Cancelled</p>
//             <p className="text-2xl font-bold text-red-600">
//               {appointments?.filter(apt => apt.cancelled)?.length || 0}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-sm font-medium text-gray-600">This Month</p>
//             <p className="text-2xl font-bold text-blue-600">
//               {appointments?.length || 0} {/* You can add month filter logic */}
//             </p>
//           </div>
//         </div>

//         {/* Appointments Table */}
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           {/* Table Header */}
//           <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
//             <div className="col-span-1 text-sm">#</div>
//             <div className="col-span-2 text-sm">Patient</div>
//             <div className="col-span-1 text-sm">Age</div>
//             <div className="col-span-2 text-sm">Date & Time</div>
//             <div className="col-span-2 text-sm">Doctor</div>
//             <div className="col-span-1 text-sm">Fees</div>
//             <div className="col-span-2 text-sm">Status</div>
//             <div className="col-span-1 text-sm">Actions</div>
//           </div>

//           {/* Table Body */}
//           <div className="divide-y divide-gray-200">
//             {appointments && appointments.length > 0 ? (
//               appointments.map((item, index) => (
//                 <div key={item._id || index} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors duration-150">
                  
//                   {/* Serial Number */}
//                   <div className="col-span-1">
//                     <p className="text-sm font-medium text-gray-900">{index + 1}</p>
//                   </div>

//                   {/* Patient Info */}
//                   <div className="col-span-2">
//                     <div className="flex items-center space-x-3">
//                       <img 
//                         src={item.userData?.image || '/default-avatar.png'} 
//                         alt={item.userData?.name} 
//                         className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                         onError={(e) => {
//                           e.target.src = '/default-avatar.png'
//                         }}
//                       />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
//                           {item.userData?.name || 'N/A'}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate max-w-[120px]">
//                           {item.userData?.email || 'N/A'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Age */}
//                   <div className="col-span-1">
//                     <p className="text-sm text-gray-900">
//                       {calculateAge(item.userData.dob) }
//                       {/* {item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'} */}
//                     </p>
//                   </div>

//                   {/* Date & Time */}
//                   <div className="col-span-2">
//                     <p className="text-sm font-medium text-gray-900">
//                       {slotDateFormate(item.slotDate) || 'N/A'}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {item.slotTime || 'N/A'}
//                     </p>
//                   </div>

//                   {/* Doctor Info */}
//                   <div className="col-span-2">
//                     <div className="flex items-center space-x-3">
//                       <img 
//                         src={item.docData?.image || '/default-doctor.png'} 
//                         alt={item.docData?.name} 
//                         className="w-8 h-8 rounded-full object-cover border border-gray-300"
//                         onError={(e) => {
//                           e.target.src = '/default-doctor.png'
//                         }}
//                       />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
//                           Dr. {item.docData?.name || 'N/A'}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate max-w-[120px]">
//                           {item.docData?.speciality || 'N/A'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Fees */}
//                   <div className="col-span-1">
//                     <p className="text-sm font-semibold text-gray-900">
//                       {currency}{item.amount || item.docData?.fees || 'N/A'}
//                     </p>
//                   </div>

//                   {/* Status */}
//                   <div className="col-span-2">
//                     {item.cancelled ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                         </svg>
//                         Cancelled
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                         Confirmed
//                       </span>
//                     )}
//                   </div>

//                   {/* Actions */}
//                   <div className="col-span-1">
//                     {item.cancelled ? (
//                       <p className="text-xs text-red-600 font-medium">Cancelled</p>
//                     ) :  item.isCompleted?
//                     <p className="text-xs text-green-600 font-medium"> Completed</p>: 
//                     (
//                       <button 
//                         onClick={() => cancelAppointment(item._id)}
//                         className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors duration-200 group"
//                         title="Cancel Appointment"
//                       >
//                         <img 
//                           src={assets.cancel_icon} 
//                           alt="Cancel" 
//                           className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
//                         />
//                         <span className="text-xs font-medium group-hover:underline">Cancel</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               /* Empty State */
//               <div className="px-6 py-12 text-center">
//                 <div className="text-gray-400 mb-4">
//                   <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-sm font-medium text-gray-900 mb-1">No appointments</h3>
//                 <p className="text-sm text-gray-500">No appointments have been booked yet.</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer Info */}
//         {appointments && appointments.length > 0 && (
//           <div className="mt-4 text-center">
//             <p className="text-sm text-gray-500">
//               Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AllAppointments

// import React from 'react'
// import { useContext } from 'react'
// import { AdminContext } from '../../context/AdminContex'
// import { useEffect } from 'react'

// import { AppContext } from '../../context/AppContext'

// const AllAppointments = () => {
//    const {aToken,appointments,getAllAppointments,cancelAppointment}=useContext(AdminContext)
//     const {calculateAge,slotDateFormate,currency}=useContext(AppContext)

//    useEffect(()=>{
//     if(aToken){
//       getAllAppointments()
//     }

//    },[aToken])

//   return (
//     <div>
//       <p>All Appointments</p>

//       <div>
     
//          <div>
//           <p>#</p>
//           <p>Patient</p>
//           <p>Age</p>
//           <p>Date & Time</p>
//           <p>Doctor</p>
//           <p>fees</p>
//           <p>Actions</p>
//          </div>
//      {appointments.map((item,index)=>(
//       <div key={index}>
//         <p>{index+1}</p>

//         <div>
//           <img src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
//         </div>
//         <p>{calculateAge(item.userData.dob)}</p>
//         <p>{slotDateFormate(item.slotDate)},{item.slotTime}</p>
//            <div>
//           <img src={item.docData.image} alt="" /> <p>{item.docData.name}</p>
//         </div>
//         <p>{currency}{item.amount}</p>
//         {item.cancelled?
//         <p> Cancelled</p>
//       :  <img  onClick={()=>cancelAppointment(item._id)}src={assets.cancel_icon} alt="" />
//       }
        
      
//         </div>

//      ))}
//       </div>
//     </div>
//   )
// }

// export default AllAppointments
