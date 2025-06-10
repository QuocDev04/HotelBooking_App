
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import { StatusCodes } from 'http-status-codes';
import bcryptjs from "bcryptjs";


const generateRefefreshToken = (userId) => {
    return jwt.sign({ userId }, "123456", { expiresIn: '1y' })
}
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, "123456", { expiresIn: '1m' })
}
export const LoginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        //ktra emal đẫ tồn tại chưa
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({
                messages:['Email không tồn tại']
            })
        };
        //ktra xem có đúng mật chưa
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages:['Mật khẩu không chính xác']
            })
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefefreshToken(user._id)
        return res.status(StatusCodes.OK).json({
            accessToken,
            refreshToken,
            email: user.email,
            userId: user.id
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

export const RegisterUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        //ktra xem đã có email hay chưa
        const exitUser = await UserModel.findOne({email});
        if(exitUser){
            return res.status(StatusCodes.BAD_REQUEST).json({
                messages: ['Email đã tồn tại']
            })
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcryptjs.hash(password,10);

        const user = await UserModel.create({
            ...req.body,
            password:hashedPassword,
        })
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "user register successfully",
            user: user
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}