const TourBookingSchema = require('../../models/Tour/TourBooking');
const DateTourModel = require('../../models/Tour/DateTour');

// Hàm tự động hủy các booking tiền mặt quá hạn 48h
const autoCancel48hExpiredBookings = async (req, res) => {
    try {
        const now = new Date();
        
        // Tìm tất cả booking tiền mặt đã quá hạn 48h và chưa bị hủy
        const expiredBookings = await TourBookingSchema.find({
            payment_method: 'cash',
            payment_status: { $in: ['pending'] }, // Chỉ hủy những booking đang pending
            cashPaymentDeadline: { $lt: now }, // Đã quá thời hạn
            cashPaymentDeadline: { $ne: null } // Có thiết lập thời hạn
        }).populate('slotId');

        let cancelledCount = 0;
        const cancelledBookings = [];

        for (const booking of expiredBookings) {
            try {
                // Cập nhật trạng thái booking thành cancelled
                booking.payment_status = 'cancelled';
                booking.cancelledAt = new Date();
                booking.cancelReason = 'Tự động hủy do quá hạn thanh toán tiền mặt (48h)';
                await booking.save();

                // Hoàn trả số ghế về slot
                if (booking.slotId) {
                    const totalPassengers = booking.adultsTour + 
                        (booking.childrenTour || 0) + 
                        (booking.toddlerTour || 0) + 
                        (booking.infantTour || 0);
                    
                    booking.slotId.availableSeats += totalPassengers;
                    await booking.slotId.save();
                }

                cancelledCount++;
                cancelledBookings.push({
                    bookingId: booking._id,
                    customerName: booking.fullNameUser,
                    email: booking.email,
                    phone: booking.phone,
                    totalAmount: booking.totalPriceTour,
                    deadline: booking.cashPaymentDeadline
                });

                console.log(`✅ Đã hủy booking ${booking._id} do quá hạn thanh toán tiền mặt`);
            } catch (error) {
                console.error(`❌ Lỗi khi hủy booking ${booking._id}:`, error);
            }
        }

        // Trả về kết quả
        if (res) {
            res.status(200).json({
                success: true,
                message: `Đã tự động hủy ${cancelledCount} booking quá hạn thanh toán tiền mặt`,
                cancelledCount,
                cancelledBookings
            });
        }

        return {
            success: true,
            cancelledCount,
            cancelledBookings
        };

    } catch (error) {
        console.error('❌ Lỗi trong quá trình tự động hủy booking:', error);
        
        if (res) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi tự động hủy booking',
                error: error.message
            });
        }
        
        return {
            success: false,
            error: error.message
        };
    }
};

// Hàm kiểm tra booking sắp hết hạn (còn 6h)
const checkBookingsNearExpiry = async (req, res) => {
    try {
        const now = new Date();
        const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
        
        // Tìm booking sắp hết hạn trong 6h tới
        const nearExpiryBookings = await TourBookingSchema.find({
            payment_method: 'cash',
            payment_status: 'pending',
            cashPaymentDeadline: {
                $gte: now,
                $lte: sixHoursLater
            }
        }).populate({
            path: 'slotId',
            populate: {
                path: 'tour',
                select: 'nameTour destination'
            }
        });

        const warningBookings = nearExpiryBookings.map(booking => ({
            bookingId: booking._id,
            customerName: booking.fullNameUser,
            email: booking.email,
            phone: booking.phone,
            tourName: booking.slotId?.tour?.nameTour,
            destination: booking.slotId?.tour?.destination,
            totalAmount: booking.totalPriceTour,
            deadline: booking.cashPaymentDeadline,
            hoursRemaining: Math.ceil((booking.cashPaymentDeadline - now) / (1000 * 60 * 60))
        }));

        if (res) {
            res.status(200).json({
                success: true,
                message: `Có ${warningBookings.length} booking sắp hết hạn thanh toán`,
                count: warningBookings.length,
                bookings: warningBookings
            });
        }

        return {
            success: true,
            count: warningBookings.length,
            bookings: warningBookings
        };

    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra booking sắp hết hạn:', error);
        
        if (res) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi kiểm tra booking sắp hết hạn',
                error: error.message
            });
        }
        
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    autoCancel48hExpiredBookings,
    checkBookingsNearExpiry
};