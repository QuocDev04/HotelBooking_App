import mongoose from "mongoose";



const checkOutTourSchema = new mongoose.Schema({
    BookingTourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookingTour',
        required: true,
    },
    fullName: { type: String, required: true },
    emailUser: { type: String, required: true },
    phoneUser: { type: String, required: true },
    payment_date: { type: Date},
    payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'credit_card', 'bank_transfer'],
    },
    payment_status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    amount: { type: Number },
}, { timestamps: true })

export default mongoose.model("checkOutTour", checkOutTourSchema)