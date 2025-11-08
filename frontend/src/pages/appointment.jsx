import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/Appcontex'
import { assets } from '../assets/assets'
import RelatedDoctors from '../Components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const fetchDocInfo = async () => {
    const doctorInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(doctorInfo)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])

    // Getting current date 
    let today = new Date();
    let slots = [];
    
    for(let i = 0; i < 7; i++){
      // Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      // Setting times end of date
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9 PM

      // Setting hours
      let startTime = new Date(currentDate);
      if(today.getDate() === currentDate.getDate()){
        // If it's today, start from current time + 1 hour
        startTime.setHours(startTime.getHours() + 1);
        startTime.setMinutes(0);
      } else {
        // For future days, start from 10 AM
        startTime.setHours(10, 0, 0, 0);
      }
      
      let timeslots = [];
      let tempTime = new Date(startTime);

      while(tempTime < endTime){
    let formattedTime = tempTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    
    // Use the EXACT same format as backend
    const slotDate = currentDate.toISOString().split('T')[0]; // "2024-11-30"
    
    console.log('Checking slot:', {
        date: slotDate,
        time: formattedTime,
        bookedSlots: docInfo.slots_booked[slotDate] // Check what's actually booked
    });
    
    const isBooked = docInfo.slots_booked && 
                    docInfo.slots_booked[slotDate] && 
                    docInfo.slots_booked[slotDate].includes(formattedTime);
    
    if (!isBooked) {
        timeslots.push(formattedTime);
    }
    
    tempTime.setMinutes(tempTime.getMinutes() + 30);
}
      
      // while(tempTime < endTime){
      //   let formattedTime = tempTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        
      //   let day=currentDate.getDate()
      //   let month=currentDate.getMonth()+1
      //   let year=currentDate.getFullYear()

      //   const slotDate= day+"_"+month+"_"+year
      //   const slotTime=formattedTime
      //   const isSlotAvailable=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime)
      //   ? false:true 
        

      //   if(isSlotAvailable){
      //   // Add slot to array
      //   timeslots.push(formattedTime);
        
       
      //   }
      //    // Increment by 30 mins
      //   tempTime.setMinutes(tempTime.getMinutes() + 30);
      // }

      // Format date for display
      let displayDate = '';
      if (i === 0) {
        displayDate = 'Today';
      } else if (i === 1) {
        displayDate = 'Tomorrow';
      } else {
        displayDate = currentDate.toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'});
      }

      // Format date for backend (YYYY-MM-DD format)
      const backendDate = currentDate.toISOString().split('T')[0];

      slots.push({
        date: displayDate,
        backendDate: backendDate, // Store the proper date format for backend
        times: timeslots
      });
    }
    
    setDocSlots(slots);
  }

