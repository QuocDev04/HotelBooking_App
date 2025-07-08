const express = require('express');
const { createBookingTour, getByIdBookingTour } = require('./../../controller/TourController/TourBookingController.js');
const RouterBookingTour = express.Router();
RouterBookingTour.post('/bookingTour', createBookingTour)
RouterBookingTour.get('/bookingTour/:id', getByIdBookingTour)

module.exports = RouterBookingTour