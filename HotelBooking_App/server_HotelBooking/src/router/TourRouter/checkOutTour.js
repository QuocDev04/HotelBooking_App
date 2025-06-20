import express from 'express';
import { checkOutBookingTour } from '../../controller/TourController/checkOutTour';
const RouterChecOutBookingTour = express.Router();
RouterChecOutBookingTour.post('/checkOutBookingTour/:id', checkOutBookingTour)

export default RouterChecOutBookingTour