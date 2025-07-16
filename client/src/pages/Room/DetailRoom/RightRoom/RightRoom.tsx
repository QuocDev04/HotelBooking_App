/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useRoom } from "../../UseRoom/useRoom";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const RightRoom = () => {
    const { room } = useRoom();
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);

    // Hàm kiểm tra ngày đi không được là quá khứ
    const isPastDate = (date: Date) => {
        const today = new Date();
        // reset giờ, phút, giây, ms để so sánh chỉ ngày
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleBooking = () => {
        if (!startDate || !endDate) {
            alert("Vui lòng chọn ngày đi và ngày về!");
            return;
        }

        if (isPastDate(startDate)) {
            alert("Ngày đi không được chọn ngày quá khứ!");
            return;
        }

        if (startDate >= endDate) {
            alert("Ngày về phải lớn hơn ngày đi!");
            return;
        }

        const totalGuests = adultCount + childCount;
        if (room?.capacityRoom && totalGuests > room.capacityRoom) {
            alert(`Phòng chỉ chứa tối đa ${room.capacityRoom} khách, bạn đang đặt ${totalGuests} khách.`);
            return;
        }

        localStorage.setItem("bookingData", JSON.stringify({
            roomId: room?._id || "",
            check_in_date: startDate.toISOString(),
            check_out_date: endDate.toISOString(),
            adults: adultCount,
            children: childCount,
          }));

        navigate(`/bookingroom/${room?._id}`);
    };

    return (
        <div className="max-w-[460px] w-full bg-blue-100/90 p-5 max-md:mt-16 border rounded-4xl border-gray-300/70">
            <h2 className="lg:text-3xl md:text-xl font-medium text-blue-500 my-2">{room?.nameRoom}</h2>
            <h2 className="lg:text-4xl md:text-xl font-medium text-red-500 my-2">
                {room?.priceRoom?.toLocaleString()} đ
            </h2>
            <div className="text-sm">
                Mã tour: <strong>{room?._id?.slice(-5)}</strong>
            </div>

            <hr className="border-gray-300 my-5" />

            {/* Ngày đi */}
            <div className="flex items-center mb-4">
                <div className="rounded-2xl p-2">📅</div>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày đi"
                    className="w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    minDate={new Date()} // ngày nhỏ nhất là hôm nay
                />
            </div>

            {/* Ngày về */}
            <div className="flex items-center mb-4">
                <div className="rounded-2xl p-2">📅</div>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Chọn ngày về"
                    className="w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    minDate={startDate || new Date()} // ngày về phải lớn hơn hoặc bằng ngày đi
                />
            </div>

            {/* Người lớn */}
            <div className="flex items-center justify-between my-4">
                <span className="w-24">Người lớn</span>
                <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                        className="px-3"
                        onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        readOnly
                        value={adultCount}
                        className="h-9 w-12 text-center border-transparent appearance-none"
                    />
                    <button
                        className="px-3"
                        onClick={() => setAdultCount(adultCount + 1)}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Trẻ em */}
            <div className="flex items-center justify-between mb-8">
                <span className="w-24">Trẻ em</span>
                <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                        className="px-3"
                        onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        readOnly
                        value={childCount}
                        className="h-9 w-12 text-center border-transparent appearance-none"
                    />
                    <button
                        className="px-3"
                        onClick={() => setChildCount(childCount + 1)}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t text-lg font-bold text-blue-600 flex justify-between items-center">
                <span>Tổng tiền:</span>
                <span>
                    {(room?.priceRoom || 0).toLocaleString()} đ
                </span>
            </div>

            <div className="flex flex-col gap-2 my-4">
                <button
                    onClick={handleBooking}
                    className="w-full py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
                >
                    Đặt ngay
                </button>
                <button className="w-full py-2 text-blue-500 border border-blue-500 rounded-xl hover:bg-blue-50">
                    Liên hệ tư vấn
                </button>
            </div>
        </div>
    );
};

export default RightRoom;
