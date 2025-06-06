import mongoose from "mongoose";


const TransportModel = new mongoose.Schema({
    transportType: { type: String, required: true },
    transportName: { type: String, required: true },
    transportNumber: { type: String, required: true },
    departureLocation: { type: String, required: true },
    arrivalLocation: { type: String, required: true },
}, { timestamps: true })
export default mongoose.model("Transport", TransportModel)