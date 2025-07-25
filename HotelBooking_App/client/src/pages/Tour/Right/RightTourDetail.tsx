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
    tour: {
        price?: number;
        _id?: string;
        code?: string;
        departure_location?: string;
        duration?: string;
        
    };
    slots?: Slot[];
}

const RightTourDetail = ({
    onChooseDate,
    selectedDate,
    tour,
    slots = []
}: RightTourDetailProps) => {
    const selectedDateFormatted = selectedDate
        ? dayjs(selectedDate).format("DD-MM-YYYY")
        : null;

    const selectedSlot = slots?.find(slot =>
        dayjs(slot.dateTour).isSame(selectedDate, "day")
          );
    const navigate = useNavigate();
    const handleBooking = () => {
        if (!selectedSlot || selectedSlot.availableSeats === 0) {
            toast.error("Ngày này đã hết chỗ, không thể đặt tour!, vui lòng chọn ngày khác");
            return;
          }
        if (selectedSlot?._id) {
            navigate(`/date/slot/${selectedSlot._id}`);
        } else {
            toast.error("Vui lòng chọn ngày hợp lệ!");
        }
      };
      console.log(selectedSlot);
      console.log(tour);
      
    return (
        <div className="max-w-[460px] w-full bg-white p-3 md:p-5 max-md:mt-4 border rounded-2xl md:rounded-4xl border-gray-300/70 fixed right-8 top-48 z-50">
            {!selectedDate || !tour ? (
                <>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-black text-xl">Giá từ:</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                        {tour?.price?.toLocaleString("vi-VN") || "..."}{" "}
                        <span className="text-xl font-medium">đ</span>{" "}
                        <span className="text-base text-gray-500 font-normal">/ Khách</span>
                    </div>
                    
                    <button
                        onClick={onChooseDate}
                        className="w-full py-2 rounded-lg mt-4 border bg-blue-500 text-white font-semibold hover:bg-blue-600"
                    >
                        Chọn ngày khởi hành
                    </button>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-black text-xl">Giá:</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                            {tour?.price?.toLocaleString("vi-VN")}{" "}
                        <span className="text-xl font-medium">đ</span>{" "}
                        <span className="text-base text-gray-500 font-normal">/ Khách</span>
                    </div>
                    <ul className="space-y-2 text-[15px] mb-4">
                        <li className="flex items-center gap-2">
                            <span className="font-medium">Mã tour:</span>
                            <span className="text-blue-700 font-semibold underline cursor-pointer">
                                {tour?._id?.slice(0, 6) || "..."}
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="font-medium">Khởi hành:</span>
                            <span className="text-blue-700 font-semibold">
                                {tour?.departure_location || "..."}
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="font-medium">Ngày khởi hành:</span>
                            <span className="font-semibold">
                                {selectedDateFormatted || "..."}
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="font-medium">Thời gian:</span>
                            <span className="font-semibold">{tour?.duration || "..."}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="font-medium">Số chỗ còn:</span>
                            <span className="text-blue-700 font-semibold">
                                    {selectedSlot?.availableSeats ?? "..."}
                            </span>
                        </li>
                    </ul>
                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={onChooseDate}
                            className="flex-1 py-2 rounded-lg border border-red-500 text-red-500 font-semibold hover:bg-red-50"
                        >
                            Ngày khác
                        </button>
                            <button
                                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
                                onClick={handleBooking}
                            >
                                Đặt ngay
                            </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RightTourDetail;
