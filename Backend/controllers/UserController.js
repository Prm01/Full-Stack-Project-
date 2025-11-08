import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
const cloud = cloudinary.v2;
import razorpay from "razorpay";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a stronger password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for userLogin

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Does not exits" });
    }

    const ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get user profile data

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//APi to updates user profile

// const updateProfile=async(req,res)=>{

//     try{

//           const {userId,name,phone,dob,address,gender}=req.body
//           const imageFile=req.file

//           if(!name ||!phone ||!gender ||!dob){
//             return res.json({success:false, message:"Data Missing"})
//  }

//        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

//        if(imageFile){
//         //upload image to cloudinary
//         const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
//         const imageUrl=imageUpload.secure_url
//         await userModel.findByIdAndUpdate(userId,{image:imageUrl})

//        }
//        res.json({success:true,message:"profile Updated"})

//     }
//     catch(error){
//          console.log(error);
//         res.json({ success: false, message: error.message });
//     }

// }
// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, dob, address, gender } = req.body;
    const imageFile = req.file;
    const userId = req.userId; // Get userId from auth middleware

    if (!name || !phone || !gender || !dob) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = {
      name,
      phone,
      dob,
      gender,
    };

    // Parse address if it's a string
    if (address) {
      try {
        updateData.address =
          typeof address === "string" ? JSON.parse(address) : address;
      } catch (parseError) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
          folder: "user-profiles", // Optional: organize in folder
        });
        updateData.image = imageUpload.secure_url;

        // Delete local file after upload
        const fs = await import("fs");
        fs.unlinkSync(imageFile.path);
      } catch (uploadError) {
        console.log("Cloudinary upload error:", uploadError);
        return res.json({ success: false, message: "Image upload failed" });
      }
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    res.json({
      success: true,
      message: "Profile Updated",
      user: await userModel.findById(userId).select("-password"),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to book appoitnment
const bookAppointment = async (req, res) => {
  console.log("=== BOOK APPOINTMENT STARTED ===");

  try {
    // Check if auth middleware is working
    console.log("User ID from auth:", req.userId);
    console.log("Request body:", req.body);

    if (!req.userId) {
      console.log("ERROR: No userId from auth middleware");
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Please login again.",
      });
    }

    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    // Validate input
    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: doctor, date, or time",
      });
    }

    console.log("Processing booking for user:", userId);

    // Check doctor exists and is available
    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    console.log("Doctor found:", docData.name);

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor is not currently available for appointments",
      });
    }

    // Check user exists
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User found:", userData.name);

    // Check slot availability
    const slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.json({
        success: false,
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    console.log("Slot is available, creating appointment...");

    // Create appointment - PROVIDE REQUIRED FIELDS
    const appointmentData = {
      userId,
      docId,
      userData: {
        // Provide required userData
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image: userData.image,
      },
      docData: {
        // Provide required docData
        name: docData.name,
        email: docData.email,
        speciality: docData.speciality,
        degree: docData.degree,
        experience: docData.experience,
        fees: docData.fees,
        image: docData.image,
        about: docData.about,
      },
      amount: docData.fees,
      slotTime,
      slotDate,
      date: new Date(),
    };

    console.log("Appointment data:", appointmentData);

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    console.log("Appointment created:", newAppointment._id);

    // Update doctor's booked slots
    const updatedSlots = { ...slots_booked };
    if (!updatedSlots[slotDate]) {
      updatedSlots[slotDate] = [];
    }
    updatedSlots[slotDate].push(slotTime);

    await doctorModel.findByIdAndUpdate(docId, {
      slots_booked: updatedSlots,
    });

    console.log("Doctor slots updated successfully");

    res.json({
      success: true,
      message: "Appointment booked successfully!",
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    console.log("🔴 BACKEND ERROR:", error);
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);

    res.status(500).json({
      success: false,
      message: "Booking failed: " + error.message,
    });
  }
};
//  const bookAppointment=async(req,res)=>{
//     try{
//          const {userId,docId,slotDate,slotTime}=req.body

//          const docData=await doctorModel.findById(docId).select('-password')

//          if(!docData.available){
//             return res.json({success:false,message:'Doctor not Available'})

//          }
//        let slots_booked=docData.slots_booked
//        // checking for slot availability

//        if(slots_booked[slotDate]){
//         if(slots_booked[slotDate].includes(slotTime)){
//             return res.json({success:false,message:'Doctor not Available'})
//         }
//         else{
//             slots_booked[slotDate].push(slotTime)
//         }

//        }
//        else{
//         slots_booked[slotDate]=[]
//         slots_booked[slotDate].push(slotTime)
//        }

//        const userData=await userModel.findById(userId).select('-password')
//        delete docData.slots_booked

//        appointmentData={
//         userId,
//         docId,
//         userData,
//         docData,
//         amount:docData.fees,
//         slotTime,
//         slotDate,
//         date:Date.now()
//        }

//        const newAppointment= new appointmentModel(appointmentData)
//        await newAppointment.save()

//        // save new slots data in doctor Data
//        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

//        res.json({success:true,message:'appointment Booked'})

//     }

//     catch(error){
//       console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
//  }

// api to get user  appointment for frontend my-appoinmtment page

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.userId;
    const appointment = await appointmentModel.find(userId);
    res.json({ success: true, appointment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to cancle appointments

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // Validate input
    if (!userId || !appointmentId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Appointment ID are required",
      });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    // Check if appointment exists
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify appointment user
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Action",
      });
    }

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
      status: "cancelled", // Add status field for better tracking
    });

    // Releasing the doctor slots
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (!doctorData) {
      console.log("Doctor not found for ID:", docId);
      return res.json({
        success: true,
        message: "Appointment cancelled but doctor data not found",
      });
    }

    let slots_booked = doctorData.slots_booked || {};

    // Check if the slot date exists and has the time slot
    if (slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );

      // Update doctor's slots
      await doctorModel.findByIdAndUpdate(
        docId,
        { slots_booked },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.log("Cancellation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const cancleAppointment=async(req,res)=>{
//     try{
//         const {userId,appointmentId}=req.body
//         const appointmentData=await appointmentModel.findById(appointmentId)
//         //very appointment user
//         if(appointmentData.userId!==userId){
//             return res.json({success:false,message:"unauthorize Action"})

//         }

//         await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
//         //releasing the doctor slots
//         const {docId,slotDate,slotTime}=appointmentData
//         const doctorData=await doctorModel.findById(docId)

//         let slots_booked=doctorData.slots_booked
//         slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e!==slotTime)
//         await doctorModel.findById(docId,{slots_booked})
//         res.json({success:true,message:"appointment Cancelled"})

//     }
//     catch(error){
//           console.log(error)
//         res.json({success:false,message:error.message})
//     }
// }

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// api to make of appointment using razorpay

const payemntRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    // creating option for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };
    //creation of an order
    const order = await razorpayInstance.orders.create(options);
    {
      res.json({ success: true, order });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to verify the payment of razorpay

const verifyRazorpay=async(req,res)=>{


  try{
    const {razorpay_order_id}=req.body
    const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
    // console.log(orderInfo)

    if(orderInfo.status==='paid'){
   await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
   res.json({success:true,message:"payment Successful"})

    }
    else{
       res.json({success:false,message:"payment failed"})
    }

  }
  catch(error){
console.log(error);
    res.json({ success: false, message: error.message });

  }
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  payemntRazorpay,
  verifyRazorpay
};

// import validator from 'validator'
// import bcrypt from 'bcrypt'
// import userModel from '../models/userModel.js'
// import jwt from 'jsonwebtoken'

// //api to register user

// const registerUser=async(req,res)=>{
//     try{
//         const {name,email,password}=req.body

//         if(!name || !password ||!email){
//             return res.json({success:false,message:"missing details"})

//         }

//        // validating email format
//         if(!validator.isEmail(email)){
//             return res.json({success:false,message:"enter a Valid Email"})
//         }
//         //validating a strong password
//         if(password.length<8){
//             return res.json({success:false,message:"entre a strong Password"})
//         }
//     //hashing the user passwords

//     const salt=await bcrypt.genSalt()

//    const hashedPassword=await bcrypt.hash(password,salt)

//    const userData=
//    {
//     name,
//     email,
//     password:hashedPassword
//    }

//    const newUser= new userModel{userData}
//    const user=await newUser.save()

//    const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
//    res.json({success:true,token})

//     }
//     catch(error){
//         console.log(error)
//         res.json({success:false,message:error.message})

//     }
// }

// export {registerUser}
