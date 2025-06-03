import express from 'express';
import { getAllTours } from '../components/TourController';

const TourRouter = express.Router();
TourRouter.get('/tour', getAllTours)

export default TourRouter;