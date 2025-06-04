import { StatusCodes } from "http-status-codes";
import TransportModel from "../models/TransportModel"


export const GetTransportAll = async (req, res) => {
    try {
        const transport = await TransportModel.find();
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour getall successfully",
            transport: transport
        })
    } catch (error) {

    }
}

export const AddTransport = async (req, res) => {
    try {
        const transport = await TransportModel.create();
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour add successfully",
            transport: transport
        })
    } catch (error) {

    }
}

export const UpdateTransport = async (req, res) => {
    try {
        const transport = await TransportModel.findByIdAndUpdate(req.params.id, res.body);
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour update successfully",
            transport: transport
        })
    } catch (error) {

    }
}

export const GetTransportById = async (req, res) => {
    try {
        const transport = await TransportModel.findById(req.params.id);
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour byid successfully",
            transport: transport
        })
    } catch (error) {

    }
}

export const DeleteTransport = async (req, res) => {
    try {
        const transport = await TransportModel.findByIdAndDelete(req.params.id, res.body);
        return res.status(StatusCodes.OK).json({

            success: true,
            message: "Tour delete successfully",
            transport: transport
        })
    } catch (error) {

    }
}