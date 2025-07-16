import express from 'express';
import { createBookingTour, getByIdBookingTour } from './../../controller/TourController/TourBookingController';
const RouterBookingTour = express.Router();
RouterBookingTour.post('/bookingTour', createBookingTour)
RouterBookingTour.get('/bookingTour/:id', getByIdBookingTour)

export default RouterBookingTour