/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';
import instanceClient from './../../../configs/instance';

const Cruise = () => {
    const {data:tour} = useQuery({
        queryKey:['tour'],
        queryFn: async () => instanceClient.get('/tour')
    })
    console.log(tour?.data);
    
    return (
        <div className="font-sans text-gray-800">
            {/* Banner tìm kiếm */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-5xl mx-auto mt-10">
                <h2 className="text-xl md:text-2xl font-bold text-center">
                    Bạn lựa chọn du thuyền Hạ Long nào?
                </h2>
                <p className="text-gray-500 text-sm text-center mt-1">
                    Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
                </p>
                <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-1/3 bg-white">
                        <span className="text-gray-400 mr-2">🔍</span>
                        <input type="text" placeholder="Nhập tên du thuyền" className="outline-none w-full text-sm" />
                    </div>
                    <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-1/4 bg-white">
                        <span className="text-gray-400 mr-2">📍</span>
                        <select className="outline-none w-full text-sm bg-white">
                            <option>Tất cả địa điểm</option>
                        </select>
                    </div>
                    <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-1/4 bg-white">
                        <span className="text-gray-400 mr-2">💰</span>
                        <select className="outline-none w-full text-sm bg-white">
                            <option>Tất cả mức giá</option>
                        </select>
                    </div>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full text-sm">
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Bộ lọc và danh sách tour */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 lg:px-20 mt-10 pb-20">
                <aside className="lg:col-span-1 bg-white rounded-xl border p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="font-semibold">Lọc kết quả</h2>
                        <button className="text-emerald-500 text-sm">Đặt lại</button>
                    </div>
                    <h3 className="font-medium mt-4 mb-2">Loại du thuyền</h3>
                    <label className="block text-sm mb-1">
                        <input type="checkbox" className="mr-2" /> cruise
                    </label>
                </aside>

                <main className="lg:col-span-4">
                    <p className="font-semibold text-lg mb-4">Tìm thấy kết quả</p>
                    <div className="space-y-4">
                        {tour?.data?.tours.map((tour:any) => (
                            <div key={tour.tour_id} className="flex bg-white border rounded-xl shadow-sm overflow-hidden">
                                <img src={tour.imageTransport} alt={tour.transportName} className="w-48 h-32 object-cover" />
                                <div className="p-4 flex flex-col justify-between w-full">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{tour.transportName}</h3>
                                        <p className="text-sm text-gray-500">{tour.duration} ngày – Tối đa {tour.maxPeople} người</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-emerald-600 font-bold">
                                            {tour.price.toLocaleString()}đ/khách
                                        </span>
                                        <button className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm hover:bg-emerald-600">
                                            Đặt ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Cruise