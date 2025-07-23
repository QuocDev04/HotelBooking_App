import mongoose from "mongoose";

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
}, { timestamps: true });

export default mongoose.model("DateSlot", DateSlotSchema);