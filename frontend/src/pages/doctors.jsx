import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/Appcontex'
import { useNavigate } from 'react-router-dom'

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate();
  
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }
  
  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {speciality ? `${speciality} Doctors` : 'All Doctors'}
          </h1>
          <p className="text-lg text-gray-600">
            Browse through the doctors specialist.
          </p>
        </div>

        {/* Speciality Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Specialities</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <p onClick={()=>speciality==='General physician' ?navigate('/doctors'):navigate('/doctors/General physician')} className={`px-6 py-3 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 transition-colors duration-300 font-medium${speciality===" General physician "? "bg-indigo-100 text-black" : " "}` }>
              General physician
            </p>
            <p onClick={()=>speciality==='Gynecologist' ?navigate('/doctors'):navigate('/doctors/Gynecologist')} className={`px-6 py-3 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 transition-colors duration-300 font-medium${speciality==="Gynecologist "? "bg-indigo-100 text-black" : " "}`}>
              Gynecologist
            </p>
            <p onClick={()=>speciality==='Dermatologist ' ?navigate('/doctors'):navigate('/doctors/Dermatologist')} className={`px-6 py-3 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 transition-colors duration-300 font-medium${speciality==="Dermatologist "? "bg-indigo-100 text-black" : " "}`}>
              Dermatologist
            </p>
            <p onClick={()=>speciality==='Pediatricians ' ?navigate('/doctors'):navigate('/doctors/Pediatricians')} className={`px-6 py-3 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 transition-colors duration-300 font-medium${speciality==="Pediatricians "? "bg-indigo-100 text-black" : " "}`}>
              Pediatricians
            </p>
            <p onClick={()=>speciality==='Neurologist ' ?navigate('/doctors'):navigate('/doctors/Neurologist')} className={`px-6 py-3 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 transition-colors duration-300 font-medium${speciality==="Neurologist "? "bg-indigo-100 text-black" : " "}`}>
              Neurologist
            </p>
            <p onClick={()=>speciality==='Gastroenterologist' ?navigate('/doctors'):navigate('/doctors/Gastroenterologist')} className={`px-6 py-3 bg-teal-500 text-white rounded-full cursor-pointer hover:bg-teal-600 transition-colors duration-300 font-medium${speciality==="Gastroenterologist"? "bg-indigo-100 text-black" : " "}`}>
              Gastroenterologist
            </p>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filterDoc.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group cursor-pointer"
            >
              {/* Doctor Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Available
                  </span>
                </div>
              </div>

              {/* Doctor Info */}
              <div onClick={() => navigate(`/appointment/${item._id}`)} className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-teal-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{item.speciality}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(124)</span>
                </div>

                {/* Experience */}
                <div className="text-sm text-gray-500">
                  <span>⭐ 5+ years experience</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filterDoc.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found for this speciality.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors

// import React, { useContext, useState,useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import { AppContext } from '../context/Appcontex'
// import { useNavigate } from 'react-router-dom'

// const doctors = () => {
//   const {speciality} = useParams();
//   const {doctors}=useContext(AppContext);
//   const [filterDoc, setFilterDoc] = useState([])
//   const navigate = useNavigate();
//    const applyFilter=()=>{
//           if(speciality){
//               setFilterDoc(doctors.filter(doc=>doc.speciality===speciality))
//           }
//           else{
//               setFilterDoc(doctors)
//           }
//       }
//     useEffect(()=>{
//   applyFilter()
//     },[doctors,speciality])
//   return (
//     <div>
//       <p>Browse through the doctors specialist.</p>
//       <div>
//         <div>
//           <p>General physician</p>
//           <p>Gynecologist</p>
//           <p>Dermatologist</p>
//           <p>Pediatricians</p>
//           <p>Neurologist</p>
//           <p>Gastroenterologist</p>
//         </div>
//       </div>
//       <div>
//           {filterDoc.map((item, index) => (
//             <div 
//               key={index}
//               className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
//             >
//               {/* Doctor Image */}
//               <div className="relative overflow-hidden">
//                 <img 
//                   src={item.image} 
//                   alt={item.name} 
//                   className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
                
//                 {/* Availability Badge */}
//                 <div className="absolute top-3 right-3">
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
//                     <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
//                     Available
//                   </span>
//                 </div>
//               </div>

//               {/* Doctor Info */}
//               <div onClick={()=>navigate(`/appointment/${item._id}`)} className="p-4">
//                 <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-teal-600 transition-colors duration-300">
//                   {item.name}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-3">{item.speciality}</p>
                
//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <svg 
//                         key={i}
//                         className="w-4 h-4 text-yellow-400"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
//                       </svg>
//                     ))}
//                   </div>
//                   <span className="text-sm text-gray-500">(124)</span>
//                 </div>

//                 {/* Experience */}
//                 <div className="text-sm text-gray-500">
//                   <span>⭐ 5+ years experience</span>
//                 </div>
//               </div>
//             </div>
//           ))}

//       </div>
//     </div>
//   )
// }

// export default doctors
