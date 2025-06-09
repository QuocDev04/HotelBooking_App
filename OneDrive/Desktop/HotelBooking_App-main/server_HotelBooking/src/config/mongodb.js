import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); 

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }

        await mongoose.connect(`${MONGODB_URI}/HotelBooking`);

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    }
};

export default connectDB;
