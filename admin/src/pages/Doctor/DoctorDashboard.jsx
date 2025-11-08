import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    dashLoading,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const { currency, slotDateFormate } = useContext(AppContext);
  const [hasFetched, setHasFetched] = useState(false);
  
  // Add a fallback date formatter function
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      // If slotDateFormat is available, use it
      if (slotDateFormate && typeof slotDateFormate === 'function') {
        return slotDateFormate(dateString);
      }
      
      // Fallback date formatting
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    console.log('🔍 Dashboard useEffect - Status:', {
      dToken: !!dToken,
      dashData: !!dashData,
      dashLoading,
      hasFetched
    });
    
    // Only fetch if we have a token, no data, not currently loading, and haven't fetched yet
    if (dToken && !dashData && !dashLoading && !hasFetched) {
      console.log('🚀 INITIATING dashboard data fetch');
      setHasFetched(true);
      getDashData();
    }
  }, [dToken, dashData, dashLoading, hasFetched, getDashData]);

  // Show loading state
  if (dashLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // Show error state if no data after loading
  if (!dashData && hasFetched) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">
          Failed to load dashboard data
          <button 
            onClick={() => {
              setHasFetched(false);
              getDashData();
            }}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("📊 Dashboard data:", dashData);

  return (
    <div className="m-5">
      {/* Debug Info - Uncomment to see what's happening */}
      {/* <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
        <p className="text-blue-800 font-semibold">Dashboard Status:</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <p className="text-blue-700">Data Loaded: {dashData ? "✅ Yes" : "❌ No"}</p>
          <p className="text-blue-700">Loading: {dashLoading ? "🔄 Yes" : "✅ No"}</p>
          <p className="text-blue-700">Has Fetched: {hasFetched ? "✅ Yes" : "❌ No"}</p>
          <p className="text-blue-700">Earnings: ${dashData?.earning || 0}</p>
          <p className="text-blue-700">Appointments: {dashData?.appointments || 0}</p>
          <p className="text-blue-700">Patients: {dashData?.patients || 0}</p>
          <p className="text-blue-700">Latest Appointments: {dashData?.latestAppointments?.length || 0}</p>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="Earnings" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {currency} {dashData?.earning || 0}
            </p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointment_icon} alt="Appointments" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.appointments || 0}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="Patients" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData?.patients || 0}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white mt-10">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-300">
          <img src={assets.list_icon} alt="List" />
          <p className="font-semibold">Latest Bookings ({dashData?.latestAppointments?.length || 0})</p>
        </div>

        <div className="pt-4 border border-t-0 border-gray-300">
          {dashData?.latestAppointments && dashData.latestAppointments.length > 0 ? (
            <div>
              <p className="px-6 py-2 text-green-600 font-semibold">
                Showing {dashData.latestAppointments.length} appointments
              </p>
              {dashData.latestAppointments.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                  key={index}
                >
                  <img
                    className="rounded-full w-10 bg-gray-200"
                    src={item.userData?.image || "/default-avatar.png"}
                    alt="Patient"
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">
                      {item.userData?.name || 'Patient'}
                    </p>
                    <p className="text-gray-600">
                      {/* Use the safe formatDate function instead of slotDateFormat */}
                      {formatDate(item.slotDate)} | {item.slotTime || 'No time'}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-red-500">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500">Completed</p>
                  ) : (
                    <div className="flex gap-2">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        src={assets.cancel_icon}
                        alt="Cancel"
                        title="Cancel Appointment"
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                        src={assets.tick_icon}
                        alt="Complete"
                        title="Complete Appointment"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="text-lg">No recent appointments found</p>
              <p className="text-sm mt-2">Appointments will appear here once patients book with you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
// import { useContext, useEffect, useState } from "react";
// import { DoctorContext } from "../../context/DoctorContext";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";

// const DoctorDashboard = () => {
//   const {
//     dToken,
//     dashData,
//     dashLoading,
//     getDashData,
//     cancelAppointment,
//     completeAppointment,
//   } = useContext(DoctorContext);

//   const { currency, slotDateFormate } = useContext(AppContext);
 
//   const [hasFetched, setHasFetched] = useState(false);
  
//   // Add a fallback date formatter function
//   const formatDate = (dateString) => {
//     if (!dateString) return 'No date';
    
//     try {
//       // If slotDateFormat is available, use it
//       if (slotDateFormate && typeof slotDateFormate === 'function') {
//         return slotDateFormate(dateString);
//       }
      
//       // Fallback date formatting
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid date';
//     }
//   };

//   useEffect(() => {
//     if (dToken) {
//       console.log("🔄 Fetching dashboard data...");
//       getDashData();
//     }
//   }, [dToken, getDashData]);

//   // Show loading state
//   if (dashLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl">Loading dashboard...</div>
//       </div>
//     );
//   }

//   console.log("📊 Dashboard data:", dashData);

//   return (
//     <div className="m-5">
//       {/* Debug Info */}
//       {/* <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
//         <p className="text-blue-800 font-semibold">Dashboard Status:</p>
//         <div className="grid grid-cols-2 gap-2 mt-2">
//           <p className="text-blue-700">Data Loaded: {dashData ? "✅ Yes" : "❌ No"}</p>
//           <p className="text-blue-700">Loading: {dashLoading ? "🔄 Yes" : "✅ No"}</p>
//           <p className="text-blue-700">Earnings: ${dashData?.earning || 0}</p>
//           <p className="text-blue-700">Appointments: {dashData?.appointments || 0}</p>
//           <p className="text-blue-700">Patients: {dashData?.patients || 0}</p>
//           <p className="text-blue-700">Latest Appointments: {dashData?.latestAppointments?.length || 0}</p>
//           <p className="text-blue-700">slotDateFormat: {typeof slotDateFormate === 'function' ? '✅ Function' : '❌ Not a function'}</p>
//         </div>
//       </div> */}

//       {/* Stats Cards */}
//       <div className="flex flex-wrap gap-3">
//         <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//           <img className="w-14" src={assets.earning_icon} alt="Earnings" />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {currency} {dashData?.earning || 0}
//             </p>
//             <p className="text-gray-400">Earnings</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//           <img className="w-14" src={assets.appointment_icon} alt="Appointments" />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashData?.appointments || 0}
//             </p>
//             <p className="text-gray-400">Appointments</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//           <img className="w-14" src={assets.patients_icon} alt="Patients" />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashData?.patients || 0}
//             </p>
//             <p className="text-gray-400">Patients</p>
//           </div>
//         </div>
//       </div>

//       {/* Latest Bookings Section */}
//       <div className="bg-white mt-10">
//         <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-300">
//           <img src={assets.list_icon} alt="List" />
//           <p className="font-semibold">Latest Bookings ({dashData?.latestAppointments?.length || 0})</p>
//         </div>

//         <div className="pt-4 border border-t-0 border-gray-300">
//           {dashData?.latestAppointments && dashData.latestAppointments.length > 0 ? (
//             <div>
//               <p className="px-6 py-2 text-green-600 font-semibold">
//                 Showing {dashData.latestAppointments.length} appointments
//               </p>
//               {dashData.latestAppointments.map((item, index) => (
//                 <div
//                   className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
//                   key={index}
//                 >
//                   <img
//                     className="rounded-full w-10 bg-gray-200"
//                     src={item.userData?.image || "/default-avatar.png"}
//                     alt="Patient"
//                   />
//                   <div className="flex-1 text-sm">
//                     <p className="text-gray-800 font-medium">
//                       {item.userData?.name || 'Patient'}
//                     </p>
//                     <p className="text-gray-600">
//                       {/* Use the safe formatDate function instead of slotDateFormat */}
//                       {formatDate(item.slotDate)} | {item.slotTime || 'No time'}
//                     </p>
//                   </div>
//                   {item.cancelled ? (
//                     <p className="text-red-500">Cancelled</p>
//                   ) : item.isCompleted ? (
//                     <p className="text-green-500">Completed</p>
//                   ) : (
//                     <div className="flex gap-2">
//                       <img
//                         onClick={() => cancelAppointment(item._id)}
//                         className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
//                         src={assets.cancel_icon}
//                         alt="Cancel"
//                         title="Cancel Appointment"
//                       />
//                       <img
//                         onClick={() => completeAppointment(item._id)}
//                         className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
//                         src={assets.tick_icon}
//                         alt="Complete"
//                         title="Complete Appointment"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="px-6 py-8 text-center text-gray-500">
//               <p className="text-lg">No recent appointments found</p>
//               <p className="text-sm mt-2">Appointments will appear here once patients book with you.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;

// import { useContext, useEffect, useState } from "react";
// import { DoctorContext } from "../../context/DoctorContext";
// import { assets } from "../../assets/assets"; // Fixed import path
// import { AppContext } from "../../context/AppContext";

// const DoctorDashboard = () => {
//   const {
//     dToken,
//     dashData,
//     dashLoading,
//     getDashData,
//     cancelAppointment,
//     completeAppointment,
//   } = useContext(DoctorContext);

//   const { currency, slotDateFormat } = useContext(AppContext);
//   const [hasFetched, setHasFetched] = useState(false);

//   useEffect(() => {
//     if (dToken && !hasFetched) {
//       console.log("🔄 Fetching dashboard data...");
//       getDashData();
//       setHasFetched(true);
//     }
//   }, [dToken, hasFetched, getDashData]);

//   // Show loading state
//   if (!dashData && dashLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl">Loading dashboard...</div>
//       </div>
//     );
//   }

//   // Show error state if no data
//   if (!dashData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl text-red-600">
//           Failed to load dashboard data
//           <button 
//             onClick={() => {
//               setHasFetched(false);
//               getDashData();
//             }}
//             className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="m-5">
//       {/* Stats Cards */}
//       <div className="flex flex-wrap gap-3">
//         <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//           <img className="w-14" src={assets.earning_icon} alt="Earnings" />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {currency} {dashData.earning || 0}
//             </p>
//             <p className="text-gray-400">Earnings</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//           <img className="w-14" src={assets.appointment_icon} alt="Appointments" />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashData.appointments || 0}
//             </p>
//             <p className="text-gray-400">Appointments</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//           <img className="w-14" src={assets.patient_icon} alt="Patients" />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashData.patients || 0}
//             </p>
//             <p className="text-gray-400">Patients</p>
//           </div>
//         </div>
//       </div>

//       {/* Latest Bookings Section */}
//       <div className="bg-white mt-10">
//         <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-300">
//           <img src={assets.list_icon} alt="List" />
//           <p className="font-semibold">Latest Bookings</p>
//         </div>

//         <div className="pt-4 border border-t-0 border-gray-300">
//           {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
//             dashData.latestAppointments.map((item, index) => (
//               <div
//                 className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
//                 key={index}
//               >
//                 <img
//                   className="rounded-full w-10 bg-gray-200"
//                   // Fixed the syntax error - removed the problematic comment
//                   src={item.userData?.image || "/default-avatar.png"}
//                   alt="Patient"
//                 />
//                 <div className="flex-1 text-sm">
//                   <p className="text-gray-800 font-medium">
//                     {item.userData?.name || 'Patient'}
//                   </p>
//                   <p className="text-gray-600">
//                     {slotDateFormat(item.slotDate)} | {item.slotTime}
//                   </p>
//                 </div>
//                 {item.cancelled ? (
//                   <p className="text-red-500">Cancelled</p>
//                 ) : item.isCompleted ? (
//                   <p className="text-green-500">Completed</p>
//                 ) : (
//                   <div className="flex gap-2">
//                     <img
//                       onClick={() => cancelAppointment(item._id)}
//                       className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
//                       src={assets.cancel_icon}
//                       alt="Cancel"
//                       title="Cancel Appointment"
//                     />
//                     <img
//                       onClick={() => completeAppointment(item._id)}
//                       className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
//                       src={assets.tick_icon}
//                       alt="Complete"
//                       title="Complete Appointment"
//                     />
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="px-6 py-8 text-center text-gray-500">
//               No recent appointments
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Debug Info - Remove in production */}
//       <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
//         <h3 className="text-blue-800 font-semibold">Debug Info</h3>
//         <p className="text-blue-700">Data Loaded: {dashData ? '✅ Yes' : '❌ No'}</p>
//         <p className="text-blue-700">Appointments: {dashData.appointments}</p>
//         <p className="text-blue-700">Patients: {dashData.patients}</p>
//         <p className="text-blue-700">Earnings: {dashData.earning}</p>
//         <p className="text-blue-700">Latest Appointments: {dashData.latestAppointments?.length || 0}</p>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;

// import { useContext, useEffect } from "react";
// import { DoctorContext } from "../../context/DoctorContext";
// import { assets } from "../../assets/assets";
// import { AppContext } from "../../context/AppContext";

// const DoctorDashboard = () => {
//   const {
//     dToken,
//     dashData,
//     // setDashData,
//     getDashData,
//     cancelAppointment,
//     completeAppointment,
//   } = useContext(DoctorContext);

//   const { currency, slotDateFormat } = useContext(AppContext);

//   useEffect(() => {
//     if (dToken) {
//       getDashData();
//     }
//   }, [dToken]);
//   return (
//     dashData && (
//       <div className="m-5">
//         <div className="flex flex-wrap gap-3">
//           <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//             <img className="w-14" src={assets.earning_icon} alt="" />
//             <div>
//               <p className="text-xl font-semibold text-gray-600">
//                 {currency} {dashData.earnings}
//               </p>
//               <p className="text-gray-400">Earnings</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//             <img className="w-14" src={assets.appointments_icon} alt="" />
//             <div>
//               <p className="text-xl font-semibold text-gray-600">
//                 {dashData.appointments}
//               </p>
//               <p className="text-gray-400">Appointments</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
//             <img className="w-14" src={assets.patients_icon} alt="" />
//             <div>
//               <p className="text-xl font-semibold text-gray-600">
//                 {dashData.patients}
//               </p>
//               <p className="text-gray-400">Patients</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white">
//           <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-300">
//             <img src={assets.list_icon} alt="" />
//             <p className="font-semibold">Latest Bookings</p>
//           </div>

//           <div className="pt-4 border border-t-0 border-gray-300">
//             {dashData.latestAppointments.map((item, index) => (
//               <div
//                 className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
//                 key={index}
//               >
//                 <img
//                   className="rounded-full w-10 bg-gray-200"
//                   src={item.userData.image}
//                   alt=""
//                 />
//                 <div className="flex-1 text-sm">
//                   <p className="text-gray-800 font-medium">
//                     {item.userData.name}
//                   </p>
//                   <p className="text-gray-600">
//                     {slotDateFormat(item.slotDate)} | {item.slotTime}
//                   </p>
//                 </div>
//                 {item.cancelled ? (
//                   <p className="text-red-500">Cancelled</p>
//                 ) : item.isCompleted ? (
//                   <p className="text-green-500">Completed</p>
//                 ) : (
//                   <div className="flex">
//                     <img
//                       onClick={() => cancelAppointment(item._id)}
//                       className="w-10 cursor-pointer"
//                       src={assets.cancel_icon}
//                       alt=""
//                     />
//                     <img
//                       onClick={() => completeAppointment(item._id)}
//                       className="w-10 cursor-pointer"
//                       src={assets.tick_icon}
//                       alt=""
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   );
// };

