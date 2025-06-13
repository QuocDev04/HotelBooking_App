import { useState } from "react";
import DatePicker from "react-datepicker";
import { useRoom } from "../../UseRoom/useRoom";

const RightRoom = () => {
    const { room } = useRoom();
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const pricePerPerson = room?.priceRoom;
    const total = (adults + children) * pricePerPerson;

    return (
        <div className="max-w-[460px] w-full bg-blue-100/90 p-5 max-md:mt-16 border rounded-4xl border-gray-300/70">
            <h2 className="lg:text-3xl md:text-xl font-medium text-blue-500 my-2">{room?.nameRoom}</h2>
            <h2 className="lg:text-4xl md:text-xl font-medium text-red-500 my-2">{(room?.priceRoom.toLocaleString())} đ</h2>
            <div className="text-sm">Mã tour: <strong>{room?._id.slice(-5)}</strong></div>
            <hr className="border-gray-300 my-5" />
            <div className="flex items-center">
                <div className=" rounded-2xl p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 21 22" fill="none">
                        <path d="M19 13.5V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 0.999998 3.89543 0.999998 5V17C0.999998 18.1046 1.89543 19 3 19H10.5" stroke="#3B82F6" stroke-width="2"></path>
                        <path d="M15 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                        <path d="M5 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                        <path d="M20 16C20 13.2386 17.7614 11 15 11C12.2386 11 10 13.2386 10 16C10 18.7614 12.2386 21 15 21C17.7614 21 20 18.7614 20 16Z" stroke="#3B82F6" stroke-width="2"></path>
                        <path d="M15 13.5676V16.0001L16.6216 17.6217" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
                <div className="w-full">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày đi"
                        className=" w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="flex items-center mt-6">
                <div className=" rounded-2xl p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 21 22" fill="none">
                        <path d="M19 13.5V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 0.999998 3.89543 0.999998 5V17C0.999998 18.1046 1.89543 19 3 19H10.5" stroke="#3B82F6" stroke-width="2"></path>
                        <path d="M15 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                        <path d="M5 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                        <path d="M20 16C20 13.2386 17.7614 11 15 11C12.2386 11 10 13.2386 10 16C10 18.7614 12.2386 21 15 21C17.7614 21 20 18.7614 20 16Z" stroke="#3B82F6" stroke-width="2"></path>
                        <path d="M15 13.5676V16.0001L16.6216 17.6217" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
                <div className="w-full">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày về"
                        className=" w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="space-y-2 my-10">
                <div className="flex items-center justify-between gap-4">
                    {/* Label */}
                    <span className="w-24">Người lớn</span>

                    {/* Nút tăng/giảm */}
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                        <button onClick={() => setAdults(Math.max(0, adults - 1))} className="px-2">-</button>
                        <input
                            type="number"
                            id="Quantity"
                            value={adults}
                            readOnly
                            className="h-9 w-16 border-transparent text-center sm:text-sm appearance-none"
                        />
                        <button onClick={() => setAdults(adults + 1)} className="px-2">+</button>
                    </div>
                    {/* Giá tiền */}
                    <span className="text-sm text-gray-500 min-w-[80px] text-right">
                        {(adults * pricePerPerson).toLocaleString()}đ
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4 mt-8">
                    {/* Label */}
                    <span className="w-24">Trẻ con</span>

                    {/* Nút tăng/giảm */}
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                        <button onClick={() => setChildren(Math.max(0, children - 1))} className="px-2">-</button>
                        <input
                            type="number"
                            id="Quantity"
                            value={children}
                            readOnly
                            className="h-9 w-16 border-transparent text-center sm:text-sm appearance-none"
                        />

                        <button onClick={() => setChildren(children + 1)} className="px-2">+</button>
                    </div>

                    {/* Giá tiền */}
                    <span className="text-sm text-gray-500 min-w-[80px] text-right">
                        {(children * pricePerPerson).toLocaleString()}đ
                    </span>
                </div>
            </div>
            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold text-blue-600">
                <span>Tổng tiền:</span>
                <span>{total.toLocaleString()}đ</span>
            </div>
            <div className="flex flex-col gap-2 my-4">
                <button className="w-full py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600">
                    Đặt ngay
                </button>
                <button className="w-full py-2 text-blue-500 border border-blue-500 rounded-xl hover:bg-blue-50">
                    Liên hệ tư vấn
                </button>
            </div>
        </div>
    )
}

export default RightRoom
