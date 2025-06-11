import { useEffect, useState } from 'react';
import ReviewSection from '../../components/reviewSection';

const HotelPage = () => {
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error('Lỗi khi fetch rooms:', err));

    fetch('http://localhost:3000/Reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Lỗi khi fetch reviews:', err));
  }, []);

  return (
    <main className="font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* FORM LỌC KHÁCH SẠN */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center">
            Bạn lựa chọn khách sạn nào?
          </h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Hơn 100 khách sạn hạng sang giá tốt đang chờ bạn
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center gap-4">
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

        {/* DANH SÁCH PHÒNG */}
        <section className="py-10">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {rooms.map((room) => (
              <div key={room.room_id} className="border rounded-xl p-3 shadow-sm bg-white">
                <img src={room.imageRoom} alt={room.room_name} className="w-full h-[180px] object-cover rounded-xl" />
                <h4 className="font-semibold mt-1 text-lg">{room.room_name}</h4>
                <p className="text-sm text-gray-500">Địa chỉ: {room.address}</p>
                <p className="text-sm text-gray-500">Giá: {room.price_per_night.toLocaleString()}đ/đêm</p>
                <p className="text-sm text-gray-500">Sức chứa: {room.capacity} người</p>
                <p className="text-sm text-gray-500">Loại: {room.type_name}</p>
                <p className="text-sm text-gray-500">Tiện ích: {room.amenities}</p>
                <button className="bg-teal-500 text-white px-4 py-1 rounded-full hover:font-semibold hover:bg-teal-600 transition">Đặt ngay</button>
              </div>
            ))}
          </div>
        </section>

        {/* XEM THÊM */}
        <div className="text-center mt-6">
          <button className="bg-white border border-gray-300 px-6 py-2 rounded-full hover:bg-teal-500 hover:text-white transition">
            Xem tất cả khách sạn
          </button>
        </div>

        {/* REVIEW */}
        <ReviewSection />

        {/* ĐIỂM ĐẾN */}
        <section className="text-center my-16">
          <h2 className="text-3xl font-bold">Các điểm đến của Elitetravel</h2>
          <p className="text-gray-600 mt-2">
            Khám phá vẻ đẹp tuyệt vời của Du thuyền Hạ Long: Hành trình đến thiên đường thiên nhiên
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="border rounded-xl p-4 hover:shadow-md transition duration-300">
                <img src="/halong.png" alt="Vịnh Hạ Long" className="w-full h-52 object-cover rounded-lg mb-4" />
                <h3 className="font-bold text-lg mb-2">Vịnh Hạ Long</h3>
                <button className="bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-teal-500 hover:text-white transition">
                  Xem ngay
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* TIN TỨC */}
        <section className="my-16">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-6">
            <h2 className="text-2xl font-bold">
              Hạ Long: Khám phá Sự đặc sắc và Cập nhật tin tức mới nhất
            </h2>
            <p className="text-gray-600 md:max-w-xl mt-2 md:mt-0">
              Hạ Long: Bí mật và Cuộc sống trong Vịnh – Khám phá và Cập nhật những tin tức hấp<br />
              dẫn từ điểm đến tuyệt vời này.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="border rounded-xl overflow-hidden hover:shadow-md transition">
                <img src="/vuonhoa.png" alt="Mùa bướm" className="w-full h-52 object-cover" />
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
      </div>
    </main>
  );
};

export default HotelPage;