const bookAppointment = async () => {
    if(!token){
      toast.warn("Please login to book appointment")
      return navigate('/login')
    }

    if(!selectedDate || !selectedTime){
      toast.warn("Please select date and time")
      return
    }

    try{
      const selectedSlot = docSlots[slotIndex];
      const slotDate = selectedSlot.backendDate;
      
      console.log('📤 Sending booking request:');
      console.log('URL:', backendUrl + '/api/user/book-appointment');
      console.log('Data:', { docId, slotDate, slotTime: selectedTime });
      console.log('Token exists:', !!token);
      console.log('Selected Doctor:', docInfo?.name);

      const response = await axios.post(
        backendUrl + '/api/user/book-appointment', 
        {
          docId, 
          slotDate, 
          slotTime: selectedTime
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('✅ Booking response:', response);
      
      if(response.data.success){
        toast.success(response.data.message)
        getDoctorsData();
        navigate('/my-appointment')
      } else {
        toast.error(response.data.message)
      }

    } catch(error){
      console.log('🔴 FULL BOOKING ERROR DETAILS:');
      console.log('Error object:', error);
      console.log('Has response:', !!error.response);
      console.log('Has request:', !!error.request);
      console.log('Error message:', error.message);
      
      if (error.response) {
        // Server responded with error status
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        console.log('No response received');
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        console.log('Setup error:', error.message);
        toast.error("Booking setup failed: " + error.message);
      }
    }
}
  // const bookAppointment = async () => {
  //   if(!token){
  //     toast.warn("Please login to book appointment")
  //     return navigate('/login')
  //   }

  //   if(!selectedDate || !selectedTime){
  //     toast.warn("Please select date and time")
  //     return
  //   }

  //   try{
  //     // Get the selected slot data
  //     const selectedSlot = docSlots[slotIndex];
      
  //     // Format date for backend (use the backendDate we stored)
  //     const slotDate = selectedSlot.backendDate;
      
  //     const { data } = await axios.post(
  //       backendUrl + '/api/user/book-appointment', 
  //       {
  //         docId, 
  //         slotDate, 
  //         slotTime: selectedTime
  //       }, 
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`
  //         }
  //       }
  //     );
      
  //     if(data.success){
  //       toast.success(data.message)
  //       getDoctorsData(); // Call the function, not just reference it
  //       navigate('/my-appointment')
  //     } else {
  //       toast.error(data.message)
  //     }

  //   } catch(error){
  //     console.log('Booking error:', error)
  //     toast.error(error.response?.data?.message || "Failed to book appointment")
  //   }
  // }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setSlotTime(time)
  }

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="text-gray-500 ml-4">Loading doctor information...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Doctor Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <img 
                src={docInfo.image} 
                alt={docInfo.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-teal-100 shadow-md"
              />
            </div>

            <div className="flex-1 space-y-4">
              {/* Doctor Name and Speciality */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{docInfo.name}</h1>
                <img src={assets.verified_icon} alt="Verified" className="w-6 h-6" />
              </div>
              
              <div>
                <p className="text-lg text-teal-600 font-semibold">{docInfo.degree} - {docInfo.speciality}</p>
                <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mt-2 hover:bg-teal-200 transition-colors duration-300">
                  ⭐ {docInfo.experience} years experience
                </button>
              </div>

              {/* Doctor About */}
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-lg font-semibold text-gray-900">About</p>
                  <img src={assets.info_icon} alt="Info" className="w-5 h-5" />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {docInfo.about || "Experienced and dedicated healthcare professional committed to providing quality medical care."}
                </p>
              </div>

              <p className="text-xl font-semibold text-gray-900">
                Appointment Fees: <span className="text-teal-600">{currencySymbol}{docInfo.fees}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Select Date</h2>
              <div className="space-y-3">
                {docSlots.length > 0 && docSlots.map((item, index) => (
                  <div 
                    onClick={() => {
                      setSlotIndex(index)
                      setSelectedDate(item.date)
                    }}
                    key={index} 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      slotIndex === index 
                        ? 'border-teal-500 bg-teal-50 shadow-md' 
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{item.date}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.times.length} slots available
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Available Time Slots {selectedDate && `- ${selectedDate}`}
              </h2>
              
              {docSlots.length > 0 && docSlots[slotIndex] && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {docSlots[slotIndex].times.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-4 rounded-xl font-medium transition-all duration-300 ${
                        selectedTime === time
                          ? 'bg-teal-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 hover:shadow-md'
                      }`}
                    >
                      {time.toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Appointment Button */}
            {selectedDate && selectedTime && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center">
                  <p className="text-lg text-gray-700 mb-4">
                    Your appointment with <span className="font-semibold text-teal-600">{docInfo.name}</span>
                  </p>
                  <p className="text-gray-600 mb-2">
                    📅 {selectedDate} at 🕒 {selectedTime.toLowerCase()}
                  </p>
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    Total: {currencySymbol}{docInfo.fees}
                  </p>
                  <button
                    onClick={bookAppointment}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Book an Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  )
} 

export default Appointment

// import React, { useContext, useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { AppContext } from '../context/Appcontex'
// import { assets } from '../assets/assets'
// import RelatedDoctors from '../Components/RelatedDoctors'
// import { toast } from 'react-toastify'
// import axios from 'axios'

// const Appointment = () => {
//   const { docId } = useParams()
//   const navigate=useNavigate()
//   const { doctors, currencySymbol,backendUrl,token,getDoctorsData } = useContext(AppContext)
//   const daysofWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   const [docInfo, setDocInfo] = useState(null)
//   const [docSlots, setDocSlots] = useState([])
//   const [slotIndex, setSlotIndex] = useState(0)
//   const [slotTime, setSlotTime] = useState('')
//   const [selectedDate, setSelectedDate] = useState('')
//   const [selectedTime, setSelectedTime] = useState('')

//   const fetchDocInfo = async () => {
//     const doctorInfo = doctors.find(doc => doc._id === docId)
//     setDocInfo(doctorInfo)
//   }

//   const getAvailableSlots = async () => {
//     setDocSlots([])

//     //getting current date 
//     let today = new Date();
//     for(let i = 0; i < 7; i++){
//       //getting date with index
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);
//       // setting times end of date
//       let endTime = new Date();
//       endTime.setDate(today.getDate() + i)
//       endTime.setHours(21, 0, 0, 0); //9 PM

