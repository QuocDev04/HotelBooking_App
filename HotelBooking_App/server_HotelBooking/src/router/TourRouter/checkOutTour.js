const express = require('express');
const { checkOutBookingTour, getCheckOutUserTour, getCheckOutUserTourByUserId } = require('../../controller/TourController/checkOutTour.js');
const RouterChecOutBookingTour = express.Router();
RouterChecOutBookingTour.post('/checkOutBookingTour/:id', checkOutBookingTour)
RouterChecOutBookingTour.get('/checkOutBookingTour', getCheckOutUserTour)
RouterChecOutBookingTour.get('/checkOutBookingTour/:userId', getCheckOutUserTourByUserId)

module.exports = RouterChecOutBookingTour