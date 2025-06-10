
import  express  from 'express';
import { LoginUser, RegisterUser } from '../components/UserControllers';

const UserRouter = express.Router();
UserRouter.post('/register', RegisterUser)
UserRouter.post('/login', LoginUser)

export default UserRouter