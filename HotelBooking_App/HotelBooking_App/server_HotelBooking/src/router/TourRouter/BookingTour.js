const express = require('express');
const { 
    getByIdBookingTour, 
    BookingTour, 
    getBookingToursByUser, 
    cancelBookingTour,
    getAllBookingsForAdmin,
    adminConfirmCancelBooking,
    requestCancelBooking,
    getBookingStats
} = require('./../../controller/TourController/TourBookingController.js');
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
RouterBookingTour.put('/admin/bookings/cancel/:id', adminConfirmCancelBooking)

module.exports = RouterBookingTour
