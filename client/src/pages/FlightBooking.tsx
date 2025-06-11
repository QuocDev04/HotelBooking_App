import React, { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaCalendarAlt, FaUser } from 'react-icons/fa';
const FlightBooking = () => {
  const [schedules, setSchedules] = useState([]);
  const [transports, setTransports] = useState([]);
useEffect(() => {
  Promise.all([
    fetch('http://localhost:3000/Transport_Schedule').then((res) => res.json()),
    fetch('http://localhost:3000/Transport').then((res) => res.json())
  ])
    .then(([scheduleData, transportData]) => {
      const enriched = scheduleData.map((schedule) => {
        const transport = transportData.find(t => t.transport_id === schedule.transport_id);
        return {
          ...schedule,
          transport_name: transport?.name,
          transport_type: transport?.transport_type,
          number: transport?.number,
          from: transport?.departure_location,
          to: transport?.arrival_location
        };
      });
      setSchedules(enriched);
      setTransports(transportData);
    })
    .catch((error) => console.error("Lỗi khi fetch dữ liệu:", error));
}, []);


  return (
    <div className="font-sans text-gray-800">
      <div className="w-full h-[360px] bg-[url('/banner.png')] bg-cover bg-center bg-no-repeat"></div>

     <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8 -mt-40 mx-auto relative z-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-1">Mở cánh cửa khám phá cùng Elite Travel</h2>
      <p className="text-center text-gray-500 text-sm mb-6">Mixivivu - Đặt chân lên đỉnh mây với một bước nhảy</p>

      <form className="space-y-4">
        {/* Chọn loại vé */}
        <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4">
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="type" defaultChecked className="accent-teal-500" />
              Một chiều
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="type" className="accent-teal-500" />
              Khứ hồi
            </label>
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="accent-teal-500" />
            Vé rẻ nhất tháng
          </label>
        </div>

        {/* Điểm đi & Điểm đến */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 text-sm">
            <FaPlaneDeparture className="text-gray-400 mr-2" />
            <input type="text" placeholder="vui lòng nhập điểm đi" className="w-full bg-transparent outline-none" />
          </div>
          <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 text-sm">
            <FaPlaneDeparture className="text-gray-400 mr-2 rotate-180" />
            <input type="text" placeholder="vui lòng nhập điểm đến" className="w-full bg-transparent outline-none" />
          </div>
        </div>

        {/* Ngày đi */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 text-sm">
            <FaCalendarAlt className="text-gray-400 mr-2" />
            <input type="date" className="w-full bg-transparent outline-none" defaultValue="2025-05-30" />
          </div>
        </div>

        {/* Hành khách */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Người lớn', 'Trẻ em', 'Em bé'].map((label, i) => (
            <div key={i} className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 text-sm">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="number"
                defaultValue={label === 'Người lớn' ? 1 : 0}
                className="w-full bg-transparent outline-none"
                placeholder={label}
              />
            </div>
          ))}
        </div>

        {/* Nút tìm kiếm */}
        <div className="flex justify-end">
          <button className="mt-4 bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-full">
            Tìm vé máy bay
          </button>
        </div>
      </form>
    </div>
    <section className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold mb-4">Đánh giá từ người dùng</h2>
        <div className="border-l-4 border-teal-400 pl-6 py-4 bg-white rounded-md shadow">
          <h3 className="font-semibold text-lg text-teal-600">
            Du thuyền Heritage Bình Chuẩn
          </h3>
          <p className="text-gray-600 mt-2">
            Chị rất cảm ơn team đã tư vấn cho chị chọn du thuyền Heritage Bình
            Chuẩn. Bố mẹ chị rất ưng ý em ạ! Tàu đẹp, mang đậm phong cách Á Đông.
            Đồ ăn hợp khẩu vị. Nhân viên nhiệt tình và chu đáo.
          </p>
          <p className="font-bold mt-4">– Chị Thu Hà</p>
        </div>
      </section>
    </div>
  );
};

export default FlightBooking;
