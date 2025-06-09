import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold">Elite Travel</span>
        </div>
        <nav className="hidden md:flex flex-1 justify-center space-x-6 font-medium">
          <Link to="/">Tìm du thuyền</Link>
          <Link to="/flight-booking">Tìm vé máy bay</Link>
          <Link to="/">Tìm khách sạn</Link>
          <Link to="/">Doanh nghiệp</Link>
          <Link to="/">Blog</Link>

        </nav>
        <div className="flex items-center space-x-4 text-sm">
          <span>Hotline: 0392595555</span>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full text-sm">
            Liên hệ Elite Travel
          </button>
        </div>
      </header>


      {/* Banner and Search */}
       <div className="relative bg-cover bg-center h-[300px]" style={{ backgroundImage: "url('/banner.png')" }}>
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Bạn lựa chọn du thuyền Hạ Long nào?</h1>
          <p className="text-gray-600 mb-6">Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn</p>
          <div className="flex space-x-2">
            <input type="text" placeholder="Nhập tên du thuyền" className="p-2 rounded-full border" />
            <select className="p-2 rounded-full border">
              <option>Địa điểm</option>
            </select>
            <select className="p-2 rounded-full border">
              <option>Mức giá</option>
            </select>
            <button className="p-2 bg-teal-500 text-white rounded-full">Tìm kiếm</button>
          </div>
        </div>
      </div>

      {/* Tour Listings */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Du thuyền mới và phổ biến nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.tour_id} className="border rounded-lg overflow-hidden shadow-md">
              <img src={tour.imageTour} alt={tour.tour_name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{tour.tour_name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-teal-600 font-bold">{tour.price.toLocaleString()}đ/khách</span>
                  <button className="bg-teal-500 text-white px-4 py-1 rounded-full">Đặt ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold mb-4">Đánh giá từ những người đã trải nghiệm</h2>
        <div className="border-l-4 border-teal-400 pl-6 py-4">
          <h3 className="font-semibold text-lg text-teal-600">Du thuyền Heritage Bình Chuẩn</h3>
          <p className="text-gray-600 mt-2">
            Chị rất cảm ơn team đã tư vấn cho chị chọn du thuyền Heritage Bình Chuẩn. Bố mẹ chị rất ưng í em ạ!
            Tàu đẹp, mang đậm phong cách Á Đông. Đồ ăn hợp khẩu vị. Các bạn nhân viên trên tàu nhiệt tình và chu đáo.
          </p>
          <p className="font-bold mt-4">Chị Thu Hà</p>
          <div className="flex gap-2 mt-4">
            {["Chị Thu Hà", "Anh Khánh", "Chị Linh", "Bạn Hoàng", "Cô Thanh Hằng"].map((name, index) => (
              <button
                key={index}
                className="px-4 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations and News */}
      <section className="container mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Các điểm đến của Elitetravel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg shadow-lg overflow-hidden">
              <img src="/images/ha-long.jpg" alt="Vịnh Hạ Long" className="w-full h-40 object-cover" />
              <div className="text-center py-4">
                <h3 className="font-semibold">Vịnh Hạ Long</h3>
                <button className="mt-2 bg-gray-200 py-1 px-3 rounded-full">Xem ngay</button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Hạ Long: Khám phá Sự đặc sắc và Cập nhật tin tức mới nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg overflow-hidden shadow-lg">
              <img src="/images/news.jpg" alt="Tin tức" className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">Mùa bướm thơ mộng tại vườn quốc gia Cúc Phương</h3>
                <p className="text-sm text-gray-500">21/05/2025</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white p-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2" />
            <p>Công ty TNHH Du lịch và Dịch Vụ Elite Travel</p>
            <p className="mt-2 text-sm">
              Tầng 7, số nhà 25, ngõ 38 phố Yên Lãng, phường Láng Hạ, quận Đống Đa, TP. Hà Nội
            </p>
            <p className="mt-2 text-sm">
              Mã số doanh nghiệp: 0107367372 do Sở kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 05/06/2023
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">GIỚI THIỆU</h4>
            <ul className="text-sm">
              <li>Về chúng tôi</li>
              <li>Điều khoản và điều kiện</li>
              <li>Chính sách riêng tư</li>
              <li>Hướng dẫn sử dụng</li>
              <li>Hình thức thanh toán</li>
              <li>Liên hệ</li>
              <li>Hotline: 0392595555</li>
              <li>Email: info@elitetravel.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">ĐIỂM ĐẾN</h4>
            <ul className="text-sm">
              <li>Vịnh Hạ Long</li>
              <li>Vịnh Lan Hạ</li>
              <li>Đảo Cát Bà</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">DU THUYỀN</h4>
            <ul className="text-sm">
              <li>Blog</li>
              <li>Quy định chung và lưu ý</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>

  );
};

export default Home;