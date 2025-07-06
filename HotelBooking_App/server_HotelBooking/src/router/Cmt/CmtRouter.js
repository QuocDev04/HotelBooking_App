import express from 'express';
import { DeleteCmtByUserTour, GetCmtByTourId, PostCmt, PostReply, PutCmtByUserTour } from '../../controller/Cmt/CmtController';


const CmtRouter = express.Router();
CmtRouter.post('/cmt/:userId/:tourId', PostCmt)
CmtRouter.post('/cmt/:commentId/reply', PostReply)
CmtRouter.put('/cmt/:userId/:tourId', PutCmtByUserTour)
CmtRouter.get('/cmt/tour/:tourId', GetCmtByTourId);
CmtRouter.delete('/cmt/:userId/:tourId', DeleteCmtByUserTour)


export default CmtRouter