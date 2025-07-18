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
            userName,
            emailName,
            phoneName,
            check_in_date,
            check_out_date,
            payment_method,
            payment_status,
            adults,
            children,
            itemRoom, // nhận danh sách phòng từ client
        } = req.body;

        if (!itemRoom || !Array.isArray(itemRoom) || itemRoom.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Danh sách phòng không được để trống",
            });
        }

        const nights = calculateNights(check_in_date, check_out_date);
        let total_price = 0;

        // Kiểm tra từng phòng
        for (const item of itemRoom) {
            const roomData = await RoomModel.findById(item.roomId);
            if (!roomData) {
                return res.status(404).json({
                    success: false,
                    message: `Phòng với ID ${item.roomId} không tồn tại`,
                });
            }

            const totalGuests = adults + children;
            if (totalGuests > roomData.capacityRoom) {
                return res.status(400).json({
                    success: false,
                    message: `Phòng ${roomData.name || item.roomId} chỉ chứa tối đa ${roomData.capacityRoom} khách, bạn đang đặt ${totalGuests}`,
                });
            }

            // Kiểm tra phòng đã được đặt chưa
            const existingBooking = await BookingOnlyRoom.findOne({
                "itemRoom.roomId": item.roomId,
                status: { $nin: ["cancelled", "checked_out"] },
                $or: [
                    {
                        check_in_date: { $lt: new Date(check_out_date) },
                        check_out_date: { $gt: new Date(check_in_date) },
                    },
                ],
            });

            if (existingBooking) {
                return res.status(400).json({
                    success: false,
                    message: `Phòng ${roomData.name || item.roomId} đã được đặt trong khoảng thời gian này`,
                });
            }

            total_price += roomData.priceRoom * nights;
        }

        // Tạo đơn đặt phòng
        const newBooking = await BookingOnlyRoom.create({
            userName,
            emailName,
            phoneName,
            check_in_date,
            check_out_date,
            payment_method,
            payment_status: "pending",
            adults,
            children,
            total_price,
            itemRoom,
        });

        // Tạo bản ghi RoomInventoryBooking cho mỗi phòng
        for (const item of itemRoom) {
            await RoomInventoryBooking.create({
                Room: item.roomId,
                check_in_date: new Date(check_in_date),
                check_out_date: new Date(check_out_date),
                booked_quantity: 1,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Đặt phòng thành công",
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
        const bookings = await BookingOnlyRoom.find()
            .populate("itemRoom.roomId", "nameRoom priceRoom amenitiesRoom addressRoom")
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