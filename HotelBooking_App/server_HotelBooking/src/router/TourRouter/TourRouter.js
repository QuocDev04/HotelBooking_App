import express from 'express';
import { AddTour, DeleteTour, getAllTours, GetTourById, TourFeatured, TourTopSelling, UpdateTour } from './../../controller/TourController/TourController.js';

const TourRouter = express.Router();
TourRouter.get('/tour', getAllTours)
TourRouter.get('/featured', TourFeatured)
TourRouter.get('/tourtopselling', TourTopSelling)
TourRouter.post('/tour', AddTour)
TourRouter.delete('/tour/:id', DeleteTour)
TourRouter.put('/tour/:id', UpdateTour)
TourRouter.get('/tour/:id', GetTourById)

export default TourRouter;