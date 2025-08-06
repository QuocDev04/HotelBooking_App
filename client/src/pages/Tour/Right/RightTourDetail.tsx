import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Slot {
    dateTour: string; // định dạng 'DD-MM-YYYY'
    availableSeats: number;
    _id: string;
    dateTourId: string;
}

interface RightTourDetailProps {
    selectedRoom?: {
        _id: string;
        nameRoom: string;
        priceRoom: string;
        typeRoom?: string;
        capacityRoom: number;
    }[] | null;
    onChooseDate: () => void;
    selectedDate: Date | null;
    tour:
        | {
              price?: number;
              _id?: string;
              code?: string;
              departure_location?: string;
              duration?: string;
          }
        | undefined;
    slots?: Slot[];
}

const RightTourDetail = ({
    onChooseDate,
    selectedDate,
    tour,
    slots = [],
}: RightTourDetailProps) => {
    const selectedDateFormatted = selectedDate
        ? dayjs(selectedDate).format("DD-MM-YYYY")
        : null;

    const selectedSlot = slots?.find((slot) =>
        dayjs(slot.dateTour).isSame(selectedDate, "day")
    );
    const navigate = useNavigate();
    const handleBooking = () => {
        // Kiểm tra xem người dùng đã chọn ngày chưa
        if (!selectedDate) {
            toast.error("Vui lòng chọn ngày khởi hành!");
            return;
        }

        // Kiểm tra xem có slot nào cho ngày đã chọn không
        if (!selectedSlot) {
            toast.error(
                "Không tìm thấy thông tin ngày khởi hành, vui lòng chọn ngày khác!"
            );
            return;
        }

        // Kiểm tra số chỗ còn trống
        if (selectedSlot.availableSeats === 0) {
            toast.error(
                "Ngày này đã hết chỗ, không thể đặt tour! Vui lòng chọn ngày khác"
            );
            return;
        }

        // Kiểm tra ID của slot
        if (!selectedSlot._id) {
            toast.error(
                "Lỗi thông tin ngày khởi hành, vui lòng chọn ngày khác!"
            );
            console.error("Selected slot has no ID:", selectedSlot);
            return;
        }

        // Nếu mọi thứ đều hợp lệ, chuyển hướng đến trang đặt tour
        console.log("Navigating to booking page with slot ID:", selectedSlot._id);
        navigate(`/date/slot/${selectedSlot._id}`);
    };
    console.log(selectedSlot);
    console.log(tour);

    return (
        <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 shadow max-w-[360px] mx-auto">
            <div className="text-gray-700 text-base mb-1">Giá tour trọn gói</div>
            {/* Giá cũ nếu có */}
            {tour?.oldPrice && (
                <div className="text-gray-400 line-through text-lg mb-1">
                    {tour.oldPrice.toLocaleString("vi-VN")}đ
                </div>
            )}
            {/* Giá mới */}
            <div className="text-3xl font-bold text-orange-600 mb-4">
                {tour?.price?.toLocaleString("vi-VN") || "..."}đ
            </div>
            <ul className="space-y-2 text-[15px] mb-5">
                <li className="flex items-center gap-2">
                    <svg
                        width="18"
                        height="18"
                        fill="none"
                        className="text-blue-500"
                    >
                        <path
                            d="M9 2a7 7 0 1 1 0 14A7 7 0 0 1 9 2Zm0 2v5l4 2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="font-semibold">Thời gian:</span>
                    <span>{tour?.duration || "..."}</span>
                </li>
                <li className="flex items-center gap-2">
                    <svg
                        width="18"
                        height="18"
                        fill="none"
                        className="text-blue-500"
                    >
                        <path
                            d="M9 2a5 5 0 0 1 5 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 0 1 5-5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <circle cx="9" cy="7" r="2" fill="currentColor" />
                    </svg>
                    <span className="font-semibold">Điểm khởi hành:</span>
                    <span>{tour?.departure_location || "..."}</span>
                </li>
                <li className="flex items-center gap-2">
                    <svg
                        width="18"
                        height="18"
                        fill="none"
                        className="text-blue-500"
                    >
                        <rect
                            x="2"
                            y="3"
                            width="14"
                            height="13"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M6 1v4M12 1v4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <circle cx="9" cy="10" r="1" fill="currentColor" />
                    </svg>
                    <span className="font-semibold">Lịch khởi hành:</span>
                    <span className="ml-2">
                        {selectedDate
                            ? dayjs(selectedDate).format("DD/MM/YYYY")
                            : slots && slots[0]?.dateTour
                            ? dayjs(slots[0].dateTour).format("DD/MM/YYYY")
                            : "..."}{" "}
                    </span>
                </li>
            </ul>
            <button
                className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition"
                onClick={selectedDate ? handleBooking : onChooseDate}
            >
                Đặt tour ngay
            </button>
        </div>
    );
};

export default RightTourDetail;
