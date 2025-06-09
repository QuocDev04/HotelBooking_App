import React from 'react'

const HotelPage = () => {
  return (
     <div className="font-sans text-gray-800">
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-center">
        <h2 className="text-2xl font-semibold mb-2">Bạn lựa chọn du thuyền Hạ Long nào?</h2>
        <p className="text-gray-500 mb-4">Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn</p>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Nhập tên du thuyền"
            className="border rounded-lg px-4 py-2 w-full lg:w-1/3"
          />
          <select className="border rounded-lg px-4 py-2 w-full lg:w-1/6">
            <option>Tất cả lịch trình</option>
          </select>
          <select className="border rounded-lg px-4 py-2 w-full lg:w-1/6">
            <option>Tất cả mức giá</option>
          </select>
          <button className="bg-teal-500 text-white px-6 py-2 rounded-lg">Tìm kiếm</button>
        </div>
      </div>
   
    </div>
  );
}

export default HotelPage;
