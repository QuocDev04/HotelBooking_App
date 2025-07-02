import mongoose from "mongoose";

const TransportItemSchema = new mongoose.Schema({
    TransportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transport",
        required: true
    }
}, { _id: false })
const TourModel = new mongoose.Schema({
    nameTour: { type: String, required: true },
    itemTransport: [TransportItemSchema],
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    departure_location: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },             // Giá gốc
    discountPercent: { type: Number },                     // Giá khuyến mãi (nếu có)
    finalPrice: { type: Number },                    // Giá cuối cùng sau áp dụng phiếu giảm giá
    discountExpiryDate: { type: Date },                    // Thời hạn phiếu giảm giá
    available_slots: { type: Number },
    maxPeople: { type: Number, required: true },
    imageTour: [{ type: String, required: true }],
    tourType: { type: String, required: true },
    status: { type: Boolean, default: true },
    descriptionTour: { type: String },
    featured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })
export default mongoose.model("Tour", TourModel)