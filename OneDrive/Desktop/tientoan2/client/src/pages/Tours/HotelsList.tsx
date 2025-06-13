import Sidebar from "../../components/Sidebar";

const hotels = [
  {
    id: 1,
    name: "Khách sạn VinWonders Nha Trang",
    location: "Nha Trang",
    nights: "3N2Đ",
    price: "6.500.000đ",
    stars: 5,
    image: "vinwonders.jpg"
  },
  {
    id: 4,
    name: "Khách sạn Jeju Island Hàn Quốc",
    location: "Jeju, Hàn Quốc",
    nights: "5N4Đ",
    price: "15.000.000đ",
    stars: 0,
    image: "jejuhotel.jpg"
  }
];

const HotelList = () => {
  return (
    <main className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6">
      <Sidebar />
      <section className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Kết quả tìm thấy: {hotels.length} khách sạn
          </h2>
          <select className="border text-sm rounded px-3 py-1">
            <option>Mặc định</option>
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                  ❤️
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">📍 Vị trí: {hotel.location}</p>
                <h3 className="text-blue-600 font-semibold mb-1 leading-snug">
                  {hotel.name}
                </h3>
                <div className="text-yellow-400 text-sm mb-1">
                  {hotel.stars
                    ? "★".repeat(hotel.stars) + "☆".repeat(5 - hotel.stars)
                    : "☆☆☆☆☆"}
                </div>
                <p className="text-blue-600 font-bold text-lg">
                  {hotel.price}
                </p>
                <p className="text-sm text-gray-500">🕒 Thời gian lưu trú: {hotel.nights}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HotelList;
