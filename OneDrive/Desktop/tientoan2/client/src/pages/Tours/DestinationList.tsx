import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const destinations = [
  {
    id: 1,
    name: "Phố cổ Hội An",
    location: "Quảng Nam",
    description: "Di sản văn hóa thế giới với đèn lồng và phố đi bộ.",
    image: "https://travelguide.org.vn/img/images/hoi%20an%2010.jpg"
  },
  {
    id: 2,
    name: "Thành phố Đà Lạt",
    location: "Lâm Đồng",
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.",
    image: "https://vivuvietnam.org/wp-content/uploads/2024/07/canh-dep-da-lat-1.jpg"
  },
  {
    id: 3,
    name: "Vịnh Hạ Long",
    location: "Quảng Ninh",
    description: "Kỳ quan thiên nhiên với hàng nghìn đảo đá vôi tuyệt đẹp.",
    image: "https://media.baoquangninh.vn/upload/image/202309/medium/2124682_do_thi_ha_long_11020312.jpg"
  },
  {
    id: 4,
    name: "Núi Bà Nà",
    location: "Đà Nẵng",
    description: "Cầu Vàng và khu du lịch trên đỉnh núi với cáp treo.",
    image: "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-thumb.jpg"
  },
  {
    id: 5,
    name: "Cố đô Huế",
    location: "Thừa Thiên Huế",
    description: "Thành phố cổ kính với di tích hoàng thành và văn hóa cung đình.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzsxeLoC2d-efsicQuWR94zUfDJlQ5hZsnw&s"
  },
  {
    id: 6,
    name: "Thành phố Hồ Chí Minh",
    location: "TP.HCM",
    description: "Trung tâm kinh tế sôi động với nhiều điểm tham quan hấp dẫn.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDTEpktOdIrlBNDWJtjUswZUajhF-mMFd8rw&s"
  },
  {
    id: 7,
    name: "Phú Quốc",
    location: "Kiên Giang",
    description: "Thiên đường biển đảo với cát trắng, biển xanh và resort cao cấp.",
    image: "https://nads.1cdn.vn/2022/12/10/W_giai-nhat_le-hoi-venice_kha-thanh-tri-dat.jpg"
  },
  {
    id: 8,
    name: "Sapa",
    location: "Lào Cai",
    description: "Vùng núi Tây Bắc với ruộng bậc thang và bản làng dân tộc.",
    image: "https://media.istockphoto.com/id/624183176/vi/anh/ru%E1%BB%99ng-b%E1%BA%ADc-thang-%E1%BB%9F-mu-cang-ch%E1%BA%A3i-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=UbNrn36xFBIff9yV3RDl5lPs3-kW-WQ_sSNMB1M3Trs="
  },
  {
    id: 9,
    name: "Mộc Châu",
    location: "Sơn La",
    description: "Thảo nguyên xanh ngát, đồi chè và vườn hoa bốn mùa.",
    image: "https://scontent.iocvnpt.com/resources/portal/Images/DTP/dtblieu/nam_2022/thang_4/canh_dep_o_son_la_xim_vang_155865732.jpeg"
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
{/*hihihi*/}
