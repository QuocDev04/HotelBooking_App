const BookingTour = require('../../models/Tour/TourBooking');
const DateTour = require('../../models/Tour/DateTour');
const Tour = require('../../models/Tour/TourModel');
const User = require('../../models/People/UserModel');

/**
 * Controller xử lý hủy tour và tính toán hoàn tiền
 */
class TourCancellationController {
    /**
     * Hủy tour đã đặt
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async cancelTourBooking(req, res) {
        try {
            const { bookingId, cancelReason } = req.body;
            const userId = req.user._id;

            // Kiểm tra booking có tồn tại không
            const booking = await BookingTour.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin đặt tour' });
            }

            // Kiểm tra xem người dùng có quyền hủy booking này không
            if (booking.userId.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền hủy đặt tour này' });
            }

            // Kiểm tra trạng thái booking hiện tại
            if (booking.payment_status === 'cancelled' || booking.payment_status === 'pending_cancel') {
                return res.status(400).json({ success: false, message: 'Tour đã được hủy hoặc đang chờ xử lý hủy' });
            }

            // Lấy thông tin tour và ngày khởi hành
            const dateSlot = await DateTour.findById(booking.slotId).populate('tourId');
            if (!dateSlot) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin lịch trình tour' });
            }

            const tour = dateSlot.tourId;
            const now = new Date();
            const departureDate = new Date(dateSlot.startDate);

            // Kiểm tra tour đã khởi hành chưa
            if (now >= departureDate) {
                return res.status(400).json({ success: false, message: 'Tour đã khởi hành, không thể hủy' });
            }

            // Tính số ngày trước khởi hành
            const diffDays = (departureDate - now) / (1000 * 60 * 60 * 24);

            // Tính thời gian từ lúc đặt tour đến hiện tại
            const bookingTime = booking.createdAt;
            const hoursSinceBooking = (now - bookingTime) / (1000 * 60 * 60);

            // Xác định có hoàn tiền vé máy bay không
            let flightRefundAmount = 0;
            if (tour.hasFlightTicket) {
                if (hoursSinceBooking <= 24) {
                    // Nếu hủy trong vòng 24h sau khi đặt, hoàn toàn bộ tiền vé máy bay
                    flightRefundAmount = tour.flightTicketPrice * booking.adultsTour;
                } else {
                    // Sau 24h, không hoàn tiền vé máy bay
                    flightRefundAmount = 0;
                }
            }

            // Xác định tỷ lệ hoàn tiền cho các dịch vụ khác
            let otherServicesRefundRate = 0;
            if (diffDays >= 7) otherServicesRefundRate = 1.0;
            else if (diffDays >= 3) otherServicesRefundRate = 0.5;
            else if (diffDays >= 1) otherServicesRefundRate = 0.2;
            else otherServicesRefundRate = 0;

            // Tính số tiền hoàn lại
            const flightTicketPrice = tour.hasFlightTicket ? tour.flightTicketPrice * booking.adultsTour : 0;
            const otherServicesAmount = booking.totalPriceTour - flightTicketPrice;
            const otherServicesRefund = otherServicesAmount * otherServicesRefundRate;
            const totalRefundAmount = flightRefundAmount + otherServicesRefund;

            // Cập nhật trạng thái booking và thêm thông tin hủy
            booking.payment_status = 'pending_cancel';
            booking.cancelRequestedAt = now;
            booking.cancelReason = cancelReason || 'Người dùng hủy tour';

            // Thêm chi tiết hủy và hoàn tiền
            booking.cancellationDetails = {
                cancelledAt: now,
                cancelledByUser: true,
                refundAmount: totalRefundAmount,
                flightRefundAmount: flightRefundAmount,
                otherServicesRefundAmount: otherServicesRefund,
                refundStatus: 'pending',
                refundNote: `Hoàn tiền tự động tính toán: Vé máy bay ${flightRefundAmount}, Dịch vụ khác ${otherServicesRefund}`
            };

            await booking.save();

            // Trả về thông tin chi tiết về việc hủy và hoàn tiền
            return res.status(200).json({
                success: true,
                message: 'Yêu cầu hủy tour đã được ghi nhận',
                data: {
                    bookingId: booking._id,
                    tourName: tour.nameTour,
                    departureDate: dateSlot.startDate,
                    cancelRequestedAt: booking.cancelRequestedAt,
                    refundDetails: {
                        totalRefundAmount,
                        flightRefundAmount,
                        otherServicesRefund,
                        refundStatus: 'pending'
                    }
                }
            });
        } catch (error) {
            console.error('Error in cancelTourBooking:', error);
            return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi hủy tour', error: error.message });
        }
    }

    /**
     * Admin xác nhận hủy tour và cập nhật trạng thái hoàn tiền
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async confirmCancellation(req, res) {
        try {
            const { bookingId, refundStatus, refundNote } = req.body;
            const adminId = req.admin._id;

            // Kiểm tra booking có tồn tại không
            const booking = await BookingTour.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin đặt tour' });
            }

            // Kiểm tra trạng thái booking hiện tại
            if (booking.payment_status !== 'pending_cancel') {
                return res.status(400).json({ success: false, message: 'Booking không ở trạng thái chờ hủy' });
            }

            // Cập nhật trạng thái booking
            booking.payment_status = 'cancelled';
            booking.cancelledAt = new Date();
            booking.cancelledBy = adminId;

            // Cập nhật thông tin hoàn tiền
            if (booking.cancellationDetails) {
                booking.cancellationDetails.refundStatus = refundStatus || 'processing';
                if (refundNote) {
                    booking.cancellationDetails.refundNote += `\n${refundNote}`;
                }
                
                // Nếu hoàn tiền hoàn tất
                if (refundStatus === 'completed') {
                    booking.cancellationDetails.refundCompletedAt = new Date();
                }
            }

            await booking.save();

            return res.status(200).json({
                success: true,
                message: 'Đã xác nhận hủy tour và cập nhật trạng thái hoàn tiền',
                data: {
                    bookingId: booking._id,
                    payment_status: booking.payment_status,
                    cancelledAt: booking.cancelledAt,
                    refundStatus: booking.cancellationDetails?.refundStatus || 'pending'
                }
            });
        } catch (error) {
            console.error('Error in confirmCancellation:', error);
            return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xác nhận hủy tour', error: error.message });
        }
    }

    /**
     * Lấy danh sách các yêu cầu hủy tour đang chờ xử lý
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async getPendingCancellations(req, res) {
        try {
            const pendingCancellations = await BookingTour.find({ payment_status: 'pending_cancel' })
                .populate({
                    path: 'slotId',
                    populate: {
                        path: 'tourId',
                        model: 'Tour'
                    }
                })
                .populate('userId', 'fullName email phone');

            return res.status(200).json({
                success: true,
                count: pendingCancellations.length,
                data: pendingCancellations
            });
        } catch (error) {
            console.error('Error in getPendingCancellations:', error);
            return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu hủy tour', error: error.message });
        }
    }
}

module.exports = new TourCancellationController(); 