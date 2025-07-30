const express = require('express');
const { PostdateTour, GetDateTour, GetAllSlotsByTourId, UpdateDateSlot, DeleteDateSlot } = require('../../controller/TourController/DateTour');



const dateRouter = express.Router();
dateRouter.post('/date', PostdateTour)
dateRouter.get('/date/slot/:id', GetDateTour)
dateRouter.get('/date/tour/:tourId', GetAllSlotsByTourId)
dateRouter.put('/date/slot/:id', UpdateDateSlot)
dateRouter.delete('/date/slot/:id', DeleteDateSlot)


module.exports={
    dateRouter
}