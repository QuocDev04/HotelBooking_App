const { verifyToken } = require("@clerk/clerk-sdk-node");

const Admin = require('../models/People/AdminModel.js');

const verifyClerkToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        // Chỉ truyền apiKey thôi, Clerk tự xử lý JWK
        const jwtPayload = await verifyToken(token, {
            apiKey: process.env.CLERK_SECRET_KEY,
        });

        req.user = jwtPayload;
        next();
    } catch (error) {
        console.error("Verify token error:", error);
        return res.status(401).json({ message: "Unauthorized: Failed to verify token." });
    }
};


const verifyClerkTokenAndAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }

        // Verify Clerk token
        const jwtPayload = await verifyToken(token, {
            apiKey: process.env.CLERK_SECRET_KEY,
        });

        // Check if user is admin in database
        const admin = await Admin.findOne({ clerkId: jwtPayload.sub });
        if (!admin) {
            return res.status(403).json({
                message: "Bạn không có quyền thực hiện hành động này"
            });
        }

        req.user = { ...jwtPayload, isAdmin: true, adminData: admin };
        next();
    } catch (error) {
        console.error("Verify Clerk token and admin error:", error);
        return res.status(401).json({
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};

module.exports = { verifyClerkToken, verifyClerkTokenAndAdmin };
