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

export const AddRoom = async (req, res) => {
    try {
        const room = await RoomModel.create(req.body);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Post rooms successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

export const DeleteRoom = async (req, res) => {
    try {
        const room = await RoomModel.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "delete rooms successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

export const UpdateRoom = async (req, res) => {
    try {
        const room = await RoomModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "put rooms successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

export const GetRoomById = async (req, res) => {
    try {
        const room = await RoomModel.findById(req.params.id);
        if (!room) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Room not found",
            });
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Get room by ID successfully",
            rooms: room,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}