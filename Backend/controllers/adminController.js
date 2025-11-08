import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

        console.log('📝 Add Doctor Request:', {
            name, email, speciality, degree, experience, about, fees, address
        });
        console.log('🖼️ Uploaded file:', req.file);

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Doctor image is required" });
        }

        // Validate required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            // Delete uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Check if doctor already exists
        const exists = await doctorModel.findOne({ email });
        if (exists) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Parse address if it's a string
        let parsedAddress;
        try {
            parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        } catch (parseError) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        // Upload image to Cloudinary
        let cloudinaryResult;
        try {
            console.log('☁️ Uploading to Cloudinary...');
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'doctors',
                resource_type: 'image',
                transformation: [
                    { width: 500, height: 500, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'webp' }
                ]
            });
            console.log('✅ Cloudinary upload successful:', cloudinaryResult.secure_url);
        } catch (uploadError) {
            console.log('❌ Cloudinary upload failed:', uploadError);
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }

        // Delete local file after successful Cloudinary upload
        try {
            fs.unlinkSync(req.file.path);
            console.log('🗑️ Local file deleted after Cloudinary upload');
        } catch (unlinkError) {
            console.log('⚠️ Could not delete local file:', unlinkError);
        }

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: cloudinaryResult.secure_url, // Store Cloudinary URL
            speciality,
            degree,
            experience: Number(experience),
            about,
            fees: Number(fees),
            address: parsedAddress,
            available: true,
            date: new Date(),
            cloudinary_public_id: cloudinaryResult.public_id // Store public_id for future operations
        };

        console.log('💾 Saving doctor data with Cloudinary URL:', doctorData.image);

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        console.log('✅ Doctor saved successfully with Cloudinary image');

        res.status(201).json({ 
            success: true, 
            message: "Doctor added successfully", 
            doctor: {
                id: newDoctor._id,
                name: newDoctor.name,
                email: newDoctor.email,
                speciality: newDoctor.speciality,
                image: newDoctor.image
            }
        });

    } catch (error) {
        console.log('❌ Error adding doctor:', error);
        
        // Delete uploaded file if error occurs
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
                console.log('🗑️ Deleted uploaded file due to error');
            } catch (unlinkError) {
                console.log('Error deleting uploaded file:', unlinkError);
            }
        }
        
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
};

