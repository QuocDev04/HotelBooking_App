import { useState } from "react";

const TourList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tours = [
    {
      id: 1,
      name: "Tour Nha Trang 3N2Đ VinWonders",
      from: "Hà Nội",
      time: "3N2Đ",
      price: "6.500.000đ",
      stars: "★★★★★",
      image: "https://cdn3.ivivu.com/2023/10/hon-mun-nha-trang-1-1-480x320.jpg",
    },
    {
      id: 2,
      name: "Tour Phú Quốc 1 ngày 4 đảo",
      from: "Phú Quốc",
      time: "1 ngày",
      price: "1.000.000đ",
      discount: "2.000.000đ",
      stars: "★★★★☆",
      image: "https://cdn3.ivivu.com/2022/12/ivivu-han-quoc-mua-thu-2-480x320.jpg",
    },
  ];

  return (
    <main className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-white p-4 border-r shadow-md`}>
        <h2 className="font-bold text-lg mb-3">Chọn mức giá</h2>
        <div className="space-y-2 mb-4 text-sm">
          {["Dưới 1 triệu", "1 - 3 triệu", "3 - 5 triệu", "Trên 9 triệu"].map((label, idx) => (
            <label key={idx} className="block"><input type="checkbox" className="mr-1" />{label}</label>
          ))}
        </div>
      </aside>

      {/* Tour list */}
      <section className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded shadow overflow-hidden">
              <div className="relative">
                <img src={tour.image} alt={tour.name} className="w-full h-48 object-cover" />
                {tour.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-50%</span>
                )}
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">❤️</button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500">Khởi hành từ: {tour.from}</p>
                <h3 className="text-blue-600 font-semibold mb-1">{tour.name}</h3>
                <div className="text-yellow-400">{tour.stars}</div>
                <p className="text-blue-600 font-bold text-lg">
                  {tour.price}{" "}
                  {tour.discount && <span className="text-gray-400 line-through text-sm">{tour.discount}</span>}
                </p>
                <p className="text-sm text-gray-500">🕒 Thời gian: {tour.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TourList;
