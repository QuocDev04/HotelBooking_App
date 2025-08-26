import React from "react";

const TrangChu = () => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Phòng được giao</h2>
      <div className="p-4 bg-white border rounded-lg shadow">
        <h3 className="text-lg font-semibold">Phòng 203 - Deluxe</h3>
        <p>Khách: Trần Văn B</p>
        <p>Ngày nhận: 12/09/2025</p>
        <p>Ngày trả: 14/09/2025</p>
        <div className="mt-4 space-y-2">
          <button className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Danh sách khách
          </button>
          <button className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Lịch trình
          </button>
          <button className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Cập nhật trạng thái
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrangChu;
