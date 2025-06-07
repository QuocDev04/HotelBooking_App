import express from "express";
import { StatusCodes } from "http-status-codes";
import { verifyClerkToken } from "../Middleware/Middleware.js";
import Admin from "../models/AdminModel.js";

const AdminRouter = express.Router();

// Middleware xác thực token Clerk
AdminRouter.post("/syncUser", verifyClerkToken, async (req, res) => {
    const { clerkId, email, firstName, lastName } = req.body;

    if (!clerkId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "No clerkId provided" });
    }

    if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email are required" });
    }
    const existingAdmins = await Admin.countDocuments();

    if (existingAdmins >= 1) {
        return res.status(403).json({ message: "Only one admin account is allowed." });
    }
    try {
        let admin = await Admin.findOne({ clerkId });

        if (admin) {
            // Cập nhật thông tin admin
            admin.email = email;
            admin.firstName = firstName;
            admin.lastName = lastName;
            admin.full_name = [lastName, firstName].filter(Boolean).join(" ");
            await admin.save();
        } else {
            // Tạo admin mới
            admin = await Admin.create({
                clerkId,
                email,
                firstName,
                lastName,
                full_name: [lastName, firstName].filter(Boolean).join(" "),
            });
        }

        res.status(StatusCodes.OK).json({ message: "User synced", admin });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

export default AdminRouter;
