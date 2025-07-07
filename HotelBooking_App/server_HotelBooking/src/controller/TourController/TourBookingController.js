import RoomModel from "../../models/Room/RoomModel.js";
import TourModel from "../../models/Tour/TourModel.js";
import TourBookingSchema from "../../models/Tour/TourBooking.js";
import cron from 'node-cron';

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

export async function releaseExpiredWaitingRooms() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Tìm các phòng waiting quá 10 phút
    const roomsToRelease = await RoomModel.find({
        statusRoom: 'waiting',
        waitingSince: { $lt: tenMinutesAgo }
    });

    for (const room of roomsToRelease) {
        const booking = await TourBookingSchema.findOne({
            'itemRoom.roomId': room._id,
            endTime: { $gte: new Date() },
            isConfirmed: false,
        });

        if (booking) {
            const totalPeople = booking.adultsTour + booking.childrenTour;
            console.log("Trả lại slot tour cho booking:", booking._id, "Tổng người:", totalPeople);

            await TourModel.findByIdAndUpdate(booking.tourId, {
                $inc: { available_slots: totalPeople },
            });
            booking.slot_reserved = false;
            await booking.save();
        } else {
            console.log("Không tìm thấy booking phù hợp cho phòng:", room._id);
        }

        room.statusRoom = 'available';
        room.waitingSince = null;
        await room.save();
    }

    if (roomsToRelease.length > 0) {
        console.log(`[CRON] Trả lại ${roomsToRelease.length} phòng & slot tour sau 10 phút`);
    }
}


export async function releaseRoomsAndSlotsForCancelledPayment(bookingId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const booking = await TourBookingSchema.findById(bookingId).session(session);
        if (!booking) throw new Error("Không tìm thấy booking.");

        if (!booking.slot_reserved) {
            await session.abortTransaction();
            return;
        }

        const totalPeople = Number(booking.adultsTour || 0) + Number(booking.childrenTour || 0);
        const tourId = booking.tourId._id ? booking.tourId._id : booking.tourId;

        await TourModel.findByIdAndUpdate(
            tourId,
            { $inc: { available_slots: totalPeople } },
            { session }
        );

        const roomIds = booking.itemRoom?.map(item => item.roomId) || [];
        await RoomModel.updateMany(
            { _id: { $in: roomIds } },
            { $set: { statusRoom: "available", waitingSince: null } },
            { session }
        );

        booking.payment_status = "cancelled";
        booking.slot_reserved = false;
        await booking.save({ session });

        await session.commitTransaction();
        console.log(`[HUỶ] Booking ${booking._id} – đã trả ${totalPeople} slot và mở ${roomIds.length} phòng.`);
    } catch (error) {
        await session.abortTransaction();
        console.error("Lỗi khi huỷ booking:", error);
        throw error;
    } finally {
        session.endSession();
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
            .populate("itemRoom.roomId", "nameRoom locationId")
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
