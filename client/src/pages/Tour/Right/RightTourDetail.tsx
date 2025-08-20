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
              oldPrice?: number;
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

    // Nếu người dùng chưa chọn ngày thì tự động dùng slot đầu tiên (nếu có)
    const selectedSlot = selectedDate
        ? slots?.find((slot) =>
              dayjs(slot.dateTour, "DD-MM-YYYY").isSame(dayjs(selectedDate), "day")
          )
        : slots && slots.length > 0
        ? slots[0]
        : undefined;

    const navigate = useNavigate();
    const handleBooking = () => {
        // Sử dụng selectedSlot (đã fallback về slot đầu nếu chưa chọn ngày)
        if (!selectedSlot) {
            toast.error("Không tìm thấy thông tin ngày khởi hành!");
            return;
        }

        if (selectedSlot.availableSeats === 0) {
            toast.error(
                "Ngày này đã hết chỗ, không thể đặt tour! Vui lòng liên hệ để được hỗ trợ."
            );
            return;
        }

        if (!selectedSlot._id) {
            toast.error("Lỗi thông tin ngày khởi hành, vui lòng thử lại sau!");
            console.error("Selected slot has no ID:", selectedSlot);
            return;
        }

        navigate(`/date/slot/${selectedSlot._id}`);
    };

    return (
        <div className="w-full bg-white p-5 rounded-2xl border border-gray-200 shadow max-w-[360px] mx-auto">
            <div className="text-gray-700 text-base mb-1">Giá tour trọn gói</div>
            {tour?.oldPrice && (
                <div className="text-gray-400 line-through text-lg mb-1">
                    {tour.oldPrice.toLocaleString("vi-VN")}đ
                </div>
            )}
            <div className="text-3xl font-bold text-orange-600 mb-4">
                {tour?.price?.toLocaleString("vi-VN") || "..."}đ
            </div>
            <ul className="space-y-2 text-[15px] mb-5">
                <li className="flex items-center gap-2">
                    <svg width="18" height="18" fill="none" className="text-blue-500">
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
                    <svg width="18" height="18" fill="none" className="text-blue-500">
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
                    <svg width="18" height="18" fill="none" className="text-blue-500">
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
                            ? dayjs(slots[0].dateTour, "DD-MM-YYYY").format("DD/MM/YYYY")
                            : "..."}{" "}
                    </span>
                </li>
            </ul>
            <button
                className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition"
                onClick={handleBooking}
            >
                Đặt tour ngay
            </button>
        </div>
    );
};

export default RightTourDetail;
