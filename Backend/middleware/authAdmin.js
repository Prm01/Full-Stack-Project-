import jwt from 'jsonwebtoken'

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { aToken } = req.headers
        
        if (!aToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authorized. Please login again.' 
            })
        }

        // Verify and decode the token
        const token_decode = jwt.verify(aToken, process.env.JWT_SECRET)
        
        // Check if token has the required admin role
        if (token_decode.role !== "admin") {
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authorized. Admin access required.' 
            })
        }

        // Optional: Verify email matches admin email from environment
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not Authorized. Invalid admin credentials.' 
            })
        }

        // Attach user info to request for use in next middleware/controller
        req.admin = {
            email: token_decode.email,
            role: token_decode.role
        }

        next()
    } catch (error) {
        console.log("Admin auth error:", error)
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token. Please login again.' 
            })
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired. Please login again.' 
            })
        }

        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        })
    }
}

export default authAdmin