
import  express  from 'express';
import { RoomAll } from '../components/Room';

const RouterRoom = express.Router();
RouterRoom.get('/room', RoomAll);
export default RouterRoom