import mongoose from "mongoose";
import RoomInventoryBooking from "../../models/Room/RoomInventoryBooking";
import BookingOnlyRoom from "../../models/Room/BookingRoom";
import RoomModel from "../../models/Room/RoomModel";

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
            check_in_date,
            check_out_date,
            status,
            payment_method,
            payment_status,
            adults,
            children,
        } = req.body;

        // 1. Kiểm tra phòng tồn tại
        const roomData = await RoomModel.findById(room);
        if (!roomData) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        // 2. Kiểm tra số người
        const totalGuests = adults + children;
        if (totalGuests > roomData.capacityRoom) {
            return res.status(400).json({
                success: false,
                message: `Số khách (${totalGuests}) vượt quá sức chứa (${roomData.capacityRoom}) của phòng`,
            });
        }

        // 3. Kiểm tra trùng ngày
        const existingBooking = await BookingOnlyRoom.findOne({
            room: room,
            status: { $nin: ["cancelled", "checked_out"] },
            $or: [
                {
                    check_in_date: { $lt: new Date(check_out_date) },
                    check_out_date: { $gt: new Date(check_in_date) }
                }
            ],
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "Phòng đã được đặt trong khoảng ngày đã chọn",
            });
        }

        // 4. Tính giá tiền
        const nights = calculateNights(check_in_date, check_out_date);
        const total_price = roomData.priceRoom * nights;

        // 5. Tạo booking
        const newBooking = await BookingOnlyRoom.create({
            user,
            room,
            check_in_date,
            check_out_date,
            status,
            payment_method,
            payment_status,
            adults,
            children,
            total_price,
        });

        // 6. Gộp RoomInventoryBooking thành 1 bản ghi
        await RoomInventoryBooking.create({
            Room: room,
            check_in_date: new Date(check_in_date),
            check_out_date: new Date(check_out_date),
            booked_quantity: 1,
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: newBooking,
        });

    } catch (error) {
        return res.status(500).json({
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