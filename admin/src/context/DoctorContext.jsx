import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const baseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [dashData, setdashData] = useState(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (dToken) localStorage.setItem("dToken", dToken);
    else localStorage.removeItem("dToken");
  }, [dToken]);

  const authHeaders = () => ({
    Authorization: `Bearer ${dToken}`,
    "Content-Type": "application/json",
  });

  const getAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/api/doctor/appointments`, {
        headers: authHeaders(),
      });

      if (data.success) setAppointments((data.appointments || []).slice().reverse());
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorProfile = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/doctor/profile`, {
        headers: authHeaders(),
      });
      if (data.success) setDoctorData(data.doctor);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch doctor profile");
    }
  };

  const getDashData = async () => {
    setDashLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/api/doctor/dashboard`, {
        headers: authHeaders(),
      });

      if (data.success) setdashData(data.dashData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch dashboard");
    } finally {
      setDashLoading(false);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: authHeaders() }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to complete appointment");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: authHeaders() }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to cancel appointment");
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/doctor/profile`, {
        headers: authHeaders(),
      });
      if (data.success) setProfileData(data.doctor || data.profileData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch profile");
    }
  };

  const doctorLogout = () => {
    setDToken("");
    setAppointments([]);
    setDoctorData(null);
    setdashData(null);
    setProfileData(null);
    setDashLoading(false);
    localStorage.removeItem("dToken");
    toast.success("Logged out successfully");
  };

  const value = {
    dToken,
    setDToken,
    appointments,
    setAppointments,
    loading,
    doctorData,
    dashData,
    setdashData,
    dashLoading,
    profileData,
    setProfileData,

    getAppointments,
    getDoctorProfile,
    doctorLogout,
    completeAppointment,
    cancelAppointment,
    getDashData,
    getProfileData,

    backendUrl: baseUrl,
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
// import { useState, useEffect } from "react";
// import { createContext } from "react";
// import axios from 'axios'
// import { toast } from 'react-toastify'

// export const DoctorContext = createContext()

// const DoctorContextProvider = (props) => {
//     const backendUrl = import.meta.env.VITE_BACKEND_URL

//     const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
//     const [appointments, setAppointments] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [doctorData, setDoctorData] = useState(null)
//     const [dashData, setdashData] = useState(null)
//     const [dashLoading, setDashLoading] = useState(false) // ✅ ADD THIS LINE
//     const [profileData,setProfileData]=useState(false)


//     // Auto-set token in localStorage when it changes
//     useEffect(() => {
//         if (dToken) {
//             localStorage.setItem('dToken', dToken)
//         } else {
//             localStorage.removeItem('dToken')
//         }
//     }, [dToken])

//     // Get doctor appointments
//     const getAppointments = async () => {
//         setLoading(true)
//         try {
//             console.log('🔄 Fetching doctor appointments...')
            
//             const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
//                 headers: { 
//                     Authorization: `Bearer ${dToken}`
//                 }
//             })

//             if (data.success) {
//                 setAppointments(data.appointments?.reverse() || [])
//                 console.log('✅ Appointments fetched:', data.appointments?.length || 0)
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             console.log('🔴 Error fetching appointments:', error)
//             console.log('Error response:', error.response?.data)
//             toast.error(error.response?.data?.message || error.message || "Failed to fetch appointments")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Get doctor profile
//     const getDoctorProfile = async () => {
//         try {
//             const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
//                 headers: { 
//                     Authorization: `Bearer ${dToken}`
//                 }
//             })
            
//             if (data.success) {
//                 setDoctorData(data.doctor)
//             }
//         } catch (error) {
//             console.log('Error fetching doctor profile:', error)
//         }
//     }

//     // Dashboard data

//     // Dashboard data - FIXED VERSION
// const getDashData = async () => {
//     setDashLoading(true); // ✅ Set loading to true at start
//     try {
//         console.log('🔄 Fetching dashboard data...');
        
//         const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
//             headers: { 
//                 Authorization: `Bearer ${dToken}`
//             }
//         });
        
//         console.log('📊 API Response:', data);
        
//         if (data.success) {
//             setdashData(data.dashData || {
//                 earning: 0,
//                 appointments: 0,
//                 patients: 0,
//                 latestAppointments: []
//             });
//             console.log('✅ Dashboard data set successfully');
//         } else {
//             console.log('❌ API returned success: false');
//             toast.error(data.message);
//             setdashData({
//                 earning: 0,
//                 appointments: 0,
//                 patients: 0,
//                 latestAppointments: []
//             });
//         }
//     } catch (error) {
//         console.log('🔴 Error fetching dashboard data:', error);
//         console.log('🔴 Error response:', error.response?.data);
//         toast.error(error.response?.data?.message || error.message || "Failed to fetch dashboard data");
//         setdashData({
//             earning: 0,
//             appointments: 0,
//             patients: 0,
//             latestAppointments: []
//         });
//     } finally {
//         console.log('🏁 Setting dashLoading to false');
//         setDashLoading(false); // ✅ Always set loading to false
//     }
// }
// //     const getDashData = async () => {
// //     try {
// //         console.log('🔄 Fetching dashboard data...')
        
// //         const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
// //             headers: { 
// //                 Authorization: `Bearer ${dToken}`
// //             }
// //         })
        
// //         console.log('📊 API Response:', data)
        
// //         if (data.success) {
// //             setdashData(data.dashData) // Make sure this line exists
// //             console.log('✅ Dashboard data set:', data.dashData)
// //         } else {
// //             toast.error(data.message)
// //         }
// //     } catch (error) {
// //         console.log('🔴 Error fetching dashboard data:', error)
// //         toast.error(error.message)
// //     }
// // }
//     // const getDashData = async () => {
//     //     setDashLoading(true) // ✅ NOW THIS WILL WORK
//     //     try {
//     //         console.log('🔄 Fetching dashboard data...')
            
//     //         const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
//     //             headers: { 
//     //                 Authorization: `Bearer ${dToken}`
//     //             }
//     //         })
            
//     //         if (data.success) {
//     //             setdashData(data.dashData || {
//     //                 earning: 0,
//     //                 appointments: 0,
//     //                 patients: 0,
//     //                 latestAppointments: []
//     //             })
//     //             console.log('✅ Dashboard data received:', data.dashData)
//     //         } else {
//     //             toast.error(data.message)
//     //             setdashData({
//     //                 earning: 0,
//     //                 appointments: 0,
//     //                 patients: 0,
//     //                 latestAppointments: []
//     //             })
//     //         }
//     //     } catch (error) {
//     //         console.log('🔴 Error fetching dashboard data:', error)
//     //         console.log('Error response:', error.response?.data)
//     //         toast.error(error.response?.data?.message || error.message || "Failed to fetch dashboard data")
//     //         setdashData({
//     //             earning: 0,
//     //             appointments: 0,
//     //             patients: 0,
//     //             latestAppointments: []
//     //         })
//     //     } finally {
//     //         setDashLoading(false) // ✅ AND THIS TOO
//     //     }
//     // }

//     // Complete appointment
//     const completeAppointment = async (appointmentId) => {
//         try {
//             const { data } = await axios.post(
//                 backendUrl + '/api/doctor/complete-appointment',
//                 { appointmentId },
//                 {
//                     headers: { 
//                         Authorization: `Bearer ${dToken}`
//                     }
//                 }
//             )
//             if (data.success) {
//                 toast.success(data.message)
//                 getAppointments()
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             console.log('Complete appointment error:', error)
//             toast.error(error.response?.data?.message || error.message || "Failed to complete appointment")
//         }
//     }

//     // Cancel appointment
//     const cancelAppointment = async (appointmentId) => {
//         try {
//             const { data } = await axios.post(
//                 backendUrl + '/api/doctor/cancel-appointment',
//                 { appointmentId },
//                 {
//                     headers: { 
//                         Authorization: `Bearer ${dToken}`
//                     }
//                 }
//             )
//             if (data.success) {
//                 toast.success(data.message)
//                 getAppointments()
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             console.log('Cancel appointment error:', error)
//             toast.error(error.response?.data?.message || error.message || "Failed to cancel appointment")
//         }
//     }


//     // get profile 
//     // get profile 
// const getProfileData = async () => {
//   try {
//     console.log('🔄 Fetching doctor profile...');
    
//     const { data } = await axios.get( // Using GET since your route is GET
//       `${backendUrl}/api/doctor/profilee`,
//       { 
//         headers: { 
//           Authorization: `Bearer ${dToken}` 
//         } 
//       }
//     );
    
//     if (data.success) {
//       setProfileData(data.profileData);
//       console.log('✅ Profile data:', data.profileData);
//     } else {
//       toast.error(data.message);
//     }
//   } catch (error) {
//     console.log('🔴 Profile error:', error);
//     console.log('🔴 Error response:', error.response?.data);
//     toast.error(error.response?.data?.message || error.message);
//   }
// };
// // const getProfileData = async (DoctorId) => {
// //   try {
// //     const { data } = await axios.post(
// //       `${backendUrl}/api/doctor/profile`,
// //        // Send in request body
// //       { headers: { Authorization: `Bearer ${dToken}` } }
// //     );
    
// //     if (data.success) {
// //       setProfileData(data.profileData);
// //       console.log(data.profileData);
// //     } else {
// //       toast.error(data.message);
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     toast.error(error.message);
// //   }
// // };
//     // const getProfileData=async(docId)=>{
//     //     try{
  
//     //         const {data}=await axios.get(backendUrl+'/api/doctor/profile'{docId},{headers:{Authorization:`Bearer ${dToken}`}})
//     //         if(data.success){
//     //             setProfileData(data.profileData)
//     //             console.log(data.profileData)
//     //         }
//     //         else{
//     //             toast.error(data.message)
//     //         }
//     //     }
//     //     catch(error)
//     //     {
//     //         console.log(error)
//     //         toast.error(error.message)
//     //     }
//     // }
//     // Doctor logout
//     const doctorLogout = () => {
//         setDToken('')
//         setAppointments([])
//         setDoctorData(null)
//         setdashData(null)
//         setDashLoading(false) // ✅ RESET THIS TOO
//         localStorage.removeItem('dToken')
//         toast.success("Logged out successfully")
//     }

//     const value = {
//         // State
//         dToken,
//         setDToken,
//         appointments,
//         setAppointments,
//         loading,
//         doctorData,
//         dashData,
//         setdashData,
//         dashLoading, // ✅ EXPORT THIS
//         profileData,setProfileData,
        
//         // Functions
//         getAppointments,
//         getDoctorProfile,
//         doctorLogout,
//         completeAppointment,
//         cancelAppointment,
//         getDashData,
//         getProfileData,
        
//         backendUrl
//     }

//     return (
//         <DoctorContext.Provider value={value}>
//             {props.children}
//         </DoctorContext.Provider>
//     )
// }

// export default DoctorContextProvider

// // import { useState, useEffect } from "react";
// // import { createContext } from "react";
// // import axios from 'axios'
// // import { toast } from 'react-toastify'

// // export const DoctorContext = createContext()

// // const DoctorContextProvider = (props) => {
// //     const backendUrl = import.meta.env.VITE_BACKEND_URL

// //     const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
// //     const [appointments, setAppointments] = useState([])
// //     const [loading, setLoading] = useState(false)
// //     const [doctorData, setDoctorData] = useState(null)
// //     const [dashData,setdashData]=useState(false)
// //     // Auto-set token in localStorage when it changes
// //     useEffect(() => {
// //         if (dToken) {
// //             localStorage.setItem('dToken', dToken)
// //         } else {
// //             localStorage.removeItem('dToken')
// //         }
// //     }, [dToken])

// //     // Get doctor appointments
// //     const getAppointments = async () => {
// //         setLoading(true)
// //         try {
// //             console.log('🔄 Fetching doctor appointments...')
            
// //             const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
// //                 headers: { 
// //                     Authorization: `Bearer ${dToken}` // ✅ CORRECT HEADER FORMAT
// //                 }
// //             })

// //             if (data.success) {
// //                 setAppointments(data.appointments?.reverse() || [])
// //                 console.log('✅ Appointments fetched:', data.appointments?.length || 0)
// //             } else {
// //                 toast.error(data.message)
// //             }
// //         } catch (error) {
// //             console.log('🔴 Error fetching appointments:', error)
// //             console.log('Error response:', error.response?.data)
// //             toast.error(error.response?.data?.message || error.message || "Failed to fetch appointments")
// //         } finally {
// //             setLoading(false)
// //         }
// //     }

// //     // Get doctor profile
// //     const getDoctorProfile = async () => {
// //         try {
// //             const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
// //                 headers: { 
// //                     Authorization: `Bearer ${dToken}`
// //                 }
// //             })
            
// //             if (data.success) {
// //                 setDoctorData(data.doctor)
// //             }
// //         } catch (error) {
// //             console.log('Error fetching doctor profile:', error)
// //         }
// //     }

// //     // Complete appointment
// //     const completeAppointment = async (appointmentId) => {
// //         try {
// //             const { data } = await axios.post(
// //                 backendUrl + '/api/doctor/complete-appointment',
// //                 { appointmentId },
// //                 {
// //                     headers: { 
// //                         Authorization: `Bearer ${dToken}` // ✅ FIXED: Use Authorization header
// //                     }
// //                 }
// //             )
// //             if (data.success) {
// //                 toast.success(data.message)
// //                 getAppointments()
// //             } else {
// //                 toast.error(data.message)
// //             }
// //         } catch (error) {
// //             console.log('Complete appointment error:', error)
// //             toast.error(error.response?.data?.message || error.message || "Failed to complete appointment")
// //         }
// //     }

// //     // Cancel appointment
// //     const cancelAppointment = async (appointmentId) => {
// //         try {
// //             const { data } = await axios.post(
// //                 backendUrl + '/api/doctor/cancel-appointment',
// //                 { appointmentId },
// //                 {
// //                     headers: { 
// //                         Authorization: `Bearer ${dToken}` // ✅ FIXED: Use Authorization header
// //                     }
// //                 }
// //             )
// //             if (data.success) {
// //                 toast.success(data.message)
// //                 getAppointments()
// //             } else {
// //                 toast.error(data.message)
// //             }
// //         } catch (error) {
// //             console.log('Cancel appointment error:', error)
// //             toast.error(error.response?.data?.message || error.message || "Failed to cancel appointment")
// //         }
// //     }

// //     //dashdta display

// //     const getDashData=async()=>{
// //         try{
       
// //             const {data}=await axios.get(backendUrl+'/api/doctor/dashboard',{headers:{dToken}})
// //             if(data.success){
// //                 setdashData(data.dashData)
// //                 console.log(data.dashData)
// //             }
// //             else{
// //                 toast.error(data,message)
// //             }
// //         }
// //         catch(error){
// //             console.log(error)
// //             toast.error(error.message)

            
// //         }
// //     }
// //     // Doctor logout
// //     const doctorLogout = () => {
// //         setDToken('')
// //         setAppointments([])
// //         setDoctorData(null)
// //         localStorage.removeItem('dToken')
// //         toast.success("Logged out successfully")
// //     }

// //     const value = {
// //         // State
// //         dToken,
// //         setDToken,
// //         appointments,
// //         setAppointments,
// //         loading,
// //         doctorData,
// //         dashData,setdashData,
        
// //         // Functions
// //         getAppointments,
// //         getDoctorProfile,
// //         doctorLogout,
// //         completeAppointment,
// //         cancelAppointment,
// //         getDashData,
        
// //         backendUrl // ✅ FIXED: Added missing comma
// //     }

// //     return (
// //         <DoctorContext.Provider value={value}>
// //             {props.children}
// //         </DoctorContext.Provider>
// //     )
// // }

// // export default DoctorContextProvider

// // import { useState, useEffect } from "react";
// // import { createContext } from "react";
// // import axios from 'axios'
// // import { toast } from 'react-toastify'

// // export const DoctorContext = createContext()

// // const DoctorContextProvider = (props) => {
// //     const backendUrl = import.meta.env.VITE_BACKEND_URL

// //     const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
// //     const [appointments, setAppointments] = useState([])
// //     const [loading, setLoading] = useState(false)
// //     const [doctorData, setDoctorData] = useState(null)

// //     // Auto-set token in localStorage when it changes
// //     useEffect(() => {
// //         if (dToken) {
// //             localStorage.setItem('dToken', dToken)
// //         } else {
// //             localStorage.removeItem('dToken')
// //         }
// //     }, [dToken])

// //     // Get doctor appointments
// //     const getAppointments = async () => {
// //         setLoading(true)
// //         try {
// //             console.log('🔄 Fetching doctor appointments...')
            
// //             const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
// //                 headers: { 
// //                     Authorization: `Bearer ${dToken}` // ✅ CORRECT HEADER FORMAT
// //                 }
// //             })

// //             if (data.success) {
// //                 setAppointments(data.appointments?.reverse() || [])
// //                 console.log('✅ Appointments fetched:', data.appointments?.length || 0)
// //             } else {
// //                 toast.error(data.message)
// //             }
// //         } catch (error) {
// //             console.log('🔴 Error fetching appointments:', error)
// //             console.log('Error response:', error.response?.data)
// //             toast.error(error.response?.data?.message || error.message || "Failed to fetch appointments")
// //         } finally {
// //             setLoading(false)
// //         }
// //     }

// //     // Get doctor profile
// //     const getDoctorProfile = async () => {
// //         try {
// //             const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
// //                 headers: { 
// //                     Authorization: `Bearer ${dToken}`
// //                 }
// //             })
            
// //             if (data.success) {
// //                 setDoctorData(data.doctor)
// //             }
// //         } catch (error) {
// //             console.log('Error fetching doctor profile:', error)
// //         }
// //     }

// //     // Cancel appointment
// //     // const cancelAppointment = async (appointmentId) => {
// //     //     try {
// //     //         const { data } = await axios.post(
// //     //             backendUrl + '/api/doctor/cancel-appointment',
// //     //             { appointmentId },
// //     //             {
// //     //                 headers: { 
// //     //                     Authorization: `Bearer ${dToken}`
// //     //                 }
// //     //             }
// //     //         )

// //     //         if (data.success) {
// //     //             toast.success("Appointment cancelled successfully")
// //     //             getAppointments() // Refresh the list
// //     //         } else {
// //     //             toast.error(data.message)
// //     //         }
// //     //     } catch (error) {
// //     //         console.log('Cancel appointment error:', error)
// //     //         toast.error(error.response?.data?.message || "Failed to cancel appointment")
// //     //     }
// //     // }

// //     // // Confirm appointment
// //     // const confirmAppointment = async (appointmentId) => {
// //     //     try {
// //     //         const { data } = await axios.post(
// //     //             backendUrl + '/api/doctor/confirm-appointment',
// //     //             { appointmentId },
// //     //             {
// //     //                 headers: { 
// //     //                     Authorization: `Bearer ${dToken}`
// //     //                 }
// //     //             }
// //     //         )

// //     //         if (data.success) {
// //     //             toast.success("Appointment confirmed")
// //     //             getAppointments()
// //     //         } else {
// //     //             toast.error(data.message)
// //     //         }
// //     //     } catch (error) {
// //     //         console.log('Confirm appointment error:', error)
// //     //         toast.error(error.response?.data?.message || "Failed to confirm appointment")
// //     //     }
// //     // }
// // //completeappointment
// //     const completeAppointment=async(appointmentId)=>{

// //         try{
          
// //             const {data}=await axios.post(backendUrl+'/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})
// //             if(data.success){
// //                 toast.success(data.message)
// //                 getAppointments()
// //             }
// //             else{
// //                 toast.error(data.message)
// //             }
// //         }
// //         catch(error){
// //             console.log(error)
// //             toast.error(error.message)
            
// //         }
// //     }

// //      const cancelAppointment=async(appointmentId)=>{

// //         try{
          
// //             const {data}=await axios.post(backendUrl+'/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})
// //             if(data.success){
// //                 toast.success(data.message)
// //                 getAppointments()
// //             }
// //             else{
// //                 toast.error(data.message)
// //             }
// //         }
// //         catch(error){
// //             console.log(error)
// //             toast.error(error.message)
            
// //         }
// //     }
    

// //     // Doctor logout
// //     const doctorLogout = () => {
// //         setDToken('')
// //         setAppointments([])
// //         setDoctorData(null)
// //         localStorage.removeItem('dToken')
// //         toast.success("Logged out successfully")
// //     }

    

// //     const value = {
// //         // State
// //         dToken,
// //         setDToken,
// //         appointments,
// //         setAppointments,
// //         loading,
// //         doctorData,
        
// //         // Functions
// //         getAppointments,
// //         getDoctorProfile,
// //         cancelAppointment,
// //         confirmAppointment,
// //         doctorLogout,
// //         completeAppointment,
// //         cancelAppointment
        
// //         backendUrl
// //     }

// //     return (
// //         <DoctorContext.Provider value={value}>
// //             {props.children}
// //         </DoctorContext.Provider>
// //     )
// // }

// // export default DoctorContextProvider

// // import { useState } from "react";
// // import { createContext } from "react";
// // import axios from 'axios'
// // import {toast} from 'react-toastify'

// // export const DoctorContext=createContext()
// // const DoctorContextProvider=(props)=>{
// //     const backendUrl=import.meta.env.VITE_BACKEND_URL

// //     const [dToken,setDToken]=useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

// //     const [appointments,setAppointments]=useState([])

// //     const getAppointments=async()=>{

// //         try{
// //    const {data}= await  axios.get(backendUrl+'/api/doctor/appointments',{headers:{dToken}})

// //    if(data.success){
// //     setAppointments(data.appointments.reverse())
// //     console.log(data.appointments.reverse())
// //    }
// //    else{
// //   toast.error(data.message)
// //    }

// //         }
// //         catch(error){
// //        console.log(error)
// //        toast.error(error.message)
// //         }
// //     }


// //     const value={
// //     dToken,setDToken,
// //   getAppointments,setAppointments,appointments,
// //     backendUrl
// //     }

// //     return(
// //         <DoctorContext.Provider value={value}>

// //            {props.children}
// //         </DoctorContext.Provider>
// //     )
// // }
// // export default DoctorContextProvider