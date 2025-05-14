
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/mongodb";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
//monggo
connectDB();

export const viteNodeApp = app;