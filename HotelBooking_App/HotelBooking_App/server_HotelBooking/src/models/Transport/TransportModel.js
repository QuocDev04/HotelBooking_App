const mongoose = require("mongoose");


const TransportModel = new mongoose.Schema({
    transportType: { type: String, required: true },
    transportName: { type: String, required: true },
    transportNumber: { type: String, required: true },
    departureLocation: { type: String, required: true },
    arrivalLocation: { type: String, required: true },
    imageTransport: [{ type: String, required: true }],
}, { timestamps: true })
module.exports = mongoose.model("Transport", TransportModel)
