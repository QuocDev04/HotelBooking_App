import TransportScheduleModel from "../models/TransportScheduleModel";
import { StatusCodes } from 'http-status-codes';

export const PostTransportScheduleModel = async (req,res) =>{
     try {
         const transportScheduleModel = await TransportScheduleModel.create(req.body);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Tour add successfully",
                transportScheduleModel: transportScheduleModel
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            })
        }
}

export const GetTransportScheduleModel = async (req, res) => {
    try {
        const transportScheduleModel = await TransportScheduleModel.find().populate('transport');
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour add successfully",
            transportScheduleModel: transportScheduleModel
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

export const PutTransportScheduleModel = async (req, res) => {
    try {
        const transportScheduleModel = await TransportScheduleModel.findByIdAndUpdate(req.params.id, req.body);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour add successfully",
            transportScheduleModel: transportScheduleModel
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

export const DelTransportScheduleModel = async (req, res) => {
    try {
        const transportScheduleModel = await TransportScheduleModel.findByIdAndDelete(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour add successfully",
            transportScheduleModel: transportScheduleModel
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

export const GetByIdTransportScheduleModel = async (req, res) => {
    try {
        const transportScheduleModel = await TransportScheduleModel.findById(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Tour add successfully",
            transportScheduleModel: transportScheduleModel
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}