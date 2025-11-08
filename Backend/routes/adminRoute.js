import express from 'express';
import { changeAvailability } from '../controllers/doctorController.js'
import { addDoctor, allDoctors, loginAdmin,appointmentsAdmin, appointmentCancel, adminDashboard,appointmentComplete } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

// Simple routes - no image serving needed since we use Cloudinary URLs directly
adminRouter.post("/add-doctor", upload.single("image"), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors', allDoctors);
adminRouter.post('/change-availability', changeAvailability);
adminRouter.get("/appointments",appointmentsAdmin);
adminRouter.post("/cancel-appointment",appointmentCancel)

adminRouter.post("/complete-appointment",appointmentComplete)
adminRouter.get("/dashboard",adminDashboard)



export default adminRouter;




// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';

// import { changeAvailability } from '../controllers/doctorController.js'
// import { addDoctor, allDoctors, loginAdmin } from '../controllers/adminController.js';
// import upload from '../middleware/multer.js';
// import doctorModel from '../models/doctorModel.js';

// const adminRouter = express.Router();

// // Get current directory for file paths
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Debug route to check uploads and database
// adminRouter.get('/debug-images', async (req, res) => {
//     try {
//         const uploadsDir = path.join(process.cwd(), 'uploads');
//         const doctors = await doctorModel.find({});
        
//         const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
        
//         const doctorInfo = doctors.map(doctor => {
//             const matchingFiles = files.filter(file => file === doctor.image);
            
//             return {
//                 name: doctor.name,
//                 imageInDB: doctor.image,
//                 hasExtension: path.extname(doctor.image || ''),
//                 matchingFiles: matchingFiles,
//                 fileExists: matchingFiles.length > 0
//             };
//         });

//         res.json({
//             success: true,
//             uploadsDirectory: uploadsDir,
//             totalDoctors: doctors.length,
//             totalFiles: files.length,
//             files: files,
//             doctors: doctorInfo
//         });
//     } catch (error) {
//         console.error('Debug error:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Fix image extensions in database
// adminRouter.get('/fix-image-data', async (req, res) => {
//     try {
//         const uploadsDir = path.join(process.cwd(), 'uploads');
//         const doctors = await doctorModel.find({});
//         const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
        
//         let fixedCount = 0;
//         const results = [];
        
//         for (const doctor of doctors) {
//             if (doctor.image) {
//                 // Find exact filename match
//                 const exactMatch = files.find(file => file === doctor.image);
                
//                 if (exactMatch) {
//                     // Already correct, no need to update
//                     results.push({
//                         doctor: doctor.name,
//                         image: doctor.image,
//                         status: 'already correct'
//                     });
//                 } else {
//                     // Try to find any file that might match
//                     const possibleMatches = files.filter(file => {
//                         // Remove extension for comparison
//                         const fileWithoutExt = path.parse(file).name;
//                         return fileWithoutExt === doctor.image;
//                     });
                    
//                     if (possibleMatches.length > 0) {
//                         // Update to the correct filename with extension
//                         await doctorModel.findByIdAndUpdate(doctor._id, {
//                             image: possibleMatches[0]
//                         });
//                         fixedCount++;
//                         results.push({
//                             doctor: doctor.name,
//                             old: doctor.image,
//                             new: possibleMatches[0],
//                             status: 'fixed'
//                         });
//                     } else {
//                         results.push({
//                             doctor: doctor.name,
//                             image: doctor.image,
//                             status: 'no matching file found'
//                         });
//                     }
//                 }
//             }
//         }
        
//         res.json({
//             success: true,
//             message: `Fixed ${fixedCount} doctor images`,
//             fixedCount,
//             results
//         });
        
//     } catch (error) {
//         console.error('Fix error:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// // Enhanced image serving route
// adminRouter.get('/images/:filename', (req, res) => {
//     try {
//         const { filename } = req.params;
//         const uploadsDir = path.join(process.cwd(), 'uploads');
        
//         console.log('🖼️ Requested image:', filename);
        
//         if (!fs.existsSync(uploadsDir)) {
//             return res.status(404).json({ success: false, message: 'Uploads directory not found' });
//         }
        
//         const files = fs.readdirSync(uploadsDir);
//         console.log('📁 Available files:', files);
        
//         // Strategy 1: Exact filename match
//         let actualFile = files.find(file => file === filename);
//         if (actualFile) {
//             console.log('✅ Exact match found:', actualFile);
//             return serveImageFile(path.join(uploadsDir, actualFile), actualFile, res);
//         }
        
//         // Strategy 2: Match by filename without extension
//         const requestedWithoutExt = path.parse(filename).name;
//         actualFile = files.find(file => path.parse(file).name === requestedWithoutExt);
//         if (actualFile) {
//             console.log('✅ Match by name found:', actualFile);
//             return serveImageFile(path.join(uploadsDir, actualFile), actualFile, res);
//         }
        
//         // If no match found
//         console.log('❌ No matching file found');
//         return res.status(404).json({
//             success: false,
//             message: 'Image not found',
//             requested: filename,
//             availableFiles: files
//         });
        
//     } catch (error) {
//         console.error('❌ Error serving image:', error);
//         res.status(500).json({ success: false, message: 'Error serving image' });
//     }
// });

// // Helper function to serve image files
// function serveImageFile(imagePath, filename, res) {
//     try {
//         // Auto-detect content type based on file extension
//         const ext = path.extname(filename).toLowerCase();
//         const contentTypes = {
//             '.jpg': 'image/jpeg',
//             '.jpeg': 'image/jpeg',
//             '.png': 'image/png',
//             '.gif': 'image/gif',
//             '.webp': 'image/webp'
//         };
        
//         const contentType = contentTypes[ext] || 'image/jpeg';
//         console.log('📄 Serving as:', contentType);
        
//         res.setHeader('Content-Type', contentType);
//         res.setHeader('Cache-Control', 'public, max-age=86400');
//         res.sendFile(imagePath);
        
//     } catch (error) {
//         console.error('❌ Error reading image file:', error);
//         res.status(500).json({ success: false, message: 'Error reading image file' });
//     }
// }

// // Use the imported multer configuration
// adminRouter.post("/add-doctor", upload.single("image"), addDoctor);
// adminRouter.post('/login', loginAdmin);
// adminRouter.post('/all-doctors', allDoctors);
// adminRouter.post('/change-availability', changeAvailability);

// export default adminRouter;







// import express from 'express';
// import multer from "multer";
// import upload from '../middleware/multer.js';

// import {changeAvailability} from '../controllers/doctorController.js'

// import {addDoctor,allDoctors,loginAdmin}  from '../controllers/adminController.js';
// // import upload from '../middleware/multer.js';

// const upload = multer({ dest: "uploads/" });

// const adminRouter=express.Router();


// adminRouter.post("/add-doctor", upload.single("image"), addDoctor);
// adminRouter.post('/login',loginAdmin);
// adminRouter.post('/all-doctors',allDoctors);
// adminRouter.post('/change-availability',changeAvailability);


// export default adminRouter;
