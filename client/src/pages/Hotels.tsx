import  { useEffect, useState } from 'react';

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

  fetch('http://localhost:3000/user')
    .then((res) => res.json())
    .then((data) => setUsers(data))
    .catch((err) => console.error('Lỗi khi fetch user:', err));
}, []);
const getUserById = (id) => {
  return users.find((u) => u.user_id === id);
};

  

  return (
    <main className="font-sans text-gray-800">
      <section className="container mx-auto px-4 py-10">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center">Bạn lựa chọn phòng nào?</h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Hàng trăm lựa chọn cao cấp đang chờ bạn
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.room_id} className="border rounded-xl p-3 shadow-sm bg-white">
              <img src={room.imageRoom} alt={room.room_name} className="w-full h-[180px] object-cover rounded-xl" />
              <h4 className="font-semibold mt-1 text-lg">{room.room_name}</h4>
              <p className="text-sm text-gray-500">Địa chỉ: {room.address}</p>
              <p className="text-sm text-gray-500">Giá: {room.price_per_night.toLocaleString()}đ/đêm</p>
              <p className="text-sm text-gray-500">Sức chứa: {room.capacity} người</p>
              <p className="text-sm text-gray-500">Loại: {room.type_name}</p>
              <p className="text-sm text-gray-500">Tiện ích: {room.amenities}</p>
              <button className="mt-3 bg-teal-500 text-white px-4 py-1 rounded-full text-sm">Đặt ngay</button>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Phản hồi từ khách hàng</h2>
        <div className="space-y-6">
          {reviews.map((review) => {
            const user = getUserById(review.user_id);
            return (
              <div key={review.review_id} className="border-l-4 border-teal-400 pl-6 py-4 bg-white rounded-md shadow-sm max-w-3xl mx-auto">
                <h3 className="font-semibold text-lg text-teal-600">Đánh giá từ {user?.full_name}</h3>
                <p className="text-gray-600 mt-2 leading-relaxed">{review.review_text}</p>
                <p className="font-bold mt-4">{user?.full_name}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default HotelPage;
