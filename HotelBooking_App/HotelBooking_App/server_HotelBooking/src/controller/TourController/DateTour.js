const DateTour = require("../../models/Tour/DateTour")



const PostdateTour = async (req, res) => {
    try {
        const { tourId, slots } = req.body;

        if (!tourId || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
        }

        const createdSlots = await DateTour.insertMany(
            slots.map(s => ({
                tour: tourId,
                dateTour: s.date,
                availableSeats: s.seats,
            }))
        );

        return res.status(201).json({ success: true, createdSlots });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
      }
}

const GetDateTour = async (req, res) => {
    try {
        const { id: slotId } = req.params;

        if (!slotId) {
            return res.status(400).json({ success: false, message: "Thiếu slotId" });
        }

        const slot = await DateTour.findById(slotId).populate({
            path: 'tour',
            populate: [
                {
                    path: 'itemTransport.TransportId',
                    model: 'Transport',
                    select: 'transportName transportNumber transportType',
                },
                {
                    path: 'destination',
                    model: 'Location',
                    select: 'locationName country',
                },
            ],
        });

        if (!slot) {
            return res.status(404).json({ success: false, message: "Không tìm thấy slot này" });
        }

        res.status(200).json({
            success: true,
            message: "Thành công",
            data:slot
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
}

const GetAllSlotsByTourId = async (req, res) => {
    try {
        const { tourId } = req.params;

        if (!tourId) {
            return res.status(400).json({ success: false, message: "Thiếu tourId" });
        }

        const slots = await DateTour.find({ tour: tourId }) // Sửa: 'tourId' → 'tour'
            .populate({
                path: 'tour',
                populate: [
                    {
                        path: 'itemTransport.TransportId',
                        model: 'Transport',
                        select: 'transportName transportNumber transportType',
                    },
                    {
                        path: 'destination',
                        model: 'Location',
                        select: 'locationName country',
                    },
                ],
            });

        if (!slots || slots.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy ngày nào cho tour này" });
        }

        res.status(200).json({
            success: true,
            message: "Lấy thành công các ngày của tour",
            data: slots,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
      }
};
module.exports = {
    PostdateTour,
    GetDateTour,
    GetAllSlotsByTourId
}