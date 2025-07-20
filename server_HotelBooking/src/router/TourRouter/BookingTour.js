import express from 'express';
import { createBookingTour, getByIdBookingTour } from './../../controller/TourController/TourBookingController.js';
const RouterBookingTour = express.Router();
RouterBookingTour.post('/bookingTour', createBookingTour)
RouterBookingTour.get('/bookingTour/:id', getByIdBookingTour)

export default RouterBookingTour