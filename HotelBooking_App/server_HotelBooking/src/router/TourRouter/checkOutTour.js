import express from 'express';
import { checkOutBookingTour, getCheckOutUserTour, getCheckOutUserTourByUserId } from '../../controller/TourController/checkOutTour';
const RouterChecOutBookingTour = express.Router();
RouterChecOutBookingTour.post('/checkOutBookingTour/:id', checkOutBookingTour)
RouterChecOutBookingTour.get('/checkOutBookingTour', getCheckOutUserTour)
RouterChecOutBookingTour.get('/checkOutBookingTour/:userId', getCheckOutUserTourByUserId)

export default RouterChecOutBookingTour