import express from 'express';
import { AddTour, DeleteTour, getAllTours, GetTourById, TourFeatured, TourTopSelling, UpdateTour, getAvailableRoomsForTour } from './../../controller/TourController/TourController';

const TourRouter = express.Router();
TourRouter.get('/tour', getAllTours)
TourRouter.get('/featured', TourFeatured)
TourRouter.get('/tourtopselling', TourTopSelling)
TourRouter.post('/tour', AddTour)
TourRouter.delete('/tour/:id', DeleteTour)
TourRouter.put('/tour/:id', UpdateTour)
TourRouter.get('/tour/:id', GetTourById)
TourRouter.get('/available-rooms-for-tour/:id', getAvailableRoomsForTour)

export default TourRouter;