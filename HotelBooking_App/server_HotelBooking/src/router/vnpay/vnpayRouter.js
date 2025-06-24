import express from 'express';
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay';
import BookingOnySchema from '../../models/Room/BookingRoom';
import checkOutTourSchema from '../../models/Tour/checkOutTour';
import RoomModel from '../../models/Room/RoomModel'; // chắc chắn import đúng path nhé

const Vnpay = express.Router();

Vnpay.post('/vnpay/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { bookingType } = req.query; // hoặc req.body tùy bạn

        if (!bookingType || (bookingType !== 'tour' && bookingType !== 'room')) {
            return res.status(400).json({ success: false, message: 'Thiếu hoặc sai bookingType' });
        }

        let booking = null;

        if (bookingType === 'tour') {
            booking = await checkOutTourSchema.findById(bookingId);
            console.log("booking tìm thấy (tour):", booking);
        } else if (bookingType === 'room') {
            booking = await BookingOnySchema.findById(bookingId);
            console.log("booking tìm thấy (room):", booking);
        }

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking không tồn tại' });
        }

        let totalPrice = 0;
        if (bookingType === 'tour') {
            totalPrice = booking.amount;
        } else if (bookingType === 'room') {
            totalPrice = booking.total_price;
        }

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
            vnp_Amount: totalPrice,
            vnp_IpAddr: req.ip || '127.0.0.1',
            vnp_TxnRef: `${booking._id}-${bookingType}-${Date.now()}`, // thêm bookingType để callback xử lý đúng
            vnp_OrderInfo: `Thanh toán đơn ${bookingType} #${booking._id}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: `http://localhost:8080/api/check-payment-vnpay`,
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

        const isValid = vnpay.verifyReturnUrl(req.query);
        if (!isValid) {
            return res.redirect('http://localhost:5173/payment-result?success=false&message=Invalid signature');
        }

        const responseCode = req.query.vnp_ResponseCode;
        const txnRef = req.query.vnp_TxnRef;
        const parts = txnRef.split('-');
        const bookingId = parts[0];
        const bookingType = parts[1];

        if (responseCode === '00') {
            if (bookingType === 'tour') {
                const updated = await checkOutTourSchema.findByIdAndUpdate(
                    bookingId,
                    {
                        payment_status: 'completed',
                        payment_date: new Date(),
                    },
                    { new: true }
                ).populate('BookingTourId');

                // Cập nhật trạng thái phòng nếu có
                const booking = updated?.BookingTourId;
                if (booking?.itemRoom?.length > 0) {
                    const roomIds = booking.itemRoom.map(item => item.roomId);
                    await Promise.all(roomIds.map(async id => {
                        const room = await RoomModel.findById(id);
                        if (room) {
                            room.statusRoom = 'full';
                            await room.save();
                        }
                    }));
                }
            } else if (bookingType === 'room') {
                await BookingOnySchema.findByIdAndUpdate(
                    bookingId,
                    {
                        payment_status: 'completed',
                        payment_date: new Date(),
                    }
                );
                // Nếu có logic update trạng thái phòng cho room booking, bạn thêm ở đây
            }

            return res.redirect('http://localhost:5173/payment-result');

        } else {
            // Thanh toán thất bại
            if (bookingType === 'tour') {
                await checkOutTourSchema.findByIdAndUpdate(
                    bookingId,
                    { payment_status: 'cancelled' }
                );
                const payment = await checkOutTourSchema.findById(bookingId).populate('BookingTourId');
                const booking = payment?.BookingTourId;
                if (booking?.itemRoom?.length > 0) {
                    const roomIds = booking.itemRoom.map(item => item.roomId);
                    await Promise.all(roomIds.map(async id => {
                        const room = await RoomModel.findById(id);
                        if (room) {
                            room.statusRoom = 'available';
                            await room.save();
                        }
                    }));
                }
            } else if (bookingType === 'room') {
                await BookingOnySchema.findByIdAndUpdate(
                    bookingId,
                    { payment_status: 'cancelled' }
                );
                // Nếu có logic update trạng thái phòng cho room booking khi thất bại, bạn thêm ở đây
            }

            return res.redirect('http://localhost:5173/payment-result?success=false&message=Giao dịch thất bại');
        }

    } catch (error) {
        console.error('Lỗi xử lý callback:', error);
        return res.redirect('http://localhost:5173/payment-result?success=false&message=Lỗi hệ thống');
    }
});

export default Vnpay;
