const express = require('express');
const { DeleteUser, GetAllUser, GetByIdUser, LoginUser, PutUser, RegisterUser } = require('../../controller/PeopleController/UserControllers.js');

const UserRouter = express.Router();
UserRouter.post('/register', RegisterUser)
UserRouter.post('/login', LoginUser)

UserRouter.get('/user', verifyClerkTokenAndAdmin, GetAllUser)
UserRouter.put('/user/:id', verifyClerkTokenAndAdmin, PutUser)
UserRouter.delete('/user/:id', verifyClerkTokenAndAdmin, DeleteUser)
UserRouter.get('/user/:id', verifyClerkTokenAndAdmin, GetByIdUser)

module.exports = UserRouter