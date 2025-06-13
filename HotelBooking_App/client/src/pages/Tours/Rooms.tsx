import Sidebar from "../../components/Sidebar";

const rooms = [
  {
    room_id: 1,
    room_name: "Phòng Deluxe Hướng Biển",
    address: "Vinpearl, Nha Trang",
    price_per_night: 1500000,
    image_room: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn7d2rRrHwbdb-W-UJPX_wIXCVXfKZmCyDPA&s",
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
    image_room: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTA0-GY84wue4TgTJKA-TMil4__Up94d4lZQ&s",
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
    image_room: "https://longthuanhotelresort.com/wp-content/uploads/2020/10/570-X-340-THUMBNAILS-PHONG-DELUXE-GARDEN-VIEW.jpg",
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
    image_room: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYzGhzdv7uYrqcKZp6ijKQOsAnLh2sPgkSQA&s",
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
    image_room: "https://blog.premierresidencesphuquoc.com/wp-content/uploads/2024/10/unnamed-2-2-1024x683.webp",
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
    image_room: "https://dyf.vn/wp-content/uploads/2021/10/phong-twin-la-gi.jpg",
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
    image_room: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMh6CYy0R_0oqi2AZjXkOI-y-SSxbJAz_3g&s",
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
    image_room: "https://www.lionhotel.vn/files/branch/room/i_78_952_IMG_5315.jpg",
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
    image_room: "https://ezcloud.vn/wp-content/uploads/2023/10/president-suite-la-gi.webp",
    capacity: 6,
    max_adults: 4,
    max_children: 2,
    type_name: "President",
  }
];


const RoomList = () => {
  return (
    <div className="max-w-screen-xl p-4 mx-auto font-sans mt-20">
    <main className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6">
      <Sidebar />
      <section className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Danh sách phòng</h2>
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
    </div>
  );
};

export default RoomList;
