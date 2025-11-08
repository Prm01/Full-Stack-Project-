import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/Appcontex.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointment = () => {
  const { backendUrl, token, userData, getDoctorsData } = useContext(AppContext)
  const [appointment, setAppointment] = useState([])
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(null)
  const navigate = useNavigate()

  const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormate = (slotDate) => {
    if (!slotDate) {
      return 'Date not set'
    }
    
    if (typeof slotDate === 'string') {
      // Try underscore format first (22_8_2024)
      if (slotDate.includes('_')) {
        const dateArray = slotDate.split('_')
        if (dateArray.length === 3) {
          const [day, monthNum, year] = dateArray
          const monthIndex = parseInt(monthNum)
          if (monthIndex >= 1 && monthIndex <= 12) {
            return `${day} ${month[monthIndex]} ${year}`
          }
        }
      }
      
      // Try hyphen format (2024-08-22)
      if (slotDate.includes('-')) {
        const date = new Date(slotDate)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }
      }
      
      // Try slash format (22/8/2024)
      if (slotDate.includes('/')) {
        const [day, monthNum, year] = slotDate.split('/')
        const monthIndex = parseInt(monthNum)
        if (monthIndex >= 1 && monthIndex <= 12) {
          return `${day} ${month[monthIndex]} ${year}`
        }
      }
    }
    
    return 'Invalid date format'
  }

  const getUserAppointment = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointment", { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      })
      
      if (data.success) {
        setAppointment(data.appointment?.reverse() || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log('Appointment fetch error:', error)
      toast.error(error.response?.data?.message || error.message || "Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  // Cancel appointment function
  const cancelAppointment = async (appointmentId) => {
    try {
      if (!userData || !userData._id) {
        toast.error("User information not available. Please login again.");
        return;
      }

      if (!window.confirm('Are you sure you want to cancel this appointment?')) {
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { 
          userId: userData._id,
          appointmentId 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('Cancellation error:', error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  }

  // Payment initialization function
  const initPay = (order) => {
    // Check if Razorpay is available
    if (!window.Razorpay) {
      toast.error("Payment service is not available. Please refresh the page.");
      console.error('Razorpay not loaded');
      return;
    }

    console.log('💰 Creating Razorpay order:', order);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: "Doctor Appointment Booking",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log('💳 Payment successful response:', response);
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay', 
            response, 
            { 
              headers: { 
                Authorization: `Bearer ${token}` 
              } 
            }
          );
          
          if (data.success) {
            toast.success("Payment successful! Appointment confirmed.");
            getUserAppointment();
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.log('Payment verification error:', error);
          toast.error(error.response?.data?.message || "Payment verification failed");
        }
      },
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || ''
      },
      theme: {
        color: "#3399cc"
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed by user');
          setPaymentLoading(null);
          toast.info("Payment cancelled");
        }
      },
      notes: {
        appointment: "Doctor Appointment"
      }
    }

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      console.log('✅ Razorpay modal opened successfully');
    } catch (error) {
      console.log('🔴 Razorpay initialization error:', error);
      setPaymentLoading(null);
      toast.error("Failed to initialize payment gateway");
    }
  }

  // Payment initiation function
  const appointmentRazorpay = async (appointmentId) => {
    setPaymentLoading(appointmentId);
    
    try {
      console.log('🔄 Starting payment for appointment:', appointmentId);
      
      // Check if Razorpay key is available
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        toast.error("Payment configuration error. Please contact support.");
        setPaymentLoading(null);
        return;
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay', 
        { appointmentId }, 
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      console.log('✅ Payment initiation response:', data);

      if (data.success) {
        console.log('🎯 Initiating Razorpay with order:', data.order);
        initPay(data.order);
      } else {
        console.log('❌ Payment initiation failed:', data.message);
        toast.error(data.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.log('🔴 Razorpay error:', error);
      console.log('Error response:', error.response?.data);
      console.log('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || error.message || "Payment initialization failed");
      }
    } finally {
      // Don't set loading to null here - let the modal handle it
    }
  }

  // Refresh appointments
  const handleRefresh = () => {
    getUserAppointment();
  }

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (appointment.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments yet</h3>
            <p className="text-gray-500 mb-6">You haven't booked any appointments yet.</p>
            <button 
              onClick={() => navigate('/doctors')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Book Your First Appointment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">
              You have {appointment.length} appointment{appointment.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="hidden md:flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-6">
          {appointment.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={item.docData?.image || '/default-doctor.png'} 
                      alt={item.docData?.name} 
                      className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100 shadow-md"
                      onError={(e) => {
                        e.target.src = '/default-doctor.png'
                      }}
                    />
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Dr. {item.docData?.name || 'Doctor Name Not Available'}
                        </h3>
                        <p className="text-teal-600 font-medium">
                          {item.docData?.speciality || 'Speciality Not Specified'}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.docData?.degree} - {item.docData?.experience} years experience
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Appointment Date & Time</p>
                          <div className="flex items-center gap-2 text-gray-900 font-semibold">
                            <span>📅</span>
                            <span>{slotDateFormate(item.slotDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-900 font-semibold mt-1">
                            <span>🕒</span>
                            <span>{item.slotTime || 'Time not set'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Fees</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{item.amount || item.docData?.fees || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          item.cancelled 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : item.payment 
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {item.cancelled ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Cancelled
                            </>
                          ) : item.payment ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Paid
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Pending Payment
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    {/* Paid Status */}
                    {item.payment && (
                      <button 
                        disabled
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Paid
                      </button>
                    )}
                    
                    {/* Pay Online Button */}
                    {!item.cancelled && !item.payment && !item.isCompleted && (
                      <button 
                        onClick={() => appointmentRazorpay(item._id)}
                        disabled={paymentLoading === item._id}
                        className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        {paymentLoading === item._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Pay Online
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* Cancel Appointment Button */}
                    {!item.cancelled && !item.payment &&  !item.isCompleted && (
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    )}
                    
                    {/* Cancelled Status */}
                    {item.cancelled && !item.isCompleted && (
                      <button 
                        disabled
                        className="border border-red-300 text-red-400 bg-red-50 px-4 py-2 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Cancelled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyAppointment



// import React from 'react'
// import { useContext, useState, useEffect } from 'react'
// import { AppContext } from '../context/Appcontex.jsx'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// const MyAppointment = () => {
//   const { backendUrl, token, userData, getDoctorsData } = useContext(AppContext)
//   const [appointment, setAppointment] = useState([])
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//   const slotDateFormate = (slotDate) => {
//     console.log('🔍 DEBUG slotDate input:', slotDate)
//     console.log('🔍 DEBUG slotDate type:', typeof slotDate)
    
//     if (!slotDate) {
//       console.log('❌ DEBUG: slotDate is null/undefined')
//       return 'Date not set'
//     }
    
//     // Handle different date formats
//     if (typeof slotDate === 'string') {
//       // Try underscore format first (22_8_2024)
//       if (slotDate.includes('_')) {
//         const dateArray = slotDate.split('_')
//         console.log('🔍 DEBUG underscore format array:', dateArray)
        
//         if (dateArray.length === 3) {
//           const [day, monthNum, year] = dateArray
//           const monthIndex = parseInt(monthNum)
          
//           if (monthIndex >= 1 && monthIndex <= 12) {
//             return `${day} ${month[monthIndex]} ${year}`
//           }
//         }
//       }
      
//       // Try hyphen format (2024-08-22)
//       if (slotDate.includes('-')) {
//         console.log('🔍 DEBUG hyphen format detected')
//         const date = new Date(slotDate)
//         if (!isNaN(date.getTime())) {
//           return date.toLocaleDateString('en-GB', {
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric'
//           })
//         }
//       }
      
//       // Try slash format (22/8/2024)
//       if (slotDate.includes('/')) {
//         console.log('🔍 DEBUG slash format detected')
//         const [day, monthNum, year] = slotDate.split('/')
//         const monthIndex = parseInt(monthNum)
        
//         if (monthIndex >= 1 && monthIndex <= 12) {
//           return `${day} ${month[monthIndex]} ${year}`
//         }
//       }
//     }
    
//     console.log('❌ DEBUG: No valid format found')
//     return 'Invalid date format'
//   }

//   const getUserAppointment = async () => {
//     setLoading(true)
//     try {
//       const { data } = await axios.get(backendUrl + "/api/user/appointment", { 
//         headers: { token } 
//       })
//       console.log('📋 Appointment API Response:', data)
      
//       if (data.success) {
//         setAppointment(data.appointment?.reverse() || [])
//       }
//     } catch (error) {
//       console.log('❌ Appointment fetch error:', error)
//       toast.error(error.response?.data?.message || error.message || "Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fixed cancelAppointment function
//   const cancelAppointment = async (appointmentId) => {
//     try {
//       if (!userData || !userData._id) {
//         toast.error("User information not available. Please login again.");
//         return;
//       }

//       const { data } = await axios.post(
//         backendUrl + "/api/user/cancel-appointment",
//         { 
//           userId: userData._id,
//           appointmentId 
//         },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success("Appointment cancelled successfully");
//         getUserAppointment();
//         getDoctorsData()
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log('Cancellation error:', error);
//       toast.error(error.response?.data?.message || "Failed to cancel appointment");
//     }
//   }

//   // Payment function - FIXED
//   const initPay = (order) => {
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Appointment Payment",
//       description: "Appointment Payment",
//       order_id: order.id,
//       receipt: order.receipt,
//       handler: async (response) => {
//         console.log('Payment response:', response)
//         try {
//           const { data } = await axios.post(
//             backendUrl + '/api/user/verifyRazorpay', 
//             response, 
//             { headers: { token } }
//           )
//           if (data.success) {
//             toast.success("Payment successful!");
//             getUserAppointment();
//             navigate('/my-appointment');
//           } else {
//             toast.error("Payment verification failed");
//           }
//         } catch (error) {
//           console.log('Payment verification error:', error)
//           toast.error(error.response?.data?.message || "Payment verification failed");
//         }
//       },
//       prefill: {
//         name: userData?.name || '',
//         email: userData?.email || '',
//         contact: userData?.phone || ''
//       },
//       theme: {
//         color: "#3399cc"
//       }
//     }

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   const appointmentRazorpay = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + '/api/user/payment-razorpay', 
//         { appointmentId }, 
//         { headers: { token } }
//       )

//       if (data.success) {
//         initPay(data.order);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log('Razorpay error:', error);
//       toast.error(error.response?.data?.message || error.message || "Payment initialization failed");
//     }
//   }

//   useEffect(() => {
//     if (token) {
//       getUserAppointment();
//     }
//   }, [token])

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading appointments...</p>
//         </div>
//       </div>
//     )
//   }

//   // Empty state
//   if (appointment.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//             <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
//             <p className="text-gray-500 text-lg">No appointments found</p>
//             <button 
//               onClick={() => navigate('/doctors')}
//               className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
//             >
//               Book Your First Appointment
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//           <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//           <p className="text-gray-600 mt-2">
//             You have {appointment.length} appointment{appointment.length !== 1 ? 's' : ''}
//           </p>
//         </div>

//         <div className="space-y-6">
//           {appointment.map((item) => (
//             <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row gap-6">
//                   {/* Doctor Image */}
//                   <div className="flex-shrink-0">
//                     <img 
//                       src={item.docData?.image || '/default-doctor.png'} 
//                       alt={item.docData?.name} 
//                       className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100"
//                       onError={(e) => {
//                         e.target.src = '/default-doctor.png'
//                       }}
//                     />
//                   </div>

//                   {/* Appointment Details */}
//                   <div className="flex-1">
//                     <div className="space-y-3">
//                       <div>
//                         <h3 className="text-xl font-semibold text-gray-900">
//                           Dr. {item.docData?.name || 'Doctor Name Not Available'}
//                         </h3>
//                         <p className="text-teal-600 font-medium">
//                           {item.docData?.speciality || 'Speciality Not Specified'}
//                         </p>
//                         <p className="text-gray-600 text-sm">
//                           {item.docData?.degree} - {item.docData?.experience} years experience
//                         </p>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</p>
//                           <p className="text-gray-900 font-semibold">
//                             📅 {slotDateFormate(item.slotDate)}
//                           </p>
//                           <p className="text-gray-900 font-semibold">
//                             🕒 {item.slotTime || 'Time not set'}
//                           </p>
//                         </div>
                        
//                         <div>
//                           <p className="text-sm font-medium text-gray-700 mb-1">Fees</p>
//                           <p className="text-gray-900 font-semibold">
//                             ₹{item.amount || item.docData?.fees || 'N/A'}
//                           </p>
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                           item.cancelled 
//                             ? 'bg-red-100 text-red-800' 
//                             : item.payment 
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {item.cancelled ? 'Cancelled' : item.payment ? 'Paid' : 'Pending Payment'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons - FIXED LOGIC */}
//                   <div className="flex flex-col gap-3">
//                     {/* Paid Button */}
//                     {item.payment && (
//                       <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
//                         ✅ Paid
//                       </button>
//                     )}
                    
//                     {/* Pay Online Button */}
//                     {!item.cancelled && !item.payment && (
//                       <button 
//                         onClick={() => appointmentRazorpay(item._id)}
//                         className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
//                       >
//                         Pay Online
//                       </button>
//                     )}
                    
//                     {/* Cancel Appointment Button */}
//                     {!item.cancelled && (
//                       <button 
//                         onClick={() => cancelAppointment(item._id)}
//                         className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
//                       >
//                         Cancel Appointment
//                       </button>
//                     )}
                    
//                     {/* Cancelled Status */}
//                     {item.cancelled && (
//                       <button className="border border-red-500 text-red-500 bg-red-50 px-6 py-2 rounded-lg font-semibold cursor-not-allowed">
//                         Appointment Cancelled
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MyAppointment

// import React from 'react'
// import { useContext, useState, useEffect } from 'react'
// import { AppContext } from '../context/Appcontex.jsx'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import {useNavigate} from 'react-router-dom'

// const MyAppointment = () => {
//   const { backendUrl, token, userData,getDoctorsData } = useContext(AppContext) // Use userData instead of user
//   const [appointment, setAppointment] = useState([])
//   const [loading, setLoading] = useState(false)
//   const navigate=useNavigate()

//   const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// //   const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//   const slotDateFormate = (slotDate) => {
//     console.log('🔍 DEBUG slotDate input:', slotDate)
//     console.log('🔍 DEBUG slotDate type:', typeof slotDate)
    
//     if (!slotDate) {
//       console.log('❌ DEBUG: slotDate is null/undefined')
//       return 'Date not set'
//     }
    
//     // Handle different date formats
//     if (typeof slotDate === 'string') {
//       // Try underscore format first (22_8_2024)
//       if (slotDate.includes('_')) {
//         const dateArray = slotDate.split('_')
//         console.log('🔍 DEBUG underscore format array:', dateArray)
        
//         if (dateArray.length === 3) {
//           const [day, monthNum, year] = dateArray
//           const monthIndex = parseInt(monthNum)
          
//           if (monthIndex >= 1 && monthIndex <= 12) {
//             return `${day} ${month[monthIndex]} ${year}`
//           }
//         }
//       }
      
//       // Try hyphen format (2024-08-22)
//       if (slotDate.includes('-')) {
//         console.log('🔍 DEBUG hyphen format detected')
//         const date = new Date(slotDate)
//         if (!isNaN(date.getTime())) {
//           return date.toLocaleDateString('en-GB', {
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric'
//           })
//         }
//       }
      
//       // Try slash format (22/8/2024)
//       if (slotDate.includes('/')) {
//         console.log('🔍 DEBUG slash format detected')
//         const [day, monthNum, year] = slotDate.split('/')
//         const monthIndex = parseInt(monthNum)
        
//         if (monthIndex >= 1 && monthIndex <= 12) {
//           return `${day} ${month[monthIndex]} ${year}`
//         }
//       }
//     }
    
//     console.log('❌ DEBUG: No valid format found')
//     return 'Invalid date format'
//   }
    

//   const getUserAppointment = async () => {
//     setLoading(true)
//     try {
//       const { data } = await axios.get(backendUrl + "/api/user/appointment", { 
//         headers: { token } 
//       })
//       console.log('📋 Appointment API Response:', data)
      
//       if (data.success) {
//         setAppointment(data.appointment?.reverse() || [])
//       }
//     } catch (error) {
//       console.log('❌ Appointment fetch error:', error)
//       toast.error(error.response?.data?.message || error.message || "Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fixed cancelAppointment function
//   const cancelAppointment = async (appointmentId) => {
//     try {
//       // Use userData instead of user
//       if (!userData || !userData._id) {
//         toast.error("User information not available. Please login again.");
//         return;
//       }

//       const { data } = await axios.post(
//         backendUrl + "/api/user/cancel-appointment",
//         { 
//           userId: userData._id, // Use userData._id
//           appointmentId 
//         },
//         { headers: { token } }
//       );

//       if (data.success) {
//         toast.success("Appointment cancelled successfully");
//         getUserAppointment();
//         getDoctorsData()
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log('Cancellation error:', error);
//       toast.error(error.response?.data?.message || "Failed to cancel appointment");
//     }
//   }
//   //paymet function

//   const initPay=(order)=>{
    
//     const options={
//       key:import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amout:order.amount,
//       currency:order.currency,
//       name:"Appointment Payment",
//       description:"Appointment Payment",
//       order_id:order.id,
//       receipt:order.receipt,
//       handler:async(response)=>{
//        console.log(response)

//        try{
//           const {data}=await axios.post(backendUrl+'/api/user/verifyRazorpay',response,{headers:{token}})
//           if(data.success){
//             getUserAppointment()
//             navigate('/my-appointment')

//           }
//        }
//        catch(error){
//         console.log(error)
//         toast.error(error.message)

//        }
//       }

//     }

//     const rzp=new window.Razorpay(options)
//     rzp.open()

//   }

//   const appointmentRazorpay=async(appointmentId)=>{
//     try{
//   const {data}=await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})

//   if(data.success){
//     initPay(data.order)
    
//   }
//     }
//     catch(error){
//     console.log(error)
//     toast.error(message.error)
//     }

//   }

//   useEffect(() => {
//     if (token) {
//       getUserAppointment()
//     }
//   }, [token])

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading appointments...</p>
//         </div>
//       </div>
//     )
//   }

//   // Empty state
//   if (appointment.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//             <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
//             <p className="text-gray-500 text-lg">No appointments found</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//           <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//         </div>

//         <div className="space-y-6">
//           {appointment.slice(0, 3).map((item) => (
//             <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row gap-6">
//                   {/* Doctor Image */}
//                   <div className="flex-shrink-0">
//                     <img 
//                       src={item.docData?.image || '/default-doctor.png'} 
//                       alt={item.docData?.name} 
//                       className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100"
//                       onError={(e) => {
//                         e.target.src = '/default-doctor.png'
//                       }}
//                     />
//                   </div>

//                   {/* Appointment Details */}
//                   <div className="flex-1">
//                     <div className="space-y-3">
//                       <div>
//                         <h3 className="text-xl font-semibold text-gray-900">
//                           Dr. {item.docData?.name || 'Doctor Name Not Available'}
//                         </h3>
//                         <p className="text-teal-600 font-medium">
//                           {item.docData?.speciality || 'Speciality Not Specified'}
//                         </p>
//                         <p className="text-gray-600 text-sm">
//                           {item.docData?.degree} - {item.docData?.experience} years experience
//                         </p>
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</p>
//                           <p className="text-gray-900 font-semibold">
//                             📅 {slotDateFormate(item.slotDate)}
//                           </p>
//                           <p className="text-gray-900 font-semibold">
//                             🕒 {item.slotTime || 'Time not set'}
//                           </p>
//                         </div>
                        
//                         <div>
//                           <p className="text-sm font-medium text-gray-700 mb-1">Fees</p>
//                           <p className="text-gray-900 font-semibold">
//                             ₹{item.amount || item.docData?.fees || 'N/A'}
//                           </p>
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                           item.status === 'confirmed' 
//                             ? 'bg-green-100 text-green-800' 
//                             : item.status === 'cancelled'
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {item.status || 'confirmed'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-3">
//                   {!item.cancelled && item.payment&&<button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300" >Paid</button>}
//                    {item.status!=='cancelled' && !item.cancelled&& !item.payment( <button onClick={()=>appointmentRazorpay(item._id)} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
//                       Pay Online
//                     </button>)}
                    
//                     {/* Only show cancel button if appointment is not already cancelled */}
//                     {item.status !== 'cancelled' && !item.cancelled && (
//                       <button 
//                         onClick={() => cancelAppointment(item._id)}
//                         className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
//                       >
//                         Cancel Appointment
//                       </button>
//                     )}
//                     {item.cancelled&&(<button className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold transition-colors duration-300">Appointment Cancelled</button>)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MyAppointment

// import React from 'react'
// import { useContext, useState, useEffect } from 'react'
// import { AppContext } from '../context/Appcontex.jsx'
// import axios from 'axios'
// import { toast } from 'react-toastify'

// const MyAppointment = () => {
//   const { backendUrl, token } = useContext(AppContext)
//   const [appointment, setAppointment] = useState([])
//   const [loading, setLoading] = useState(false)

//   const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//   const slotDateFormate = (slotDate) => {
//     console.log('🔍 DEBUG slotDate input:', slotDate)
//     console.log('🔍 DEBUG slotDate type:', typeof slotDate)
    
//     if (!slotDate) {
//       console.log('❌ DEBUG: slotDate is null/undefined')
//       return 'Date not set'
//     }
    
//     // Handle different date formats
//     if (typeof slotDate === 'string') {
//       // Try underscore format first (22_8_2024)
//       if (slotDate.includes('_')) {
//         const dateArray = slotDate.split('_')
//         console.log('🔍 DEBUG underscore format array:', dateArray)
        
//         if (dateArray.length === 3) {
//           const [day, monthNum, year] = dateArray
//           const monthIndex = parseInt(monthNum)
          
//           if (monthIndex >= 1 && monthIndex <= 12) {
//             return `${day} ${month[monthIndex]} ${year}`
//           }
//         }
//       }
      
//       // Try hyphen format (2024-08-22)
//       if (slotDate.includes('-')) {
//         console.log('🔍 DEBUG hyphen format detected')
//         const date = new Date(slotDate)
//         if (!isNaN(date.getTime())) {
//           return date.toLocaleDateString('en-GB', {
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric'
//           })
//         }
//       }
      
//       // Try slash format (22/8/2024)
//       if (slotDate.includes('/')) {
//         console.log('🔍 DEBUG slash format detected')
//         const [day, monthNum, year] = slotDate.split('/')
//         const monthIndex = parseInt(monthNum)
        
//         if (monthIndex >= 1 && monthIndex <= 12) {
//           return `${day} ${month[monthIndex]} ${year}`
//         }
//       }
//     }
    
//     console.log('❌ DEBUG: No valid format found')
//     return 'Invalid date format'
//   }

//   // Rest of your component remains the same...

// // const MyAppointment = () => {
// //   const { backendUrl, token } = useContext(AppContext)
// //   const [appointment, setAppointment] = useState([])
// //   const [loading, setLoading] = useState(false)


// //   const month = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// //  const slotDateFormate = (slotDate) => {
// //   if (!slotDate) return 'Date not available';
  
// //   try {
// //     const dateArray = slotDate.split('_');
    
// //     // Validate the date array
// //     if (dateArray.length !== 3) {
// //       return 'Invalid date format';
// //     }
    
// //     const [day, monthNum, year] = dateArray;
// //     const monthIndex = Number(monthNum);
    
// //     // Validate month index
// //     if (monthIndex < 1 || monthIndex > 12) {
// //       return 'Invalid month';
// //     }
    
// //     return `${day} ${month[monthIndex]} ${year}`;
// //   } catch (error) {
// //     console.error('Date formatting error:', error);
// //     return 'Date format error';
// //   }
// // }
// // const month = [" ","jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
// //   const slotDateFormate=(slotDate)=>{
// //     const dateArray=slotDate.split('_')
// //     return dateArray[0]+" "+month[Number(dateArray[1])]+" "+dateArray[2]
// //   }

//   const getUserAppointment = async () => {
//   setLoading(true)
//   try {
//     const { data } = await axios.get(backendUrl + "/api/user/appointment", { 
//       headers: { token } 
//     })
//     console.log('📋 Appointment API Response:', data)
//     console.log('🔍 First appointment data:', data.appointment?.[0])
    
//     if (data.success) {
//       setAppointment(data.appointment?.reverse() || [])
//     }
//   } catch (error) {
//     console.log('❌ Appointment fetch error:', error)
//     toast.error(error.response?.data?.message || error.message || "Something went wrong")
//   } finally {
//     setLoading(false)
//   }
// }
//   // const getUserAppointment = async () => {
//   //   setLoading(true)
//   //   try {
//   //     const { data } = await axios.get(backendUrl + "/api/user/appointment", { 
//   //       headers: { token } 
//   //     })
//   //     if (data.success) {
//   //       setAppointment(data.appointment?.reverse() || [])
//   //     }
//   //   } catch (error) {
//   //     console.log(error)
//   //     toast.error(error.response?.data?.message || error.message || "Something went wrong")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }


//   const cancelAppointment = async (appointmentId) => {
//   try {
//     const { data } = await axios.post(
//       backendUrl + "/api/user/cancel-appointment",
//       { 
//         userId: user._id, // assuming you have user data in context
//         appointmentId 
//       },
//       { headers: { token } }
//     );

//     if (data.success) {
//       toast.success("Appointment cancelled successfully");
//       // Refresh appointments
//       getUserAppointment();
//     } else {
//       toast.error(data.message);
//     }
//   } catch (error) {
//     console.log('Cancellation error:', error);
//     toast.error(error.response?.data?.message || "Failed to cancel appointment");
//   }
// };

// // Update the cancel button in your JSX:
// {/* <button 
//   onClick={() => cancelAppointment(item._id)}
//   className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
// >
//   Cancel Appointment
// </button> */}
//   // const cancleAppointment=async(appointmentId)=>{

//   //   try{
     
//   //     const {data}=await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})

//   //     if(data.success){
//   //       toast.success(data.message)
//   //       getUserAppointment()

//   //     }
//   //     else{
//   //       toast.error(data.message)
//   //     }

//   //   }
//   //   catch(error){
//   //     console.log(error)
//   //     toast.error(error.message)
//   //   }
//   // }

//   useEffect(() => {
//     if (token) {
//       getUserAppointment()
//     }
//   }, [token])

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading appointments...</p>
//         </div>
//       </div>
//     )
//   }

//   // Empty state
//   if (appointment.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//             <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
//             <p className="text-gray-500 text-lg">No appointments found</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//           <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//         </div>

//         <div className="space-y-6">
//   {appointment.slice(0, 3).map((item) => (
//     <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       <div className="p-6">
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Doctor Image */}
//           <div className="flex-shrink-0">
//             <img 
//               src={item.docData?.image || '/default-doctor.png'} 
//               alt={item.docData?.name} 
//               className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100"
//               onError={(e) => {
//                 e.target.src = '/default-doctor.png'
//               }}
//             />
//           </div>

//           {/* Appointment Details */}
//           <div className="flex-1">
//             <div className="space-y-3">
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   Dr. {item.docData?.name || 'Doctor Name Not Available'}
//                 </h3>
//                 <p className="text-teal-600 font-medium">
//                   {item.docData?.speciality || 'Speciality Not Specified'}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   {item.docData?.degree} - {item.docData?.experience} years experience
//                 </p>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</p>
//                   <p className="text-gray-900 font-semibold">
//                     📅 {slotDateFormate(item.slotDate) || 'Date not set'} 
//                   </p>
//                   <p className="text-gray-900 font-semibold">
//                     🕒 {item.slotTime || 'Time not set'}
//                   </p>
//                 </div>
                
//                 <div>
//                   <p className="text-sm font-medium text-gray-700 mb-1">Fees</p>
//                   <p className="text-gray-900 font-semibold">
//                     ₹{item.amount || item.docData?.fees || 'N/A'}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
//                 <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   item.status === 'confirmed' 
//                     ? 'bg-green-100 text-green-800' 
//                     : item.status === 'cancelled'
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {item.status || 'confirmed'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col gap-3">
//             <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
//               Pay Online
//             </button>
//             <button onClick={()=>cancelAppointment(item._id)} className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
//               Cancel Appointment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>
//       </div>
//     </div>
//   )
// }

// export default MyAppointment

// import React from 'react'
// import { useContext } from 'react'
// import { AppContext } from '../context/Appcontex.jsx'
// import { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useEffect } from 'react';

// const MyAppointment = () => {
//   const {backendUrl,token} = useContext(AppContext);
//   const [appointment,setAppointment]=useState([])

//   const getUserAppointment=async()=>{
//     try{
//           const {data}=await axios.get(backendUrl+"/api/user/appointment",{headers:{token}})
//           if(data.success){
//             setAppointment(data.appointment.reverse())
//             console.log(data.appointment);

//           }
//     }
//     catch(error){
//       console.log(error)
//       toast.error(error.message)

//     }
//   }


//   useEffect(()=>{
//     if(token){
//       getUserAppointment()
//     }

//   },[token])
  
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//           <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
//         </div>

//         {/* Appointments List */}
//         <div className="space-y-6">
//           {appointment.slice(0,3).map((item,index) => (
//             <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//               <div className="p-6">
//                 <div className="flex flex-col md:flex-row gap-6">
//                   {/* Doctor Image */}
//                   <div className="flex-shrink-0">
//                     <img 
//                       src={item.docData.image} 
//                       alt={item.name} 
//                       className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100"
//                     />
//                   </div>

//                   {/* Doctor Details */}
//                   <div className="flex-1">
//                     <div className="space-y-3">
//                       <div>
//                         <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
//                         <p className="text-teal-600 font-medium">{item.docData.speciality}</p>
//                       </div>
                      
//                       <div>
//                         <p className="text-sm font-medium text-gray-700 mb-1">Address</p>
//                         <p className="text-gray-600">{item.address?.line1}</p>
//                         <p className="text-gray-600">{item.address?.line2}</p>
//                       </div>
                      
//                       <div>
//                         <p className="text-sm font-medium text-gray-700">
//                           Date&Time: <span className="text-gray-900">{item.slotDate} | {item.slotTime}</span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col gap-3">
//                     <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
//                       Pay Online
//                     </button>
//                     <button className="border border-red-500 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
//                       Cancel Appointment
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MyAppointment

// import React from 'react'
// import { useContext } from 'react'
// import { AppContext } from '../context/Appcontex.jsx'

// const myappointment = () => {
//   const {doctors}=useContext(AppContext);
//   return (
    
//     <div>
//       <p>My appointment</p>
//       <div>
//         {doctors.slice(0,2).map((item,index)=>(
//           <div key={index}>
//         <div>
//           <img src={item.image} alt="" />
//         </div>
//         <div>

//           <div>
//             <p>{item.name}</p>
//             <p>{item.speciality}</p>
//             <p>Address</p>
//             <p>{item.address.line1}</p>
//             <p>{item.address.line2}</p>
//             <p>Date and Time: <span>25 july,2025 | 8:30 PM</span> </p>
//           </div>
//         </div>
//          <div>
//           <button>Pay Online</button>
//           <button>Cancle appointment</button>
//          </div>
//           </div>
//         ))}
//       </div>
//     </div>
      
//   )
// }

// export default myappointment
