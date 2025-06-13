
import  express from 'express';
import { DelTransportScheduleModel, GetByIdTransportScheduleModel, GetTransportScheduleModel, PostTransportScheduleModel, PutTransportScheduleModel } from '../components/TransportScheduleModel';
const TransportSchedulemodel = express.Router();
TransportSchedulemodel.post('/transportSchedule', PostTransportScheduleModel)
TransportSchedulemodel.get('/transportSchedule', GetTransportScheduleModel)
TransportSchedulemodel.put('/transportSchedule/:id', PutTransportScheduleModel)
TransportSchedulemodel.delete('/transportSchedule/:id', DelTransportScheduleModel)
TransportSchedulemodel.get('/transportSchedule/:id', GetByIdTransportScheduleModel)

export default TransportSchedulemodel