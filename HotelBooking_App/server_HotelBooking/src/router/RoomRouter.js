
import  express  from 'express';
import { AddRoom, DeleteRoom, GetRoomById, RoomAll, UpdateRoom } from './../components/Room/Room';

const RouterRoom = express.Router();
RouterRoom.get('/room', RoomAll);
RouterRoom.post('/room', AddRoom);
RouterRoom.delete('/room/:id', DeleteRoom);
RouterRoom.get('/room/:id', GetRoomById);
RouterRoom.put('/room/:id', UpdateRoom);
export default RouterRoom