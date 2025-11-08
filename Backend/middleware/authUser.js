import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {
    try {
        console.log('🔐 Auth Middleware - Headers:', req.headers);
        console.log('🔐 Auth Header:', req.headers.authorization);
        console.log('🔐 Token Header:', req.headers.token);

        // Try multiple ways to get the token
        let token;

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
        // Method 3: Check x-auth-token header
        else if (req.headers['x-auth-token']) {
            token = req.headers['x-auth-token'];
            console.log('✅ Found token in x-auth-token header');
        }

        console.log('🔐 Extracted token:', token);

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
        
        req.userId = token_decode.id;

        next();
    } catch (error) {
        console.log('❌ Auth error:', error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export default authUser;

// import jwt from 'jsonwebtoken'

// const authUser = (req, res, next) => {
//     try {
//         const token = req.headers.token;

//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Not Authorized. Please login again."
//             });
//         }

//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = token_decode.id; // ✅ save userid properly

//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token."
//         });
//     }
// };

// export default authUser;


// import jwt from 'jsonwebtoken'

// // user authentication middleware
// const authUser = async (req, res, next) => {
//     try {
//        const token = req.headers.token;

        
//         if (!token) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Not Authorized. Please login again.' 
//             })
//         }

//         // Verify and decode the token
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET)
//         req.body.userId=token_decode.userId
//         next()
        
//         // Check if token has the required admin role
//         if (token_decode.role !== "admin") {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Not Authorized. Admin access required.' 
//             })
//         }

//         // Optional: Verify email matches admin email from environment
//         if (token_decode.email !== process.env.ADMIN_EMAIL) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Not Authorized. Invalid admin credentials.' 
//             })
//         }

//         // Attach user info to request for use in next middleware/controller
//         req.admin = {
//             email: token_decode.email,
//             role: token_decode.role
//         }

//         next()
//     } catch (error) {
//         console.log("Admin auth error:", error)
        
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Invalid token. Please login again.' 
//             })
//         }
        
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Token expired. Please login again.' 
//             })
//         }

//         res.status(500).json({ 
//             success: false, 
//             message: error.message || "Internal server error" 
//         })
//     }
// }

// export default authUser