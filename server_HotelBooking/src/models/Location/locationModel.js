import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    locationName: { type: String, required: true },
    country: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model("Location", LocationSchema)