
import express from 'express';
import { AddTransport, DeleteTransport, GetTransportAll, GetTransportById, UpdateTransport } from '../../controller/TransportController/TransportControllers';

const TransportRouter = express.Router();
TransportRouter.get('/transport', GetTransportAll)
TransportRouter.post('/transport', AddTransport)
TransportRouter.put('/transport/:id', UpdateTransport)
TransportRouter.get('/transport/:id', GetTransportById)
TransportRouter.delete('/transport/:id', DeleteTransport)

export default TransportRouter