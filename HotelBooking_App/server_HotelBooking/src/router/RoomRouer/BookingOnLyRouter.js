
import  express  from 'express';
import { createBookingOnlyRoom, getBookingWithDetails, getOrderById } from './../../controller/Room/BookingOnLyController.js';

const RouterBookingOnly = express.Router();
RouterBookingOnly.post('/booking-room', createBookingOnlyRoom);
RouterBookingOnly.get('/booking-room', getBookingWithDetails);
// RouterBookingOnly.delete('/room/:id', DeleteRoom);
RouterBookingOnly.get('/booking-room/:userId', getOrderById);
// RouterBookingOnly.put('/room/:id', UpdateRoom);
export default RouterBookingOnly