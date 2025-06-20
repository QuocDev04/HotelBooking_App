import BookingTour from "../../models/Tour/TourBooking"
import CheckOutTour from "../../models/Tour/checkOutTour"

export const checkOutBookingTour = async (req, res) => {
    try {
        const { BookingTourId, fullName, emailUser, phoneUser, payment_method, amount } = req.body;

        // Kiểm tra xem BookingTour có tồn tại không
        const booking = await BookingTour.findById(BookingTourId);
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy booking" });
        }

        // Tạo thông tin thanh toán
        const newPayment = new CheckOutTour({
            BookingTourId,
            fullName,
            emailUser,
            phoneUser,
            payment_date: new Date(), 
            payment_method,
            payment_status: "pending" ,
            amount: booking.totalPriceBooking
        });

        const savedPayment = await newPayment.save();

        res.status(201).json({
            message: "Thanh toán thành công",
            payment: savedPayment,
            finalPrice: booking.finalPrice
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thanh toán", error: error.message });
    }
};
