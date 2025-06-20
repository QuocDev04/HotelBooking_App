import mongoose from "mongoose";

const RoomItemBookingSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
}, { _id: false });

const TourBookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: true,
    },
    itemRoom: [RoomItemBookingSchema],
    totalPriceTour: { type: Number, default: 0 },
    totalPriceBooking: { type: Number, default: 0 },
    bookingDate: { type: Date, required: true },
    endTime: { type: Date },
    adultsTour: { type: Number, required: true },
    childrenTour: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('BookingTour', TourBookingSchema);
