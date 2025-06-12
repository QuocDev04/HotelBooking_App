
import mongoose from 'mongoose';

const BookingOnySchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    total_price: { type: Number, required: true },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    status: { type: String, required: true },
    adults: { type: Number, required: true },         
    children: { type: Number, required: true }, 
    payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'credit_card', 'bank_transfer'],
    },
    payment_status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'processing'],
    },
}, {
    timestamps: true
})
export default mongoose.model("BookingOnlyRoom", BookingOnySchema)