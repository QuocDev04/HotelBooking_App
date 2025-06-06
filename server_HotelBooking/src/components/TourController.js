import { StatusCodes } from "http-status-codes";
import TourModel from "../models/TourModel";


export const getAllTours = async (req,res) => {
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
        const tour = await TourModel.create(req.body);
        return res.status(StatusCodes.OK).json({

            success:true,
            message:"Tour added successfully",
            tour:tour
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:error.message
        })
    }
}

export const DeleteTour = async (req,res) => {
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
        const tour = await TourModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour update successfully",
            tour: tour
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

export const GetTourById = async (req,res) => {
    try {
        const tour = await TourModel.findById(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour byID successfully",
            tour: tour
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}
