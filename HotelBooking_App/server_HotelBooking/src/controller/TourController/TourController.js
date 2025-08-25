const { StatusCodes } = require("http-status-codes");
const TourModel = require("../../models/Tour/TourModel.js");
const TourScheduleModel = require("../../models/Tour/TourScheduleModel.js");
const TourBooking = require("../../models/Tour/TourBooking.js");


const getAllTours = async (req, res) => {
    try {
        const tour = await TourModel.find()
        .populate("itemTransport.TransportId", "transportName transportNumber transportType")
            .populate("destination", "locationName country")

            .populate("assignedEmployee", "firstName lastName full_name email employee_id position")
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Get all tours successfully",
            tours: tour,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

const AddTour = async (req, res) => {
    try {
        const { price, discountPercent = 0, discountExpiryDate } = req.body;
        const now = new Date();

        // Kiểm tra ngày hết hạn giảm giá, nếu chưa có hoặc còn hạn thì áp dụng giảm giá
        const isDiscountValid = !discountExpiryDate || new Date(discountExpiryDate) > now;

        // Tính giá cuối cùng
        const finalPrice = isDiscountValid
            ? Math.round(price * (1 - discountPercent / 100))
            : price;

        // Tạo tour mới
        const tour = await TourModel.create({ ...req.body, finalPrice });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour added successfully",
            tour
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}

const DeleteTour = async (req, res) => {
    try {
        const tour = await TourModel.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour delete successfully",
            tour: tour
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

const UpdateTour = async (req, res) => {
    try {
        const { price, discountPercent = 0, discountExpiryDate } = req.body;
        const now = new Date();

        const isDiscountValid =
            discountPercent > 0 &&
            (!discountExpiryDate || new Date(discountExpiryDate) > now);

        const finalPrice = isDiscountValid
            ? Math.round(price * (1 - discountPercent / 100))
            : null;

        const tour = await TourModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, finalPrice },
            { new: true }
        );

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour updated successfully",
            tour
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

const GetTourById = async (req, res) => {
    try {
        const tour = await TourModel.findById(req.params.id).populate("itemTransport.TransportId", "transportName transportNumber transportType").populate("destination", "locationName country")
        if (!tour) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tour" });
        }

        const schedule = await TourScheduleModel.findOne({ Tour: tour._id });

        //// Tính tổng số người đã đặt từ bảng BookingTour
        const bookings = await TourBooking.find({ tourId: tour._id });
        let totalBooked = 0;
        bookings.forEach(booking => {
            totalBooked += booking.adultsTour + booking.childrenTour;
        });
        //Tính số slot còn lại
        const available_slots = tour.maxPeople - totalBooked;

        return res.status(200).json({
            success: true,
            message: "Tour byID successfully",
            tour: {
                ...tour.toObject(),
                schedules: schedule ? schedule.schedules : [],
                available_slots: available_slots < 0 ? 0 : available_slots
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//get tour featured
const TourFeatured = async (req, res) => {
    try {
        const tourFeatured = await TourModel.find({ featured: true }).populate("destination", "locationName country");
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "get tourFeatured successfully",
            tourFeatured: tourFeatured
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

//get tour top_selling
const TourTopSelling = async (req, res) => {
    try {
        const topSellingTours = await TourModel.find().populate("destination", "locationName country")
            .sort({ totalSold: -1 })
            .limit(7); // Lấy 7 tour có lượt đặt nhiều nhất
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "get topSellingTours successfully",
            topSellingTours: topSellingTours
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}


const assignEmployeeToTour = async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeId } = req.body;

        // Kiểm tra tour có tồn tại không
        const tour = await TourModel.findById(id);
        if (!tour) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Tour không tồn tại"
            });
        }

        // Cập nhật phân công nhân viên
        const updatedTour = await TourModel.findByIdAndUpdate(
            id,
            { assignedEmployee: employeeId },
            { new: true }
        ).populate('assignedEmployee', 'firstName lastName full_name email employee_id position');

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Phân công nhân viên thành công",
            tour: updatedTour
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật trạng thái tour bởi HDV
const updateTourStatus = async (req, res) => {
    try {
        const { id } = req.params; // Tour ID
        const { status, note, updatedBy } = req.body;

        // Validate status
        const validStatuses = ['preparing', 'ongoing', 'completed', 'postponed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái không hợp lệ"
            });
        }

        // Validate required note for postponed status
        if (status === 'postponed' && (!note || !note.trim())) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập lý do hoãn tour"
            });
        }

        // Find tour
        const tour = await TourModel.findById(id);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tour"
            });
        }

        // Update tour status
        const updateData = {
            tourStatus: status,
            statusUpdatedAt: new Date(),
            statusUpdatedBy: updatedBy
        };

        if (note && note.trim()) {
            updateData.statusNote = note.trim();
        }

        const updatedTour = await TourModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate("destination", "locationName country")
         .populate("assignedEmployee", "firstName lastName full_name email employee_id position");

        console.log(`Tour ${id} status updated to ${status} by ${updatedBy}`);

        return res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái tour thành công",
            tour: updatedTour
        });

    } catch (error) {
        console.error("Error updating tour status:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server: " + error.message
        });
    }
};

module.exports = { getAllTours, AddTour, DeleteTour, UpdateTour, GetTourById, TourFeatured, TourTopSelling, assignEmployeeToTour, updateTourStatus };
