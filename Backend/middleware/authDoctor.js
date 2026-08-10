import jwt from 'jsonwebtoken'

const authDoctor = (req, res, next) => {
    try {
        let token; // ✅ Use let instead of const for reassignment

        // Method 1: Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('✅ Found token in Authorization header');
        }
        // Method 2: Check token header directly
        else if (req.headers.token) {
            token = req.headers.token;
            console.log('✅ Found token in token header');
        }
        // Method 3: Check dtoken header (from your original code)
        else if (req.headers.dtoken) {
            token = req.headers.dtoken;
            console.log('✅ Found token in dtoken header');
        }
        // Method 4: Check x-auth-token header
        else if (req.headers['x-auth-token']) {
            token = req.headers['x-auth-token'];
            console.log('✅ Found token in x-auth-token header');
        }

        if (!token) {
            console.log('❌ No token found in any header');
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        // Verify token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded:', token_decode);
        
        // ✅ Set doctorId on req object (not req.body)
        req.doctorId = token_decode.id;
        console.log('✅ Set doctorId:', req.doctorId);

        next();
    } catch (error) {
        console.log('❌ Auth error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }
        
        return res.status(401).json({
            success: false,
            message: "Authentication failed."
        });
    }
};

export default authDoctor;

// import jwt from 'jsonwebtoken'

// const authDoctor = (req, res, next) => {
//     try {
//         console.log('🔐 Auth Middleware - Headers:', req.headers);
//         console.log('🔐 Auth Header:', req.headers.authorization);
//         console.log('🔐 Token Header:', req.headers.token);

//         // Try multiple ways to get the token
//         const {dtoken}=req.headers

//         // Method 1: Check Authorization header (Bearer token)
//         const authHeader = req.headers.authorization;
//         if (authHeader && authHeader.startsWith('Bearer ')) {
//             dtoken = authHeader.split(' ')[1];
//             console.log('✅ Found token in Authorization header');
//         }
//         // Method 2: Check token header directly
//         else if (req.headers.token) {
//             dtoken = req.headers.token;
//             console.log('✅ Found token in token header');
//         }
//         // Method 3: Check x-auth-token header
//         else if (req.headers['x-auth-token']) {
//             dtoken = req.headers['x-auth-token'];
//             console.log('✅ Found token in x-auth-token header');
//         }

//         console.log('🔐 Extracted token:', token);

//         if (!dtoken) {
//             console.log('❌ No token found in any header');
//             return res.status(401).json({
//                 success: false,
//                 message: "Not Authorized. Please login again."
//             });
//         }

//         // Verify token
//         const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
//         console.log('✅ Token decoded:', token_decode);
        
//         req.body.docId= token_decode.id;

//         next();
//     } catch (error) {
//         console.log('❌ Auth error:', error.message);
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token."
//         });
//     }
// };

// export default authDoctor;
