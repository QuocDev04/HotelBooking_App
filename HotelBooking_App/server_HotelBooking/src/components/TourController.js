import { StatusCodes } from "http-status-codes";
import TourModel from "../models/TourModel";
import TourScheduleModel from "../models/TourScheduleModel";


export const getAllTours = async (req, res) => {
    try {
        const tour = await TourModel.find()
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
        const tour = await TourModel.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tour" });
        }

        const schedule = await TourScheduleModel.findOne({ Tour: tour._id });

        return res.status(200).json({
            success: true,
            message: "Tour byID successfully",
            tour: {
                ...tour.toObject(),
                schedules: schedule ? schedule.schedules : [],
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