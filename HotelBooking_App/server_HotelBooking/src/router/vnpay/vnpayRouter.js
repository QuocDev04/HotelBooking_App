const express = require('express');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

const TourBookingSchema = require("../../models/Tour/TourBooking.js");
const HotelBooking = require("../../models/Hotel/HotelBooking.js");
const { sendMail } = require("../../controller/mail/sendMail.js");

const Vnpay = express.Router();


// Tạo URL thanh toán VNPay
Vnpay.post('/create-payment', async (req, res) => {
    try {
        const bookingData = req.body;
        if (!bookingData)
            return res.status(400).json({ success: false, message: 'Thiếu dữ liệu booking' });

        // Xác định loại booking
        const type = bookingData.type || 'hotel'; // 'tour' hoặc 'hotel'
        let totalAmount = bookingData.totalPrice || 0;

        if (type === 'tour' && !totalAmount) {
            totalAmount =
                (bookingData.adultsTour || 0) * 5000000 +
                (bookingData.childrenTour || 0) * 3000000 +
                (bookingData.toddlerTour || 0) * 1000000;
            bookingData.totalPriceTour = totalAmount;
        } else if (type === 'hotel' && !totalAmount) {
            totalAmount = bookingData.totalPriceRoom || 0;
            bookingData.totalPriceRoom = totalAmount;
        }

        // Lưu booking vào DB
        let booking;
        if (type === 'tour') booking = new TourBookingSchema(bookingData);
        else booking = new HotelBooking(bookingData);

        await booking.save();

        // Cấu hình VNPay
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });


        const Vnpays = await vnpay.buildPaymentUrl({
            vnp_Amount: totalAmount,
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${booking._id}-${Date.now()}`,
            vnp_OrderInfo: `${type} booking #${booking._id}`,
            vnp_OrderType: ProductCode.Other,
            // Callback phải trỏ về backend
            vnp_ReturnUrl: `http://localhost:5173/payment-result`
            ,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        });
        console.log("VNPAY", Vnpays);

        return res.status(200).json({ success: true, Vnpays, bookingId: booking._id, type });
    } catch (error) {
        console.error('Lỗi tạo thanh toán:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Callback VNPay
Vnpay.get('/payment-callback', async (req, res) => {
    try {
        console.log('Nhận callback VNPay:', req.query);

        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: () => { },
        });

        const isValid = vnpay.verifyReturnUrl(req.query);
        if (!isValid) {
            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Invalid signature');
        }

        const responseCode = req.query.vnp_ResponseCode;
        const txnRef = req.query.vnp_TxnRef || '';
        const bookingId = txnRef.split('-')[0];
        const orderInfo = req.query.vnp_OrderInfo || '';
        const isHotelBooking = orderInfo.includes('khách sạn') || orderInfo.toLowerCase().includes('hotel');

        let updatedBooking;

        if (responseCode === '00') {
            if (isHotelBooking) {
                updatedBooking = await HotelBooking.findByIdAndUpdate(
                    bookingId,
                    { payment_status: 'completed', booking_status: 'confirmed', paidAt: new Date() },
                    { new: true }
                ).populate({
                    path: 'hotelId',
                    select: 'hotelName location',
                    populate: { path: 'location', select: 'locationName country' }
                });
            } else {
                updatedBooking = await TourBookingSchema.findByIdAndUpdate(
                    bookingId,
                    { payment_status: 'completed', isFullyPaid: true, fullPaidAt: new Date() },
                    { new: true }
                ).populate({
                    path: 'slotId',
                    select: 'dateTour tour',
                    populate: { path: 'tour', select: 'nameTour' }
                });
            }

            if (!updatedBooking) {
                return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Booking not found');
            }

            // Gửi email xác nhận
            if (updatedBooking.email) {
                try {
                    const totalPriceVN = (updatedBooking.totalPriceTour || updatedBooking.totalPrice || 0).toLocaleString('vi-VN');

                    let emailHtml = '';
                    if (isHotelBooking) {
                        // render chi tiết phòng + khách
                        let roomDetailsHtml = updatedBooking.roomBookings.map(rb => `
                <li style="margin-bottom: 10px;">
                    <b>${rb.roomTypeName}</b> - ${rb.numberOfRooms} phòng<br/>
                    Giá/đêm: ${rb.pricePerNight.toLocaleString('vi-VN')} VNĐ<br/>
                    Tổng: ${rb.totalPrice.toLocaleString('vi-VN')} VNĐ<br/>
                    Khách: ${rb.guests.map(g => g.fullName).join(', ') || 'Chưa nhập'}
                </li>
            `).join('');

                        emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Thanh toán thành công!</h2>
                    <p>Xin chào <strong>${updatedBooking.fullNameUser || 'Khách hàng'}</strong>,</p>
                    <p>Bạn đã <b>thanh toán thành công</b> cho khách sạn <b>${updatedBooking.hotelId?.hotelName || 'N/A'}</b>.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Thông tin đặt phòng:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>Mã booking:</strong> ${bookingId}</li>
                            <li><strong>Tổng giá:</strong> ${totalPriceVN} VNĐ</li>
                            <li><strong>Loại thanh toán:</strong> ${updatedBooking.paymentType || 'Không xác định'}</li>
                            <li><strong>Ngày nhận phòng:</strong> ${new Date(updatedBooking.checkInDate).toLocaleDateString('vi-VN')}</li>
                            <li><strong>Ngày trả phòng:</strong> ${new Date(updatedBooking.checkOutDate).toLocaleDateString('vi-VN')}</li>
                            <li><strong>Số đêm:</strong> ${updatedBooking.numberOfNights}</li>
                        </ul>
                        
                        <h3>Chi tiết phòng:</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${roomDetailsHtml}
                        </ul>
                    </div>

                    <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                    <p>Nếu có thắc mắc, vui lòng liên hệ: <strong>support@example.com</strong></p>
                </div>
            `;
                    } else {
                        // ========== TẠO DANH SÁCH KHÁCH ==========
                        const allGuests = [
                            ...(updatedBooking.adultPassengers || []),
                            ...(updatedBooking.childPassengers || []),
                            ...(updatedBooking.toddlerPassengers || []),
                            ...(updatedBooking.infantPassengers || [])
                        ];
                        const tourDate = updatedBooking.slotId?.dateTour
                            ? new Date(updatedBooking.slotId.dateTour).toLocaleDateString('vi-VN')
                            : 'N/A';
                        // Tách khách chọn singleRoom và khách ghép
                        const singleRoomGuests = allGuests.filter(g => g.singleRoom);
                        const guestsToCombine = allGuests.filter(g => !g.singleRoom);

                        // ========== GHÉP PHÒNG ==========
                        let remainingGuests = [...guestsToCombine];
                        let roomInfoList = [];

                        while (remainingGuests.length > 0) {
                            let roomGuests = [];
                            if (remainingGuests.length >= 4) {
                                roomGuests = remainingGuests.splice(0, 4);
                                roomInfoList.push(`1 phòng (4 khách) - Flamingo Đại Lải – Forest In The Sky Resort - Deluxe Sky Residence (2 phòng ngủ)<br/>
            Khách: ${roomGuests.map(g => g.fullName).join(', ')}`);
                            } else if (remainingGuests.length === 3) {
                                roomGuests = remainingGuests.splice(0, 3);
                                roomInfoList.push(`1 phòng (3 khách) - Flamingo Đại Lải – Forest In The Sky Resort - Premier Sky Residence<br/>
            Khách: ${roomGuests.map(g => g.fullName).join(', ')}`);
                            } else if (remainingGuests.length === 2) {
                                roomGuests = remainingGuests.splice(0, 2);
                                roomInfoList.push(`1 phòng (2 khách) - Flamingo Đại Lải – Forest In The Sky Resort - Deluxe Sky Residence<br/>
            Khách: ${roomGuests.map(g => g.fullName).join(', ')}`);
                            } else if (remainingGuests.length === 1) {
                                roomGuests = remainingGuests.splice(0, 1);
                                roomInfoList.push(`1 phòng (1 khách) - Flamingo Đại Lải – Forest In The Sky Resort - Deluxe Sky Residence<br/>
            Khách: ${roomGuests.map(g => g.fullName).join(', ')}`);
                            }
                        }

                        const roomInfo = roomInfoList.length > 0 ? roomInfoList.join('<br/><br/>') : '0 khách - Không có phòng ghép';

                        // Thông báo khách chọn singleRoom
                        let singleRoomInfo = '';
                        if (singleRoomGuests.length > 0) {
                            singleRoomInfo = `<p><strong>Lưu ý:</strong> Những khách đã chọn phòng đơn riêng: ${singleRoomGuests.map(g => g.fullName).join(', ')}</p>`;
                        }

                        // ========== EMAIL ==========
                        emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #28a745;">Thanh toán thành công!</h2>
    <p>Xin chào <strong>${updatedBooking.fullNameUser}</strong>,</p>
    <p>Bạn đã <b>thanh toán thành công</b> cho tour 
        <b>${updatedBooking.slotId?.tour?.nameTour || 'N/A'}</b>.
    </p>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Thông tin đặt chỗ:</h3>
        <ul style="list-style: none; padding: 0;">
            <li><strong>Mã đặt chỗ:</strong> ${bookingId}</li>
            <li><strong>Ngày đi:</strong> ${tourDate}</li>
            <li><strong>Người lớn:</strong> ${updatedBooking.adultsTour} người</li>
            <li><strong>Trẻ em:</strong> ${updatedBooking.childrenTour || 0} người</li>
            <li><strong>Trẻ nhỏ:</strong> ${updatedBooking.toddlerTour || 0} người</li>
            <li><strong>Em bé:</strong> ${updatedBooking.infantTour || 0} người</li>
            <li><strong>Tổng giá:</strong> ${totalPriceVN} VNĐ</li>
            <li><strong>Loại thanh toán:</strong> ${updatedBooking.paymentType || 'Không xác định'}</li>
        </ul>

        <h3>Thông tin phòng khách sạn:</h3>
        <p>${roomInfo}</p>
        ${singleRoomInfo}

        <h3>🛏️ Các hạng phòng tiêu biểu:</h3>
        <ul style="list-style: none; padding: 0;">
            <li><b>Deluxe Sky Residence</b> - 60 m², 2 người lớn + 2 trẻ em, Phòng ngủ riêng, phòng khách, sofa, ban công, bồn tắm, view Rừng.</li>
            <li><b>Premier Sky Residence</b> - 66 m², 2 người lớn + 2 trẻ em, Phòng ngủ riêng, phòng khách, sofa, ban công, bồn tắm, view Toàn cảnh.</li>
            <li><b>Executive Sky Residence</b> - 75 m², 2 người lớn + 2 trẻ em, Phòng ngủ riêng, phòng khách, sofa, ban công, bồn tắm, view Toàn cảnh.</li>
            <li><b>Deluxe Sky Residence (2 phòng ngủ)</b> - 103 m², 4 người lớn + 4 trẻ em, 2 phòng ngủ, phòng khách, sofa, ban công, bồn tắm, view Toàn cảnh.</li>
            <li><b>Premier Sky Residence (2 phòng ngủ)</b> - 134 m², 4 người lớn + 4 trẻ em, 2 phòng ngủ, phòng khách, sofa, ban công, bồn tắm, view Toàn cảnh.</li>
            <li><b>Executive Sky Residence (2 phòng ngủ)</b> - 165 m², 4 người lớn + 4 trẻ em, 2 phòng ngủ, phòng khách, sofa, ban công, bồn tắm, view Toàn cảnh.</li>
        </ul>
    </div>
    <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
    <p>Nếu có thắc mắc, vui lòng liên hệ: <strong>support@example.com</strong></p>
</div>
`;
                    }
                    await sendMail({
                        email: updatedBooking.email,
                        subject: `Xác nhận thanh toán ${isHotelBooking ? 'khách sạn' : 'tour'} thành công`,
                        html: emailHtml
                    });

                    console.log('Email xác nhận đã gửi tới:', updatedBooking.email);
                } catch (mailErr) {
                    console.error('Lỗi gửi email:', mailErr);
                }
            }


            return res.redirect(`http://localhost:5173/payment-result?vnp_ResponseCode=00&success=true&bookingId=${bookingId}`);
        } else {
            // Thanh toán thất bại
            if (isHotelBooking) {
                await HotelBooking.findByIdAndUpdate(bookingId, { payment_status: 'failed', booking_status: 'cancelled' });
            } else {
                await TourBookingSchema.findByIdAndUpdate(bookingId, { payment_status: 'cancelled' });
            }
            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Payment failed');
        }
    } catch (error) {
        console.error('Lỗi callback VNPay:', error);
        return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=System error');
    }
});

