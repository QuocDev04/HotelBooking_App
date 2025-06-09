import React, { useEffect, useState } from 'react';

const HotelPage = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/hotels')
      .then((res) => res.json())
      .then((data) => setHotels(data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="border rounded-xl p-3 shadow-sm bg-white">
          <img src={hotel.image} alt={hotel.name} className="w-full h-[180px] object-cover rounded-xl" />
          <div className="mt-3 text-sm text-gray-500">📍 {hotel.location}</div>
          <h4 className="font-semibold mt-1">{hotel.name}</h4>
          <p className="text-sm text-gray-500">Hạ {hotel.rooms} phòng</p>
          <p className="line-through text-sm text-gray-400">{hotel.originalPrice.toLocaleString()}đ/phòng</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">{hotel.currentPrice.toLocaleString()}đ/phòng</p>
            <button className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm">Đặt ngay</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelPage;
