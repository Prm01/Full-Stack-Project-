
import React, { useState, useContext } from "react";
import { AppContext } from "../context/Appcontex";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from '../assets/assets'

const MyProfile = () => {
  const { userData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [image, setImage] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phone: userData?.phone || "",
    dob: userData?.dob || "",
    gender: userData?.gender || "",
    address: userData?.address || { line1: "", line2: "" }
  });


  //

  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        dob: userData.dob || "",
        gender: userData.gender || "",
        address: userData.address || { line1: "", line2: "" }
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('dob', formData.dob);
      submitData.append('gender', formData.gender);
      submitData.append('address', JSON.stringify(formData.address));
      
      if (image) {
        submitData.append('image', image);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setImage(false); // Reset image state after successful upload
        loadUserProfileData(); // Refresh user data
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.log('Update error:', error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || "",
      phone: userData?.phone || "",
      dob: userData?.dob || "",
      gender: userData?.gender || "",
      address: userData?.address || { line1: "", line2: "" }
    });
    setImage(false); // Reset image on cancel
    setEditMode(false);
  };

  if (!userData) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">My Profile</h1>
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Information"}
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Profile Header with Image */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-200">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-teal-100 shadow-lg">
                  <img 
                    src={image ? URL.createObjectURL(image) : (userData.image || assets.upload_area)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {editMode && (
                  <label className="absolute bottom-2 right-2 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 w-full md:w-auto text-center md:text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your name"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                )}
                <p className="text-gray-600 mt-2">{userData.email}</p>
                <p className="text-teal-600 font-medium mt-1">Premium Member</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">CONTACT INFORMATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email ID</label>
                  <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userData.email}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {userData.phone || "Not provided"}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  {editMode ? (
                    <div className="space-y-3">
                      <input
                        name="line1"
                        value={formData.address?.line1 || ""}
                        onChange={handleAddressChange}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Address Line 1"
                      />
                      <input
                        name="line2"
                        value={formData.address?.line2 || ""}
                        onChange={handleAddressChange}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Address Line 2"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-lg text-gray-900">{userData.address?.line1 || "Not provided"}</p>
                      <p className="text-lg text-gray-900">{userData.address?.line2 || ""}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">BASIC INFORMATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {userData.gender || "Not provided"}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Birthday</label>
                  {editMode ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {userData.dob || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editMode && (
              <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-gray-200">
                <button 
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

// import React, { useState } from "react";

// import { useContext } from "react";
// import { AppContext } from "../context/Appcontex";

// const MyProfile = () => {
//   const [userData, setUserData] = useContext(AppContext)

//   const [editMode, setEditMode] = useState(false);

//   const handleSave = () => {
//     setEditMode(false);
//     // Add save logic here (API call, etc.)
//   }

//   return  userData &&(
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-6 text-white">
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold">My Profile</h1>
//               {!editMode ? (
//                 <button 
//                   onClick={() => setEditMode(true)}
//                   className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
//                 >
//                   Edit Profile
//                 </button>
//               ) : (
//                 <button 
//                   onClick={handleSave}
//                   className="bg-white text-teal-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
//                 >
//                   Save Information
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="p-8">
//             {/* Profile Header with Image */}
//             <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-200">
//               <div className="relative">
//                 <img 
//                   src={userData.image} 
//                   alt="Profile" 
//                   className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-teal-100 shadow-lg"
//                 />
//                 {editMode && (
//                   <button className="absolute bottom-2 right-2 bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </button>
//                 )}
//               </div>
              
//               <div className="flex-1 text-center md:text-left">
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={userData.name}
//                     onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
//                     className="text-3xl font-bold bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 w-full md:w-auto text-center md:text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   />
//                 ) : (
//                   <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
//                 )}
//                 <p className="text-gray-600 mt-2">Premium Member</p>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="mb-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
//                 <h3 className="text-2xl font-bold text-gray-900">CONTACT INFORMATION</h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Email ID</label>
//                   <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userData.email}</p>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Phone</label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={userData.phone}
//                       onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     />
//                   ) : (
//                     <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userData.phone}</p>
//                   )}
//                 </div>
                
//                 <div className="md:col-span-2 space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   {editMode ? (
//                     <div className="space-y-3">
//                       <input
//                         value={userData.address.Line1}
//                         onChange={(e) => setUserData((prev) => ({
//                           ...prev,
//                           address: { ...prev.address, Line1: e.target.value }
//                         }))}
//                         type="text"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                         placeholder="Address Line 1"
//                       />
//                       <input
//                         value={userData.address.Line2}
//                         onChange={(e) => setUserData((prev) => ({
//                           ...prev,
//                           address: { ...prev.address, Line2: e.target.value }
//                         }))}
//                         type="text"
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                         placeholder="Address Line 2"
//                       />
//                     </div>
//                   ) : (
//                     <div className="bg-gray-50 px-4 py-3 rounded-lg">
//                       <p className="text-lg text-gray-900">{userData.address.Line1}</p>
//                       <p className="text-lg text-gray-900">{userData.address.Line2}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Basic Information */}
//             <div>
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
//                 <h3 className="text-2xl font-bold text-gray-900">BASIC INFORMATION</h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Gender</label>
//                   {editMode ? (
//                     <select
//                       value={userData.gender}
//                       onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     >
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   ) : (
//                     <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userData.gender}</p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Birthday</label>
//                   {editMode ? (
//                     <input
//                       value={userData.dob}
//                       onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
//                       type="date"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                     />
//                   ) : (
//                     <p className="text-lg text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{userData.dob}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-center mt-12 pt-8 border-t border-gray-200">
//               {editMode ? (
//                 <div className="flex gap-4">
//                   <button 
//                     onClick={() => setEditMode(false)}
//                     className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     onClick={handleSave}
//                     className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               ) : (
//                 <button 
//                   onClick={() => setEditMode(true)}
//                   className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;


// import React, { useState } from "react";
// import { assets } from "../assets/assets";

// const Myprofile = () => {
//   const [userData, setUserData] = useState({
//     name: "Edward Vincent",
//     image: assets.profile_pic,
//     email: "richardjameswap@gmail.com",
//     phone: "+1 123 456 7890",
//     address: {
//       Line1: "123, Main Street, City, Country",
//       Line2: "Near Central Park",
//     },
//     gender: "Male",
//     dob: "01-01-1990",
//   });
//   const [editMode, setEditMode] = useState(true);

//   return (
//     <div>
//       <img src={userData.image} alt="" />

//       {editMode ? (
//         <input
//           type="text"
//           value={userData.name}
//           onChange={(e) =>
//             setUserData((prev) => ({ ...prev, name: e.target.value }))
//           }
//         />
//       ) : (
//         <p>{userData.name}</p>
//       )}

//       <hr />
//       <div>
//         <p>CONTACT INFORMATION</p>
//       </div>
//       <div>
//         <p>Email id:</p>
//         <p>{userData.email}</p>
//         <p>Phone:</p>
//         {editMode ? (
//           <input
//             type="text"
//             value={userData.phone}
//             onChange={(e) =>
//               setUserData((prev) => ({ ...prev, phone: e.target.value }))
//             }
//           />
//         ) : (
//           <p>{userData.phone}</p>
//         )}

//         <p>Address:</p>
//         {editMode ? (
//           <p>
//             <input
//               value={userData.address.Line1}
//               onChange={(e) =>
//                 setUserData((prev) => ({
//                   ...prev,
//                   address,
//                   Line1: e.target.address.Line1,
//                 }))
//               }
//               type="text"
//             />
//             <br />
//             <input
//               value={userData.address.Line2}
//               onChange={(e) =>
//                 setUserData((prev) => ({
//                   ...prev,
//                   address,
//                   Line1: e.target.address.Line1,
//                 }))
//               }
//               type="text"
//             />
//           </p>
//         ) : (
//           <p>
//             {userData.address.Line1}
//             <br />
//             {userData.address.Line2}
//           </p>
//         )}
//       </div>
//       <div>
//         <p>BASIC INFORMATION</p>
//         <div>
//           <p>Gender:</p>
//           {editMode ? (
//             <select
//               value={userData.gender}
//               onChange={(e) =>
//                 setUserData((prev) => ({ ...prev, gender: e.target.value }))
//               }
//             >
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           ) : (
//             <p>{userData.gender}</p>
//           )}
//           <p>Birthday</p>
//           {editMode ? (
//             <input
//               value={userData.dob}
//               onChange={(e) =>
//                 setUserData((prev) => ({ ...prev, dob: e.target.value }))
//               }
//               type="date"
//             />
//           ) : (
//             <p>{userData.dob}</p>
//           )}
//         </div>

//         <div>
//           {
//             editMode 
//             ? <button  onClick={()=>setEditMode(false)}>Save Information</button>
//             : <button onClick={()=>setEditMode(true)} > Edit</button>
//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Myprofile;
