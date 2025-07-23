const TourBookingSchema = require("../../models/Tour/TourBooking.js");
const DateTourModel = require("../../models/Tour/DateTour.js");
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');


// Lấy thông tin booking theo ID
const getByIdBookingTour = async (req, res) => {
    try {
        const booking = await TourBookingSchema.findById(req.params.id)
            .populate('userId', 'username email')
            .populate({
                path: 'slotId',
                select: 'dateTour availableSeats tour',
                populate: {
                    path: 'tour',  
                    select: 'nameTour destination departure_location duration finalPrice imageTour tourType', 
                }
            });

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy booking" });
        }

        res.status(200).json({
            success: true,
            booking: booking
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Admin: Lấy tất cả booking để quản lý
const getAllBookingsForAdmin = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;
        
        let query = {};
        
        // Filter theo trạng thái
        if (status && status !== 'all') {
            query.payment_status = status;
        }
        
        // Search theo tên tour hoặc tên khách hàng
        if (search) {
            query.$or = [
                { fullNameUser: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        const skip = (page - 1) * limit;
        
        const bookings = await TourBookingSchema.find(query)
            .populate('userId', 'username email')
            .populate({
                path: 'slotId',
                select: 'dateTour availableSeats tour',
                populate: {
                    path: 'tour',
                    select: 'nameTour destination departure_location duration finalPrice imageTour tourType',
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await TourBookingSchema.countDocuments(query);
        
        res.status(200).json({
            success: true,
            bookings: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Admin: Xác nhận hủy booking
const adminConfirmCancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminId, reason } = req.body;
        
        // Tìm booking cần hủy
        const booking = await TourBookingSchema.findById(id)
            .populate('slotId');
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đặt chỗ cần hủy" 
            });
        }

        // Kiểm tra trạng thái hiện tại
        if (booking.payment_status === 'cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: "Đặt chỗ đã được hủy trước đó" 
            });
        }

        // Cập nhật trạng thái thành cancelled
        booking.payment_status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancelledBy = adminId;
        booking.cancelReason = reason || 'Admin xác nhận hủy';
        await booking.save();

        // Hoàn trả số ghế về slot
        const totalPassengers = booking.adultsTour + (booking.childrenTour || 0) + (booking.toddlerTour || 0) + (booking.infantTour || 0);
        booking.slotId.availableSeats += totalPassengers;
        await booking.slotId.save();

        res.status(200).json({
            success: true,
            message: "Admin đã xác nhận hủy đặt chỗ thành công",
            booking: {
                _id: booking._id,
                payment_status: booking.payment_status,
                cancelledAt: booking.cancelledAt,
                cancelledBy: booking.cancelledBy,
                cancelReason: booking.cancelReason,
                refundInfo: booking.payment_status === 'completed' ? {
                    amount: booking.totalPriceTour,
                    policy: "Hoàn tiền theo chính sách của công ty"
                } : null
            }
        });

    } catch (error) {
        console.error("Lỗi admin hủy booking:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi admin hủy đặt chỗ", 
            error: error.message 
        });
    }
};

// Admin: Lấy thống kê booking
const getBookingStats = async (req, res) => {
    try {
        const stats = await TourBookingSchema.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ['$payment_status', 'pending'] }, 1, 0]
                        }
                    },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ['$payment_status', 'completed'] }, 1, 0]
                        }
                    },
                    cancelled: {
                        $sum: {
                            $cond: [{ $eq: ['$payment_status', 'cancelled'] }, 1, 0]
                        }
                    },
                    pendingCancel: {
                        $sum: {
                            $cond: [{ $eq: ['$payment_status', 'pending_cancel'] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            total: 0,
            pending: 0,
            completed: 0,
            cancelled: 0,
            pendingCancel: 0
        };

        res.status(200).json({
            success: true,
            stats: result
        });
    } catch (error) {
        console.error("Lỗi lấy thống kê booking:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi lấy thống kê booking", 
            error: error.message 
        });
    }
};

