/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Input, message, type FormProps } from "antd";
import logo from "../assets/logo.png";
import {
    AiOutlineLock,
    AiOutlineMail,
    AiOutlineUser,
    AiOutlinePhone,
    AiTwotoneEye,
    AiTwotoneEyeInvisible,
} from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import instanceClient from "../../configs/instance";
import type { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa";

type FieldType = {
    name?: string;
    password?: string;
    email: string;
    username: string;
    phone_number: string;
};

const Register = ({ onClose = () => { }, openLogin = () => { } }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            try {
                const response = await instanceClient.post("/register", data);
                await new Promise((resolve) => setTimeout(resolve, 1500));
                if (response.status !== 200 && response.status !== 201) {
                    return messageApi.open({
                        type: "error",
                        content: "Bạn đăng ký thất bại",
                        duration: 2,
                    });
                }
                openLogin();
            } catch (error: unknown) {
                const err = error as AxiosError<{ messages: string[] }>;
                const errorMessages = err?.response?.data?.messages;

                messageApi.open({
                    type: "error",
                    content: errorMessages?.[0] || "Đã có lỗi xảy ra",
                });
            }
        },
    });

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        mutate(values);
    };

    return (
        <>
            {contextHolder}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white relative text-gray-600 w-full max-w-[450px] md:p-8 p-6 rounded-2xl shadow-xl animate-fadeIn">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-black text-3xl"
                    >
                        <IoClose />
                    </button>

                    {/* Logo */}
                    <img src={logo} alt="Logo" className="h-16 mx-auto mb-3" />

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Chào mừng đến với{" "}
                        <span className="text-indigo-600">Elite Travel</span>
                    </h2>

                    {/* Google login */}
                    <button
                        type="button"
                        className="w-full flex items-center gap-2 justify-center mb-5 bg-white border border-gray-300 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition"
                    >
                        <img
                            className="h-4 w-4"
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"
                            alt="googleFavicon"
                        />
                        Đăng nhập với Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 w-full my-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <p className="text-xs text-gray-400">Hoặc đăng ký bằng email</p>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
                        {/* Email */}
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                {
                                    type: "email",
                                    message: "Email không hợp lệ",
                                },
                            ]}
                        >
                            <Input
                                prefix={<AiOutlineMail className="text-gray-400" />}
                                placeholder="Email"
                                size="large"
                                disabled={isPending}
                                className="rounded-full"
                            />
                        </Form.Item>

                        {/* Username */}
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: "Vui lòng nhập tên đăng nhập" },
                                {
                                    pattern: /^[a-zA-Z0-9._]{4,20}$/,
                                    message:
                                        "Tên đăng nhập từ 4–20 ký tự, không khoảng trắng, chỉ gồm chữ, số, _ hoặc .",
                                },
                            ]}
                        >
                            <Input
                                prefix={<AiOutlineUser className="text-gray-400" />}
                                placeholder="Tên đăng nhập"
                                size="large"
                                disabled={isPending}
                                className="rounded-full"
                            />
                        </Form.Item>

                        {/* Phone */}
                        <Form.Item
                            name="phone_number"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại" },
                                {
                                    pattern: /^0\d{9}$/,
                                    message:
                                        "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số",
                                },
                            ]}
                        >
                            <Input
                                prefix={<AiOutlinePhone className="text-gray-400" />}
                                placeholder="Số điện thoại"
                                size="large"
                                disabled={isPending}
                                className="rounded-full"
                            />
                        </Form.Item>

                        {/* Password */}
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        >
                            <Input
                                prefix={<AiOutlineLock className="text-gray-400" />}
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                size="large"
                                disabled={isPending}
                                className="rounded-full"
                                suffix={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        {showPassword ? (
                                            <AiTwotoneEye className="text-lg" />
                                        ) : (
                                            <AiTwotoneEyeInvisible className="text-lg" />
                                        )}
                                    </button>
                                }
                            />
                        </Form.Item>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full mt-2 mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending && <FaSpinner className="animate-spin text-white" />}
                            {isPending ? "Đang đăng ký..." : "Đăng Ký"}
                        </button>
                    </Form>

                    {/* Switch to login */}
                    <p className="text-center text-sm">
                        Bạn đã có tài khoản?{" "}
                        <button
                            onClick={openLogin}
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Đăng Nhập
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
