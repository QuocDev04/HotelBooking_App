import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";

function PaymentResult() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get("vnp_ResponseCode");

        if (responseCode === "00") {
            message.success("Thanh toán VNPay thành công!");
        } else {
            message.error("Thanh toán VNPay thất bại!");
        }

        setTimeout(() => {
            navigate("/");  // Chuyển về trang chủ sau 2 giây
        }, 20000);
    }, [location, navigate]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
}

export default PaymentResult;
