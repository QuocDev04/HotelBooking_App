const express = require('express');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const TourBookingSchema = require("../../models/Tour/TourBooking.js")
const { sendMail } = require("../../controller/mail/sendMail.js");

const Vnpay = express.Router();

// Tạo URL thanh toán VNPay cho booking ID
Vnpay.post('/vnpay/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const bookingType = req.query.bookingType || 'tour'; // Mặc định là tour nếu không có query param

        // Tìm booking dựa vào ID
        const booking = await TourBookingSchema.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking"
            });
        }

        // Xác định số tiền cần thanh toán
        let paymentAmount;
        let orderInfo;

        if (booking.isFullyPaid) {
            return res.status(400).json({
                success: false,
                message: "Booking này đã được thanh toán đầy đủ"
            });
        }

        if (booking.isDeposit) {
            // Nếu đã đặt cọc, thanh toán phần còn lại
            paymentAmount = booking.totalPriceTour - booking.depositAmount;
            orderInfo = `Thanh toán phần còn lại cho đơn #${booking._id}`;
        } else if (req.body && req.body.isFullPayment) {
            // Nếu yêu cầu thanh toán đầy đủ
            paymentAmount = booking.totalPriceTour;
            orderInfo = `Thanh toán đầy đủ cho đơn #${booking._id}`;
        } else {
            // Mặc định là đặt cọc
            paymentAmount = booking.depositAmount || Math.round(booking.totalPriceTour * 0.5);
            orderInfo = `Đặt cọc cho đơn #${booking._id}`;
        }

        // Tạo URL thanh toán VNPay
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
            vnp_Amount: paymentAmount * 100, // VNPay yêu cầu số tiền * 100
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${booking._id}-${Date.now()}`, // dùng cho callback xác định booking
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `http://localhost:8080/api/check-payment-vnpay`, // URL callback
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow),
        });

        console.log('Generated VNPay URL:', paymentUrl);

        return res.status(200).json({
            success: true,
            message: "Tạo URL thanh toán VNPay thành công",
            paymentUrl,
            bookingId: booking._id,
            amount: paymentAmount
        });
    } catch (error) {
        console.error("Lỗi khi tạo URL thanh toán VNPay:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi tạo URL thanh toán VNPay",
            error: error.message
        });
    }
});

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
            const amount = parseFloat(req.query.vnp_Amount) / 100; // VNPay trả về số tiền * 100
            
            // Xác định trạng thái thanh toán dựa vào số tiền
            if (amount >= booking.totalPriceTour) {
                // Thanh toán đầy đủ
                booking.payment_status = 'completed';
                booking.isFullyPaid = true;
            } else if (Math.abs(amount - booking.depositAmount) < 10000) { // Cho phép sai số nhỏ
                // Thanh toán đặt cọc
                booking.payment_status = 'deposit_paid';
                booking.isDeposit = true;
                
                // Nếu booking đánh dấu là phần còn lại sẽ thanh toán bằng tiền mặt
                if (booking.cashPaymentRemaining) {
                    // Thêm thông tin vào email để thông báo khách hàng
                    const cashRemainingInfo = `<p><strong>Lưu ý:</strong> Phần còn lại (${(booking.totalPriceTour - booking.depositAmount).toLocaleString('vi-VN')} VNĐ) sẽ được thanh toán bằng tiền mặt theo thỏa thuận.</p>`;
                }
            }
            
            booking.payment_date = new Date();
            await booking.save();

            // Gửi email xác nhận nếu có email
            if (booking.email) {
                try {
                    const totalPriceVN = amount.toLocaleString('vi-VN');
                    const isDeposit = booking.payment_status === 'deposit_paid';
                    
                    // Thêm thông tin về phần còn lại thanh toán tiền mặt nếu có
                    const cashRemainingInfo = booking.cashPaymentRemaining && isDeposit ? 
                        `<p><strong>Lưu ý:</strong> Phần còn lại (${(booking.totalPriceTour - booking.depositAmount).toLocaleString('vi-VN')} VNĐ) sẽ được thanh toán bằng tiền mặt theo thỏa thuận.</p>` : '';
                    
                    await sendMail({
                        email: booking.email,
                        subject: isDeposit ? 
                            'Xác nhận đặt cọc tour thành công' : 
                            'Xác nhận thanh toán tour thành công',
                        html: `
              <p>Xin chào <strong>${booking.fullNameUser}</strong>,</p>
              <p>Bạn đã <b>${isDeposit ? 'đặt cọc' : 'thanh toán đầy đủ'} thành công</b> cho tour <b>${booking.tourId?.nameTour || 'N/A'}</b>.</p>
              <ul>
                <li><strong>Mã đặt chỗ:</strong> ${bookingId}</li>
                <li><strong>Số tiền ${isDeposit ? 'đặt cọc' : 'thanh toán'}:</strong> ${totalPriceVN} VNĐ</li>
                ${isDeposit ? `<li><strong>Số tiền còn lại:</strong> ${(booking.totalPriceTour - booking.depositAmount).toLocaleString('vi-VN')} VNĐ</li>` : ''}
                <li><strong>Phương thức thanh toán:</strong> VNPay</li>
              </ul>
              ${cashRemainingInfo}
              ${isDeposit && !booking.cashPaymentRemaining ? '<p>Vui lòng thanh toán số tiền còn lại trước khi khởi hành tour.</p>' : ''}
              <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
            `,
                    });
                    console.log('Đã gửi email xác nhận tới', booking.email);
                } catch (mailErr) {
                    console.error('Gửi email thất bại:', mailErr);
                }
            }

            // Chuyển hướng về trang chi tiết booking với thông báo thành công
            return res.redirect(`http://localhost:5173/?success=true&status=${booking.payment_status}`);
        } else {
            // Thanh toán thất bại, cập nhật trạng thái hủy
            booking.payment_status = 'cancelled';
            await booking.save();

            // Nếu cần reset lại số ghế hoặc trạng thái slot, bạn có thể thêm logic ở đây

            return res.redirect(`http://localhost:5173/?success=false&message=payment_failed`);
        }
    } catch (error) {
        console.error('Lỗi xử lý trả về thanh toán VNPay:', error);
        return res.redirect('http://localhost:5173/?success=false&message=Error');
    }
});

module.exports = Vnpay;
