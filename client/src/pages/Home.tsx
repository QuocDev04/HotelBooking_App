import React from 'react'
import { useEffect, useState } from 'react';

const Home = () => {
    const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tours')
      .then((response) => response.json())
      .then((data) => setTours(data))
      .catch((error) => console.error('Error fetching tours:', error));
  }, []);
  return (
    <div className="font-sans text-gray-800">
        <div
        className="relative bg-cover bg-center h-[300px]"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Bạn lựa chọn du thuyền Hạ Long nào?
          </h1>
          <p className="text-gray-600 mb-6">
            Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Nhập tên du thuyền"
              className="p-2 rounded-full border"
            />
            <select className="p-2 rounded-full border">
              <option>Địa điểm</option>
            </select>
            <select className="p-2 rounded-full border">
              <option>Mức giá</option>
            </select>
            <button className="p-2 bg-teal-500 text-white rounded-full">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách tour */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Du thuyền mới và phổ biến nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.length === 0 ? (
            <p>Không có dữ liệu du thuyền.</p>
          ) : (
            tours.map((tour) => (
              <div
                key={tour.tour_id}
                className="border rounded-lg overflow-hidden shadow-md bg-white"
              >
                <img
                  src={tour.imageTour}
                  alt={tour.tour_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {tour.tour_name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">{tour.destination}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-600 font-bold">
                      {tour.promotion_price
                        ? `${tour.promotion_price.toLocaleString()}đ`
                        : `${tour.price.toLocaleString()}đ`}
                      /khách
                    </span>
                    <button className="bg-teal-500 text-white px-4 py-1 rounded-full">
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

       {/* Đánh giá giả định */}
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

      {/* Điểm đến và tin tức */}
      <section className="container mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold mb-4">Các điểm đến nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg shadow-md overflow-hidden bg-white"
            >
              <img
                src="/images/ha-long.jpg"
                alt="Vịnh Hạ Long"
                className="w-full h-40 object-cover"
              />
              <div className="text-center py-4">
                <h3 className="font-semibold">Vịnh Hạ Long</h3>
                <button className="mt-2 bg-gray-200 py-1 px-3 rounded-full">
                  Xem ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home
