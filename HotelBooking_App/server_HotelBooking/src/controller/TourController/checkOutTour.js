const BookingTour = require("../../models/Tour/TourBooking.js")
const CheckOutTour = require("../../models/Tour/checkOutTour.js")

const checkOutBookingTour = async (req, res) => {
    try {
        const { BookingTourId,payment_method, amount } = req.body;

        // Kiểm tra xem BookingTour có tồn tại không
        const booking = await BookingTour.findById(BookingTourId);
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy booking" });
        }
        
        // Tạo thông tin thanh toán
        const newPayment = new CheckOutTour({
            BookingTourId,
            payment_date: new Date(), 
            payment_method,
            payment_status: "pending" ,
            amount: booking.totalPriceTour
        });

        const savedPayment = await newPayment.save();

        res.status(201).json({
            message: "Thanh toán thành công",
            payment: savedPayment,
            finalPrice: booking.totalPriceTour
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thanh toán", error: error.message });
    }
};

const getCheckOutUserTour = async (req, res) => {
    try {
        const getCheckOutUserTour = await CheckOutTour.find()
            .populate({
                path: "BookingTourId",
                populate: [
                    {
                        path: "userId", 
                        model: "User",
                    },
                    {
                        path: "tourId",
                        model: "Tour",
                    },
                    {
                        path: "itemRoom.roomId", 
                        model: "Room",
                    },
                ],
            });

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin booking thành công",
            getCheckOutUserTour,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
  
const getCheckOutUserTourByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const checkOuts = await CheckOutTour.find()
            .populate({
                path: "BookingTourId",
                match: { userId: userId }, // chỉ populate BookingTour có userId trùng
                populate: [
                    {
                        path: "userId",
                        model: "User",
                    },
                    {
                        path: "tourId",
                        model: "Tour",
                    },
                    {
                        path: "itemRoom.roomId",
                        model: "Room",
                    },
                ],
            });

        // Lọc ra các bản ghi có BookingTourId tồn tại (không bị null do không match)
        const filtered = checkOuts.filter(item => item.BookingTourId !== null);

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin booking theo user thành công",
            data: filtered,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { checkOutBookingTour, getCheckOutUserTour, getCheckOutUserTourByUserId };
  