import mongoose from "mongoose";


const RoomModel = new mongoose.Schema({
    nameRoom: { type: String, required: true },
    priceRoom: { type: Number, required: true },
    imageRoom: [{ type: String, required: true }],
    typeRoom: { type: String, required: true },
    descriptionRoom: { type: String },
    amenitiesRoom: [{ type: String, required: true }],
    addressRoom: { type: String, required: true },
    capacityRoom: {
        type: Number,
        required: true,
        min: 1
    }
}, { timestamps: true });
export default mongoose.model("Room", RoomModel);