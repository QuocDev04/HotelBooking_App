import express from 'express';
import { AddTour, DeleteTour, getAllTours, GetTourById, UpdateTour } from '../components/TourController';

const TourRouter = express.Router();
TourRouter.get('/tour', getAllTours)
TourRouter.post('/tour', AddTour)
TourRouter.delete('/tour/:id', DeleteTour)
TourRouter.put('/tour/:id', UpdateTour)
TourRouter.get('/tour/:id', GetTourById)

export default TourRouter;