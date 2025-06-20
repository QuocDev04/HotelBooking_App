import express from 'express'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay';
import BookingOnySchema from '../../models/Room/BookingRoom'
import checkOutTourSchema from '../../models/Tour/checkOutTour'
const Vnpay = express.Router();

Vnpay.post('/vnpay/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { bookingType } = req.query; // hoặc req.body tùy bạn

        let booking = null;

        if (bookingType === 'tour') {
            booking = await checkOutTourSchema.findById(bookingId);
            console.log("booking tìm thấy:", booking);
        } else if (bookingType === 'room') {
            booking = await BookingOnySchema.findById(bookingId);
        } else {
            return res.status(400).json({ success: false, message: 'Thiếu hoặc sai bookingType' });
        }

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        }

        // Lấy giá tiền theo loại booking
        let totalPrice = 0;
        if (bookingType === 'tour') {
            totalPrice = booking.amount;
        } else if (bookingType === 'room') {
            totalPrice = booking.total_price;
        }

        // Khởi tạo VNPAY
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: totalPrice , // nhân 100!
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${booking._id}-${Date.now()}`, // đảm bảo duy nhất
            vnp_OrderInfo: `Thanh toán đơn ${bookingType} #${booking._id}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `http://localhost:5173/payment-result`,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
        });
        console.log('Generated VNPay URL:', paymentUrl);

        return res.status(200).json({ success: true, paymentUrl });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Callback xử lý kết quả thanh toán
Vnpay.get('/check-payment-vnpay', (req, res) => {
    console.log('Callback VNPay:', req.query);
    // TODO: xử lý cập nhật trạng thái booking theo kết quả thanh toán
    res.send('Payment callback received');
});

export default Vnpay;
