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
    </div>
  )
}

export default Home
