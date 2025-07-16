
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb";
import Vnpay from "./router/vnpay/vnpayRouter.js";
import RouterBookingTour from './router/TourRouter/BookingTour';
import RouterBookingOnly from './router/RoomRouer/BookingOnLyRouter';
import AdminRouter from './router/PeopleRouter/AdminRouter';
import TourSchedule from './router/TourRouter/TourScheduleRouter';
import TransportSchedulemodel from './router/TransportRouter/TransportScheduleModel';
import TransportRouter from './router/TransportRouter/TransportRouter';
import TourRouter from './router/TourRouter/TourRouter';
import RouterRoom from './router/RoomRouer/RoomRouter';
import UserRouter from './router/PeopleRouter/UserRouter';
import RouterChecOutBookingTour from "./router/TourRouter/checkOutTour";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
//monggo

connectDB();

app.use('/api', UserRouter)
app.use('/api/', RouterRoom)
app.use('/api/', TourRouter)
app.use('/api/', TransportRouter)
app.use('/api/', TransportSchedulemodel)
app.use('/api/', TourSchedule)
app.use('/api/', AdminRouter)
app.use('/api/', RouterBookingOnly)
app.use('/api/', Vnpay)
app.use('/api/', RouterBookingTour)
app.use('/api/', RouterChecOutBookingTour)

export const viteNodeApp = app;