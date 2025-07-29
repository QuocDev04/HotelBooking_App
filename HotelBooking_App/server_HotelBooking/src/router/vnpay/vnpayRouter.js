const express = require('express');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const TourBookingSchema = require("../../models/Tour/TourBooking.js")
const { sendMail } = require("../../controller/mail/sendMail.js");

const Vnpay = express.Router();


// Xử lý callback VNPAY khi khách hàng thanh toán xong
Vnpay.get('/check-payment-vnpay', async (req, res) => {
    try {
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Kiểm tra chữ ký hợp lệ từ VNPay
        const isValid = vnpay.verifyReturnUrl(req.query);
        if (!isValid) {
            return res.redirect('http://localhost:5173/payment-result?success=false&message=Invalid signature');
        }

        const responseCode = req.query.vnp_ResponseCode; // Mã kết quả thanh toán
        const txnRef = req.query.vnp_TxnRef; // bookingId + timestamp (ví dụ: bookingId-timestamp)
        const bookingId = txnRef.split('-')[0]; // Lấy bookingId từ txnRef

        // Lấy booking dựa trên bookingId từ TourBookingSchema
        const booking = await TourBookingSchema.findById(bookingId)

        if (!booking) {
            return res.redirect('http://localhost:5173/payment-result?success=false&message=Booking not found');
        }

        if (responseCode === '00') {
            // Thanh toán thành công, cập nhật trạng thái thanh toán
            booking.payment_status = 'completed';
            booking.payment_date = new Date();
            await booking.save();

            // Gửi email xác nhận nếu có email
            if (booking.email) {
                try {
                    const totalPriceVN = booking.totalPriceTour.toLocaleString('vi-VN');
                    await sendMail({
                        email: booking.email,
                        subject: 'Xác nhận thanh toán tour thành công',
                        html: `
              <p>Xin chào <strong>${booking.fullNameUser}</strong>,</p>
              <p>Bạn đã <b>thanh toán thành công</b> cho tour <b>${booking.tourId?.nameTour || 'N/A'}</b>.</p>
              <ul>
                <li><strong>Mã đặt chỗ:</strong> ${bookingId}</li>
                <li><strong>Tổng giá:</strong> ${totalPriceVN} VNĐ</li>
                <li><strong>Phương thức thanh toán:</strong> VNPay</li>
              </ul>
              <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
            `,
                    });
                    console.log('Đã gửi email xác nhận tới', booking.email);
                } catch (mailErr) {
                    console.error('Gửi email thất bại:', mailErr);
                }
            }

            return res.redirect(`http://localhost:5173/booking/${bookingId}?success=true`);
        } else {
            // Thanh toán thất bại, cập nhật trạng thái hủy
            booking.payment_status = 'cancelled';
            await booking.save();

            // Nếu cần reset lại số ghế hoặc trạng thái slot, bạn có thể thêm logic ở đây

            return res.redirect('http://localhost:5173/payment-result?success=false');
        }
    } catch (error) {
        console.error('Lỗi xử lý trả về thanh toán VNPay:', error);
        return res.redirect('http://localhost:5173/payment-result?success=false&message=Error');
    }
});

module.exports = Vnpay;
