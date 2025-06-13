import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const destinations = [
  {
    id: 1,
    name: "Phố cổ Hội An",
    location: "Quảng Nam",
    description: "Di sản văn hóa thế giới với đèn lồng và phố đi bộ.",
    image: "https://source.unsplash.com/400x300/?hoian"
  },
  {
    id: 2,
    name: "Thành phố Đà Lạt",
    location: "Lâm Đồng",
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.",
    image: "https://source.unsplash.com/400x300/?dalat"
  },
  {
    id: 3,
    name: "Vịnh Hạ Long",
    location: "Quảng Ninh",
    description: "Kỳ quan thiên nhiên với hàng nghìn đảo đá vôi tuyệt đẹp.",
    image: "https://source.unsplash.com/400x300/?halong"
  },
  {
    id: 4,
    name: "Núi Bà Nà",
    location: "Đà Nẵng",
    description: "Cầu Vàng và khu du lịch trên đỉnh núi với cáp treo.",
    image: "https://source.unsplash.com/400x300/?banahill"
  }
];

const DestinationList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6">
      <Sidebar />
      <section className="flex-1">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-center mb-2">Bạn lựa chọn địa điểm du lịch nào?</h2>
          <p className="text-center text-gray-500 mb-4">Hơn 100 điểm đến hấp dẫn đang chờ bạn khám phá</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="🔍 Nhập tên địa điểm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-full px-5 py-2 w-full md:w-96 focus:outline-none"
            />
            <button className="bg-teal-500 text-white font-medium rounded-full px-6 py-2 hover:bg-teal-600 transition">
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-blue-600 font-semibold text-base mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">📍 {item.location}</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default DestinationList;
