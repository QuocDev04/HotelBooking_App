
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb";
import RouterRoom from "./router/RoomRouter";
import TourRouter from "./router/TourRouter";
import TransportRouter from "./router/TransportRouter";
import TransportSchedulemodel from "./router/TransportScheduleModel";
import TourSchedule from "./router/TourScheduleRouter";
import AdminRouter from "./router/AdminRouter";
import UserRouter from "./router/UserRouter";

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

export const viteNodeApp = app;