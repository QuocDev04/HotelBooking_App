import RoomModel from "../../models/Room/RoomModel";
import TourModel from "../../models/Tour/TourModel";
import TourBookingSchema from "../../models/Tour/TourBooking";
import { StatusCodes } from 'http-status-codes';

export const createBookingTour = async (req, res) => {
    try {
        const {
            userId,
            tourId,
            itemRoom,
            bookingDate,
            adultsTour,
            childrenTour,
        } = req.body;

        // Tìm tour theo id
        const tour = await TourModel.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour không tồn tại." });
        }

        // Kiểm tra số lượng người
        const totalPeople = Number(adultsTour) + Number(childrenTour);
        if (isNaN(totalPeople) || totalPeople <= 0) {
            return res.status(400).json({ message: "Số lượng người không hợp lệ." });
        }

        // Hàm tách duration
        function parseDuration(str) {
            const dayMatch = str.match(/(\d+)\s*ngày/);
            const nightMatch = str.match(/(\d+)\s*đêm/);

            const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
            let nights = nightMatch ? parseInt(nightMatch[1], 10) : 0;

            return { days, nights };
        }

        // Hàm cộng ngày
        function addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        const { days, nights } = parseDuration(tour.duration);

        const startTime = new Date(bookingDate);
        const endTime = addDays(startTime, days);

        // Khai báo biến roomPricePerNight ngoài if để dùng được sau này
        let roomPricePerNight = 0;
        let totalRoomPrice = 0;

        if (itemRoom && itemRoom.length > 0) {
            const roomId = itemRoom[0].roomId;
            const room = await RoomModel.findById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Phòng không tồn tại." });
            }

            roomPricePerNight = room.priceRoom;

            if (days === 1 && nights === 0) {
                totalRoomPrice = roomPricePerNight;
            } else {
                totalRoomPrice = roomPricePerNight * (nights > 0 ? nights : (days - 1));
            }
        }

        // Tính tổng tiền tour (giá tour nhân với tổng số người)
        const totalPriceTour = tour.price * totalPeople;

        // Tổng giá booking = tổng giá tour + tổng tiền phòng
        const totalPriceBooking = totalPriceTour + totalRoomPrice;

        const newBooking = new TourBookingSchema({
            userId,
            tourId,
            itemRoom,
            totalPriceTour,
            bookingDate: startTime,
            totalPriceBooking,
            adultsTour,
            childrenTour,
            endTime,
        });

        await newBooking.save();

        res.status(201).json({
            message: "Đặt tour thành công",
            booking: newBooking,
            endTime,
            totalRoomPrice,
        });
    } catch (error) {
        console.error("Lỗi khi đặt tour:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const getByIdBookingTour = async (req, res) => {
    try {
        const byId = await TourBookingSchema.findById(req.params.id).populate("itemRoom.roomId", "nameRoom addressRoom").populate("tourId")
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Get all tours successfully",
            byId: byId,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}