//       //settings hours
//       if(today.getDate() === currentDate.getDate()){
//         currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10); //10 AM
//         currentDate.setMinutes(0);
//       }
      
//       let timeslots = [];
//       while(currentDate < endTime){
//         let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

//         // add slot to array
//         timeslots.push(formattedTime);
//         //increment by 30 mins
//         currentDate.setMinutes(currentDate.getMinutes() + 30);
//       }

//       setDocSlots(prevSlots => [...prevSlots, {
//         date: today.getDate() === currentDate.getDate() ? 'Today' : i === 1 ? 'Tomorrow' : currentDate.toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'}), 
//         times: timeslots
//       }])
//     }
//   }


//   const bookAppointment=async()=>{
//     if(!token){
//       toast.warn("login to book appointment")
//       return  navigate('/login')
//     }

//     try{
//       const date=getDoctorsData[slotIndex][0].datetime()
     
//       let day=date.getDate()
//       let month= date.getMonth()+1 
//       let year=date.getFullYear()


//       const slotDate=day + "_"+month +"_"+year
      
//       const {data}=await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:token})
//       if(data.success){
//         toast.success(data.message)
//         getdoctorsData
//         navigate('/my-appointment')
//       }
//       else{
//         toast.error(data.message)
//       }

//     }
//     catch(error){
//       console.log(error)
//       toast.error(error.message)

//     }
//   }

//   useEffect(() => {
//     fetchDocInfo()
//   }, [doctors, docId])

//   useEffect(() => {
//     getAvailableSlots()
//   }, [docInfo])

//   useEffect(() => {
//     console.log(docSlots);
//   }, [docSlots])

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time)
//     setSlotTime(time)
//   }

//   const handleBookAppointment = () => {
//     if (selectedDate && selectedTime) {
//       alert(`Appointment booked for ${selectedDate} at ${selectedTime}`)
//       // Add your booking logic here
//     } else {
//       alert('Please select date and time')
//     }
//   }

//   if (!docInfo) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-500">Loading doctor information...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Doctor Details */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-6 items-start">
//             <div className="flex-shrink-0">
//               <img 
//                 src={docInfo.image} 
//                 alt={docInfo.name}
//                 className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-teal-100 shadow-md"
//               />
//             </div>

//             <div className="flex-1 space-y-4">
//               {/* Doctor Name and Speciality */}
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{docInfo.name}</h1>
//                 <img src={assets.verified_icon} alt="Verified" className="w-6 h-6" />
//               </div>
              
//               <div>
//                 <p className="text-lg text-teal-600 font-semibold">{docInfo.degree} - {docInfo.speciality}</p>
//                 <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mt-2 hover:bg-teal-200 transition-colors duration-300">
//                   ⭐ {docInfo.experience} years experience
//                 </button>
//               </div>

//               {/* Doctor About */}
//               <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
//                 <div className="flex items-center gap-2 mb-3">
//                   <p className="text-lg font-semibold text-gray-900">About</p>
//                   <img src={assets.info_icon} alt="Info" className="w-5 h-5" />
//                 </div>
//                 <p className="text-gray-600 leading-relaxed">
//                   {docInfo.about || "Experienced and dedicated healthcare professional committed to providing quality medical care."}
//                 </p>
//               </div>

//               <p className="text-xl font-semibold text-gray-900">
//                 Appointment Fees: <span className="text-teal-600">{currencySymbol}{docInfo.fees}</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Booking Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Date Selection */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">Select Date</h2>
//               <div className="space-y-3">
//                 {docSlots.length > 0 && docSlots.map((item, index) => (
//                   <div 
//                     onClick={() => {
//                       setSlotIndex(index)
//                       setSelectedDate(item.date)
//                     }}
//                     key={index} 
//                     className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
//                       slotIndex === index 
//                         ? 'border-teal-500 bg-teal-50 shadow-md' 
//                         : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <p className="font-semibold text-gray-900">{item.date}</p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {item.times.length} slots available
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Time Slots */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">
//                 Available Time Slots {selectedDate && `- ${selectedDate}`}
//               </h2>
              
