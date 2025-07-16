const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Nam", "Nữ"], required: true },
    birthDate: { type: Date, required: true },
    singleRoom: { type: Boolean, default: false } 
}, { _id: false });

const TourBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DateSlot",  
        required: true,
    },
    // Thông tin liên hệ
    fullNameUser: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },

    // Tổng giá tour
    totalPriceTour: { type: Number, default: 0 },

    // Số lượng từng nhóm khách
    adultsTour: { type: Number, required: true },      // Người lớn (>= 12 tuổi)
    childrenTour: { type: Number },    // Trẻ em (5-11 tuổi)
    toddlerTour: { type: Number },     // Trẻ nhỏ (2-4 tuổi)
    infantTour: { type: Number },      // Em bé (< 2 tuổi)

    // Danh sách hành khách
    adultPassengers: [PassengerSchema],  
    childPassengers: [PassengerSchema],
    toddlerPassengers: [PassengerSchema],
    infantPassengers: [PassengerSchema],
    note:{type:String},
    payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'bank_transfer'],
    },
    payment_status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'pending_cancel'],
        default: 'pending',
    },
    cancelledAt: { type: Date }, // Thời gian hủy đặt chỗ
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Admin xác nhận hủy
    cancelReason: { type: String }, // Lý do hủy
    cancelRequestedAt: { type: Date }, // Thời gian yêu cầu hủy
    
    // Chi tiết hủy và hoàn tiền
    cancellationDetails: {
        cancelledAt: { type: Date },
        cancelledByUser: { type: Boolean, default: false }, // Hủy bởi người dùng hay admin
        refundAmount: { type: Number, default: 0 }, // Tổng số tiền hoàn lại
        flightRefundAmount: { type: Number, default: 0 }, // Số tiền hoàn lại cho vé máy bay
        otherServicesRefundAmount: { type: Number, default: 0 }, // Số tiền hoàn lại cho dịch vụ khác
        refundStatus: { 
            type: String, 
            enum: ['pending', 'processing', 'completed', 'rejected'], 
            default: 'pending'
        },
        refundNote: { type: String }, // Ghi chú về việc hoàn tiền
        refundCompletedAt: { type: Date } // Thời gian hoàn tiền hoàn tất
    }
}, { timestamps: true });

module.exports = mongoose.model('BookingTour', TourBookingSchema);
