
import mongoose from 'mongoose';

const RoomItemSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    }
}, { _id: false })
const BookingOnySchema = new mongoose.Schema({
    itemRoom: [RoomItemSchema],
    userName: { type: String, required: true },
    emailName: { type: String, required: true },
    phoneName: { type: String, required: true },
    total_price: { type: Number, required: true },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'credit_card', 'bank_transfer'],
    },
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'processing'],
    },
}, {
    timestamps: true
})
export default mongoose.model("BookingOnlyRoom", BookingOnySchema)