//               {docSlots.length > 0 && docSlots[slotIndex] && (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//                   {docSlots[slotIndex].times.map((time, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleTimeSelect(time)}
//                       className={`p-4 rounded-xl font-medium transition-all duration-300 ${
//                         selectedTime === time
//                           ? 'bg-teal-500 text-white shadow-lg transform scale-105'
//                           : 'bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700 hover:shadow-md'
//                       }`}
//                     >
//                       {time.toLowerCase()}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Book Appointment Button */}
//             {selectedDate && selectedTime && (
//               <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
//                 <div className="text-center">
//                   <p className="text-lg text-gray-700 mb-4">
//                     Your appointment with <span className="font-semibold text-teal-600">{docInfo.name}</span>
//                   </p>
//                   <p className="text-gray-600 mb-2">
//                     📅 {selectedDate} at 🕒 {selectedTime.toLowerCase()}
//                   </p>
//                   <p className="text-xl font-bold text-gray-900 mb-4">
//                     Total: {currencySymbol}{docInfo.fees}
//                   </p>
//                   <button
//                     onClick={bookAppointment}
//                     className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                   >
//                     Book an Appointment
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//           {/* related Doctors*/}
//           <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
//         </div>
//       </div>
//     </div>
//   )
// } 

// export default Appointment

// import React, { useContext, useState, useEffect, use } from 'react'
// import { useParams } from 'react-router-dom'
// import { AppContext } from '../context/Appcontex'
// import { assets } from '../assets/assets'

// const Appointment = () => {
//   const { docId } = useParams()
//   const { doctors,currencySymbol } = useContext(AppContext)
//   const daysofWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   const [docInfo, setDocInfo] = useState(null)
//   const [docSlots, setDocSlots] = useState([])
//   const [slotIndex, setSlotIndex] = useState(0)
//   const [slotTime, setSlotTime] = useState('')

//   const fetchDocInfo = async () => {
//     const doctorInfo = doctors.find(doc => doc._id === docId)
//     setDocInfo(doctorInfo)
            
//   }

//   const getAvailableSlots = async()=>{
//     setDocSlots([])

//     //getting current date 
//     let today=new Date();
//     for(let i=0;i<7;i++){
//       //getting date with index
//       let currentDate=new Date(today);
//       currentDate.setDate(today.getDate()+i);
//       //  setting times end of date
//       let endTime=new Date();
//       endTime.setDate(today.getDate()+i)
//       endTime.setHours(21,0,0,0); //9 PM

//       //settings hours

//       if(today.getDate()===currentDate.getDate()){
//         currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10);
//         currentDate.setMinutes(currentDate.getMinutes()>30?30:0);
//       }else{
//         currentDate.setHours(10); //10 AM
//         currentDate.setMinutes(0);
//       }
//       let timeslots=[];
//       while(currentDate<endTime){
//         let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

// // add slot toarray
//         timeslots.push(formattedTime);
//         //increment by30 mins
//         currentDate.setMinutes(currentDate.getMinutes()+30);
//       }

//       setDocSlots(prevSlots=>[...prevSlots,{date:today.getDate()===currentDate.getDate()?'Today':i===1?'Tomorrow':currentDate.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'}),times:timeslots}])
//   }

//   useEffect(() => {
//     fetchDocInfo()
//   }, [doctors, docId])

//   useEffect(() => {
//     getAvailableSlots()
//   }, [docInfo])
// useEffect(() => {
//   console.log(docSlots);
// }, [docSlots])



//   // Add loading state and error handling
//   if (!docInfo) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-500">Loading doctor information...</p>
//       </div>
//     )
//   }

//   return docInfo &&  (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Doctor Details */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="flex-shrink-0">
//               <img 
//                 src={docInfo.image} 
//               />
//             </div>

//             <div>
//               {/* Doctor Name and Speciality */}
//               <p>
//                 {docInfo.name} <img src={assets.verified_icon} alt="" />
//               </p>
//             </div>
//             <div>
//               <p>{docInfo.degree}-{docInfo.speciality}</p>
//               <button>{docInfo.experience}</button>
//             </div>
//             {/* doctor about */}
//             <div>
//               <p>About
//                 <img src={assets.info_icon} alt="" />
//               </p>
//               <p>{docInfo.about}</p>
//             </div>
//             <p>
//               Appointment Fees: <span>{currencySymbol}{docInfo.fees}</span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* booking slots */}
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <p>Booking Slots</p>
//         <div >
//           {docSlots.length && docSlots.map((item, index) => (
//             <div  onClick={()=>setSlotIndex(index)} key={index} className="mb-6">
              
//             <p>{ item [0] && daysofWeek[item[0].datetime.getDay()]}</p>
//             <p>{item[0] && item[0].datetime.getdate()}</p>

//         </div>
//         <div>
//           {docSlots.length && docSlots[slotIndex].times.map((item, index) => (
//             <p key={index}>
//               {item.time.tolowerCase()}
//             </p>
//   }
//         </div>
//     </div>
//   )
//       </div>
//       </div>

//     </div>
//   )
// } 

// export default Appointment