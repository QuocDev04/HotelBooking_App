
import  express  from 'express';
import { DeleteUser, GetAllUser, GetByIdUser, LoginUser, PutUser, RegisterUser } from '../../controller/PeopleController/UserControllers';

const UserRouter = express.Router();
UserRouter.post('/register', RegisterUser)
UserRouter.post('/login', LoginUser)
UserRouter.get('/user', GetAllUser)
UserRouter.put('/user/:id', PutUser)
UserRouter.delete('/user/:id', DeleteUser)
UserRouter.get('/user/:id', GetByIdUser)

export default UserRouter