// API for admin Login
const loginAdmin = async (req, res) => {
    console.log("==== ADMIN LOGIN API HIT ====");

    try {
        const { email, password } = req.body;
        console.log("Admin Login Body:", req.body);

        if (!email || !password) {
            console.log("Validation Failed: Missing Fields");
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const tokenPayload = {
                email: email,
                role: "admin",
                timestamp: Date.now()
            };

            console.log("Generating JWT Token");
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "24h" });

            return res.json({
                success: true,
                token: token,
                message: "Admin login successful"
            });
        }

        console.log("Invalid Admin Credentials");
        res.status(401).json({
            success: false,
            message: "Invalid admin credentials"
        });

    } catch (error) {
        console.log("Admin Login Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// API for getting all doctors for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        console.log('👨‍⚕️ Doctors found:', doctors.length);
        
        // Log image info for each doctor
        doctors.forEach((doctor, index) => {
            console.log(`Doctor ${index + 1}:`, {
                name: doctor.name,
                image: doctor.image,
                isCloudinaryURL: doctor.image?.includes('cloudinary'),
                available: doctor.available
            });
        });
        
        res.json({ 
            success: true, 
            doctors 
        });
    } catch (error) {
        console.log('❌ Error fetching doctors:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
}

// api to get all appointment list

const appointmentsAdmin=async(req,res)=>{
    try{
     const appointments=await appointmentModel.find({})
     res.json({success:true,appointments})

    }
    catch(error){
        console.log(error)
          res.json({success:false,message:error.message})
        

    }
}

// API for appopintment Cancelled
// const appointmentCancel= async (req, res) => {
//   try {
//     const {appointmentId } = req.body;

//     // Validate input
//     if (!userId || !appointmentId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID and Appointment ID are required",
//       });
//     }

//     const appointmentData = await appointmentModel.findById(appointmentId);

//     // Check if appointment exists
//     if (!appointmentData) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     // Verify appointment user
//     // if (appointmentData.userId.toString() !== userId.toString()) {
//     //   return res.status(403).json({
//     //     success: false,
//     //     message: "Unauthorized Action",
//     //   });
//     // }

//     // Check if already cancelled
//     if (appointmentData.cancelled) {
//       return res.json({
//         success: false,
//         message: "Appointment is already cancelled",
//       });
//     }

//     // Update appointment status
//     await appointmentModel.findByIdAndUpdate(appointmentId, {
//       cancelled: true,
//       status: "cancelled", // Add status field for better tracking
//     });

//     // Releasing the doctor slots
//     const { docId, slotDate, slotTime } = appointmentData;
//     const doctorData = await doctorModel.findById(docId);

//     if (!doctorData) {
//       console.log("Doctor not found for ID:", docId);
//       return res.json({
//         success: true,
//         message: "Appointment cancelled but doctor data not found",
//       });
//     }

//     let slots_booked = doctorData.slots_booked || {};

//     // Check if the slot date exists and has the time slot
//     if (slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
//       slots_booked[slotDate] = slots_booked[slotDate].filter(
//         (e) => e !== slotTime
//       );

//       // Update doctor's slots
//       await doctorModel.findByIdAndUpdate(
//         docId,
//         { slots_booked },
//         { new: true }
//       );
//     }

//     res.json({
//       success: true,
//       message: "Appointment cancelled successfully",
//     });
//   } catch (error) {
//     console.log("Cancellation error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
const appointmentCancel = async (req, res) => {
    console.log('=== ADMIN CANCELLING APPOINTMENT ===');
    console.log('Request body:', req.body);
    console.log('Admin ID from auth:', req.adminId); // From admin auth middleware

    try {
        const { appointmentId } = req.body;

        // ✅ REMOVE userId validation - admin doesn't need to provide userId
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        console.log('🔍 Finding appointment:', appointmentId);
        const appointmentData = await appointmentModel.findById(appointmentId);

        // Check if appointment exists
        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        console.log('📋 Appointment found for:', appointmentData.userData?.name);

        // ✅ REMOVE user verification - admin can cancel any appointment
        // if (appointmentData.userId.toString() !== userId.toString()) {
        //   return res.status(403).json({
        //     success: false,
        //     message: "Unauthorized Action",
        //   });
        // }

        // Check if already cancelled
        if (appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment is already cancelled",
            });
        }

        // Update appointment status
        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
            status: "cancelled",
            cancelledBy: 'admin', // Track who cancelled it
            cancelledAt: new Date()
        });

        console.log('✅ Appointment marked as cancelled');

        // Releasing the doctor slots
        const { docId, slotDate, slotTime } = appointmentData;
        console.log('🔄 Freeing doctor slot:', { docId, slotDate, slotTime });

        const doctorData = await doctorModel.findById(docId);

        if (!doctorData) {
            console.log("⚠️ Doctor not found for ID:", docId);
            return res.json({
                success: true,
                message: "Appointment cancelled but doctor data not found",
            });
        }

        let slots_booked = doctorData.slots_booked || {};

        // Check if the slot date exists and has the time slot
        if (slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
            // Remove the cancelled time slot
            slots_booked[slotDate] = slots_booked[slotDate].filter(
                (e) => e !== slotTime
            );

            // Remove the date entry if no slots left
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }

            // Update doctor's slots
            await doctorModel.findByIdAndUpdate(
                docId,
                { slots_booked },
                { new: true }
            );
            
            console.log('✅ Doctor slot freed successfully');
        } else {
            console.log('⚠️ Slot not found in doctor booked slots');
        }

        res.json({
            success: true,
            message: "Appointment cancelled successfully",
        });
    } catch (error) {
        console.log("🔴 Cancellation error:", error);
        console.log("Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// api for completed appointment by admin

const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body; // Remove docId from here
        
        console.log('✅ Admin completing appointment:', appointmentId);

        // Find the appointment
        const appointmentData = await appointmentModel.findById(appointmentId);

        // Verify appointment exists
        if (!appointmentData) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        console.log(`✅ Appointment found for ID: ${appointmentId}`);

        // For admin, no need to verify doctor - admin can complete any appointment
        // Remove this doctor verification check for admin
        
        // Mark appointment as completed
        appointmentData.isCompleted = true; // Use isCompleted field instead of status
        await appointmentData.save();

        console.log(`✅ Appointment marked as completed for ID: ${appointmentId}`);
        
        res.json({
            success: true,
            message: "Appointment marked as completed successfully"
        });

    } catch (error) {
        console.log('🔴 Completion error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// API to get Dashboard data for admin panel

const adminDashboard=async(req,res)=>{
    try{
    
          const doctors= await doctorModel.find({})
          const users=await  userModel.find({})
          const appointments=await appointmentModel.find({})

          const dashData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)

          }

          res.json({success:true,dashData})
    }
    catch(error){
          console.log("🔴 Cancellation error:", error);
        console.log("Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export { addDoctor, loginAdmin, allDoctors ,appointmentsAdmin,appointmentCancel,adminDashboard,appointmentComplete};







// import validator from "validator";
// import bcrypt from "bcrypt";
// import doctorModel from "../models/doctorModel.js";
// import jwt from "jsonwebtoken";
// import fs from "fs";
// import path from "path";


// // API for adding doctor
// const addDoctor = async (req, res) => {
//     try {
//         const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;

//         console.log('📝 Add Doctor Request:', {
//             name, email, speciality, degree, experience, about, fees, address
//         });
//         console.log('🖼️ Uploaded file:', req.file);

//         // Check if image was uploaded
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: "Doctor image is required" });
//         }

//         // Validate required fields
//         if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//             // Delete uploaded file if validation fails
//             if (req.file) {
//                 fs.unlinkSync(req.file.path);
//             }
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         // Validate email format
//         if (!validator.isEmail(email)) {
//             fs.unlinkSync(req.file.path);
//             return res.status(400).json({ success: false, message: "Please enter a valid email" });
//         }

//         // Check if doctor already exists
//         const exists = await doctorModel.findOne({ email });
//         if (exists) {
//             fs.unlinkSync(req.file.path);
//             return res.status(400).json({ success: false, message: "Email already exists" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Parse address if it's a string
//         let parsedAddress;
//         try {
//             parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
//         } catch (parseError) {
//             fs.unlinkSync(req.file.path);
//             return res.status(400).json({ success: false, message: "Invalid address format" });
//         }

//         const doctorData = {
//             name,
//             email,
//             password: hashedPassword,
//             image: req.file.filename, // Use the filename with extension from multer
//             speciality,
//             degree,
//             experience: Number(experience),
//             about,
//             fees: Number(fees),
//             address: parsedAddress,
//             available: true,
//             date: new Date()
//         };

//         console.log('💾 Saving doctor data with image:', doctorData.image);

//         const newDoctor = new doctorModel(doctorData);
//         await newDoctor.save();

//         console.log('✅ Doctor saved successfully with image:', newDoctor.image);

//         res.status(201).json({ 
//             success: true, 
//             message: "Doctor added successfully", 
//             doctor: {
//                 id: newDoctor._id,
//                 name: newDoctor.name,
//                 email: newDoctor.email,
//                 speciality: newDoctor.speciality,
//                 image: newDoctor.image
//             }
//         });

//     } catch (error) {
//         console.log('❌ Error adding doctor:', error);
        
//         // Delete uploaded file if error occurs
//         if (req.file) {
//             try {
//                 fs.unlinkSync(req.file.path);
//             } catch (unlinkError) {
//                 console.log('Error deleting uploaded file:', unlinkError);
//             }
//         }
        
//         res.status(500).json({ 
//             success: false, 
//             message: error.message || "Internal server error" 
//         });
//     }
// };

// // API for admin Login
// const loginAdmin = async (req, res) => {
//     console.log("==== ADMIN LOGIN API HIT ====");

//     try {
//         const { email, password } = req.body;
//         console.log("Admin Login Body:", req.body);

//         if (!email || !password) {
//             console.log("Validation Failed: Missing Fields");
//             return res.status(400).json({ success: false, message: "Email and password are required" });
//         }

//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             const tokenPayload = {
//                 email: email,
//                 role: "admin",
//                 timestamp: Date.now()
//             };

//             console.log("Generating JWT Token");
//             const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "24h" });

//             return res.json({
//                 success: true,
//                 token: token,
//                 message: "Admin login successful"
//             });
//         }

//         console.log("Invalid Admin Credentials");
//         res.status(401).json({
//             success: false,
//             message: "Invalid admin credentials"
//         });

//     } catch (error) {
//         console.log("Admin Login Error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message || "Internal server error"
//         });
//     }
// };

// // API for getting all doctors for admin panel
// const allDoctors = async (req, res) => {
//     try {
//         const doctors = await doctorModel.find({});
//         console.log('👨‍⚕️ Doctors found:', doctors.length);
        
//         // Log image info for each doctor
//         doctors.forEach((doctor, index) => {
//             console.log(`Doctor ${index + 1}:`, {
//                 name: doctor.name,
//                 image: doctor.image,
//                 available: doctor.available,
//                 hasImageField: 'image' in doctor
//             });
//         });
        
//         res.json({ 
//             success: true, 
//             doctors 
//         });
//     } catch (error) {
//         console.log('❌ Error fetching doctors:', error);
//         res.status(500).json({ 
//             success: false, 
//             message: error.message || "Internal server error" 
//         });
//     }
// }

// export { addDoctor, loginAdmin, allDoctors };