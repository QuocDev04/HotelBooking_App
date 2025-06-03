import RoomModel from "../models/RoomModel";
import { StatusCodes } from 'http-status-codes';



export const RoomAll = async (req, res) => {
    try {
        const room = await RoomModel.find()
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Get all rooms successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}