const express = require("express");
const { 
    loginEmployee,
    getEmployeeProfile,
    updateEmployeeProfile,
    changePassword,
    getAssignedTours,
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
    resetEmployeePassword
} = require("../../controller/PeopleController/EmployeeController");
const { verifyEmployeeToken, verifyClerkTokenAndAdmin } = require("../../Middleware/Middleware");

const EmployeeRouter = express.Router();

// === EMPLOYEE ROUTES (Dành cho nhân viên HDV) ===

// Đăng nhập
EmployeeRouter.post("/login", loginEmployee);

// Routes yêu cầu xác thực nhân viên
EmployeeRouter.get("/profile", verifyEmployeeToken, getEmployeeProfile);
EmployeeRouter.put("/profile", verifyEmployeeToken, updateEmployeeProfile);
EmployeeRouter.post("/change-password", verifyEmployeeToken, changePassword);
EmployeeRouter.get("/assigned-tours", verifyEmployeeToken, getAssignedTours);

// === ADMIN ROUTES (Dành cho admin quản lý nhân viên) ===

// Quản lý nhân viên (yêu cầu quyền admin)
EmployeeRouter.post("/admin/create", verifyClerkTokenAndAdmin, createEmployee);
EmployeeRouter.get("/admin/list", verifyClerkTokenAndAdmin, getAllEmployees);
EmployeeRouter.put("/admin/:id", verifyClerkTokenAndAdmin, updateEmployee);
EmployeeRouter.delete("/admin/:id", verifyClerkTokenAndAdmin, deleteEmployee);
EmployeeRouter.post("/admin/:id/reset-password", verifyClerkTokenAndAdmin, resetEmployeePassword);

module.exports = EmployeeRouter;
