const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/mongodb");
const Vnpay = require("./router/vnpay/vnpayRouter");
const RouterBookingTour = require('./router/TourRouter/BookingTour');
const RouterBookingOnly = require('./router/RoomRouer/BookingOnLyRouter');
const AdminRouter = require('./router/PeopleRouter/AdminRouter');
const TourSchedule = require('./router/TourRouter/TourScheduleRouter');
const TransportScheduleRouter = require('./router/TransportRouter/TransportScheduleModel');
const TransportRouter = require('./router/TransportRouter/TransportRouter');
const TourRouter = require('./router/TourRouter/TourRouter');
const RouterRoom = require('./router/RoomRouer/RoomRouter');
const UserRouter = require('./router/PeopleRouter/UserRouter');
const RouterChecOutBookingTour = require("./router/TourRouter/checkOutTour");
const routerLocation = require("./router/Location/locationRouter");
const CmtRouter = require("./router/Cmt/CmtRouter");
const { dateRouter } = require("./router/TourRouter/DateTour");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// MongoDB connection
connectDB();

app.get('/', (req, res) => res.send("API is working"));

app.use('/api', UserRouter);
app.use('/api/', RouterRoom);
app.use('/api/', TourRouter);
app.use('/api/', TransportRouter);
app.use('/api/', TransportScheduleRouter);
app.use('/api/', TourSchedule);
app.use('/api/', AdminRouter);
app.use('/api/', RouterBookingOnly);
app.use('/api/', Vnpay);
app.use('/api/', RouterBookingTour);
app.use('/api/', RouterChecOutBookingTour);
app.use('/api/', routerLocation);
app.use('/api/', CmtRouter);
app.use('/api/', dateRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
