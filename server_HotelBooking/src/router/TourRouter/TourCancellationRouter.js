const express = require('express');
const TourCancellationController = require('../../controller/TourController/TourCancellationController');
const { verifyToken } = require('../../Middleware/Middleware');
const { verifyTokenAdmin } = require('../../Middleware/Middleware');

const TourCancellationRouter = express.Router();

// User routes - yêu cầu đăng nhập
TourCancellationRouter.post('/cancel', verifyToken, TourCancellationController.cancelTourBooking);

// Admin routes - yêu cầu quyền admin
TourCancellationRouter.get('/pending', verifyTokenAdmin, TourCancellationController.getPendingCancellations);
TourCancellationRouter.put('/confirm', verifyTokenAdmin, TourCancellationController.confirmCancellation);

module.exports = TourCancellationRouter; 