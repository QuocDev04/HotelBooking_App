import React from 'react'
import { useEffect, useState } from 'react';
import ReviewSection from '../compoments/reviewSection';
import Footer from '../compoments/footer';

const Home = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tours')
      .then((response) => response.json())
      .then((data) => setTours(data))
      .catch((error) => console.error('Error fetching tours:', error));
  }, []);
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <main className="flex-grow">

        <div className="relative w-full h-[380px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/banner.png')" }}>

          <div className="absolute left-1/2 bottom-[-60px] transform -translate-x-1/2 w-full max-w-5xl px-4">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Bạn lựa chọn du thuyền Hạ Long nào?
              </h1>
              <p className="text-gray-600 mb-6">
                Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <input
                  type="text"
                  placeholder="🔍Nhập tên du thuyền"
                  className="p-3 rounded-full border text-sm w-[240px]"
                />
                <select className="p-3 rounded-full border text-sm w-[160px]">
                  <option>Tất cả địa điểm</option>
                </select>
                <select className="p-3 rounded-full border text-sm w-[160px]">
                  <option>Tất cả mức giá</option>
                </select>
                <button className="p-3 px-6 bg-teal-500 text-white rounded-full text-sm font-semibold">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>






        <section className="container mx-auto p-4 mt-[120px] md:mt-[150px] lg:mt-[180px]">

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
        <div className="text-center mt-6">
          <button className="bg-white border border-gray-300 px-6 py-2 rounded-full hover:bg-teal-500 hover:text-white transition">
            Xem tất cả du thuyền
          </button>
        </div>

        <ReviewSection />


        <section className="text-center my-16">
          <h2 className="text-3xl font-bold">Các điểm đến của Elitetravel</h2>
          <p className="text-gray-600 mt-2">
            Khám phá vẻ đẹp tuyệt vời của Du thuyền Hạ Long: Hành trình đến thiên đường thiên nhiên
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 hover:shadow-md transition duration-300"
              >
                <img
                  src="/halong.png"
                  alt="Vịnh Hạ Long"
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg mb-2">Vịnh Hạ Long</h3>
                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-teal-500 hover:text-white transition">
                  Xem ngay
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Tin tức nổi bật */}
        <section className="my-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Hạ Long: Khám phá Sự đặc sắc và Cập nhật tin tức mới nhất
            </h2>
            <p className="text-gray-600 md:max-w-xl mt-2 md:mt-0">
              Hạ Long: Bí mật và Cuộc sống trong Vịnh – Khám phá và Cập nhật những tin tức hấp dẫn từ điểm đến tuyệt vời này.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <img
                  src="/vuonhoa.png"
                  alt="Mùa bướm"
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-sm leading-snug mb-2">
                    Mùa bướm thơ mộng tại vườn quốc gia Cúc Phương
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                    Mỗi năm, từ cuối tháng 4 đến cuối tháng 5, Vườn quốc gia Cúc Phương lại khoác lên mình tấm áo rực rỡ...
                  </p>
                  <p className="text-xs text-gray-400">21/05/2025</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="bg-white border border-gray-300 px-6 py-2 rounded-full hover:bg-teal-500 hover:text-white transition">
              Xem tất cả →
            </button>
          </div>
        </section>
      </main>
    </div>

  );
};

export default Home
