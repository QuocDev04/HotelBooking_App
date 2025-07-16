import { StatusCodes } from "http-status-codes";
import TourModel from "../../models/Tour/TourModel";
import TourScheduleModel from "../../models/Tour/TourScheduleModel";
import TourBooking from "../../models/Tour/TourBooking";
import RoomModel from "../../models/Room/RoomModel";


export const getAllTours = async (req, res) => {
    try {
        const tour = await TourModel.find().populate("itemTransport.TransportId", "transportName transportNumber transportType")
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

export const AddTour = async (req, res) => {
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

export const DeleteTour = async (req, res) => {
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

export const UpdateTour = async (req, res) => {
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

export const GetTourById = async (req, res) => {
    try {
        const tour = await TourModel.findById(req.params.id).populate("itemTransport.TransportId", "transportName transportNumber transportType")
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
export const TourFeatured = async (req, res) => {
    try {
        const tourFeatured = await TourModel.find({ featured: true });
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
export const TourTopSelling = async (req, res) => {
    try {
        const topSellingTours = await TourModel.find()
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

// Lấy danh sách phòng khả dụng cho một tour cụ thể
export const getAvailableRoomsForTour = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await TourModel.findById(id);
        
        if (!tour) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                success: false, 
                message: "Tour không tồn tại" 
            });
        }
        
        // Lấy thông tin lịch trình tour
        const tourSchedule = await TourScheduleModel.findOne({ Tour: tour._id });
        if (!tourSchedule || !tourSchedule.schedules || tourSchedule.schedules.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Tour chưa có lịch trình"
            });
        }
        
        // Lấy ngày bắt đầu và kết thúc tour từ lịch trình
        const startDate = new Date(tourSchedule.schedules[0].date);
        const endDate = new Date(tourSchedule.schedules[tourSchedule.schedules.length - 1].date);
        
        // Lấy tất cả các phòng
        const allRooms = await RoomModel.find({});
        
        // Lọc các phòng khả dụng trong khoảng thời gian tour
        const availableRooms = allRooms.filter(room => {
            // Kiểm tra xem phòng có đang được đặt trong khoảng thời gian của tour không
            return !room.availabilitySchedule.some(schedule => 
                schedule.isBooked && 
                ((startDate >= schedule.startDate && startDate <= schedule.endDate) ||
                 (endDate >= schedule.startDate && endDate <= schedule.endDate) ||
                 (startDate <= schedule.startDate && endDate >= schedule.endDate))
            );
        });
        
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy danh sách phòng khả dụng thành công",
            availableRooms,
            tourDates: {
                startDate,
                endDate
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};