// Kiểm tra trạng thái booking
Vnpay.get('/booking-status/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await TourBookingSchema.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking không tồn tại'
            });
        }

        return res.status(200).json({
            success: true,
            booking: {
                _id: booking._id,
                payment_status: booking.payment_status,
                isFullyPaid: booking.isFullyPaid,
                fullPaidAt: booking.fullPaidAt,
                payment_method: booking.payment_method,
                totalPriceTour: booking.totalPriceTour,
                fullNameUser: booking.fullNameUser,
                email: booking.email,
                adultsTour: booking.adultsTour,
                childrenTour: booking.childrenTour,
                toddlerTour: booking.toddlerTour,
                infantTour: booking.infantTour
            }
        });

    } catch (error) {
        console.error('Lỗi kiểm tra trạng thái:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Cập nhật thủ công trạng thái (chỉ để debug)
Vnpay.put('/update-status/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { payment_status, isFullyPaid } = req.body;

        const updated = await TourBookingSchema.findByIdAndUpdate(
            bookingId,
            {
                payment_status: payment_status || 'completed',
                isFullyPaid: isFullyPaid !== undefined ? isFullyPaid : true,
                fullPaidAt: new Date(),
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Booking không tồn tại'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật thành công',
            booking: {
                _id: updated._id,
                payment_status: updated.payment_status,
                isFullyPaid: updated.isFullyPaid,
                fullPaidAt: updated.fullPaidAt
            }
        });

    } catch (error) {
        console.error('Lỗi cập nhật trạng thái:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route để xử lý thanh toán trực tiếp từ frontend
Vnpay.post('/process-payment', async (req, res) => {
    try {
        console.log('Body nhận được:', req.body);

        const bookingData = req.body;

        if (!bookingData) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu dữ liệu booking'
            });
        }

        let existingBooking = null;

        // Nếu có bookingId, tìm booking hiện tại
        if (bookingData.bookingId) {
            existingBooking = await TourBookingSchema.findById(bookingData.bookingId);
            if (!existingBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy booking'
                });
            }
            console.log('Tìm thấy booking hiện tại:', existingBooking._id);
        }

        // Sử dụng giá từ request hoặc tính tổng giá nếu không có
        let totalAmount = 0;

        if (bookingData.tourPrice) {
            // Sử dụng giá tour từ request
            totalAmount = bookingData.tourPrice;
        } else if (bookingData.totalPriceTour) {
            // Sử dụng totalPriceTour nếu có
            totalAmount = bookingData.totalPriceTour;
        } else {
            // Tính giá dựa trên số lượng khách (fallback)
            const adultPrice = 5000000; // 5 triệu/người lớn
            const childPrice = 3000000; // 3 triệu/trẻ em
            const toddlerPrice = 1000000; // 1 triệu/trẻ nhỏ
            const infantPrice = 0; // Em bé miễn phí

            totalAmount =
                (bookingData.adultsTour || 0) * adultPrice +
                (bookingData.childrenTour || 0) * childPrice +
                (bookingData.toddlerTour || 0) * toddlerPrice +
                (bookingData.infantTour || 0) * infantPrice;
        }

        // Xử lý loại thanh toán (đặt cọc hay thanh toán đầy đủ)
        if (bookingData.isFullPayment === false) {
            // Nếu là đặt cọc, chỉ tính 50% tổng tiền
            totalAmount = Math.round(totalAmount * 0.5);
        }

        // Sử dụng booking hiện tại hoặc tạo mới nếu cần
        const bookingToUse = existingBooking || new TourBookingSchema({
            ...bookingData,
            payment_status: 'pending',
            isFullyPaid: false,
            createdAt: new Date()
        });

        if (!existingBooking) {
            await bookingToUse.save();
            console.log('Booking mới đã được tạo:', bookingToUse._id);
        }

        console.log('Tổng giá tour:', totalAmount);
        console.log('Loại thanh toán:', bookingData.paymentType);

        // Cấu hình VNPay
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Tạo thông tin đơn hàng dựa trên loại thanh toán
        let orderInfo = '';
        if (bookingData.isFullPayment === false) {
            orderInfo = `Đặt cọc tour #${bookingToUse._id}`;
        } else {
            orderInfo = `Thanh toán đầy đủ tour #${bookingToUse._id}`;
        }

        // Tạo URL thanh toán
        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: totalAmount, // VNPay yêu cầu số tiền tính bằng xu
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${bookingToUse._id}-${Date.now()}`,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `http://localhost:8080/api/vnpay/payment-callback`,
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 giờ
        });

        console.log('Generated VNPay URL:', paymentUrl);

        return res.status(200).json({
            success: true,
            paymentUrl,
            bookingId: bookingToUse._id,
            paymentType: bookingData.paymentType,
            amount: totalAmount,
            isExistingBooking: !!existingBooking
        });

    } catch (error) {
        console.error('Lỗi tạo thanh toán:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route test callback
Vnpay.get('/test-callback', async (req, res) => {
    try {
        console.log('Test callback được gọi với query:', req.query);

        const responseCode = req.query.vnp_ResponseCode;
        const txnRef = req.query.vnp_TxnRef;
        const bookingId = txnRef ? txnRef.split('-')[0] : null;

        console.log('Response Code:', responseCode);
        console.log('Booking ID:', bookingId);

        if (responseCode === '00' && bookingId) {
            const updatedBooking = await TourBookingSchema.findByIdAndUpdate(
                bookingId,
                {
                    payment_status: 'completed',
                    isFullyPaid: true,
                    fullPaidAt: new Date(),
                },
                { new: true }
            );

            console.log('Booking đã được cập nhật:', updatedBooking);
        }

        return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=00&success=true');

    } catch (error) {
        console.error('Lỗi test callback:', error);
        return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Test error');
    }
});

// Route để xử lý callback từ frontend (khi user quay lại từ VNPay)
Vnpay.get('/frontend-callback', async (req, res) => {
    try {
        console.log('Frontend callback được gọi với query:', req.query);

        const responseCode = req.query.vnp_ResponseCode;
        const txnRef = req.query.vnp_TxnRef;
        const bookingId = txnRef ? txnRef.split('-')[0] : null;

        console.log('Response Code:', responseCode);
        console.log('Booking ID:', bookingId);

        if (responseCode === '00' && bookingId) {
            // Thanh toán thành công
            const updatedBooking = await TourBookingSchema.findByIdAndUpdate(
                bookingId,
                {
                    payment_status: 'completed',
                    isFullyPaid: true,
                    fullPaidAt: new Date(),
                },
                { new: true }
            );

            if (updatedBooking) {
                console.log('Booking đã được cập nhật thành công:', updatedBooking._id);

                // Gửi email xác nhận
                if (updatedBooking.email) {
                    try {
                        const totalPriceVN = updatedBooking.totalPriceTour.toLocaleString('vi-VN');

                        await sendMail({
                            email: updatedBooking.email,
                            subject: 'Xác nhận thanh toán tour thành công',
                            html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h2 style="color: #28a745;">Thanh toán thành công!</h2>
                                    <p>Xin chào <strong>${updatedBooking.fullNameUser}</strong>,</p>
                                    <p>Bạn đã <b>thanh toán thành công</b> cho tour.</p>
                                    
                                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                        <h3>Thông tin đặt chỗ:</h3>
                                        <ul style="list-style: none; padding: 0;">
                          <li><strong>Mã đặt chỗ:</strong> ${bookingId}</li>
                                            <li><strong>Người lớn:</strong> ${updatedBooking.adultsTour} người</li>
                                            <li><strong>Trẻ em:</strong> ${updatedBooking.childrenTour || 0} người</li>
                                            <li><strong>Trẻ nhỏ:</strong> ${updatedBooking.toddlerTour || 0} người</li>
                                            <li><strong>Em bé:</strong> ${updatedBooking.infantTour || 0} người</li>
                          <li><strong>Tổng giá:</strong> ${totalPriceVN} VNĐ</li>
                        </ul>
                                    </div>
                                    
                        <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                                </div>
                      `,
                        });

                        console.log('Email xác nhận đã gửi tới:', updatedBooking.email);
                    } catch (mailErr) {
                        console.error('Lỗi gửi email:', mailErr);
                    }
                }

                return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=00&success=true&bookingId=' + bookingId);
            } else {
                console.error('Không tìm thấy booking:', bookingId);
                return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Booking not found');
            }
        } else {
            // Thanh toán thất bại
            if (bookingId) {
                await TourBookingSchema.findByIdAndUpdate(
                    bookingId,
                    { payment_status: 'cancelled' }
                );
            }

            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Payment failed');
        }

    } catch (error) {
        console.error('Lỗi frontend callback:', error);
        return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=System error');
    }
});

// Route để test cập nhật trạng thái thủ công
Vnpay.get('/manual-update/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;

        console.log('Manual update cho booking:', bookingId);

        const updatedBooking = await TourBookingSchema.findByIdAndUpdate(
            bookingId,
            {
                payment_status: 'completed',
                isFullyPaid: true,
                fullPaidAt: new Date(),
            },
            { new: true }
        );

        if (updatedBooking) {
            console.log('Booking đã được cập nhật:', updatedBooking._id);
            return res.json({
                success: true,
                message: 'Cập nhật thành công',
                booking: {
                    _id: updatedBooking._id,
                    payment_status: updatedBooking.payment_status,
                    isFullyPaid: updatedBooking.isFullyPaid,
                    fullPaidAt: updatedBooking.fullPaidAt
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Booking không tồn tại'
            });
        }

    } catch (error) {
        console.error('Lỗi manual update:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route để test callback với dữ liệu mẫu
Vnpay.get('/test-payment-callback/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;

        console.log('Test payment callback cho booking:', bookingId);

        // Giả lập dữ liệu callback từ VNPay
        const mockCallbackData = {
            vnp_ResponseCode: '00',
            vnp_TxnRef: `${bookingId}-${Date.now()}`,
            vnp_Amount: '6699000000',
            vnp_OrderInfo: `Thanh toán đầy đủ đơn #${bookingId}`,
            vnp_TransactionNo: '12345678',
            vnp_BankCode: 'NCB',
            vnp_PayDate: '20250802101732',
            vnp_SecureHash: 'test_hash'
        };

        // Xử lý như callback thật
        const responseCode = mockCallbackData.vnp_ResponseCode;
        const txnRef = mockCallbackData.vnp_TxnRef;
        const extractedBookingId = txnRef.split('-')[0];

        console.log('Response Code:', responseCode);
        console.log('Booking ID:', extractedBookingId);

        if (responseCode === '00' && extractedBookingId) {
            const updatedBooking = await TourBookingSchema.findByIdAndUpdate(
                extractedBookingId,
                {
                    payment_status: 'completed',
                    isFullyPaid: true,
                    fullPaidAt: new Date(),
                },
                { new: true }
            );

            if (updatedBooking) {
                console.log('Booking đã được cập nhật thành công:', updatedBooking._id);
                return res.json({
                    success: true,
                    message: 'Test callback thành công',
                    booking: {
                        _id: updatedBooking._id,
                        payment_status: updatedBooking.payment_status,
                        isFullyPaid: updatedBooking.isFullyPaid,
                        fullPaidAt: updatedBooking.fullPaidAt
                    }
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Booking không tồn tại'
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Response code không hợp lệ'
            });
        }

    } catch (error) {
        console.error('Lỗi test callback:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route duplicate đã được xóa để tránh xung đột với route /payment-callback chính

// Route xử lý hoàn tiền
Vnpay.post('/process-refund', async (req, res) => {
    try {
        const { bookingId, refundReason, refundAmount, refundType } = req.body;

        console.log('Xử lý hoàn tiền cho booking:', bookingId);

        // Tìm booking
        const booking = await TourBookingSchema.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy booking'
            });
        }

        // Kiểm tra trạng thái booking
        if (booking.payment_status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Booking chưa thanh toán hoàn tất'
            });
        }

        // Kiểm tra xem booking có bị hủy không
        if (!booking.cancel_status || booking.cancel_status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể hoàn tiền cho booking đã được hủy'
            });
        }

        // Tính toán số tiền hoàn
        let refundAmountToProcess = refundAmount;
        if (!refundAmountToProcess) {
            // Tính theo chính sách hoàn tiền
            const tourDate = new Date(booking.slotId?.dateTour);
            const currentDate = new Date();
            const daysUntilTour = Math.ceil((tourDate - currentDate) / (1000 * 60 * 60 * 24));

            if (refundType === 'customer_cancellation') {
                if (daysUntilTour > 14) {
                    refundAmountToProcess = booking.totalPriceTour; // 100%
                } else if (daysUntilTour > 7) {
                    refundAmountToProcess = booking.totalPriceTour * 0.7; // 70%
                } else if (daysUntilTour > 0) {
                    refundAmountToProcess = booking.totalPriceTour * 0.5; // 50%
                } else {
                    refundAmountToProcess = 0; // No-show
                }
            } else if (refundType === 'company_cancellation') {
                refundAmountToProcess = booking.totalPriceTour; // 100%
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ hỗ trợ hoàn tiền khi khách hàng hủy hoặc công ty hủy'
                });
            }
        }

        // Cấu hình VNPay
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Tạo URL hoàn tiền VNPay
        const refundUrl = await vnpay.buildRefundUrl({
            vnp_Amount: refundAmountToProcess * 100, // VNPay yêu cầu số tiền tính bằng xu
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${booking._id}-refund-${Date.now()}`,
            vnp_OrderInfo: `Hoàn tiền tour #${booking._id} - ${refundReason}`,
            vnp_TransactionType: '02', // Refund
            vnp_CreateDate: dateFormat(new Date()),
        });

        // Cập nhật trạng thái hoàn tiền
        await TourBookingSchema.findByIdAndUpdate(bookingId, {
            refund_status: 'processing',
            refund_amount: refundAmountToProcess,
            refund_method: 'bank_transfer',
            refund_note: refundReason,
            cancel_reason: refundReason,
            cancel_status: 'approved',
            cancelledAt: new Date()
        });

        console.log('URL hoàn tiền đã tạo:', refundUrl);

        return res.status(200).json({
            success: true,
            refundUrl,
            bookingId: booking._id,
            refundAmount: refundAmountToProcess,
            refundReason,
            refundType
        });

    } catch (error) {
        console.error('Lỗi xử lý hoàn tiền:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route tạo thanh toán cho hotel booking
Vnpay.post('/create-hotel-payment', async (req, res) => {
    try {
        const { bookingId, amount, orderInfo, orderType, locale, returnUrl, ipAddr } = req.body;

        console.log('Tạo thanh toán hotel với dữ liệu:', req.body);

        // Kiểm tra booking tồn tại
        const booking = await HotelBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy booking'
            });
        }

        // Cấu hình VNPay
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Tạo URL thanh toán
        const paymentUrl = await vnpay.buildPaymentUrl({
            vnp_Amount: amount * 100, // VNPay yêu cầu số tiền tính bằng xu
            vnp_IpAddr: ipAddr || '127.0.0.1',
            vnp_TxnRef: `${bookingId}-${Date.now()}`,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: returnUrl || `http://localhost:8080/api/vnpay/hotel-payment-callback`,
            vnp_Locale: locale === 'en' ? VnpLocale.EN : VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(new Date(Date.now() + 24 * 60 * 60 * 1000)), // 24 giờ
        });

        console.log('URL thanh toán hotel đã tạo:', paymentUrl);

        return res.status(200).json({
            success: true,
            paymentUrl,
            bookingId: booking._id
        });

    } catch (error) {
        console.error('Lỗi tạo thanh toán hotel:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route hoàn tiền cho hotel booking
Vnpay.post('/process-hotel-refund', async (req, res) => {
    try {
        const { bookingId, refundType, refundReason } = req.body;

        console.log('Xử lý hoàn tiền hotel với dữ liệu:', req.body);

        // Kiểm tra booking tồn tại
        const booking = await HotelBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy booking'
            });
        }

        // Tính toán số tiền hoàn
        let refundAmountToProcess = 0;
        const checkInDate = new Date(booking.checkInDate);
        const currentDate = new Date();
        const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        if (refundType === 'customer_cancellation') {
            if (daysUntilCheckIn > 7) {
                refundAmountToProcess = booking.totalPrice * 0.8; // 80%
            } else if (daysUntilCheckIn > 3) {
                refundAmountToProcess = booking.totalPrice * 0.5; // 50%
            } else if (daysUntilCheckIn > 0) {
                refundAmountToProcess = booking.totalPrice * 0.2; // 20%
            } else {
                refundAmountToProcess = 0; // No-show
            }
        } else if (refundType === 'hotel_cancellation') {
            refundAmountToProcess = booking.totalPrice; // 100%
        }

        // Cấu hình VNPay
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Tạo URL hoàn tiền VNPay
        const refundUrl = await vnpay.buildRefundUrl({
            vnp_Amount: refundAmountToProcess * 100, // VNPay yêu cầu số tiền tính bằng xu
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${booking._id}-refund-${Date.now()}`,
            vnp_OrderInfo: `Hoàn tiền đặt phòng #${booking._id} - ${refundReason}`,
            vnp_TransactionType: '02', // Refund
            vnp_CreateDate: dateFormat(new Date()),
        });

        // Cập nhật trạng thái hoàn tiền
        await HotelBooking.findByIdAndUpdate(bookingId, {
            refund_status: 'processing',
            refund_amount: refundAmountToProcess,
            refund_method: 'bank_transfer',
            refund_note: refundReason,
            cancel_reason: refundReason,
            booking_status: 'cancelled',
            cancelledAt: new Date()
        });

        console.log('URL hoàn tiền hotel đã tạo:', refundUrl);

        return res.status(200).json({
            success: true,
            refundUrl,
            bookingId: booking._id,
            refundAmount: refundAmountToProcess,
            refundReason,
            refundType
        });

    } catch (error) {
        console.error('Lỗi xử lý hoàn tiền hotel:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Route callback hoàn tiền
Vnpay.get('/refund-callback', async (req, res) => {
    try {
        console.log('Nhận callback hoàn tiền từ VNPay:', req.query);

        const responseCode = req.query.vnp_ResponseCode;
        const txnRef = req.query.vnp_TxnRef;
        const bookingId = txnRef.split('-')[0];

        console.log('Response Code:', responseCode);
        console.log('Booking ID:', bookingId);

        if (responseCode === '00') {
            // Hoàn tiền thành công
            console.log('Hoàn tiền thành công cho booking:', bookingId);

            const updatedBooking = await TourBookingSchema.findByIdAndUpdate(
                bookingId,
                {
                    refund_status: 'completed',
                    refund_date: new Date(),
                    payment_status: 'refunded'
                },
                { new: true }
            ).populate({
                path: 'slotId',
                select: 'dateTour tour',
                populate: {
                    path: 'tour',
                    select: 'nameTour',
                },
            });

            if (!updatedBooking) {
                console.error('Không tìm thấy booking:', bookingId);
                return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Booking not found');
            }

            console.log('Booking đã được cập nhật hoàn tiền:', updatedBooking._id);

            // Gửi email thông báo hoàn tiền
            if (updatedBooking.email) {
                try {
                    const refundAmountVN = updatedBooking.refund_amount.toLocaleString('vi-VN');

                    await sendMail({
                        email: updatedBooking.email,
                        subject: 'Xác nhận hoàn tiền tour',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #28a745;">Hoàn tiền thành công!</h2>
                                <p>Xin chào <strong>${updatedBooking.fullNameUser}</strong>,</p>
                                <p>Chúng tôi đã <b>hoàn tiền thành công</b> cho tour <b>${updatedBooking.slotId?.tour?.nameTour || 'N/A'}</b>.</p>
                                
                                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                    <h3>Thông tin hoàn tiền:</h3>
                                    <ul style="list-style: none; padding: 0;">
                <li><strong>Mã đặt chỗ:</strong> ${bookingId}</li>
                                        <li><strong>Số tiền hoàn:</strong> ${refundAmountVN} VNĐ</li>
                                        <li><strong>Lý do hoàn tiền:</strong> ${updatedBooking.refund_note || 'N/A'}</li>
                                        <li><strong>Ngày hoàn tiền:</strong> ${new Date().toLocaleDateString('vi-VN')}</li>
              </ul>
                                </div>
                                
                                <p>Tiền sẽ được chuyển về tài khoản của bạn trong 3-5 ngày làm việc.</p>
                                <p>Nếu có thắc mắc, vui lòng liên hệ: <strong>support@example.com</strong></p>
                            </div>
            `,
                    });

                    console.log('Email thông báo hoàn tiền đã gửi tới:', updatedBooking.email);
                } catch (mailErr) {
                    console.error('Lỗi gửi email hoàn tiền:', mailErr);
                }
            }

            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=00&success=true&type=refund');

        } else {
            // Hoàn tiền thất bại
            console.log('Hoàn tiền thất bại cho booking:', bookingId);

            await TourBookingSchema.findByIdAndUpdate(
                bookingId,
                {
                    refund_status: 'pending',
                    cancel_status: 'pending'
                }
            );

            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Refund failed');
        }

    } catch (error) {
        console.error('Lỗi xử lý callback hoàn tiền:', error);
        return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=System error');
    }
});

// Route callback cho hotel booking
Vnpay.get('/hotel-payment-callback', async (req, res) => {
    try {
        console.log('Nhận callback từ VNPay (Hotel Booking):', req.query);

        // Cấu hình VNPay
        const vnpay = new VNPay({
            tmnCode: 'LH54Z11C',
            secureSecret: 'PO0WDG07TJOGP1P8SO6Z9PHVPIBUWBGQ',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // Kiểm tra chữ ký
        const isValid = vnpay.verifyReturnUrl(req.query);
        if (!isValid) {
            console.error('Chữ ký không hợp lệ');
            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Invalid signature');
        }

        const responseCode = req.query.vnp_ResponseCode;
        const txnRef = req.query.vnp_TxnRef;
        const bookingId = txnRef.split('-')[0];

        console.log('Response Code:', responseCode);
        console.log('Hotel Booking ID:', bookingId);

        if (responseCode === '00') {
            // Thanh toán thành công
            console.log('Thanh toán hotel thành công cho booking:', bookingId);

            // Lấy thông tin booking để xác định loại thanh toán
            const booking = await HotelBooking.findById(bookingId);

            let updateData = {
                booking_status: 'confirmed',
                paidAt: new Date(),
            };

            // Xác định payment_status dựa trên loại thanh toán
            if (booking.isDeposit) {
                if (booking.payment_status === 'pending') {
                    // Thanh toán cọc
                    updateData.payment_status = 'deposit_paid';
                } else if (booking.payment_status === 'deposit_paid') {
                    // Thanh toán phần còn lại
                    updateData.payment_status = 'confirmed';
                    updateData.isFullyPaid = true;
                }
            } else {
                // Thanh toán toàn bộ
                updateData.payment_status = 'confirmed';
                updateData.isFullyPaid = true;
            }

            const updatedBooking = await HotelBooking.findByIdAndUpdate(
                bookingId,
                updateData,
                { new: true }
            );

            if (updatedBooking) {
                console.log('Hotel booking đã được cập nhật thành công:', updatedBooking._id);

                // Gửi email xác nhận
                if (updatedBooking.guestInfo && updatedBooking.guestInfo.email) {
                    try {
                        await sendMail({
                            to: updatedBooking.guestInfo.email,
                            subject: 'Xác nhận đặt phòng khách sạn thành công',
                            html: `
                                <h2>Xác nhận đặt phòng thành công</h2>
                                <p>Chào ${updatedBooking.guestInfo.fullName},</p>
                                <p>Đặt phòng của bạn đã được xác nhận thành công!</p>
                                <p><strong>Mã đặt phòng:</strong> ${updatedBooking._id}</p>
                                <p><strong>Khách sạn:</strong> ${updatedBooking.hotelId.hotelName}</p>
                                <p><strong>Ngày nhận phòng:</strong> ${new Date(updatedBooking.checkInDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Ngày trả phòng:</strong> ${new Date(updatedBooking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                                <p><strong>Tổng tiền:</strong> ${updatedBooking.totalPrice.toLocaleString('vi-VN')} VND</p>
                                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                            `
                        });
                        console.log('Email xác nhận hotel đã gửi tới:', updatedBooking.guestInfo.email);
                    } catch (mailErr) {
                        console.error('Lỗi gửi email hotel:', mailErr);
                    }
                }
            }

            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=00&success=true&type=hotel');

        } else {
            // Thanh toán thất bại
            console.log('Thanh toán hotel thất bại cho booking:', bookingId);

            await HotelBooking.findByIdAndUpdate(
                bookingId,
                {
                    payment_status: 'failed',
                    booking_status: 'cancelled'
                }
            );

            return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=Hotel payment failed');
        }

    } catch (error) {
        console.error('Lỗi xử lý callback hotel:', error);
        return res.redirect('http://localhost:5173/payment-result?vnp_ResponseCode=99&success=false&message=System error');
    }
});

module.exports = Vnpay;
