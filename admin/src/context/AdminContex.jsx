import { useState, useCallback } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ normalize backendUrl (avoid trailing slash issues)
  const baseUrl = (backendUrl || "").replace(/\/+$/, "");

  const authHeaders = () => ({
    Authorization: `Bearer ${aToken}`,
    "Content-Type": "application/json",
  });

  const updateToken = (token) => {
    if (token) localStorage.setItem("aToken", token);
    else localStorage.removeItem("aToken");
    setAToken(token || "");
  };

  const logout = () => {
    localStorage.removeItem("aToken");
    setAToken("");
    setDoctors([]);
    setAppointments([]);
    setDashData(false);
  };

  // ✅ Get all doctors (should be GET usually; keep POST only if backend uses POST)
  const getAllDoctors = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/admin/all-doctors`,
        {},
        { headers: authHeaders(), timeout: 10000 }
      );

      if (data.success) {
        setDoctors(data.doctors || []);
        return data.doctors || [];
      }
      toast.error(data.message);
      throw new Error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch doctors");
      throw error;
    }
  }, [baseUrl, aToken]);

  // ✅ Change availability
  const changeAvailbility = useCallback(
    async (doctorId, isAvailable) => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/api/admin/change-availability`,
          { docId: doctorId },
          { headers: authHeaders() }
        );

        if (data.success) {
          setDoctors((prev) =>
            prev.map((d) => (d._id === doctorId ? { ...d, available: isAvailable } : d))
          );
          toast.success(`Availability ${isAvailable ? "enabled" : "disabled"} successfully`);
          return data;
        }

        toast.error(data.message);
        throw new Error(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Failed to update availability");
        throw error;
      }
    },
    [baseUrl, aToken]
  );

  // ✅ Appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/admin/appointments`, {
        headers: authHeaders(),
      });

      if (data.success) setAppointments(data.appointments || []);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: authHeaders() }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to cancel appointment");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/admin/complete-appointment`,
        { appointmentId },
        { headers: authHeaders() }
      );

      if (data.success) {
        toast.success(data.message || "Appointment completed successfully!");
        getAllAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to complete appointment");
    }
  };

  // ✅ Dashboard
  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/admin/dashboard`, {
        headers: authHeaders(),
      });

      if (data.success) setDashData(data.dashData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch dashboard");
    }
  };

  const value = {
    aToken,
    setAToken: updateToken,
    backendUrl: baseUrl,
    doctors,
    getAllDoctors,
    changeAvailbility,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    logout,
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
// import { useState, useCallback } from "react";
// import { createContext } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AdminContext = createContext();

// const AdminContextProvider = (props) => {
//     const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
//     const [doctors, setDoctors] = useState([]);
//     const [appointments,setAppointments]=useState([])
//     const [dashData,setDashData]=useState(false)
//     const backendUrl = import.meta.env.VITE_BACKEND_URL;

//     console.log('Backend URL:', backendUrl);
//     console.log('Token exists:', !!aToken);

    
//     // Get all doctors
//     const getAllDoctors = useCallback(async () => {
//         try {
//             console.log('🔄 Fetching doctors from:', `${backendUrl}/api/admin/all-doctors`);
            
//             const { data } = await axios.post(
//                 `${backendUrl}/api/admin/all-doctors`,
//                 {},
//                 {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     timeout: 10000
//                 }
//             );

//             console.log('✅ Doctors API Response:', data);
            
//             if (data.success) {
//                 console.log(`✅ Successfully fetched ${data.doctors?.length || 0} doctors`);
//                 setDoctors(data.doctors || []);
//                 return data.doctors;
//             } else {
//                 console.error('❌ API returned success:false', data.message);
//                 toast.error(data.message);
//                 throw new Error(data.message);
//             }
//         } catch (error) {
//             console.error('❌ Error fetching doctors:', error);
            
//             if (error.code === 'NETWORK_ERROR') {
//                 console.error('🌐 Network Error');
//                 toast.error('Network error. Check backend server.');
//             } else if (error.response) {
//                 console.error('🚨 Server Error:', error.response.status, error.response.data);
//                 toast.error(`Server error: ${error.response.status}`);
//             } else if (error.request) {
//                 console.error('📡 No response received');
//                 toast.error('No response from server.');
//             } else {
//                 console.error('⚡ Other error:', error.message);
//                 toast.error(error.message || 'Failed to fetch doctors');
//             }
            
//             throw error;
//         }
//     }, [backendUrl]);

//     // Change doctor availability
//     const changeAvailbility = useCallback(async (doctorId, isAvailable) => {
//         try {
//             console.log('Changing availability for doctor:', doctorId, 'to:', isAvailable);
//             const { data } = await axios.post(
//                 `${backendUrl}/api/admin/change-availability`,
//                 { docId: doctorId },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 setDoctors(prevDoctors => 
//                     prevDoctors.map(doctor => 
//                         doctor._id === doctorId 
//                             ? { ...doctor, available: isAvailable }
//                             : doctor
//                     )
//                 );
//                 toast.success(`Availability ${isAvailable ? 'enabled' : 'disabled'} successfully`);
//                 return data;
//             } else {
//                 throw new Error(data.message);
//             }
//         } catch (error) {
//             console.error('Error changing availability:', error);
//             const errorMessage = error.response?.data?.message || error.message || 'Failed to update availability';
//             toast.error(errorMessage);
//             throw error;
//         }
//     }, [backendUrl]);

//     const updateToken = (token) => {
//         if (token) {
//             localStorage.setItem('aToken', token);
//         } else {
//             localStorage.removeItem('aToken');
//         }
//         setAToken(token);
//     };

//     const logout = () => {
//         localStorage.removeItem('aToken');
//         setAToken('');
//         setDoctors([]);
//     };

//     const getAllAppointments=async()=>{
//         try{
//    const {data}=await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}})
//      if(data.success){
//         console.log(data.appointments)
//         setAppointments(data.appointments)

//      }
//      else{
//         toast.error(data.message)
//      }
//         }
//         catch(error){
//             toast.error(error.message)

//         }
//     }


// //    const cancelAppointment=async(appointmentId)=>{
// //     try{
// //      const {data}= await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
    
// //      if(data.success){
// //         toast.success(data.message)
// //         getAllAppointments()
// //      }
// //      else{
// //         toast.error(data.message)
// //      }

// //     }
// //     catch(error){
// //   toast.error(error.message)
// //     }
// //    }
// const completeAppointment = async (appointmentId) => {
//     try {
//         console.log('🔄 Admin completing appointment:', appointmentId);
        
//         const { data } = await axios.post(
//             `${backendUrl}/api/admin/complete-appointment`,
//             { appointmentId }, // Only send appointmentId, NOT docId
//             {
//                 headers: { 
//                     Authorization: `Bearer ${aToken}`
//                 }
//             }
//         );

//         if (data.success) {
//             toast.success(data.message || "Appointment completed successfully!");
//             getAllAppointments(); // Refresh the list
//         } else {
//             toast.error(data.message);
//         }
//     } catch (error) {
//         console.log('🔴 Complete appointment error:', error);
//         toast.error(error.response?.data?.message || error.message || "Failed to complete appointment");
//     }
// };

// const cancelAppointment = async (appointmentId) => {
//     try {
//         console.log('🔄 Cancelling appointment:', appointmentId);
        
//         const { data } = await axios.post(
//             backendUrl + '/api/admin/cancel-appointment',
//             { appointmentId }, 
//             {
//                 headers: { 
//                     'Authorization': `Bearer ${aToken}`, // ✅ CORRECT HEADER
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
    
//         if (data.success) {
//             toast.success(data.message);
//             getAllAppointments();
//         } else {
//             toast.error(data.message);
//         }
//     } catch (error) {
//         console.log('🔴 Cancel error:', error);
//         console.log('Error response:', error.response?.data);
//         toast.error(error.response?.data?.message || error.message || "Failed to cancel appointment");
//     }
// };

// // get dashboard data

//   const getDashData=async()=>{
//     try{
//    const {data}=await axios.get(backendUrl+'/api/admin/dashboard',{headers:{aToken}})

//    if(data.success){
//     setDashData(data.dashData)
//     console.log(data.dashData)

//    }
//    else{
//     toast.error(data.message)
//    }
//     }
//     catch(error){
//         toast.error(data.message)

//     }
//   }

//     const value = {
//         aToken,
//         setAToken: updateToken,
//         backendUrl,
//         doctors,
//         getAllDoctors,
//         changeAvailbility,
//         appointments,setAppointments,getAllAppointments,
//         cancelAppointment,
//         completeAppointment,
        
//         dashData,getDashData,
//         logout
//     };

//     return (
//         <AdminContext.Provider value={value}>
//             {props.children}
//         </AdminContext.Provider>
//     );
// };

// export default AdminContextProvider;