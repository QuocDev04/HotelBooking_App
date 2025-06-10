import { useState } from "react";
import { Form } from "antd";
import logo from "../assets/logo.png";
import { AiOutlineLock, AiOutlineMail, AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
const Register = ({ onClose = () => {}, openLogin = () => {} }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (

        <>
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                <div className="bg-white relative text-gray-500 w-full max-w-96 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                    >
                        <IoClose />
                    </button>
                    <img src={logo} alt="Logo" className="h-20 mx-auto" />
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                        Welcome back Elite Travel
                    </h2>

                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        {/* Email input */}
                        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-3">
                            <AiOutlineMail className="size-5" />
                            <input
                                type="email"
                                placeholder="Email id"
                                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                                required
                            />
                        </div>
                        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-3">
                            <AiOutlineLock className="size-6" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
                                required
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

                        <button type="submit" className="w-full mb-3 mt-6 bg-indigo-500 py-2.5 rounded-full text-white">
                            Đăng Ký
                        </button>
                    </Form>

                    <p className="text-center mt-4">
                        Bạn đã có tài khoản?{" "}
                        <button
                            onClick={openLogin}
                            className="text-blue-500 underline bg-transparent border-none outline-none cursor-pointer"
                        >
                            Đăng Nhập
                        </button>
                    </p>

                    <button
                        type="button"
                        className="w-full flex items-center gap-2 justify-center mt-5 bg-black py-2.5 rounded-full text-white"
                    >
                        <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/appleLogo.png" alt="appleLogo" />
                        Đăng Nhập với Apple
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center gap-2 justify-center my-3 bg-white border border-gray-500/30 py-2.5 rounded-full text-gray-800"
                    >
                        <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
                        Đăng Nhập với Google
                    </button>
                </div>
            </div>
        </>

    );
};

export default Register;
