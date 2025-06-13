
import  express  from 'express';
import { createBookingOnlyRoom, getBookingWithDetails } from '../components/BookingOnLyController';

const RouterBookingOnly = express.Router();
RouterBookingOnly.post('/booking-room', createBookingOnlyRoom);
RouterBookingOnly.get('/booking-room', getBookingWithDetails);
// RouterBookingOnly.delete('/room/:id', DeleteRoom);
// RouterBookingOnly.get('/room/:id', GetRoomById);
// RouterBookingOnly.put('/room/:id', UpdateRoom);
export default RouterBookingOnly