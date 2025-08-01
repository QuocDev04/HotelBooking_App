const express = require('express');
const { 
    PostdateTour, 
    GetDateTour, 
    GetAllSlotsByTourId, 
    UpdateDateSlot, 
    DeleteDateSlot,
    getTourStats,
    getToursByStatus,
    updateTourBookingStatsAPI,
    markCustomerNoShow,
    getNoShowCustomers
} = require('../../controller/TourController/DateTour');
const { verifyToken, verifyTokenAndAdmin } = require("../../Middleware/verifyToken");
const { verifyClerkTokenAndAdmin } = require("../../Middleware/Middleware");

const dateRouter = express.Router();

// Các API cơ bản cho quản lý slot thời gian tour
dateRouter.post('/date', verifyTokenAndAdmin, PostdateTour);
dateRouter.get('/date/slot/:id', GetDateTour);
dateRouter.get('/date/tour/:tourId', GetAllSlotsByTourId);
dateRouter.put('/date/slot/:id', verifyTokenAndAdmin, UpdateDateSlot);
dateRouter.delete('/date/slot/:id', verifyTokenAndAdmin, DeleteDateSlot);

// API mới cho quản lý tour theo trạng thái
dateRouter.get('/stats', verifyClerkTokenAndAdmin, getTourStats);
dateRouter.get('/status/all', getToursByStatus); // API mới để lấy tất cả tour không phân biệt trạng thái
dateRouter.get('/status/:status', getToursByStatus);
dateRouter.post('/update-stats', verifyTokenAndAdmin, updateTourBookingStatsAPI);

// API quản lý khách hàng không tham gia tour
dateRouter.post('/booking/:bookingId/mark-no-show', verifyClerkTokenAndAdmin, markCustomerNoShow);
dateRouter.get('/slot/:slotId/no-show-customers', verifyClerkTokenAndAdmin, getNoShowCustomers);

module.exports = {
    dateRouter
}