// User: Yêu cầu hủy đặt chỗ (chuyển sang trạng thái pending_cancel)
const requestCancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || req.query.userId;
        const { reason } = req.body;
        
        // Tìm booking cần hủy
        const booking = await TourBookingSchema.findById(id)
            .populate('slotId');
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đặt chỗ cần hủy" 
            });
        }

        // Kiểm tra quyền hủy (chỉ chủ đặt chỗ mới được yêu cầu hủy)
        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Bạn không có quyền yêu cầu hủy đặt chỗ này" 
            });
        }

        // Kiểm tra trạng thái hiện tại
        if (booking.payment_status === 'cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: "Đặt chỗ đã được hủy trước đó" 
            });
        }

        if (booking.payment_status === 'pending_cancel') {
            return res.status(400).json({ 
                success: false, 
                message: "Đã có yêu cầu hủy đang chờ xử lý" 
            });
        }

        // Kiểm tra thời gian hủy
        const tourDate = new Date(booking.slotId.dateTour);
        const currentDate = new Date();
        const daysDifference = Math.ceil((tourDate - currentDate) / (1000 * 60 * 60 * 24));

        // Không cho phép hủy nếu đã đến ngày khởi hành
        if (daysDifference <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Không thể yêu cầu hủy đặt chỗ khi tour đã khởi hành" 
            });
        }

        // Cập nhật trạng thái thành pending_cancel
        booking.payment_status = 'pending_cancel';
        booking.cancelRequestedAt = new Date();
        booking.cancelReason = reason || 'Khách hàng yêu cầu hủy';
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Yêu cầu hủy đặt chỗ đã được gửi và đang chờ admin xác nhận",
            booking: {
                _id: booking._id,
                payment_status: booking.payment_status,
                cancelRequestedAt: booking.cancelRequestedAt,
                cancelReason: booking.cancelReason
            }
        });

    } catch (error) {
        console.error("Lỗi yêu cầu hủy booking:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi yêu cầu hủy đặt chỗ", 
            error: error.message 
        });
    }
};

// Hủy đặt chỗ tour (giữ lại function cũ để tương thích)
const cancelBookingTour = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId || req.query.userId; // Lấy userId từ body hoặc query
        
        // Tìm booking cần hủy
        const booking = await TourBookingSchema.findById(id)
            .populate('slotId');
        
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đặt chỗ cần hủy" 
            });
        }

        // Kiểm tra quyền hủy (chỉ chủ đặt chỗ mới được hủy)
        if (booking.userId.toString() !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Bạn không có quyền hủy đặt chỗ này" 
            });
        }

        // Kiểm tra trạng thái hiện tại
        if (booking.payment_status === 'cancelled') {
            return res.status(400).json({ 
                success: false, 
                message: "Đặt chỗ đã được hủy trước đó" 
            });
        }

        // Kiểm tra thời gian hủy
        const tourDate = new Date(booking.slotId.dateTour);
        const currentDate = new Date();
        const daysDifference = Math.ceil((tourDate - currentDate) / (1000 * 60 * 60 * 24));

        // Không cho phép hủy nếu đã đến ngày khởi hành
        if (daysDifference <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Không thể hủy đặt chỗ khi tour đã khởi hành" 
            });
        }

        // Kiểm tra nếu đã thanh toán và muốn hoàn tiền
        let refundMessage = "";
        if (booking.payment_status === 'completed') {
            // Logic hoàn tiền có thể được thêm ở đây
            refundMessage = " Đặt chỗ đã thanh toán sẽ được xử lý hoàn tiền theo chính sách.";
        }

        // Cập nhật trạng thái thành cancelled
        booking.payment_status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();

        // Hoàn trả số ghế về slot
        const totalPassengers = booking.adultsTour + (booking.childrenTour || 0) + (booking.toddlerTour || 0) + (booking.infantTour || 0);
        booking.slotId.availableSeats += totalPassengers;
        await booking.slotId.save();

        res.status(200).json({
            success: true,
            message: "Hủy đặt chỗ thành công" + refundMessage,
            booking: {
                _id: booking._id,
                payment_status: booking.payment_status,
                cancelledAt: booking.cancelledAt,
                refundInfo: booking.payment_status === 'completed' ? {
                    amount: booking.totalPriceTour,
                    policy: "Hoàn tiền theo chính sách của công ty"
                } : null
            }
        });

    } catch (error) {
        console.error("Lỗi hủy booking:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi hủy đặt chỗ", 
            error: error.message 
        });
    }
};

