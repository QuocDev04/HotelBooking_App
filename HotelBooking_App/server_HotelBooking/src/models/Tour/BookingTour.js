import mongoose from "mongoose";
const RoomItemSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    }
}, { _id: false })
const BookingTour = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
    },
    itemRoom: [RoomItemSchema],
    totalPriceTour: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    adultsTour: { type: Number, required: true },
    childrenTour: { type: Number, required: true }
}, { timestamps: true })
export default mongoose.model("BookingTour", BookingTour)