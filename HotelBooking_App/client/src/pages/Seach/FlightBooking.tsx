import React, { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaCalendarAlt, FaUser } from 'react-icons/fa';
import ReviewSection from '../../components/reviewSection';
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
          <div className="flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-600 gap-2 sm:gap-0 mb-4">
            <div className="flex gap-6 justify-center sm:justify-start">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="type" defaultChecked className="accent-teal-500" />
                Một chiều
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="type" className="accent-teal-500" />
                Khứ hồi
              </label>
            </div>
            <label className="inline-flex items-center gap-2 self-center sm:self-auto">
              <input type="checkbox" className="accent-teal-500" />
              Vé rẻ nhất tháng
            </label>
          </div>

          {/* Điểm đi & Điểm đến */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['vui lòng nhập điểm đi', <FaPlaneDeparture className="text-gray-400 mr-2" />],
            ['vui lòng nhập điểm đến', <FaPlaneDeparture className="text-gray-400 mr-2 rotate-180" />]]
              .map(([placeholder, icon], i) => (
                <div key={i} className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 text-sm">
                  {icon}
                  <input type="text" placeholder={placeholder} className="w-full bg-transparent outline-none" />
                </div>
              ))}
          </div>

          {/* Ngày đi */}
          <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 text-sm">

            <FaCalendarAlt className="text-gray-400 mr-2" />
            <input type="date" className="w-full bg-transparent outline-none" defaultValue="2025-05-30" />

          </div>

          {/* Hành khách */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Người lớn', defaultValue: 1 },
              { label: 'Trẻ em', defaultValue: 0 },
              { label: 'Em bé', defaultValue: 0 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col bg-gray-50 border rounded-xl px-4 py-3 text-sm">
                <label className="flex items-center text-gray-500 font-medium mb-1">
                  <FaUser className="text-gray-400 mr-2" />
                  {item.label}
                </label>
                <input
                  type="number"
                  min={0}
                  defaultValue={item.defaultValue}
                  className="w-full bg-transparent outline-none border rounded-md px-2 py-1"
                />
              </div>
            ))}
          </div>


          {/* Nút tìm kiếm */}
          <div className="flex justify-center sm:justify-end">
            <button className="mt-4 bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-full w-full sm:w-auto">
              Tìm vé máy bay
            </button>
          </div>
        </form>
      </div>
      <ReviewSection />
    </div>
  );
};

export default FlightBooking;