// export default DoctorDashboard;
// import React from 'react'
// import { useContext } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
// import { assets } from '../../assets/assets'

// const DoctorDashboard = () => {
//   const {dToken, dashData,setdashData,getDashData}=useContext(DoctorContext)
  
    
//     useEffect(()=>{
    
//       if(dToken){
//         getDashData()
//       }
  
//     },[dToken])


//   return  dashData &&(
    
//          <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//            <div className="max-w-7xl mx-auto">
//              {/* Header */}
//              <div className="mb-8">
//                <h1 className="text-3xl font-bold text-gray-900">Doctor  Dashboard</h1>
//                <p className="text-gray-600 mt-2">Overview of your healthcare platform</p>
//              </div>
   
//              {/* Stats Grid */}
//              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                {/* Doctors Card */}
//                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//                  <div className="flex items-center justify-between">
//                    <div>
//                      <p className="text-3xl font-bold text-gray-900">{dashData.doctors || 0}</p>
//                      <p className="text-gray-600 font-medium mt-1">Doctors</p>
//                    </div>
//                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
//                      <img 
//                        src={assets.earning_icon} 
//                        alt="Doctors" 
//                        className="w-8 h-8 text-blue-500"
//                      />
//                    </div>
//                  </div>
//                  <div className="mt-4 flex items-center text-sm text-green-600">
//                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                    </svg>
//                    Active professionals
//                  </div>
//                </div>
   
//                {/* Appointments Card */}
//                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//                  <div className="flex items-center justify-between">
//                    <div>
//                      <p className="text-3xl font-bold text-gray-900">{dashData.appointments || 0}</p>
//                      <p className="text-gray-600 font-medium mt-1">Appointments</p>
//                    </div>
//                    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
//                      <img 
//                        src={assets.appointment_icon} 
//                        alt="Appointments" 
//                        className="w-8 h-8 text-green-500"
//                      />
//                    </div>
//                  </div>
//                  <div className="mt-4 flex items-center text-sm text-blue-600">
//                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                    </svg>
//                    Total bookings
//                  </div>
//                </div>
//   )


// export default DoctorDashboard
