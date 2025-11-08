import { createContext } from "react";
export const AppContext = createContext();

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Set axios default headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem("token");
    }
  }, [token]);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

const loadUserProfileData = async () => {
    try {
        console.log('🔄 Loading user profile...');
        console.log('🔑 Current token:', token);
        console.log('🌐 Backend URL:', backendUrl);

        const { data } = await axios.get(
            backendUrl + "/api/user/get-profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log('✅ Profile response:', data);
        
        if (data.success) {
            setUserData(data.userData);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.log('❌ Profile error:', error);
        console.log('❌ Error response:', error.response?.data);
        toast.error("Session expired. Please login again.");
        setUserData(null);
        setToken("");
        localStorage.removeItem("token");
    }
};

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  useEffect(() => {
    getDoctorsData();
  }, []);

  // Add login and register functions
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/login", {
        email,
        password
      });

      if (data.success) {
        setToken(data.token);
        return { success: true };
      }
    } catch (error) {
      console.log('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password
      });

      if (data.success) {
        setToken(data.token);
        return { success: true };
      }
    } catch (error) {
      console.log('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken("");
    setUserData(null);
  };

  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    backendUrl,
    login,
    register,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

// import { createContext } from "react";
// export const AppContext = createContext();

// import axios from "axios";
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";

// const AppContextProvider = (props) => {
//   const [doctors, setDoctors] = useState([]);
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [userData, setUserData] = useState(false);

//   const currencySymbol = "₹";
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const getDoctorsData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/doctor/list");
//       if (data.success) {
//         setDoctors(data.doctors);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const loadUserProfileData = async () => {
//     try {
//       const { data } = await axios.get(
//         backendUrl + "/api/user/get-profile",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (data.success) {
//         setUserData(data.userData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Session expired. Please login again.");
//       setUserData(null);
//       setToken("");
//       localStorage.removeItem("token");
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       loadUserProfileData();
//     } else {
//       setUserData(null);
//     }
//   }, [token]);

//   useEffect(() => {
//     getDoctorsData();
//   }, []);

//   const value = {
//     doctors,
//     currencySymbol,
//     token,
//     setToken,
//     userData,
//     setUserData,
//     loadUserProfileData,
//     backendUrl
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {props.children}
//     </AppContext.Provider>
//   );
// };

// export default AppContextProvider;


// import { createContext } from "react";

// export const AppContext = createContext();
// import axios from 'axios'
// import { useState } from "react";
// import { useEffect } from "react";
// import { toast } from "react-toastify";

// const AppContextProvider = (props) => {
//     const [doctors,setDoctors]=useState([])
//     const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
//     const [userData,setuserData]=useState(false)
   
//     const currencySymbol="₹";
//     const backendUrl=import.meta.env.VITE_BACKEND_URL


    

//     const getDoctorsData=async()=>{
//         try{
//           const {data}=await axios.get(backendUrl+'/api/doctor/list')
//           if(data.success){
//             setDoctors(data.doctors)


//           }
//           else{
//             toast.error(data.message)
//           }

//         }
//         catch(error){
//             console.log(error)
//             toast.error(error.message)

//         }
//     }


//     const loadUserProfileData=async()=>{

//       try{
//         const {data}=await axios.get(backendUrl+'/api/user/get-profile',{Headers:{token}})
//         if(data.success){
//           setuserData(data.userData)
//         }
//         else{
//           toast.error(data.message)
//         }
      
//       }
//       catch(error){
//          console.log(error)
//             toast.error(error.message)


//       }

//     }



//      const value = {
//         doctors
//      ,currencySymbol,
//      token,setToken
//      ,userData,setuserData,loadUserProfileData,
//      backendUrl
//     };

//     useEffect(()=>{
//       if(token){
//         loadUserProfileData()
//       }
//       else{
//         setuserData
//       }

//     },[token])


//     useEffect(()=>{
//  getDoctorsData()
//     },[])
    
//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }

// export default AppContextProvider;

