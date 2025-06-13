import Sidebar from "../../components/Sidebar";

const rooms = [
  {
    room_id: 1,
    room_name: "Phòng Deluxe Hướng Biển",
    address: "Vinpearl, Nha Trang",
    price_per_night: 1500000,
    image_room: "https://source.unsplash.com/400x250/?hotel,sea",
    capacity: 4,
    max_adults: 2,
    max_children: 2,
    type_name: "Deluxe",
  },
  {
    room_id: 2,
    room_name: "Phòng Suite Sang Trọng",
    address: "Jeju, Hàn Quốc",
    price_per_night: 3000000,
    image_room: "https://source.unsplash.com/400x250/?hotel,suite",
    capacity: 5,
    max_adults: 3,
    max_children: 2,
    type_name: "Suite",
  },
  {
    room_id: 3,
    room_name: "Phòng Standard View Vườn",
    address: "Đà Lạt",
    price_per_night: 900000,
    image_room: "https://source.unsplash.com/400x250/?hotel,garden",
    capacity: 3,
    max_adults: 2,
    max_children: 1,
    type_name: "Standard",
  },
  {
    room_id: 4,
    room_name: "Phòng Family Hướng Núi",
    address: "Sa Pa",
    price_per_night: 2200000,
    image_room: "https://source.unsplash.com/400x250/?hotel,mountain",
    capacity: 6,
    max_adults: 4,
    max_children: 2,
    type_name: "Family",
  },
  {
    room_id: 5,
    room_name: "Phòng Executive Hồ Bơi Riêng",
    address: "Phú Quốc",
    price_per_night: 4500000,
    image_room: "https://source.unsplash.com/400x250/?hotel,pool",
    capacity: 5,
    max_adults: 3,
    max_children: 2,
    type_name: "Executive",
  },
  {
    room_id: 6,
    room_name: "Phòng Twin Cơ Bản",
    address: "TP.HCM",
    price_per_night: 850000,
    image_room: "https://source.unsplash.com/400x250/?hotel,twin",
    capacity: 2,
    max_adults: 2,
    max_children: 0,
    type_name: "Twin",
  },
  {
    room_id: 7,
    room_name: "Phòng King View Biển",
    address: "Đà Nẵng",
    price_per_night: 2800000,
    image_room: "https://source.unsplash.com/400x250/?hotel,king",
    capacity: 4,
    max_adults: 2,
    max_children: 2,
    type_name: "King",
  },
  {
    room_id: 8,
    room_name: "Phòng Single Giá Rẻ",
    address: "Huế",
    price_per_night: 500000,
    image_room: "https://source.unsplash.com/400x250/?hotel,single",
    capacity: 1,
    max_adults: 1,
    max_children: 0,
    type_name: "Single",
  },
  {
    room_id: 9,
    room_name: "Phòng President Sang Trọng",
    address: "Hà Nội",
    price_per_night: 7500000,
    image_room: "https://source.unsplash.com/400x250/?hotel,luxury",
    capacity: 6,
    max_adults: 4,
    max_children: 2,
    type_name: "President",
  }
];


const RoomList = () => {
  return (
    <main className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6">
      <Sidebar />
      <section className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Kết quả tìm thấy: {rooms.length} phòng khách sạn
          </h2>
          <select className="border text-sm rounded px-3 py-1">
            <option>Mặc định</option>
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="relative">
                <img
                  src={room.image_room}
                  alt={room.room_name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                  ❤️
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">📍 {room.address}</p>
                <h3 className="text-blue-600 font-semibold mb-1 leading-snug">
                  {room.room_name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  🛏 Loại phòng: {room.type_name}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  👥 Sức chứa: {room.capacity} người (Tối đa {room.max_adults} NL, {room.max_children} TE)
                </p>
                <p className="text-blue-600 font-bold text-lg">
                  {room.price_per_night.toLocaleString("vi-VN")}đ / đêm
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default RoomList;
