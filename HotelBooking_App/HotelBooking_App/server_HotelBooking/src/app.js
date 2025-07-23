import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/mongodb.js";
import Vnpay from "./router/vnpay/vnpayRouter.js";
import RouterBookingTour from './router/TourRouter/BookingTour.js';
import RouterBookingOnly from './router/RoomRouer/BookingOnLyRouter.js';
import AdminRouter from './router/PeopleRouter/AdminRouter.js';
import TourSchedule from './router/TourRouter/TourScheduleRouter.js';
import TransportScheduleRouter from './router/TransportRouter/TransportScheduleModel.js';
import TransportRouter from './router/TransportRouter/TransportRouter.js';
import TourRouter from './router/TourRouter/TourRouter.js';
import RouterRoom from './router/RoomRouer/RoomRouter.js';
import UserRouter from './router/PeopleRouter/UserRouter.js';
import RouterChecOutBookingTour from "./router/TourRouter/checkOutTour.js";
import routerLocation from "./router/Location/locationRouter.js";
import CmtRouter from "./router/Cmt/CmtRouter.js";
import { dateRouter } from "./router/TourRouter/DateTour.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
//monggo

connectDB();
app.get('/', (req, res) => res.send("API is working"))
app.use('/api', UserRouter)
app.use('/api/', RouterRoom)
app.use('/api/', TourRouter)
app.use('/api/', TransportRouter)
app.use('/api/', TransportScheduleRouter)
app.use('/api/', TourSchedule)
app.use('/api/', AdminRouter)
app.use('/api/', RouterBookingOnly)
app.use('/api/', Vnpay)
app.use('/api/', RouterBookingTour)
app.use('/api/', RouterChecOutBookingTour)
app.use('/api/', routerLocation)
app.use('/api/', CmtRouter)
app.use('/api/', dateRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
