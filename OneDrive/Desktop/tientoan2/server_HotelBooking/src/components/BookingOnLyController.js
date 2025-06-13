import BookingOnlyRoom from "../models/BookingRoom";
import RoomModel from "../models/RoomModel";
import { StatusCodes } from "http-status-codes";

// Tính số đêm giữa check-in và check-out
const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const createBookingOnlyRoom = async (req, res) => {
    try {
        const {
            user,
            room,
            roomQuantity,
            check_in_date,
            check_out_date,
            status,
            payment_method,
            payment_status,
        } = req.body;

        // Lấy thông tin phòng để tính giá
        const roomData = await RoomModel.findById(room);
        if (!roomData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Room not found",
            });
        }

        const nights = calculateNights(check_in_date, check_out_date);
        const total_price = roomData.priceRoom * roomQuantity * nights;

        // Tạo booking
        const newBooking = await BookingOnlyRoom.create({
            user,
            room,
            roomQuantity,
            check_in_date,
            check_out_date,
            status,
            payment_method,
            payment_status,
            total_price,
        });

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const getBookingWithDetails = async (req, res) => {
    try {
        // Giả sử lấy tất cả booking, bạn có thể sửa filter theo user hoặc bookingId
        const bookings = await BookingOnlyRoom.find()
            .populate("user", "username email phone_number")   // lấy trường name, email, phone từ user
            .populate("room", "nameRoom priceRoom ")
        return res.status(200).json({
            success: true,
            message: "Bookings retrieved with user and room info",
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
  };