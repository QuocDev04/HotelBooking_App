import mongoose from "mongoose";


const TransportScheduleModel = new mongoose.Schema({
    transport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transport",
        required: true,
    },
    departureTime: { type: Date, required: true },
    arrivalTime:{type:Date, required:true},
    priceTransport:{type:Number, required:true},
    availableSeats: { type: Number, required: true },


}, {timestamps:true})
export default mongoose.model("TransportSchedule", TransportScheduleModel)