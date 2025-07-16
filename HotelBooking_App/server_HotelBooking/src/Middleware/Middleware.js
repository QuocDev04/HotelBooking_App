import { verifyToken } from "@clerk/clerk-sdk-node";

export const verifyClerkToken = async (req, res, next) => {
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
