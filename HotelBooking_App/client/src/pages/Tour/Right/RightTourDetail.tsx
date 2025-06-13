import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import { useParams } from 'react-router-dom';
import instanceClient from '../../../../configs/instance';

const RightTourDetail = () => {
    const { id } = useParams();
    const { data: tour } = useQuery({
        queryKey: ['tour', id],
        queryFn: () => instanceClient.get(`/tour/${id}`)
    })
    const tours = tour?.data?.tour
    console.log(tours);
    const price = tours?.price ?? 0;
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const pricePerPerson = tours?.price;
    const total = (adults + children + infants) * pricePerPerson;
    return (
        <div className="max-w-[460px] w-full bg-blue-100/90 p-5 max-md:mt-16 border rounded-4xl border-gray-300/70">
            <h2 className="lg:text-4xl md:text-xl font-medium text-blue-500 my-2">{price.toLocaleString()}đ</h2>
            <div className="text-sm">Mã tour: <strong>{tours?._id.slice(-5)}</strong></div>
            <hr className="border-gray-300 my-5" />
            <div className="text-2xl font-bold "></div>

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
            <div className="space-y-2 my-6">
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

                <div className="flex items-center justify-between gap-4">
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

                <div className="flex items-center justify-between gap-4">
                    {/* Label */}
                    <span className="w-24">Em bé</span>

                    {/* Nút tăng/giảm */}
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                        <button onClick={() => setInfants(Math.max(0, infants - 1))} className="px-2">-</button>
                        <input
                            type="number"
                            id="Quantity"
                            value={infants}
                            readOnly
                            className="h-9 w-16 border-transparent text-center sm:text-sm appearance-none"
                        />

                        <button onClick={() => setInfants(infants + 1)} className="px-2">+</button>
                    </div>

                    {/* Giá tiền */}
                    <span className="text-sm text-gray-500 min-w-[80px] text-right">
                        {(infants * pricePerPerson).toLocaleString()}đ
                    </span>
                </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold text-blue-600">
                <span>Tổng tiền:</span>
                <span>{total.toLocaleString()}đ</span>
            </div>


            <div className="flex gap-2 my-6">
                <button className="flex-1 py-2 text-white bg-blue-400 rounded hover:bg-blue-500">Đặt ngay</button>
                <button className="flex-1 py-2 border rounded hover:bg-gray-100">Liên hệ tư vấn</button>
            </div>
        </div>
    )
}

export default RightTourDetail