// Tạo booking tour mới
const BookingTour = async (req, res) => {
    console.log("👉 Vào được BookingTour");
    console.log("📦 Body nhận được:", req.body);
    try {
        const {
            userId,
            slotId,
            fullNameUser,
            email,
            phone,
            address,
            adultsTour,
            childrenTour,
            toddlerTour,
            infantTour,
            adultPassengers,
            childPassengers,
            toddlerPassengers,
            infantPassengers,
            payment_method,
            note,
            isFullPayment, // Thêm option cho phép thanh toán đầy đủ
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId) {
            return res.status(400).json({ success: false, message: "Thiếu userId" });
        }
        if (!slotId) {
            return res.status(400).json({ success: false, message: "Thiếu slotId" });
        }
        if (!fullNameUser) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin họ tên" });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin email" });
        }
        if (!phone) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin số điện thoại" });
        }
        if (!adultsTour || adultsTour <= 0) {
            return res.status(400).json({ success: false, message: "Số lượng người lớn không hợp lệ" });
        }
        if (!payment_method) {
            return res.status(400).json({ success: false, message: "Thiếu phương thức thanh toán" });
        }
        if (!Array.isArray(adultPassengers) || adultPassengers.length === 0) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin hành khách người lớn" });
        }

        // Tìm slot tương ứng
        const slot = await DateTourModel.findById(slotId).populate("tour");
        if (!slot) {
            return res.status(404).json({ success: false, message: "Không tìm thấy slot" });
        }

        // Kiểm tra số ghế còn lại
        if (slot.availableSeats <= 0) {
            return res.status(400).json({ success: false, message: "Slot đã hết chỗ" });
        }

        const tour = slot.tour;
        if (!tour) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin tour" });
        }

        // Lấy giá theo từng loại khách
        const priceAdult = tour.price || 0;
        const priceChild = tour.priceChildren || 0;
        const priceToddler = tour.priceLittleBaby || 0;
        const priceInfant = tour.pricebaby || 0;
        const priceSingleRoom = tour.priceSingleRoom || 0;

        // Đếm số người chọn phòng đơn
        const singleRoomCount = (adultPassengers || []).filter(p => p.singleRoom === true).length;

        // Tính tổng tiền cuối cùng
        const totalFinalPriceTour =
            Number(adultsTour) * priceAdult +
            Number(childrenTour || 0) * priceChild +
            Number(toddlerTour || 0) * priceToddler +
            Number(infantTour || 0) * priceInfant +
            singleRoomCount * priceSingleRoom;

        // Tính số tiền đặt cọc (50% tổng giá)
        const depositAmount = Math.round(totalFinalPriceTour * 0.5);
        
        // Xác định số tiền thanh toán dựa vào lựa chọn của khách hàng
        const paymentAmount = isFullPayment ? totalFinalPriceTour : depositAmount;

        // Xử lý dữ liệu hành khách
        const processedAdultPassengers = adultPassengers.map(passenger => {
            // Chuyển đổi birthDate từ string sang Date nếu cần
            if (passenger.birthDate && typeof passenger.birthDate === 'string') {
                passenger.birthDate = new Date(passenger.birthDate);
            }
            return passenger;
        });

        const processedChildPassengers = childPassengers ? childPassengers.map(passenger => {
            if (passenger.birthDate && typeof passenger.birthDate === 'string') {
                passenger.birthDate = new Date(passenger.birthDate);
            }
            return passenger;
        }) : [];

        const processedToddlerPassengers = toddlerPassengers ? toddlerPassengers.map(passenger => {
            if (passenger.birthDate && typeof passenger.birthDate === 'string') {
                passenger.birthDate = new Date(passenger.birthDate);
            }
            return passenger;
        }) : [];

        const processedInfantPassengers = infantPassengers ? infantPassengers.map(passenger => {
            if (passenger.birthDate && typeof passenger.birthDate === 'string') {
                passenger.birthDate = new Date(passenger.birthDate);
            }
            return passenger;
        }) : [];

        // Tạo booking mới
        const booking = new TourBookingSchema({
            userId,
            tourId: slot.tour._id,
            slotId: slot._id,
            fullNameUser,
            email,
            phone,
            address,
            totalPriceTour: totalFinalPriceTour,
            depositAmount: depositAmount,
            isDeposit: !isFullPayment, // Nếu không phải thanh toán đầy đủ thì là đặt cọc
            isFullyPaid: isFullPayment, // Đánh dấu đã thanh toán đầy đủ nếu chọn thanh toán đầy đủ
            adultsTour,
            childrenTour: childrenTour || 0,
            toddlerTour: toddlerTour || 0,
            infantTour: infantTour || 0,
            adultPassengers: processedAdultPassengers,
            childPassengers: processedChildPassengers,
            toddlerPassengers: processedToddlerPassengers,
            infantPassengers: processedInfantPassengers,
            payment_method,
            payment_status: "pending",
            note,
        });

        await booking.save();

        // Cập nhật lại số ghế còn lại trong slot
        slot.availableSeats -= Number(adultsTour) + Number(childrenTour || 0) + Number(toddlerTour || 0) + Number(infantTour || 0);
        if (slot.availableSeats < 0) slot.availableSeats = 0;
        await slot.save();

        // Nếu phương thức thanh toán là VNPay (bank_transfer)
        if (payment_method === "bank_transfer") {
            try {
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

                // Tạo url thanh toán với số tiền là đặt cọc hoặc toàn bộ
                const paymentUrl = await vnpay.buildPaymentUrl({
                    vnp_Amount: paymentAmount * 100, // VNPay yêu cầu số tiền * 100
                    vnp_IpAddr: req.ip || '127.0.0.1',
                    vnp_TxnRef: `${booking._id}-${Date.now()}`, // dùng cho callback xác định booking
                    vnp_OrderInfo: isFullPayment ? 
                        `Thanh toán đầy đủ cho đơn #${booking._id}` : 
                        `Đặt cọc 50% cho đơn #${booking._id}`,
                    vnp_OrderType: ProductCode.Other,
                    vnp_ReturnUrl: `http://localhost:8080/api/check-payment-vnpay`, // URL callback
                    vnp_Locale: VnpLocale.VN,
                    vnp_CreateDate: dateFormat(new Date()),
                    vnp_ExpireDate: dateFormat(tomorrow),
                });

                console.log('Generated VNPay URL:', paymentUrl);

                return res.status(201).json({
                    success: true,
                    message: isFullPayment ? 
                        "Đặt tour thành công - chuyển đến thanh toán đầy đủ" : 
                        "Đặt tour thành công - chuyển đến thanh toán đặt cọc",
                    booking,
                    paymentUrl,
                    isDeposit: !isFullPayment,
                });
            } catch (vnpayError) {
                console.error("Lỗi khi tạo URL thanh toán VNPay:", vnpayError);
                return res.status(500).json({
                    success: false,
                    message: "Lỗi khi tạo URL thanh toán VNPay",
                    error: vnpayError.message
                });
            }
        }

        // Nếu thanh toán bằng tiền mặt
        if (payment_method === "cash") {
            // Đánh dấu thanh toán tiền mặt, không tạo URL VNPay
            if (isFullPayment) {
                // Nếu chọn thanh toán đầy đủ bằng tiền mặt
                booking.payment_status = 'pending';
                booking.isFullyPaid = false; // Chưa thanh toán đầy đủ
                booking.cashPaymentRemaining = true;
            } else {
                // Nếu chọn đặt cọc bằng tiền mặt
                booking.payment_status = 'pending';
                booking.isDeposit = false; // Chưa đặt cọc
                booking.cashPaymentRemaining = true;
            }
            
            await booking.save();

            return res.status(201).json({
                success: true,
                message: isFullPayment ? 
                    "Đặt tour thành công - Vui lòng thanh toán tiền mặt khi đến văn phòng" : 
                    "Đặt tour thành công - Vui lòng đặt cọc tiền mặt khi đến văn phòng",
                booking,
                isDeposit: !isFullPayment,
                depositAmount: depositAmount,
                remainingAmount: totalFinalPriceTour - depositAmount,
                totalAmount: totalFinalPriceTour,
                paymentMethod: {
                    type: "cash",
                    status: "pending"
                }
            });
        }

        // Nếu là phương thức thanh toán khác (không nên xảy ra)
        // Cập nhật trạng thái thanh toán tương ứng
        if (isFullPayment) {
            // Nếu chọn thanh toán đầy đủ
            booking.payment_status = 'pending'; // Vẫn để pending vì chưa xác nhận thanh toán
        } else {
            // Nếu chọn đặt cọc
            booking.payment_status = 'pending'; // Vẫn để pending vì chưa xác nhận đặt cọc
        }
        
        await booking.save();

        // Nếu không phải thanh toán qua VNPay thì trả về luôn
        res.status(201).json({
            success: true,
            message: isFullPayment ? 
                "Đặt tour thành công - Thanh toán đầy đủ" : 
                "Đặt tour thành công - Đặt cọc 50%",
            booking,
            isDeposit: !isFullPayment,
            depositAmount: depositAmount,
            remainingAmount: totalFinalPriceTour - depositAmount,
            totalAmount: totalFinalPriceTour
        });

    } catch (error) {
        console.error("Lỗi khi đặt tour:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đặt tour",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getBookingToursByUser = async (req, res) => {
    try {
        const bookings = await TourBookingSchema.find({ userId: req.params.userId })
            .populate('userId', 'username email')
            .populate({
                path: 'slotId',
                select: 'dateTour availableSeats tour',
                populate: {
                    path: 'tour',
                    select: 'nameTour destination departure_location duration finalPrice imageTour tourType',
                }
            });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy booking nào cho người dùng này" });
        }

        res.status(200).json({
            success: true,
            bookings: bookings,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Hàm tính hoàn tiền dựa trên chính sách
function calculateRefund(tourType, isFlight, daysBefore, totalPrice) {
    let refund = 0;
    let note = '';
    if (isFlight) {
        if (daysBefore >= 15) {
            refund = totalPrice; note = 'Trừ vé máy bay nếu không hoàn được';
        } else if (daysBefore >= 7) {
            refund = totalPrice * 0.6; note = 'Vé máy bay thu theo điều kiện';
        } else {
            refund = 0; note = 'Không hoàn hoặc hoàn rất ít, vé máy bay đã chốt';
        }
    } else {
        if (daysBefore >= 7) {
            refund = totalPrice; note = 'Trừ phí đặt cọc nhỏ';
        } else if (daysBefore >= 3) {
            refund = totalPrice * 0.6; note = 'Có thể đã đặt trước dịch vụ';
        } else {
            refund = totalPrice * 0.1; note = 'Gần ngày tour, tổ chức khó thay đổi';
        }
    }
    return { refund, note };
}

// API: User gửi yêu cầu hủy booking
exports.requestCancel = async (req, res) => {
    try {
        const { userId, reason } = req.body;
        const booking = await TourBookingSchema.findById(req.params.id).populate({
            path: 'slotId',
            populate: { path: 'tour' }
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== userId) return res.status(403).json({ message: 'Forbidden' });
        const now = new Date();
        const tourDate = new Date(booking.slotId.dateTour);
        const daysBefore = Math.ceil((tourDate - now) / (1000 * 60 * 60 * 24));
        const isFlight = booking.slotId.tour.tourType === 'maybay';
        const { refund, note } = calculateRefund(booking.slotId.tour.tourType, isFlight, daysBefore, booking.totalPriceTour);
        booking.cancel_requested = true;
        booking.cancel_reason = reason;
        booking.cancel_status = 'pending';
        booking.refund_amount = refund;
        booking.cancel_policy_note = note;
        await booking.save();
        res.json({ message: 'Yêu cầu hủy đã gửi', refund, note });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// API: Admin duyệt yêu cầu hủy
exports.approveCancel = async (req, res) => {
    try {
        const { approve } = req.body;
        const booking = await TourBookingSchema.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (approve) {
            booking.cancel_status = 'approved';
            booking.payment_status = 'cancelled';
        } else {
            booking.cancel_status = 'rejected';
        }
        await booking.save();
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getByIdBookingTour,
    BookingTour,
    getBookingToursByUser,
    cancelBookingTour,
    getAllBookingsForAdmin,
    adminConfirmCancelBooking,
    requestCancelBooking,
    getBookingStats
};
