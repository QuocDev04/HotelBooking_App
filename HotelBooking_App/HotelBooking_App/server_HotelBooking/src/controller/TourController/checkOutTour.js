const BookingTour = require("../../models/Tour/TourBooking.js")
const CheckOutTour = require("../../models/Tour/checkOutTour.js")

const checkOutBookingTour = async (req, res) => {
    try {
        const { BookingTourId, payment_method, isFullPayment } = req.body;

        // Kiểm tra xem BookingTour có tồn tại không
        const booking = await BookingTour.findById(BookingTourId).populate("tourId").populate("slotId");
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy booking" });
        }
        
        // Xác định số tiền thanh toán
        let amount;
        let payment_status;
        
        if (booking.isFullyPaid) {
            return res.status(400).json({ message: "Đơn hàng này đã được thanh toán đầy đủ" });
        }
        
        // Nếu là thanh toán đầy đủ hoặc thanh toán phần còn lại
        if (isFullPayment || booking.isDeposit) {
            if (booking.isDeposit) {
                // Nếu đã đặt cọc rồi, thanh toán phần còn lại
                amount = booking.totalPriceTour - booking.depositAmount;
                payment_status = "completed";
            } else {
                // Thanh toán đầy đủ ngay từ đầu
                amount = booking.totalPriceTour;
                payment_status = "completed";
            }
        } else {
            // Thanh toán đặt cọc
            amount = booking.depositAmount;
            payment_status = "deposit_paid";
        }

        // Kiểm tra trường hợp đặc biệt: thanh toán tiền mặt phần còn lại sau khi đã đặt cọc
        if (payment_method === 'cash' && booking.isDeposit && booking.cashPaymentRemaining) {
            // Xác nhận đã nhận tiền mặt cho phần còn lại
            payment_status = "completed";
            amount = booking.totalPriceTour - booking.depositAmount;
        }
        
        // Tạo thông tin thanh toán
        const newPayment = new CheckOutTour({
            BookingTourId,
            payment_date: new Date(), 
            payment_method,
            payment_status,
            isDeposit: !isFullPayment && !booking.isDeposit,
            amount
        });

        const savedPayment = await newPayment.save();
        
        // Cập nhật trạng thái booking
        booking.payment_status = payment_status;
        
        if (isFullPayment || booking.isDeposit) {
            booking.isFullyPaid = true;
        } else {
            booking.isDeposit = true;
        }
        
        await booking.save();

        // Lấy thông tin booking đã cập nhật để trả về
        const updatedBooking = await BookingTour.findById(BookingTourId).populate("tourId").populate("slotId");

        // Phản hồi dựa trên phương thức thanh toán
        const response = {
            message: isFullPayment || booking.isDeposit ? 
                "Thanh toán đầy đủ thành công" : 
                "Đặt cọc thành công",
            payment: savedPayment,
            booking: updatedBooking,
            finalPrice: amount,
            isDeposit: !isFullPayment && !booking.isDeposit
        };

        // Nếu là thanh toán qua VNPay, cần trả về thêm thông tin
        if (payment_method === "bank_transfer") {
            response.requiresRedirect = true;
        } else {
            // Với các phương thức thanh toán khác (tiền mặt, thẻ tín dụng...)
            response.requiresRedirect = false;
        }

        res.status(201).json(response);
    } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        res.status(500).json({ 
            message: "Lỗi khi thanh toán", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
  