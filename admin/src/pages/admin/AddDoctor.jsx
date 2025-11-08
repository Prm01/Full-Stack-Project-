import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContex";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!docImage) {
        toast.error("Please select a doctor image");
        setLoading(false);
        return;
      }

      const addressObj = {
        line1: address1,
        line2: address2,
      };

      const formData = new FormData();
      formData.append("image", docImage);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", Number(experience)); // Fix: must be Number
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("address", JSON.stringify(addressObj));

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            aToken: aToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImage(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1");
        setFees("");
        setAbout("");
        setSpeciality("General Physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add doctor. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text">
              Add New Doctor
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Register a new medical professional to your team
            </p>
          </div>

          <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6 sm:p-8">
              {/* Image Upload Section */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-linear-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-dashed border-blue-200 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
                    <label htmlFor="doc-img" className="cursor-pointer block">
                      <div className="w-40 h-40 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={
                            docImage
                              ? URL.createObjectURL(docImage)
                              : assets.upload_area
                          }
                          alt="Doctor preview"
                          className={`w-full h-full transition-all duration-300 ${
                            docImage
                              ? "object-cover scale-105"
                              : "object-contain p-6 opacity-70"
                          }`}
                        />
                      </div>
                      <input
                        onChange={(e) => setDocImage(e.target.files[0])}
                        type="file"
                        id="doc-img"
                        hidden
                        accept="image/*"
                      />
                      <div className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg mb-3 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg">
                        Upload Photo
                      </div>
                      <p className="text-gray-600 font-medium">
                        Doctor Profile Picture
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Supports: PNG, JPG, WEBP
                      </p>
                      <p className="text-xs text-gray-500">Max size: 5MB</p>
                    </label>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Form Status
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Image:</span>
                        <span
                          className={
                            docImage
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {docImage ? "✓ Added" : "✗ Required"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Details:</span>
                        <span
                          className={
                            name && email && password
                              ? "text-green-600 font-semibold"
                              : "text-yellow-600 font-semibold"
                          }
                        >
                          {name && email && password
                            ? "✓ Complete"
                            : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-3">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div className="bg-linear-to-r from-blue-50 to-transparent rounded-2xl p-6 border border-blue-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Doctor Name",
                          value: name,
                          onChange: setName,
                          type: "text",
                          placeholder: "Dr. John Smith",
                          section: "personal",
                        },
                        {
                          label: "Email Address",
                          value: email,
                          onChange: setEmail,
                          type: "email",
                          placeholder: "doctor@hospital.com",
                          section: "personal",
                        },
                        {
                          label: "Password",
                          value: password,
                          onChange: setPassword,
                          type: "password",
                          placeholder: "••••••••",
                          section: "personal",
                        },
                        {
                          label: "Consultation Fees",
                          value: fees,
                          onChange: setFees,
                          type: "number",
                          placeholder: "500",
                          section: "personal",
                        },
                      ].map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {field.label}
                          </label>
                          <input
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value}
                            type={field.type}
                            placeholder={field.placeholder}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-blue-300 placeholder-opacity-70"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="bg-linear-to-r from-green-50 to-transparent rounded-2xl p-6 border border-green-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Professional Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Experience
                        </label>
                        <select
                          onChange={(e) => setExperience(e.target.value)}
                          value={experience}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white text-gray-700"
                        >
                          {[...Array(9)].map((_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1} Year{i > 0 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Speciality
                        </label>
                        <select
                          onChange={(e) => setSpeciality(e.target.value)}
                          value={speciality}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white text-gray-700"
                        >
                          <option value="General physician">
                            General physician
                          </option>
                          <option value="Gynecologist">Gynecologist</option>
                          <option value="Dermatologist">Dermatologist</option>
                          <option value="Pediatricians">Pediatricians</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Gastroenterologist">
                            Gastroenterologist
                          </option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Education & Qualifications
                        </label>
                        <input
                          onChange={(e) => setDegree(e.target.value)}
                          value={degree}
                          type="text"
                          placeholder="MBBS, MD, MS, etc."
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white placeholder-green-300 placeholder-opacity-70"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-linear-to-r from-purple-50 to-transparent rounded-2xl p-6 border border-purple-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Address Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line 1
                        </label>
                        <input
                          onChange={(e) => setAddress1(e.target.value)}
                          value={address1}
                          type="text"
                          placeholder="Street address, P.O. box"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white placeholder-purple-300 placeholder-opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          onChange={(e) => setAddress2(e.target.value)}
                          value={address2}
                          type="text"
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white placeholder-purple-300 placeholder-opacity-70"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Doctor */}
                  <div className="bg-linear-to-r from-orange-50 to-transparent rounded-2xl p-6 border border-orange-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-5 h-5 text-orange-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Professional Bio
                    </h2>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        About Doctor
                      </label>
                      <textarea
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                        placeholder="Describe the doctor's expertise, achievements, specialties, and approach to patient care..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white resize-vertical placeholder-orange-300 placeholder-opacity-70"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding Doctor...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Add Doctor to System</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDoctor;

// import React ,{useContext, useState}from 'react'
// import { assets } from '../../assets/assets'
// import { AdminContext } from '../../context/AdminContex'

// const AddDoctor = () => {
//     const [docImage,setDocImage]=useState(false)
//   const [name,setName]=useState('')
//   const [email,setEmail]=useState('')
//   const [password,setPassword]=useState('')
//   const [experience,setExperience]=useState('1 Year')
//   const [fees,setFess]=useState('')
//   const [about,setAbout]=useState('')
//   const [Speaciality,setSpeaciality]=useState(' General Physician')
//   const [degree,setDegree]=useState('')
//   const [address1,setAddress1]=useState('')
//   const [address2,setAddress2]=useState('')

//   const {backendUrl,aToken}=useContext(AdminContext)

//   const onSubmitHander=async(event)=>{
//     event.preventDefault()
//   }
//   return (
//     <form>

//         <p>Add Doctor</p>
//         <div>
//             <div>
//                <label htmlFor="doc-img">
//                 <img src={docImage?URL.createObjectURL(docImage) :assets.upload_area} alt=""  />
//                 </label>
//                 <input onChange={(e)=>setDocImage(e.target.files[0])} type="file"  id="doc-img" hidden />
//                 <p>Upload Doctor <br />picture</p>
//             </div>

//             <div>

//                 <div>
//                     <div>
//                         <p>Your Name</p>
//                         <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Name' required />
//                     </div>
//                      <div>
//                         <p>Doctor Email</p>
//                         <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Doctor Email' required />
//                     </div>
//                      <div>
//                         <p>Doctor Password</p>
//                         <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
//                     </div>

//                      <div>
//                         <p>Experience</p>
//                        <select onChange={(e)=>setExperience(e.target.value)} value={experience} name="" id="">
//                         <option value="1 Year">1 Year</option>
//                         <option value="2 Year">2 Year</option>
//                         <option value="3 Year">3 Year</option>
//                         <option value="4 Year">4 Year</option>
//                         <option value="5 Year">5 Year</option>
//                         <option value="6 Year">6 Year</option>
//                         <option value="7 Year">7 Year</option>
//                         <option value="8 Year">8 Year</option>
//                         <option value="9 Year">9 Year</option>
//                        </select>
//                     </div>
//                     <div>
//                         <p>Fees</p>
//                         <input onChange={(e)=>setFess(e.target.value)} value={fees} type="number" placeholder='Your Fees' required />
//                     </div>

//                    <div>
//                     <div>
//                         <p>Speaciality</p>
//                         <select onChange={(e)=>setSpeaciality(e.target.value)} value={Speaciality} >
//                             <option value="General physician">General physician</option>
//                             <option value="Gynecologist">Gynecologist</option>
//                             <option value="Dermatologist">Dermatologist</option>
//                             <option value="Pediatricians">Pediatricians</option>
//                             <option value="Neurologist">Neurologist</option>
//                             <option value="Gastroenterologist">Gastroenterologist</option>
//                         </select>
//                     </div>
//                      <div>
//                         <p>Education</p>
//                         <input onChange={(e)=>setDegree(e.target.value)} value={degree} type="text" placeholder='Your Education' required />
//                     </div>
//                      <div>
//                         <p>Address</p>
//                         <input onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" placeholder='Your Address 1' required />
//                          <input onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" placeholder='Your Address 2' required />
//                     </div>

//                    </div>

//                 </div>

//                 <div>
//                         <p>About Doctor</p>
//                         <textarea onChange={(e)=>setAbout(e.target.value)} value={about} placeholder='write About Doctor'  rows={5}></textarea>
//                     </div>
//                 <button type='submit'>Add Doctor</button>
//             </div>
//         </div>
//     </form>
//   )
// }

// export default AddDoctor
