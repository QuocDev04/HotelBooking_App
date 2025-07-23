import express from 'express';
import { PostdateTour, GetDateTour, GetAllSlotsByTourId } from '../../controller/TourController/DateTour.js';

const dateRouter = express.Router();
dateRouter.post('/date', PostdateTour)
dateRouter.get('/date/slot/:id', GetDateTour)
dateRouter.get('/date/tour/:tourId', GetAllSlotsByTourId)

export {
    dateRouter
}