
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb";
import RouterRoom from "./router/RoomRouter";
import TourRouter from "./router/TourRouter";
import TransportRouter from "./router/TransportRouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
//monggo

connectDB();

app.use('/api/', RouterRoom)
app.use('/api/', TourRouter)
app.use('/api/', TransportRouter)

export const viteNodeApp = app;