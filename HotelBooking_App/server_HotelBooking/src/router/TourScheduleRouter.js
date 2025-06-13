import express from 'express'
import { DeleteTourSchedule, GetByIdTourSchedule, GetTourScheduleAll, PostTourSchedule, PutTourSchedule } from '../components/TourScheduleController';


const TourSchedule = express.Router();
TourSchedule.get('/tourschedule', GetTourScheduleAll);
TourSchedule.get('/tourschedule/:id', GetByIdTourSchedule);
TourSchedule.post('/tourschedule', PostTourSchedule);
TourSchedule.put('/tourschedule/:id', PutTourSchedule);
TourSchedule.delete('/tourschedule/:id', DeleteTourSchedule);

export default TourSchedule