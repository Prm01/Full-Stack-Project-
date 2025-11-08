import express from "express";
import { registerUser, loginUser, getProfile ,updateProfile,bookAppointment, listAppointment,cancelAppointment,payemntRazorpay, verifyRazorpay} from "../controllers/UserController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile",upload.single('image'),authUser,updateProfile)
userRouter.post("/book-appointment",authUser,bookAppointment)
userRouter.get("/appointment",authUser,listAppointment)
userRouter.post("/cancel-appointment",authUser,cancelAppointment)
userRouter.post("/payment-razorpay",authUser,payemntRazorpay)
userRouter.post("/verifyRazorpay",authUser,verifyRazorpay)

export default userRouter;


// import express from "express"
// import { registerUser,loginUser, getProfile } from "../controllers/UserController.js"
// import authUser from "../middleware/authUser.js"

// const userRouter = express.Router()

// userRouter.post('/register', registerUser)
// userRouter.post('/login', loginUser)

// userRouter.get('/get-profile',authUser,getProfile)

// export default userRouter