const express = require('express');
const { 
    getByIdBookingTour, 
    BookingTour, 
    getBookingToursByUser, 
    cancelBookingTour,
    getAllBookingsForAdmin,
    adminConfirmCancelBooking,
    requestCancelBooking,
    getBookingStats,
    confirmCashPayment,
    confirmFullPayment,
    getAccurateRevenue
} = require('./../../controller/TourController/TourBookingController.js');
const { uploadPaymentImage } = require('../../Middleware/uploadMiddleware');
const RouterBookingTour = express.Router();

// User routes
RouterBookingTour.post('/bookingTour', BookingTour)
RouterBookingTour.get('/bookingTour/:id', getByIdBookingTour)
RouterBookingTour.get('/bookingTour/user/:userId', getBookingToursByUser)
RouterBookingTour.put('/bookingTour/cancel/:id', cancelBookingTour)
RouterBookingTour.put('/bookingTour/request-cancel/:id', requestCancelBooking)

// Admin routes
RouterBookingTour.get('/admin/bookings', getAllBookingsForAdmin)
RouterBookingTour.get('/admin/bookings/stats', getBookingStats)
RouterBookingTour.get('/admin/bookings/revenue', getAccurateRevenue)
RouterBookingTour.put('/admin/bookings/cancel/:id', adminConfirmCancelBooking)
RouterBookingTour.put('/admin/bookings/confirm-payment/:id', uploadPaymentImage, confirmCashPayment)
RouterBookingTour.put('/admin/bookings/confirm-full-payment/:id', uploadPaymentImage, confirmFullPayment)

module.exports = RouterBookingTour