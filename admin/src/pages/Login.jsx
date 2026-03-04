import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContex";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin"); // "Admin" | "Doctor"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const adminCtx = useContext(AdminContext);
  const doctorCtx = useContext(DoctorContext);

  const backendUrl = adminCtx?.backendUrl; // should come from AdminContext
  const setAToken = adminCtx?.setAToken;
  const setDToken = doctorCtx?.setDToken; // may be undefined if provider not wrapped

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!backendUrl) {
      toast.error("Backend URL is missing. Set VITE_BACKEND_URL in Render env and redeploy.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        state === "Admin" ? "/api/admin/login" : "/api/doctor/login";

      console.log("🔗 Hitting:", backendUrl + endpoint);

      const { data } = await axios.post(`${backendUrl}${endpoint}`, {
        email,
        password,
      });

      console.log("✅ Response:", data);

      if (!data?.success) {
        toast.error(data?.message || "Login failed");
        return;
      }

      if (state === "Admin") {
        localStorage.setItem("aToken", data.token);
        setAToken?.(data.token);
      } else {
        localStorage.setItem("dToken", data.token);
        setDToken?.(data.token);
      }

      toast.success("Login successful!");
    } catch (error) {
      console.log("🔴 Login error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setState((prev) => (prev === "Admin" ? "Doctor" : "Admin"));
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span
              className={`px-3 py-1 rounded-full text-white ${
                state === "Admin" ? "bg-purple-500" : "bg-teal-500"
              }`}
            >
              {state}
            </span>{" "}
            Login
          </h1>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter your password"
            disabled={loading}
            autoComplete={state === "Admin" ? "current-password" : "current-password"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
            state === "Admin"
              ? "bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400"
              : "bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400"
          } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            {state === "Admin" ? "Doctor Login?" : "Admin Login?"}{" "}
            <span
              onClick={handleToggle}
              className={`font-semibold cursor-pointer transition-colors duration-300 ${
                state === "Admin"
                  ? "text-teal-500 hover:text-teal-600"
                  : "text-purple-500 hover:text-purple-600"
              }`}
            >
              Click Here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;

// import React from 'react'
// import { assets } from '../assets/assets'
// import { useState } from 'react'
// import { useContext } from 'react'
// import { AdminContext } from '../context/AdminContex'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { DoctorContext } from '../context/DoctorContext'

// const Login = () => {
//     const [state, setState] = useState('Admin')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [loading, setLoading] = useState(false)
//     const {setAToken, backendUrl} = useContext(AdminContext)
//     const {setDToken}=useContext(DoctorContext)

//     const onSubmitHandler = async (event) => {
//         event.preventDefault()
//         setLoading(true)

//         try {
//             if (state === 'Admin') {
//                 const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
//                 if (data.success) {
//                     localStorage.setItem('aToken', data.token)
//                     setAToken(data.token)
//                     toast.success('Login successful!')
//                 } else {
//                     toast.error(data.message)
//                 }
//             } else {
//                 // Add doctor login logic here

//                 // toast.info('Doctor login coming soon!')

//                 const {data}= await axios.post(backendUrl+'/api/doctor/login',{email,password})
//                 if (data.success) {
//                     localStorage.setItem('dToken', data.token)
//                     setDToken(data.token)
//                     console.log(data.token)
//                     toast.success('Login successful!')
//                 } else {
//                     toast.error(data.message)
//                 }


//             }
//         } catch (error) {
//             console.log("Login error:", error)
//             toast.error('Login failed. Please try again.')
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleToggle = () => {
//         setState(state === 'Admin' ? 'Doctor' : 'Admin')
//         setEmail('')
//         setPassword('')
//     }

//     return (
//         <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
//             <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900">
//                         <span className={`px-3 py-1 rounded-full text-white ${
//                             state === 'Admin' ? 'bg-purple-500' : 'bg-teal-500'
//                         }`}>
//                             {state}
//                         </span>{' '}
//                         Login
//                     </h1>
//                 </div>

//                 {/* Email Field */}
//                 <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Email
//                     </label>
//                     <input 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         value={email}
//                         type="email" 
//                         required 
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                         placeholder="Enter your email"
//                         disabled={loading}
//                     />
//                 </div>

//                 {/* Password Field */}
//                 <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Password
//                     </label>
//                     <input 
//                         onChange={(e) => setPassword(e.target.value)} 
//                         value={password}
//                         type="password" 
//                         required 
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                         placeholder="Enter your password"
//                         disabled={loading}
//                     />
//                 </div>

//                 {/* Login Button */}
//                 <button 
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
//                         state === 'Admin' 
//                             ? 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400' 
//                             : 'bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400'
//                     } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                     {loading ? 'Logging in...' : 'Login'}
//                 </button>

//                 {/* Toggle Link */}
//                 <div className="text-center mt-6">
//                     <p className="text-gray-600">
//                         {state === 'Admin' ? 'Doctor Login?' : 'Admin Login?'}{' '}
//                         <span 
//                             onClick={handleToggle}
//                             className={`font-semibold cursor-pointer transition-colors duration-300 ${
//                                 state === 'Admin' 
//                                     ? 'text-teal-500 hover:text-teal-600' 
//                                     : 'text-purple-500 hover:text-purple-600'
//                             }`}
//                         >
//                             Click Here
//                         </span>
//                     </p>
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default Login

// import React from 'react'
// import { assets } from '../assets/assets'
// import { useState } from 'react'


// const Login = () => {

//     const [state,setState]=useState('Admin')


//   return (
//     <form className='flex'>
//         <div >
//             <p> <span>{state}</span> Login </p>
          
//           <div>
//             <p>Email</p>
//             <input type="email" required />
//           </div>
//           <div>
//             <p>Password</p>
//             <input type="password"  required/>
//           </div>
//            <button>Login</button>

//            {
//             state==='Admin'
//             ? <p>Doctor Login? <span onClick={()=>setState('Doctor')}>Click Here</span></p>
//             :<p>Admin Login? <span onClick={()=>setState('Admin')}>Click Here</span></p>
//            }
//         </div>
//     </form>
//   )
// }

// export default Login 
