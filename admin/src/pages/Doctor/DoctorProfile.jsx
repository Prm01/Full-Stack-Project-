import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    if (!isEdit) {
      setIsEdit(true);
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        name: profileData.name,
        degree: profileData.degree,
        speciality: profileData.speciality,
        experience: profileData.experience,
        about: profileData.about
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { 
          headers: { 
            Authorization: `Bearer ${dToken}` 
          } 
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    getProfileData(); // Reset to original data
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Doctor Profile</h1>
              {!isEdit ? (
                <button 
                  onClick={() => setIsEdit(true)}
                  className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={updateProfile}
                  disabled={loading}
                  className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Profile Image */}
              <div className="lg:w-1/3">
                <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                  <div className="w-full rounded-2xl overflow-hidden border-4 border-teal-100 shadow-lg mb-4">
                    <img 
                      src={profileData.image} 
                      alt={profileData.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  {/* Availability Toggle */}
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <input 
                      onChange={() => isEdit && setProfileData(prev => ({
                        ...prev,
                        available: !prev.available
                      }))}
                      checked={profileData.available}
                      type="checkbox"
                      id="availability"
                      className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                      disabled={!isEdit}
                    />
                    <label 
                      htmlFor="availability" 
                      className="text-lg font-medium text-gray-700 cursor-pointer"
                    >
                      Available for Appointments
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Information */}
              <div className="lg:w-2/3">
                {/* Name and Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEdit ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Doctor Name"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-gray-900">{profileData.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                        {isEdit ? (
                          <input
                            type="text"
                            value={profileData.degree}
                            onChange={(e) => setProfileData(prev => ({ ...prev, degree: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Degree"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{profileData.degree}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Speciality</label>
                        {isEdit ? (
                          <input
                            type="text"
                            value={profileData.speciality}
                            onChange={(e) => setProfileData(prev => ({ ...prev, speciality: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Speciality"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{profileData.speciality}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                        {isEdit ? (
                          <input
                            type="text"
                            value={profileData.experience}
                            onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Experience"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{profileData.experience} years</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">About</label>
                  {isEdit ? (
                    <textarea
                      value={profileData.about}
                      onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{profileData.about}</p>
                  )}
                </div>

                {/* Address Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">Address</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                      {isEdit ? (
                        <input
                          type="text"
                          value={profileData.address?.line1 || ''}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Address Line 1"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.address?.line1 || "Not provided"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                      {isEdit ? (
                        <input
                          type="text"
                          value={profileData.address?.line2 || ''}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Address Line 2"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.address?.line2 || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment Fee */}
                <div className="bg-teal-50 rounded-2xl border border-teal-100 p-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">Appointment Fee</label>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Fee:</span>
                    {isEdit ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{currency}</span>
                        <input
                          type="number"
                          value={profileData.fees}
                          onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-teal-600">
                        {currency} {profileData.fees}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEdit && (
                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button 
                      onClick={handleCancel}
                      disabled={loading}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={updateProfile}
                      disabled={loading}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
// import React, { useEffect } from 'react'
// import { useContext } from 'react';
// import { DoctorContext } from '../../context/DoctorContext';
// import { AppContext } from '../../context/AppContext';

// const DoctorProfile = () => {
//   const { dToken, profileData, getProfileData } = useContext(DoctorContext);
//   const { currency } = useContext(AppContext);

//   useEffect(() => {
//     if (dToken) {
//       getProfileData();
//     }
//   }, [dToken]);



//   if (!profileData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-6 text-white">
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold">Doctor Profile</h1>
//               <button className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                 Edit Profile
//               </button>
//             </div>
//           </div>

//           <div className="p-8">
//             {/* Profile Header with Image */}
//             <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-200">
//               <div className="relative">
//                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-teal-100 shadow-lg">
//                   <img 
//                     src={profileData.image} 
//                     alt={profileData.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
              
//               <div className="flex-1 text-center md:text-left">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   {profileData.name}
//                 </h2>
                
//                 <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
//                   <span className="text-lg text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
//                     {profileData.degree} - {profileData.speciality}
//                   </span>
//                   <button className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-teal-200 transition-colors">
//                     {profileData.experience} years experience
//                   </button>
//                 </div>

//                 {/* Appointment Fee */}
//                 <div className="bg-teal-50 p-4 rounded-lg max-w-md">
//                   <p className="text-lg font-semibold text-gray-800">
//                     Appointment Fee: {currency} 
//                     <span className="text-2xl text-teal-600 ml-2">
//                       {profileData.fees}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* About Section */}
//             <div className="mb-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
//                 <h3 className="text-2xl font-bold text-gray-900">ABOUT</h3>
//               </div>
              
//               <div className="bg-gray-50 p-6 rounded-xl">
//                 <p className="text-gray-700 leading-relaxed text-lg">
//                   {profileData.about}
//                 </p>
//               </div>
//             </div>

//             {/* Address Section */}
//             <div className="mb-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
//                 <h3 className="text-2xl font-bold text-gray-900">ADDRESS</h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
//                   <div className="bg-gray-50 px-4 py-3 rounded-lg">
//                     <p className="text-lg text-gray-900">
//                       {profileData.address?.line1 || "Not provided"}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
//                   <div className="bg-gray-50 px-4 py-3 rounded-lg">
//                     <p className="text-lg text-gray-900">
//                       {profileData.address?.line2 || "Not provided"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Availability Section */}
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
//               <div className="flex items-center gap-3">
//                 <input 
//                   type="checkbox" 
//                   id="availability"
//                   className="w-5 h-5 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
//                   defaultChecked
//                 />
//                 <label 
//                   htmlFor="availability" 
//                   className="text-lg font-medium text-gray-700 cursor-pointer"
//                 >
//                   Available for Appointments
//                 </label>
//               </div>
              
//               <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md">
//                 Edit Profile Information
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DoctorProfile;


// import React, { useEffect } from 'react'
// import { useContext } from 'react';
// import { DoctorContext } from '../../context/DoctorContext';
// import { AppContext } from '../../context/AppContext';

// const DoctorProfile = () => {

//   const {dToken,profileData,setProfileData,getProfileData}=useContext(DoctorContext);

//   const {currency,backendUrl}=useContext(AppContext);

//   useEffect(()=>{
//     if(dToken){
//     getProfileData();
//     }
//   },[dToken])


//   return profileData &&  (
//     <div>
     

//      <div>
   
//    <div>
//     <img src={profileData.image} alt="" />
//    </div>
//    <div>
//     {/* Name  ,degree,experiemce*/}
//     <p>{profileData.name}</p>
//     <div>
//       {profileData.degree}-{profileData.speciality} 
//       <button>{profileData.experience}</button>
//     </div>

//     {/* doctor abouts text */}

//     <div>
//       <p>About</p>
      
//       <p>{profileData.about}</p>


//     </div>
//     <p>
//       Appointment Fee : {currency} <span>{profileData.fees}</span>

//     </p>
//    </div>
//      <p>Address</p>
      
//       <p>{profileData.address.line1}</p>
//      <br />
//       <p>{profileData.address.line2}</p>


//      </div>

//      <div>
//       <input type="checkbox" />
//       <label htmlFor=""> Available</label>
//      </div>
//      <button>Edit</button>
//     </div>
//   )
// }

// export default DoctorProfile
