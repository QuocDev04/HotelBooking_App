/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import logo from "../assets/logo.png";
import { useState } from "react";
import {
    AiOutlineLock,
    AiOutlineMail,
    AiTwotoneEye,
    AiTwotoneEyeInvisible,
} from "react-icons/ai";
import { Form, message, type FormProps } from "antd";
import { useMutation } from "@tanstack/react-query";
import instanceClient from "../../configs/instance";
import type { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa";
type FieldType = {
    password: string;
    email: string;
};
const Login = ({ onClose = () => { }, openRegister = () => { } }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            try {
                const response = await instanceClient.post('/login', data);

                // Thêm delay giả lập 1.5s
                await new Promise(resolve => setTimeout(resolve, 1500));

                if (response.status !== 200 && response.status !== 201) {
                    return messageApi.open({
                        type: 'error',
                        content: 'Bạn đăng nhập thất bại',
                        duration: 2, // tự ẩn sau 2s
                    });
                }

                const { accessToken, username, userId } = response.data;
                if (accessToken) {
                    localStorage.setItem("token", accessToken);
                    localStorage.setItem("user", username);
                    localStorage.setItem("userId", userId);
                    onClose();
<<<<<<< HEAD:HotelBooking_App/HotelBooking_App/client/src/components/Login.tsx
=======

>>>>>>> 55ef12ab3d840a41c44e04988f88f2c48a8831e1:client/src/components/Login.tsx
                }
            } catch (error: unknown) {
                const err = error as AxiosError<{ messages: string[] }>;
                const errorMessages = err?.response?.data?.messages;

                messageApi.open({
                    type: 'error',
                    content: errorMessages?.[0] || 'Đã có lỗi xảy ra',
                    duration: 3,
                });

                throw new Error("error");
            }
        }

    })
    const onFinish: FormProps<FieldType>['onFinish'] = (value) => {
        console.log("Success", value);
        mutate(value)

    }
    return (
        <>
            {contextHolder}
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <div className="bg-white mx-auto text-gray-500 w-full max-w-[450px] md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-4xl text-gray-500 hover:text-black"
                    >
                        &times;
                    </button>

                    <img src={logo} alt="" className="h-20 mx-auto" />
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                        Chào mừng đến với{" "}
                        <span className="text-blue-600 font-bold">Elite Travel</span>
                    </h2>
                    <button
                        type="button"
                        className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
                    >
                        <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
                        Đăng Nhập với Google
                    </button>
                    <div className="flex items-center gap-4 w-full my-5">
                        <div className="w-full h-px bg-gray-300/90"></div>
                        <p className="w-full text-nowrap text-sm text-gray-500/90">hoặc đăng nhập với email</p>
                        <div className="w-full h-px bg-gray-300/90"></div>
                    </div>
                    <Form
                        onFinish={onFinish}
                    >
                        <Form.Item
                            validateTrigger="onBlur"
                            name="email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                {
                                    validator: (_, value) => {
                                        if (!value) return Promise.resolve();
                                        const allowedDomains = [
                                            "gmail.com",
                                            "yahoo.com",
                                            "outlook.com",
                                            "hotmail.com",
                                            "icloud.com"
                                        ];
                                        const domain = value.split("@")[1]?.toLowerCase();
                                        if (!domain || !allowedDomains.includes(domain)) {
                                            return Promise.reject(
                                                new Error("Sai Địa Chỉ Email")
                                            );
                                        }

                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-3">
                                <AiOutlineMail className="size-5" />
                                <input
                                    disabled={isPending}
                                    type="email"
                                    placeholder="Email"
                                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                                />
                            </div>
                        </Form.Item>

                        <Form.Item
                            validateTrigger="onBlur"
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                        >
                            <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-3">
                                <AiOutlineLock className="size-6" />
                                <input
                                    disabled={isPending}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none"
                                >
                                    {showPassword ? (
                                        <AiTwotoneEye className="size-5 mr-3" />
                                    ) : (
                                        <AiTwotoneEyeInvisible className="size-5 mr-3" />
                                    )}
                                </button>
                            </div>
                        </Form.Item>

                        <div className="text-right pb-3">
                            <a className="text-blue-600 underline" href="#">
                                Quên Mật Khẩu
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full mb-3 bg-indigo-500 py-2.5 rounded-full text-white flex items-center justify-center gap-2 disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending && (
                                <FaSpinner className="animate-spin text-white text-lg" />
                            )}
                            {isPending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </button>
                    </Form>

                    <p className="text-center mt-4">
                        Bạn chưa có tài khoản?{" "}
                        <button
                            onClick={openRegister}
                            className="text-blue-500 underline bg-transparent border-none outline-none cursor-pointer"
                        >
                            Đăng Ký
                        </button>
                    </p>
                </div>
            </div>
        </>

    );
};

export default Login;
