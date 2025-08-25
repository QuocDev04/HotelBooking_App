import React from "react";

const TourDuocGiao = () => {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Tour được giao</h1>
      <div className="p-5 transition bg-white shadow rounded-xl hover:shadow-lg">
        <h2 className="mb-3 text-lg font-semibold">Tour Miền Tây sông nước 3N2D</h2>
        <p className="mb-1 text-sm text-gray-500">📅 12/09/2025</p>
        <p className="mb-4 text-sm text-gray-500">✔️ 14/09/2025</p>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 text-left bg-gray-100 rounded-md hover:bg-blue-100">
            Danh sách khách hàng →
          </button>
          <button className="w-full px-3 py-2 text-left bg-gray-100 rounded-md hover:bg-blue-100">
            Lịch trình tour →
          </button>
          <button className="w-full px-3 py-2 text-left bg-gray-100 rounded-md hover:bg-blue-100">
            Cập nhật trạng thái →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDuocGiao;
