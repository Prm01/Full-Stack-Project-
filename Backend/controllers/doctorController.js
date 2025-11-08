import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
    try {
       const { docId } = req.body;
       
       if (!docId) {
           return res.status(400).json({ 
               success: false, 
               message: 'Doctor ID is required' 
           });
       }
       
       const docData = await doctorModel.findById(docId);
       
       if (!docData) {
           return res.status(404).json({ 
               success: false, 
               message: 'Doctor not found' 
           });
       }
       
       await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
       res.json({ 
           success: true, 
           message: 'Availability Changed' 
       });
    } catch (error) {
         console.log(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

const doctorList = async (req, res) => {
   try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({
            success: true,
            doctors
        })

   } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
   }
}

// API for Doctors LOgin

const loginDoctor=async(req,res)=>{
    try{
  const {email,password}=req.body
   const doctor=await doctorModel.findOne({email})
   if(!doctor){
    return res.json({success:false,message:"Invaild Credentials"})

   }

   const isMatch=await bcrypt.compare(password,doctor.password)

   if(isMatch){
    const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)

    res.json({success:true,token})
   }
   else{
    res.json({success:false,message:"Invaild Credential"})

   }

    }
    catch(error){
         console.log(error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

//API to get doctor  appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    console.log('=== GET DOCTOR APPOINTMENTS ===');
    
    try {
        // ✅ CORRECT: Get doctorId from req object (set by auth middleware)
        const docId = req.doctorId;
        
        console.log('🔍 Doctor ID from auth middleware:', docId);
        console.log('🔍 Full req object keys:', Object.keys(req));
        console.log('🔍 req.doctorId directly:', req.doctorId);

        if (!docId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID not found. Authentication failed."
            });
        }

        // Verify doctor exists
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        console.log(`✅ Doctor found: ${doctor.name}`);

        // Get appointments for this doctor
        const appointments = await appointmentModel.find({ docId })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`✅ Found ${appointments.length} appointments for Dr. ${doctor.name}`);

        res.json({
            success: true,
            message: `Found ${appointments.length} appointments`,
            doctor: {
                name: doctor.name,
                speciality: doctor.speciality
            },
            appointments: appointments
        });

    } catch (error) {
        console.log('🔴 Error fetching doctor appointments:', error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch appointments: " + error.message 
        });
    }
}
// const appointmentsDoctor= async(req,res)=>{
//     try{
//     const {docId}=req.body
//     const appointments=await appointmentModel.find({docId})

//     res.json({success:true,appointments})


//     }
//     catch(error){
//          console.log(error);
//         res.status(500).json({ 
//             success: false, 
//             message: error.message 
//         });
//     }
// }

// api to mark appointment Completed for doctor panel
const appointmentComplete=async(req,res)=>{
    try{
     const {docId,appointmentId}=req.body

     const appointmentData=appointmentModel.findById(appointmentId)

     if(appointmentData && appointmentData.docId===docId){

        await appointmentModel.findByIdAndUpdate(appointmentId,{isComplete:true})
        return res.json({success:true,message:"Appointmnets Completed"})

     }
     else{
         return res.json({success:false,message:"Mark Failed"})
     }
    }
    catch(error){
  console.log(error)
  res.json({success:false,message:error.message
  })
    }
}
// api to cancel appointment for doctor pannel

const appointmentCancel=async(req,res)=>{
    try{
     const {docId,appointmentId}=req.body

     const appointmentData=appointmentModel.findById(appointmentId)

     if(appointmentData && appointmentData.docId===docId){

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        return res.json({success:true,message:"Appointmnets Cancelled"})

     }
     else{
         return res.json({success:false,message:"Cancelletion Failed"})
     }
    }
    catch(error){
  console.log(error)
  res.json({success:false,message:error.message
  })
    }
}

// api to get Dashboard data for doctor pannel

const doctorDashboard = async (req, res) => {
    try {
        // Get doctor ID from the authenticated token
        const docId = req.doctorId; // Assuming you set this in auth middleware
        
        const appointments = await appointmentModel.find({ docId })
        let earning = 0;

        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount || 0
            }
        })

        let patients = []
        appointments.forEach((item) => {
            if (item.userId && !patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString())
            }
        })

        const dashData = {
            earning,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 10)
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ 
            success: false, 
            message: error.message 
        })
    }
}

// const doctorDashboard=async(req,res)=>{

//     try{
   
//         const {docId}=req.body
//         const appointments=await appointmentModel.find({docId})
//         let  earning=0;

//         appointments.map((item,index)=>{
//             if(item.isCompleted || item.payment){
//                 earning+=item.amount
//             }
//         })

//         let patients=[]
//         appointments.map((item,index)=>{
//             if(!patients.includes(item.userId)){
//                 patients.push(item.userId)
//             }
//         })

//         const dashData={
//             earning,
//             appointments:appointments.length,
//             patients:patients.length,
//             latestAppointments:appointments.reverse().slice(0,10)
//         }

//         res.json({success:true,dashData})
//     }
//     catch(error){
// console.log(error)
//   res.json({success:false,message:error.message
//   })
//     }
// }

// api for doctor profile for doctor pannel

const doctorProfile = async (req, res) => {
    try {
        const docId = req.doctorId; // Direct assignment, not destructuring
        
        console.log('📋 Fetching profile for doctor:', docId);
        
        const profileData = await doctorModel.findById(docId).select(['-password','-email'])
        
        if (!profileData) {
            return res.json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }
        
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// const doctorProfile=async(req,res)=>{
//     try{
//      const docId =req.doctorId
//         const profileData=await doctorModel.findById(docId).select(['-password','-email'])
//         res.json({success:true,profileData})
//     }
//     catch(error){
//   console.log(error)
//   res.json({success:false,message:error.message
//   })
//     }

// }

// API to Update Doctor Profile for doctor pannel
const updateDoctorProfile=async(req,res)=>{
    try{
     const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,message:"Profile Updated"})
    }
    catch(error){
    console.log(error)
    res.json({success:false,message:error.message
    })
    }
}

export { changeAvailability, doctorList,loginDoctor,appointmentsDoctor ,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updateDoctorProfile};