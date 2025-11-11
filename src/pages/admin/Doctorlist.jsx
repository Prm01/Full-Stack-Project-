import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContex";
import { toast } from "react-toastify";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const [updatingDoctor, setUpdatingDoctor] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      if (aToken && !hasFetched) {
        console.log('Starting to fetch doctors...');
        setLoading(true);
        setError('');
        try {
          await getAllDoctors();
          setHasFetched(true);
          console.log('Doctors fetched successfully');
        } catch (err) {
          console.error('Error in fetchDoctors:', err);
          const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch doctors';
          setError(errorMsg);
          toast.error(errorMsg);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDoctors();
  }, [aToken, getAllDoctors, hasFetched]);

  // Handle image errors
  const handleImageError = (doctorId, imageUrl) => {
    console.log('❌ Cloudinary image failed to load for doctor:', doctorId);
    setImageErrors(prev => ({ ...prev, [doctorId]: true }));
  };

  // Handle availability toggle
  const handleAvailabilityToggle = async (doctorId, currentAvailability) => {
    console.log('Toggling availability for:', doctorId, 'from:', currentAvailability, 'to:', !currentAvailability);
    setUpdatingDoctor(doctorId);
    try {
      await changeAvailability(doctorId, !currentAvailability);
      toast.success(`Availability ${!currentAvailability ? 'enabled' : 'disabled'} successfully`);
    } catch (err) {
      console.error('Error in handleAvailabilityToggle:', err);
      toast.error('Failed to update availability');
    } finally {
      setUpdatingDoctor(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Medical Team</h2>
          <p className="text-gray-600 max-w-md">
            We're gathering all healthcare professional details for you...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Connection Issue
            </h3>
            <p className="text-gray-600 text-lg mb-2">We couldn't load the doctor directory</p>
            <p className="text-red-500 font-medium mb-8 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
              {error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={() => {
                  setHasFetched(false);
                  setError('');
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <button 
                onClick={() => {
                  setError('');
                  setHasFetched(true);
                }}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-lg opacity-30 transform scale-110"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl mb-6 transform hover:rotate-6 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                Medical Team Directory
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Meet our exceptional team of healthcare professionals dedicated to providing 
                world-class medical care with compassion and expertise.
              </p>
              
              {doctors && doctors.length > 0 && (
                <div className="mt-6 inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
                  <span className="text-lg font-semibold">
                    <span className="text-2xl font-black mr-1">{doctors.length}</span> 
                    Active Doctors
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cloudinary Status Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-800 text-lg">☁️ Cloudinary Storage</h3>
                <p className="text-green-600 text-sm">All images are securely stored and delivered via Cloudinary CDN</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-700">
                {doctors.filter(d => d.image?.includes('cloudinary')).length} / {doctors.length} 
                <span className="text-green-600"> on Cloudinary</span>
              </p>
              <p className="text-xs text-green-500">Failed: {Object.keys(imageErrors).length}</p>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors && doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => {
              const hasImageError = imageErrors[doctor._id];
              const isCloudinaryURL = doctor.image?.includes('cloudinary');
              
              return (
                <div 
                  key={doctor._id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-105"></div>
                  
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 group-hover:border-blue-200/50 transform group-hover:-translate-y-2">
                    {/* Card Header */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white overflow-hidden">
                      {/* Cloudinary Badge */}
                      {isCloudinaryURL && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
                            <span>☁️</span>
                            <span>Cloudinary</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Availability Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                          doctor.available 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        }`}>
                          <div className={`w-2 h-2 rounded-full bg-white ${doctor.available ? 'animate-pulse' : ''}`}></div>
                          <span>{doctor.available ? 'Available' : 'Unavailable'}</span>
                        </div>
                      </div>
                      
                      {/* Doctor Image */}
                      <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/30 transform group-hover:scale-110 transition-transform duration-300">
                          {doctor.image && !hasImageError ? (
                            <img
                              className="w-full h-full object-cover"
                              src={doctor.image}
                              alt={doctor.name}
                              onError={() => handleImageError(doctor._id, doctor.image)}
                              onLoad={() => console.log('✅ Image loaded:', doctor.name)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/10">
                              <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Error Badge */}
                          {hasImageError && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Doctor Info */}
                      <div className="text-center">
                        <h3 className="text-xl font-bold truncate mb-1">{doctor.name}</h3>
                        <p className="text-blue-100 text-sm font-medium opacity-95">{doctor.speciality}</p>
                        <p className="text-blue-200 text-xs mt-1">{doctor.degree}</p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Contact Info */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 block mb-1">Email</span>
                          <span className="text-gray-800 text-sm font-medium break-words">{doctor.email}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                          <div className="text-lg font-black text-orange-600">{doctor.experience}</div>
                          <div className="text-orange-500 text-xs font-semibold">Years Exp</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                          <div className="text-lg font-black text-green-600">${doctor.fees}</div>
                          <div className="text-green-500 text-xs font-semibold">Consultation</div>
                        </div>
                      </div>

                      {/* Availability Toggle */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-gray-700 block">Status</span>
                            <span className={`text-xs font-medium ${doctor.available ? 'text-green-600' : 'text-red-600'}`}>
                              {doctor.available ? '✅ Accepting patients' : '❌ Not available'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAvailabilityToggle(doctor._id, doctor.available)}
                            disabled={updatingDoctor === doctor._id}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                              doctor.available ? 'bg-green-500' : 'bg-gray-400'
                            } ${updatingDoctor === doctor._id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                          >
                            <span className="sr-only">Toggle availability</span>
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-all duration-300 ease-in-out ${
                                doctor.available ? 'translate-x-5' : 'translate-x-0'
                              } ${updatingDoctor === doctor._id ? 'scale-90' : ''}`}
                            />
                          </button>
                        </div>
                        {updatingDoctor === doctor._id && (
                          <div className="mt-3 flex items-center justify-center space-x-2 bg-white/80 p-2 rounded-lg">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                            <span className="text-xs font-medium text-gray-700">Updating...</span>
                          </div>
                        )}
                      </div>

                      {/* About Section */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">About</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {doctor.about}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-gray-200/50 flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs">
                            {new Date(doctor.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          doctor.available 
                            ? 'bg-green-400 animate-pulse' 
                            : 'bg-red-400'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading && (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-3">
                No Doctors Available
              </h3>
              <p className="text-gray-600 mb-8">
                {hasFetched 
                  ? "Currently there are no doctors registered in our healthcare system." 
                  : "Ready to discover our medical team?"
                }
              </p>
              
              <button 
                onClick={() => setHasFetched(false)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Load Medical Team
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DoctorsList;







// import React, { useState, useEffect, useContext } from 'react'
// import { AdminContext } from '../../context/AdminContex'
// import { toast } from 'react-toastify'

// const DoctorList = () => {
//   const { doctors, aToken, getAllDoctors, changeAvailbility, backendUrl } = useContext(AdminContext)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [hasFetched, setHasFetched] = useState(false)
//   const [updatingDoctor, setUpdatingDoctor] = useState(null)
//   const [imageErrors, setImageErrors] = useState({})

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       if (aToken && !hasFetched) {
//         console.log('Starting to fetch doctors...');
//         setLoading(true)
//         setError('')
//         try {
//           await getAllDoctors()
//           setHasFetched(true)
//           console.log('Doctors fetched successfully');
//         } catch (err) {
//           console.error('Error in fetchDoctors:', err);
//           const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch doctors';
//           setError(errorMsg)
//           toast.error(errorMsg)
//         } finally {
//           setLoading(false)
//         }
//       }
//     }

//     fetchDoctors()
//   }, [aToken, getAllDoctors, hasFetched])

//   // Get image URL for doctor
//   const getImageUrl = (doctor) => {
//     if (!doctor.image) {
//       console.log('❌ No image for doctor:', doctor.name);
//       return null;
//     }
    
//     // If image is already a full URL, return it
//     if (doctor.image.startsWith('http')) {
//       return doctor.image;
//     }
    
//     // Try with the stored filename
//     const imageUrl = `${backendUrl}/api/admin/images/${doctor.image}`;
//     console.log('🖼️ Generated image URL:', imageUrl);
//     return imageUrl;
//   }

//   // Handle image errors
//   const handleImageError = (doctorId, imageUrl) => {
//     console.log('❌ Image failed to load:', imageUrl);
//     setImageErrors(prev => ({ ...prev, [doctorId]: true }));
//   }

//   // Safe availability check with fallback
//   const getDoctorAvailability = (doctor) => {
//     if (doctor.available !== undefined && typeof doctor.available === 'boolean') {
//       return doctor.available;
//     }
    
//     if (doctor.isAvailable !== undefined && typeof doctor.isAvailable === 'boolean') {
//       return doctor.isAvailable;
//     }
    
//     return true;
//   }

//   // Handle availability toggle
//   const handleAvailabilityToggle = async (doctorId, currentAvailability) => {
//     console.log('Toggling availability for:', doctorId, 'from:', currentAvailability, 'to:', !currentAvailability);
//     setUpdatingDoctor(doctorId)
//     try {
//       await changeAvailbility(doctorId, !currentAvailability)
//       toast.success(`Availability ${!currentAvailability ? 'enabled' : 'disabled'} successfully`)
//     } catch (err) {
//       console.error('Error in handleAvailabilityToggle:', err)
//       toast.error('Failed to update availability')
//     } finally {
//       setUpdatingDoctor(null)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Medical Team</h2>
//           <p className="text-gray-600 max-w-md">
//             We're gathering all healthcare professional details for you...
//           </p>
//           <div className="mt-4 flex justify-center space-x-2">
//             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
//             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//             <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
//         <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
//           <div className="flex flex-col items-center text-center">
//             <div className="relative mb-6">
//               <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg">
//                 <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm font-bold">!</span>
//               </div>
//             </div>
            
//             <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
//               Connection Issue
//             </h3>
//             <p className="text-gray-600 text-lg mb-2">We couldn't load the doctor directory</p>
//             <p className="text-red-500 font-medium mb-8 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
//               {error}
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 w-full">
//               <button 
//                 onClick={() => {
//                   setHasFetched(false);
//                   setError('');
//                 }}
//                 className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
//               >
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Try Again
//               </button>
//               <button 
//                 onClick={() => {
//                   setError('');
//                   setHasFetched(true);
//                 }}
//                 className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
//               >
//                 Continue Anyway
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-8xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="text-center mb-16">
//           <div className="relative inline-block mb-8">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-lg opacity-30 transform scale-110"></div>
//             <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl mb-6 transform hover:rotate-6 transition-transform duration-300">
//                 <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//               </div>
//               <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
//                 Medical Team Directory
//               </h1>
//               <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//                 Meet our exceptional team of healthcare professionals dedicated to providing 
//                 world-class medical care with compassion and expertise.
//               </p>
              
//               {doctors && doctors.length > 0 && (
//                 <div className="mt-8 inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
//                   <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
//                   <span className="text-lg font-semibold">
//                     <span className="text-2xl font-black">{doctors.length}</span> Active Doctors
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Debug Panel - Remove this in production */}
//         {doctors && doctors.length > 0 && (
//           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h3 className="font-bold text-blue-800 mb-2">Debug Info:</h3>
//             <div className="text-sm text-blue-700 space-y-1">
//               <p>Backend: {backendUrl}</p>
//               <p>First doctor image: {doctors[0]?.image}</p>
//               <p>Image URL: {getImageUrl(doctors[0])}</p>
//               <p>Failed images: {Object.keys(imageErrors).length}</p>
//               <button 
//                 onClick={() => window.open(`${backendUrl}/api/admin/debug-uploads`, '_blank')}
//                 className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
//               >
//                 Check Uploads Folder
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Enhanced Doctors Grid */}
//         {doctors && doctors.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
//             {doctors.map((doctor, index) => {
//               const isAvailable = getDoctorAvailability(doctor);
//               const imageUrl = getImageUrl(doctor);
//               const hasImageError = imageErrors[doctor._id];
              
//               return (
//                 <div 
//                   key={doctor._id}
//                   className="group relative"
//                   style={{
//                     animationDelay: `${index * 100}ms`,
//                     animation: 'fadeInUp 0.6s ease-out forwards'
//                   }}
//                 >
//                   {/* Background Glow Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-105"></div>
                  
//                   <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-white/20 group-hover:border-blue-200/50 transform group-hover:-translate-y-3">
//                     {/* Card Header with Enhanced Gradient */}
//                     <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white overflow-hidden">
//                       {/* Background Pattern */}
//                       <div className="absolute inset-0 opacity-10">
//                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
//                       </div>
                      
//                       {/* Enhanced Availability Badge */}
//                       <div className="absolute top-6 right-6 transform group-hover:scale-110 transition-transform duration-300">
//                         <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
//                           isAvailable 
//                             ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
//                             : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
//                         }`}>
//                           <div className={`w-2 h-2 rounded-full bg-white ${isAvailable ? 'animate-pulse' : ''}`}></div>
//                           <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center justify-between mb-6 relative z-10">
//                         {/* Doctor Profile Image - FIXED */}
//                         <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/30 transform group-hover:rotate-12 transition-transform duration-300">
//                           {imageUrl && !hasImageError ? (
//                             <img 
//                               src={imageUrl}
//                               alt={doctor.name}
//                               className="w-full h-full object-cover"
//                               onLoad={() => console.log('✅ Image loaded successfully for:', doctor.name)}
//                               onError={() => handleImageError(doctor._id, imageUrl)}
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center bg-white/10">
//                               <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                               </svg>
//                             </div>
//                           )}
                          
//                           {/* Debug badge for image status */}
//                           {hasImageError && (
//                             <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
//                               <span className="text-white text-xs font-bold">!</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
//                           {doctor.speciality}
//                         </span>
//                       </div>
                      
//                       <div className="relative z-10">
//                         <h3 className="text-2xl font-black truncate pr-20 mb-2">{doctor.name}</h3>
//                         <p className="text-blue-100 text-base font-medium opacity-95">{doctor.degree}</p>
//                       </div>
//                     </div>

//                     {/* Enhanced Card Body */}
//                     <div className="p-8 space-y-6">
//                       {/* Contact Info */}
//                       <div className="flex items-start space-x-4 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100">
//                         <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <span className="text-sm font-semibold text-gray-500 block mb-1">Email</span>
//                           <span className="text-gray-800 font-medium break-words">{doctor.email}</span>
//                         </div>
//                       </div>

//                       {/* Experience & Fees - Enhanced */}
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="text-center p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 transform hover:scale-105 transition-transform duration-300">
//                           <div className="text-3xl font-black text-orange-600 mb-1">{doctor.experience}</div>
//                           <div className="text-orange-500 text-sm font-bold uppercase tracking-wide">Years Exp</div>
//                         </div>
//                         <div className="text-center p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 transform hover:scale-105 transition-transform duration-300">
//                           <div className="text-3xl font-black text-green-600 mb-1">${doctor.fees}</div>
//                           <div className="text-green-500 text-sm font-bold uppercase tracking-wide">Consultation</div>
//                         </div>
//                       </div>

//                       {/* Enhanced Availability Toggle */}
//                       <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-6 rounded-2xl border border-gray-200 shadow-sm">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <span className="text-lg font-bold text-gray-800 block mb-1">Availability Status</span>
//                             <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
//                               {isAvailable ? '✅ Accepting new patients' : '❌ Not accepting patients'}
//                             </span>
//                           </div>
//                           <button
//                             onClick={() => handleAvailabilityToggle(doctor._id, isAvailable)}
//                             disabled={updatingDoctor === doctor._id}
//                             className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
//                               isAvailable ? 'bg-green-500' : 'bg-gray-400'
//                             } ${updatingDoctor === doctor._id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
//                           >
//                             <span className="sr-only">Toggle availability</span>
//                             <span
//                               className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${
//                                 isAvailable ? 'translate-x-8' : 'translate-x-0'
//                               } ${updatingDoctor === doctor._id ? 'scale-90' : ''}`}
//                             />
//                           </button>
//                         </div>
//                         {updatingDoctor === doctor._id && (
//                           <div className="mt-4 flex items-center justify-center space-x-3 bg-white/80 p-3 rounded-xl">
//                             <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
//                             <span className="text-sm font-medium text-gray-700">Updating status...</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Enhanced About Section */}
//                       <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-100">
//                         <div className="flex items-center space-x-3 mb-4">
//                           <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
//                             <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                           </div>
//                           <span className="text-lg font-bold text-gray-800">Professional Bio</span>
//                         </div>
//                         <p className="text-gray-700 leading-relaxed text-sm font-medium">
//                           {doctor.about}
//                         </p>
//                       </div>

//                       {/* Enhanced Address Section */}
//                       <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-2xl border border-cyan-100">
//                         <div className="flex items-center space-x-3 mb-4">
//                           <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
//                             <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                           </div>
//                           <span className="text-lg font-bold text-gray-800">Clinic Address</span>
//                         </div>
//                         <div className="text-gray-700 space-y-2 text-sm font-medium">
//                           <div className="flex items-start space-x-2">
//                             <span className="text-cyan-500 mt-1">📍</span>
//                             <span>{doctor.address?.line1 || 'Address not available'}</span>
//                           </div>
//                           <div className="flex items-start space-x-2">
//                             <span className="text-cyan-500 mt-1">🏢</span>
//                             <span>{doctor.address?.line2 || ''}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Enhanced Footer */}
//                       <div className="pt-6 border-t border-gray-200/50 flex justify-between items-center">
//                         <div className="flex items-center space-x-3 text-gray-500">
//                           <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div>
//                             <span className="text-xs font-semibold text-gray-400 block">Joined</span>
//                             <span className="text-sm font-bold text-gray-600">
//                               {doctor.date ? new Date(doctor.date).toLocaleDateString('en-US', {
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               }) : 'Unknown date'}
//                             </span>
//                           </div>
//                         </div>
//                         <div className={`w-3 h-3 rounded-full shadow-lg ${
//                           isAvailable 
//                             ? 'bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse' 
//                             : 'bg-gradient-to-r from-red-400 to-pink-400'
//                         }`} title={isAvailable ? 'Active & Available' : 'Currently Unavailable'}></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         ) : !loading && (
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-16 text-center max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300">
//             <div className="flex flex-col items-center">
//               <div className="relative mb-8">
//                 <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
//                   <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                 </div>
//                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
//                   <span className="text-white font-bold text-lg">!</span>
//                 </div>
//               </div>
              
//               <h3 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
//                 No Doctors Available
//               </h3>
//               <p className="text-gray-600 text-xl mb-10 max-w-2xl leading-relaxed">
//                 {hasFetched 
//                   ? "Currently there are no doctors registered in our healthcare system. Please check back later or contact system administration." 
//                   : "Ready to discover our medical team? Click below to load all available healthcare professionals."
//                 }
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-6">
//                 <button 
//                   onClick={() => setHasFetched(false)}
//                   className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl flex items-center justify-center min-w-[200px]"
//                 >
//                   <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   Load Medical Team
//                 </button>
                
//                 <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold text-lg py-5 px-12 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl flex items-center justify-center min-w-[200px]">
//                   <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Contact Support
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add CSS animations */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default DoctorList