import RoomModel from "../../models/Room/RoomModel";
import TourModel from "../../models/Tour/TourModel";
import TourBookingSchema from "../../models/Tour/TourBooking";
import { StatusCodes } from 'http-status-codes';
import cron from 'node-cron';

// Giải phóng phòng khi tour đã kết thúc
async function releaseRooms(itemRoom) {
    const roomIds = itemRoom.map(item => item.roomId);
    const rooms = await Promise.all(roomIds.map(id => RoomModel.findById(id)));
    await Promise.all(rooms.map(room => {
        if (room) {
            room.statusRoom = 'available';
            room.waitingSince = null;
            return room.save();
        }
    }));
}

// Giải phóng phòng waiting quá 10 phút
export async function releaseExpiredWaitingRooms() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Tìm các phòng waiting quá 10 phút
    const roomsToRelease = await RoomModel.find({
        statusRoom: 'waiting',
        waitingSince: { $lt: tenMinutesAgo }
    });

    for (const room of roomsToRelease) {
        // Tìm booking chứa phòng này
        const booking = await TourBookingSchema.findOne({
            'itemRoom.roomId': room._id,
            adultsTour: { $gt: 0 },   // chỉ lấy booking có người đặt
            endTime: { $gte: new Date() }
        });

        if (booking) {
            // Lấy phòng trong booking
            const roomItem = booking.itemRoom.find(item => item.roomId.toString() === room._id.toString());
            if (roomItem) {
                // Tổng người trong booking hiện tại (ở level booking)
                const totalPeople = booking.adultsTour + booking.childrenTour;

                // Cộng lại slot cho tour
                await TourModel.findByIdAndUpdate(booking.tourId, {
                    $inc: { available_slots: totalPeople }
                });

                // Reset số người về 0
                booking.adultsTour = 0;
                booking.childrenTour = 0;

                // Xóa itemRoom (hoặc giữ, tùy ý)
                booking.itemRoom = [];

                // Lưu booking
                await booking.save();
            }
        }

        // Trả phòng về trạng thái ban đầu
        room.statusRoom = 'available';
        room.waitingSince = null;
        await room.save();
    }

    if (roomsToRelease.length > 0) {
        console.log(`[CRON] Đã trả lại ${roomsToRelease.length} phòng waiting sau 10 phút`);
    }
}

// Cron job chạy mỗi phút để kiểm tra phòng waiting
cron.schedule('* * * * *', async () => {
    console.log(`[CRON] Kiểm tra phòng waiting lúc ${new Date().toLocaleString()}`);
    await releaseExpiredWaitingRooms();
});

// Tạo booking tour
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

        const tour = await TourModel.findById(tourId);
        if (!tour) return res.status(404).json({ message: "Tour không tồn tại." });

        const totalPeople = Number(adultsTour) + Number(childrenTour);
        if (isNaN(totalPeople) || totalPeople <= 0) {
            return res.status(400).json({ message: "Số lượng người không hợp lệ." });
        }

        function parseDuration(str) {
            const dayMatch = str.match(/(\d+)\s*ngày/);
            const nightMatch = str.match(/(\d+)\s*đêm/);
            const days = dayMatch ? parseInt(dayMatch[1]) : 0;
            const nights = nightMatch ? parseInt(nightMatch[1]) : 0;
            return { days, nights };
        }

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
            if (itemRoom && itemRoom.length > 0) await releaseRooms(itemRoom);
            return res.status(400).json({ message: "Tour đã kết thúc, không thể đặt phòng." });
        }

        let totalRoomPrice = 0;
        let totalRoomCapacity = 0;

        if (itemRoom && itemRoom.length > 0) {
            const roomIds = itemRoom.map(item => item.roomId);
            const rooms = await Promise.all(roomIds.map(id => RoomModel.findById(id)));

            for (let i = 0; i < rooms.length; i++) {
                const room = rooms[i];
                if (!room) return res.status(404).json({ message: `Phòng ID ${roomIds[i]} không tồn tại.` });
                if (room.statusRoom !== 'available') return res.status(400).json({ message: `Phòng ${room.nameRoom} đã được đặt.` });

                totalRoomCapacity += room.capacityRoom;
                const price = room.priceRoom;
                totalRoomPrice += price * (nights > 0 ? nights : (days - 1));
            }

            if (totalPeople > totalRoomCapacity) {
                return res.status(400).json({
                    message: `Tổng ${totalPeople} người vượt quá sức chứa (${totalRoomCapacity}).`,
                });
            }

            // Cập nhật trạng thái phòng
            await Promise.all(rooms.map(room => {
                room.statusRoom = 'waiting';
                room.waitingSince = new Date();
                return room.save();
            }));
        }

        const totalPriceTour = tour.price * totalPeople;
        const totalPriceBooking = totalPriceTour + totalRoomPrice;

        const newBooking = new TourBookingSchema({
            userId,
            tourId,
            itemRoom,
            totalPriceTour,
            totalPriceBooking,
            bookingDate: startTime,
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

// Lấy booking theo ID
export const getByIdBookingTour = async (req, res) => {
    try {
        const byId = await TourBookingSchema.findById(req.params.id)
            .populate("itemRoom.roomId", "nameRoom addressRoom")
            .populate("tourId");

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin booking thành công",
            byId: byId,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
