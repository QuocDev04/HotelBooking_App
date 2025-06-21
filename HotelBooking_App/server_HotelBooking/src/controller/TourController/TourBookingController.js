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
        
        const now = new Date();
        if (endTime < now) {
            if (itemRoom && itemRoom.length > 0) {
                const roomIds = itemRoom.map(item => item.roomId);
                const rooms = await Promise.all(roomIds.map(id => RoomModel.findById(id)));

                await Promise.all(rooms.map(room => {
                    if (room) {
                        room.statusRoom = false;  // trả phòng
                        return room.save();
                    }
                }));
            }
            return res.status(400).json({ message: "Tour đã kết thúc, không thể đặt phòng." });
        }
        let roomPricePerNight = 0;
        let totalRoomPrice = 0;
        let totalRoomCapacity = 0;

        if (itemRoom && itemRoom.length > 0) {
            const roomIds = itemRoom.map(item => item.roomId);
            const rooms = await Promise.all(roomIds.map(id => RoomModel.findById(id)));

            for (let i = 0; i < rooms.length; i++) {
                const room = rooms[i];
                if (!room) {
                    return res.status(404).json({ message: `Phòng với ID ${roomIds[i]} không tồn tại.` });
                }

                if (room.statusRoom) {
                    return res.status(400).json({ message: `Phòng ${room.nameRoom} đã được đặt.` });
                }

                totalRoomCapacity += room.capacityRoom;

                roomPricePerNight = room.priceRoom;
                if (days === 1 && nights === 0) {
                    totalRoomPrice += roomPricePerNight;
                } else {
                    totalRoomPrice += roomPricePerNight * (nights > 0 ? nights : (days - 1));
                }
            }

            const totalPeople = Number(adultsTour) + Number(childrenTour);
            if (totalPeople > totalRoomCapacity) {
                return res.status(400).json({
                    message: `Tổng số người (${totalPeople}) không được vượt quá sức chứa phòng (${totalRoomCapacity}).`,
                });
              }
              
            // Cập nhật trạng thái tất cả phòng là đã đặt
            await Promise.all(rooms.map(room => {
                room.statusRoom = true;
                return room.save();
            }));
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