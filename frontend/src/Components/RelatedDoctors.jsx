import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/Appcontex'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const [relatedDoctors, setRelatedDoctors] = useState([])
    const navigate = useNavigate()
    
    useEffect(() => {
        if (doctors.length > 0) {
            const related = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelatedDoctors(related)
        }
    }, [doctors, speciality, docId])

    const handleBookAppointment = (doctorId) => {
        navigate(`/appointment/${doctorId}`)
        window.scrollTo(0, 0)
    }

    const handleViewMoreDoctors = () => {
        navigate('/doctors')
        window.scrollTo(0, 0)
    }

    return (
        <div className="bg-white py-12 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-left mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-teal-500 rounded-full"></div>
                        <h2 className="text-2xl lg:text-2xl font-bold text-gray-900">
                            You May Also Like
                        </h2>
                    </div>
                    <p className="text-gray-600 text-base">
                        Other {speciality} specialists with similar expertise
                    </p>
                </div>

                {/* Horizontal Scroll Container for Desktop */}
                <div className="hidden lg:flex gap-6 overflow-x-auto pb-6 mb-6 scrollbar-hide">
                    {relatedDoctors.slice(0, 5).map((item, index) => (
                        <div 
                            key={item._id || index}
                            className="flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-200 hover:border-teal-300 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <div className="flex p-5">
                                {/* Doctor Image */}
                                <div className="flex-shrink-0 mr-4">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-20 h-20 rounded-xl object-cover border-2 border-gray-100"
                                    />
                                </div>

                                {/* Doctor Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-teal-600 text-sm font-medium">{item.speciality}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                                            Available
                                        </span>
                                    </div>
                                    
                                    {/* Rating and Experience */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span>4.8</span>
                                            <span className="text-gray-400">(124)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⭐</span>
                                            <span>{item.experience || '5+'}+ yrs</span>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button 
                                        onClick={() => handleBookAppointment(item._id)}
                                        className="w-full bg-white border border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white py-2 rounded-lg font-medium text-sm transition-all duration-300"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Layout for Mobile & Tablet */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {relatedDoctors.slice(0, 4).map((item, index) => (
                        <div 
                            key={item._id || index}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-teal-300 transition-all duration-300"
                        >
                            <div className="flex items-start space-x-3">
                                {/* Doctor Image */}
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                />
                                
                                {/* Doctor Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-base mb-1 leading-tight">
                                        {item.name}
                                    </h3>
                                    <p className="text-teal-600 text-xs font-medium mb-2">{item.speciality}</p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span>4.8</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⭐</span>
                                            <span>{item.experience || '5+'}+ yrs</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                                            Available
                                        </span>
                                        <button 
                                            onClick={() => handleBookAppointment(item._id)}
                                            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-300"
                                        >
                                            Book
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {relatedDoctors.length === 0 && (
                    <div className="text-center py-8">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Related Doctors</h3>
                            <p className="text-gray-600 text-sm mb-4">No other doctors found in this speciality.</p>
                        </div>
                    </div>
                )}

                {/* View More Button */}
                {relatedDoctors.length > 0 && (
                    <div className="text-center">
                        <button 
                            onClick={handleViewMoreDoctors}
                            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors duration-300 border border-teal-200 hover:border-teal-300 px-6 py-2.5 rounded-lg"
                        >
                            <span>Browse All Doctors</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RelatedDoctors