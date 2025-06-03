import mongoose from "mongoose";


const TourModel = new mongoose.Schema({
    nameTour: { type: String, required: true },
    destination:{type:String, required:true},
    departure_location:{type:String, required:true},
    duration: { type: Number, required:true},
    price: { type: Number, required:true},
    promotion_price:{type:Number, required:true},
    available_slots: { type: Number, required: true },
    available: { type: Number, required: true },
    imageTour: { type: String, required: true },
    tour_type: { type: String, required: true },
    status: { type: String, required: true },
    description: { type: String, required: true },

})
export default  mongoose.model("Tour", TourModel)