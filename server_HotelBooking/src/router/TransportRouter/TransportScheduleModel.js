
import  express from 'express';
import { DelTransport, GetByIdTransport, GetTransport, PostTransport, PutTransport } from '../../controller/TransportController/TransportScheduleModel.js';
const TransportSchedulemodel = express.Router();
TransportSchedulemodel.post('/transportSchedule', PostTransport)
TransportSchedulemodel.get('/transportSchedule', GetTransport)
TransportSchedulemodel.put('/transportSchedule/:id', PutTransport)
TransportSchedulemodel.delete('/transportSchedule/:id', DelTransport)
TransportSchedulemodel.get('/transportSchedule/:id', GetByIdTransport)

export default TransportSchedulemodel