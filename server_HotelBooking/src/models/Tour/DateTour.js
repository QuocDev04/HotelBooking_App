const mongoose = require("mongoose");

const DateSlotSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    dateTour: {
        type: Date,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
    },
    // Trạng thái tour: upcoming (sắp diễn ra), ongoing (đang diễn ra), completed (đã diễn ra)
    // Trạng thái sẽ được tính toán tự động dựa trên ngày hiện tại và ngày tour
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    // Số người đã đặt tour này
    bookedSeats: {
        type: Number,
        default: 0
    },
    // Tổng doanh thu từ tour này
    totalRevenue: {
        type: Number,
        default: 0
    },
    // Số tiền cọc đã thu
    depositAmount: {
        type: Number,
        default: 0
    },
    // Số tiền hoàn trả (nếu có hủy tour)
    refundAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("DateSlot", DateSlotSchema);