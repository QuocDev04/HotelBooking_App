import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentResult() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // const params = new URLSearchParams(location.search);
        // const responseCode = params.get("vnp_ResponseCode");

            navigate("/");  // Chuyển về trang chủ sau 2 giây
    }, [location, navigate]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
}

export default PaymentResult;
