const express = require('express');
const { PostdateTour, GetDateTour, GetAllSlotsByTourId } = require('../../controller/TourController/DateTour');



const dateRouter = express.Router();
dateRouter.post('/date', PostdateTour)
dateRouter.get('/date/slot/:id', GetDateTour)
dateRouter.get('/date/tour/:tourId', GetAllSlotsByTourId)


module.exports={
    dateRouter
}