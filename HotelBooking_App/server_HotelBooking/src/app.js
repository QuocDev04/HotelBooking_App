import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/mongodb";
import Vnpay from "./router/vnpay/vnpayRouter.js";
import RouterBookingTour from './router/TourRouter/BookingTour';
import RouterBookingOnly from './router/RoomRouer/BookingOnLyRouter';
import AdminRouter from './router/PeopleRouter/AdminRouter';
import TourSchedule from './router/TourRouter/TourScheduleRouter';
import TransportScheduleRouter from './router/TransportRouter/TransportScheduleModel';
import TransportRouter from './router/TransportRouter/TransportRouter';
import TourRouter from './router/TourRouter/TourRouter';
import RouterRoom from './router/RoomRouer/RoomRouter';
import UserRouter from './router/PeopleRouter/UserRouter';
import RouterChecOutBookingTour from "./router/TourRouter/checkOutTour";
import routerLocation from "./router/Location/locationRouter";
import CmtRouter from "./router/Cmt/CmtRouter";

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
app.use('/api/', TransportScheduleRouter)
app.use('/api/', TourSchedule)
app.use('/api/', AdminRouter)
app.use('/api/', RouterBookingOnly)
app.use('/api/', Vnpay)
app.use('/api/', RouterBookingTour)
app.use('/api/', RouterChecOutBookingTour)
app.use('/api/', routerLocation)
app.use('/api/', CmtRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
