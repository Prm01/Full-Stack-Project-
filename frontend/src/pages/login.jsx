import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AppContext } from '../context/Appcontex';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate=useNavigate()

  const {backendUrl,token,setToken}=useContext(AppContext)
  const [state, setState] = useState('SignUp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Add your form submission logic here
    try{
     
      if(state==='sign Up'){
        const {data}=await axios.post(backendUrl+'/api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
        }
      }
      else{
         const {data}=await axios.post(backendUrl+'/api/user/login',{password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
        }
      }


    }
    catch(error){
      toast.error(error.message)

    }
  }



  const toggleState = () => {
    setState(state === 'SignUp' ? 'Login' : 'SignUp');
    // Clear form when toggling
    setName('');
    setEmail('');
    setPassword('');
  }

  useEffect(()=>{
    if(token){
navigate('/')
    }

  },[token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={onSubmitHandler} className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {state === 'SignUp' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {state === 'SignUp' ? 'Sign up to book appointments' : 'Log in to your account'}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Field - Only show for SignUp */}
            {state === 'SignUp' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {state === 'SignUp' ? 'Create Account' : 'Log In'}
            </button>
          </div>

          {/* Toggle Section */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              {state === 'SignUp' ? 'Already have an account?' : "Don't have an account?"}
              <button 
                type="button"
                onClick={toggleState}
                className="ml-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-300"
              >
                {state === 'SignUp' ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700">Terms</a>{' '}
              and{' '}
              <a href="#" className="text-teal-600 hover:text-teal-700">Privacy Policy</a>
            </p>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-gray-500">
            <div className="w-8 h-px bg-gray-300"></div>
            <span className="text-sm">Secure & Trusted</span>
            <div className="w-8 h-px bg-gray-300"></div>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

// import React from 'react'
// import { useState } from 'react'

// const login = () => {
// const [state, setState] = useState('SignUp');
// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');
// const [name, setName] = useState('');

// const onSubmitHandler=async(event)=>{
//   event.preventDefault();


// }

//   return (
//     <form className='min-h-[80vh] flex-items-centre'>
//         <div>
//        <p>
//         {state==='SignUp'?'Create Account':'Log In'}
//        </p>
//        <p>Please  {state==='SignUp'?'sign Up':'Log In'} to book appointment</p>
//       <div>
//         <p>Full Name</p>
//         <input type="text" onChange={(e)=>setName(e.target.name)}  value={name}/>
//       </div>
//        <div>
//         <p>Email</p>
//         <input type="email" onChange={(e)=>setEmail(e.target.email)}  value={email}/>
//       </div>
//        <div>
//         <p>Password</p>
//         <input type="password" onChange={(e)=>setPassword(e.target.password)}  value={password}/>
//       </div>
//       <div>
//         <button> {state==='SignUp'?'Create Account':'Log In'}</button>
//       </div>
//         </div>

//     </form>
//   )
// }

// export default login
