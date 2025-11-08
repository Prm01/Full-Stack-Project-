import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        
        // Create filename that includes the unique ID and original extension
        const filename = `doctor-${uniqueSuffix}${extension}`;
        
        console.log('📁 Saving file as:', filename);
        cb(null, filename);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    console.log('📄 File received:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });
    
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        console.log('❌ Invalid file type:', file.mimetype);
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;



// import multer from "multer"

// const storage=multer.diskStorage({

//     filename:function(req,file,callback){
//         callback(null,file.originalname)

// }

// })

// const upload=multer({storage})

// export default upload;