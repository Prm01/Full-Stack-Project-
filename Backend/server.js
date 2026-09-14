import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/UserRoute.js';



const app=express();
const port=process.env.PORT || 4000;
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map((url) => url.trim()) : true
}));

// api endpoints

app.use('/api/admin',adminRouter);
// localhost :4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter);


app.get('/',(req,res)=>{
    res.send('API is Working....');

})
app.get('/health',(req,res)=>{
    res.json({ success: true, message: 'API is healthy' });
})
// Static folder for images
app.use('/uploads', express.static('uploads'));


// listen server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(`Server startup failed: ${error.message}`);
        process.exit(1);
    }
};

startServer();

