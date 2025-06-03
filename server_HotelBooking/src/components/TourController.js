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

