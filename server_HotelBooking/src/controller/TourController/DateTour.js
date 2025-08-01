const DateTour = require("../../models/Tour/DateTour");
const TourBooking = require("../../models/Tour/TourBooking.js");

// Hàm cập nhật trạng thái tour dựa trên ngày hiện tại
const updateTourStatus = async () => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Cập nhật tour sắp diễn ra (ngày tour > ngày hiện tại)
        await DateTour.updateMany(
            { dateTour: { $gt: tomorrow }, status: { $ne: 'upcoming' } },
            { $set: { status: 'upcoming' } }
        );
        
        // Cập nhật tour đang diễn ra (ngày tour = ngày hiện tại)
        await DateTour.updateMany(
            { 
                dateTour: { 
                    $gte: today,
                    $lt: tomorrow
                }, 
                status: { $ne: 'ongoing' } 
            },
            { $set: { status: 'ongoing' } }
        );
        
        // Cập nhật tour đã diễn ra (ngày tour < ngày hiện tại)
        await DateTour.updateMany(
            { dateTour: { $lt: today }, status: { $ne: 'completed' } },
            { $set: { status: 'completed' } }
        );
        
        console.log('Cập nhật trạng thái tour thành công');
    } catch (error) {
        console.error('Lỗi cập nhật trạng thái tour:', error);
    }
};

// Hàm cập nhật thông tin đặt chỗ và doanh thu cho tour
const updateTourBookingStats = async () => {
    try {
        // Lấy tất cả các slot tour
        const slots = await DateTour.find();
        
        for (const slot of slots) {
            // Lấy tất cả booking cho slot này
            const bookings = await TourBooking.find({ slotId: slot._id });
            
            let bookedSeats = 0;
            let totalRevenue = 0;
            let depositAmount = 0;
            let refundAmount = 0;
            
            for (const booking of bookings) {
                // Tính tổng số người đã đặt
                const totalPassengers = booking.adultsTour + 
                    (booking.childrenTour || 0) + 
                    (booking.toddlerTour || 0) + 
                    (booking.infantTour || 0);
                    
                // Chỉ tính booking đã thanh toán hoặc đã đặt cọc
                if (booking.payment_status === 'completed' || 
                    booking.payment_status === 'deposit_paid') {
                    bookedSeats += totalPassengers;
                }
                
                // Tính doanh thu từ booking đã hoàn thành
                if (booking.payment_status === 'completed') {
                    totalRevenue += booking.totalPriceTour;
                }
                
                // Tính tiền cọc đã thu
                if (booking.isDeposit && !booking.isFullyPaid) {
                    depositAmount += booking.depositAmount;
                }
                
                // Tính tiền hoàn trả
                if (booking.payment_status === 'cancelled' && booking.refund_amount) {
                    refundAmount += booking.refund_amount;
                }
            }
            
            // Cập nhật thông tin cho slot
            slot.bookedSeats = bookedSeats;
            slot.totalRevenue = totalRevenue;
            slot.depositAmount = depositAmount;
            slot.refundAmount = refundAmount;
            await slot.save();
        }
        
        console.log('Cập nhật thông tin đặt chỗ và doanh thu thành công');
    } catch (error) {
        console.error('Lỗi cập nhật thông tin đặt chỗ và doanh thu:', error);
    }
};

const PostdateTour = async (req, res) => {
    try {
        const { tourId, slots } = req.body;

        if (!tourId || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
        }

        const createdSlots = await DateTour.insertMany(
            slots.map(s => ({
                tour: tourId,
                dateTour: s.date,
                availableSeats: s.seats,
            }))
        );

        return res.status(201).json({ success: true, createdSlots });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }
}

const GetDateTour = async (req, res) => {
    try {
        const { id: slotId } = req.params;

        if (!slotId) {
            return res.status(400).json({ success: false, message: "Thiếu slotId" });
        }

        const slot = await DateTour.findById(slotId).populate({
            path: 'tour',
            populate: [
                {
                    path: 'itemTransport.TransportId',
                    model: 'Transport',
                    select: 'transportName transportNumber transportType',
                },
                {
                    path: 'destination',
                    model: 'Location',
                    select: 'locationName country',
                },
            ],
        });

        if (!slot) {
            return res.status(404).json({ success: false, message: "Không tìm thấy slot này" });
        }

        res.status(200).json({
            success: true,
            message: "Thành công",
            data:slot
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
}

const GetAllSlotsByTourId = async (req, res) => {
    try {
        const { tourId } = req.params;

        if (!tourId) {
            return res.status(400).json({ success: false, message: "Thiếu tourId" });
        }

        const slots = await DateTour.find({ tour: tourId }) // Sửa: 'tourId' → 'tour'
            .populate({
                path: 'tour',
                populate: [
                    {
                        path: 'itemTransport.TransportId',
                        model: 'Transport',
                        select: 'transportName transportNumber transportType',
                    },
                    {
                        path: 'destination',
                        model: 'Location',
                        select: 'locationName country',
                    },
                ],
            });

        if (!slots || slots.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ngày nào cho tour này" });
        }

        res.status(200).json({
            success: true,
            message: "Lấy thành công các ngày của tour",
            data: slots,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
      }
};

const UpdateDateSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, seats } = req.body;

        if (!date || !seats) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin cần thiết" });
        }

        const updatedSlot = await DateTour.findByIdAndUpdate(
            id,
            { 
                dateTour: date, 
                availableSeats: seats 
            },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ success: false, message: "Không tìm thấy slot để cập nhật" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Cập nhật slot thành công",
            data: updatedSlot
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const DeleteDateSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSlot = await DateTour.findByIdAndDelete(id);

        if (!deletedSlot) {
            return res.status(404).json({ success: false, message: "Không tìm thấy slot để xóa" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Xóa slot thành công"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// API lấy thống kê tour theo trạng thái
const getTourStats = async (req, res) => {
    try {
        // Cập nhật trạng thái tour trước khi lấy thống kê
        await updateTourStatus();
        
        // Lấy thống kê số lượng tour theo trạng thái
        const stats = await DateTour.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalBookedSeats: { $sum: "$bookedSeats" },
                    totalRevenue: { $sum: "$totalRevenue" },
                    totalDeposit: { $sum: "$depositAmount" },
                    totalRefund: { $sum: "$refundAmount" }
                }
            }
        ]);
        
        // Tạo đối tượng kết quả
        const result = {
            total: 0,
            upcoming: 0,
            ongoing: 0,
            completed: 0,
            totalBookedSeats: 0,
            totalRevenue: 0,
            totalDeposit: 0,
            totalRefund: 0
        };
        
        // Điền dữ liệu từ kết quả aggregate
        stats.forEach(stat => {
            if (stat._id) {
                result[stat._id] = stat.count;
                result.totalBookedSeats += stat.totalBookedSeats;
                result.totalRevenue += stat.totalRevenue;
                result.totalDeposit += stat.totalDeposit;
                result.totalRefund += stat.totalRefund;
            }
            result.total += stat.count;
        });
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Lỗi lấy thống kê tour:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thống kê tour'
        });
    }
};

// API lấy danh sách tour theo trạng thái
const getToursByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        
        // Kiểm tra trạng thái hợp lệ
        if (status && !['upcoming', 'ongoing', 'completed', 'all'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }
        
        // Cập nhật trạng thái tour trước khi lấy danh sách
        await updateTourStatus();
        
        // Tạo query
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Lấy danh sách tour theo trạng thái
        const tours = await DateTour.find(query)
            .populate({
                path: 'tour',
                select: 'nameTour destination departure imagesTour durationTour priceTour maxPeople tourType transport'
            })
            .sort({ dateTour: 1 });
        
        return res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách tour theo trạng thái:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy danh sách tour theo trạng thái'
        });
    }
};

// API cập nhật thông tin đặt chỗ và doanh thu cho tour
const updateTourBookingStatsAPI = async (req, res) => {
    try {
        await updateTourBookingStats();
        
        return res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin đặt chỗ và doanh thu thành công'
        });
    } catch (error) {
        console.error('Lỗi cập nhật thông tin đặt chỗ và doanh thu:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật thông tin đặt chỗ và doanh thu'
        });
    }
};

module.exports = {
    PostdateTour,
    GetDateTour,
    GetAllSlotsByTourId,
    UpdateDateSlot,
    DeleteDateSlot,
    getTourStats,
    getToursByStatus,
    updateTourBookingStatsAPI,
    updateTourStatus,
    updateTourBookingStats
}