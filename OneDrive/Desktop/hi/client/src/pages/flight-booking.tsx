import React from 'react';
import { Link } from 'react-router-dom';
const FlightBooking = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 shadow-md bg-white z-10 relative">
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

      {/* Banner Section only */}
      <div className="w-full h-[360px] bg-[url('/banner.png')] bg-cover bg-center bg-no-repeat"></div>

      {/* Form Section below banner */}
      <div className="-mt-28 flex justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-1">Mở cánh cửa khám phá cùng Elite Travel</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Mixivivu - Đặt chân lên đỉnh mây với một bước nhảy</p>

          {/* Form */}
          <form className="space-y-4">
            <div className="flex items-center gap-6 justify-center mb-4">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="type" defaultChecked className="accent-teal-500" />
                Một chiều
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="type" className="accent-teal-500" />
                Khứ hồi
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-teal-500" />
                Vé rẻ nhất tháng
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Điểm đi" className="w-full p-3 border rounded-lg" />
              <input type="text" placeholder="Điểm đến" className="w-full p-3 border rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <input type="date" className="w-full p-3 border rounded-lg" defaultValue="2025-05-30" />
              <input type="number" defaultValue="1" className="w-full p-3 border rounded-lg" placeholder="Người lớn" />
              <input type="number" defaultValue="0" className="w-full p-3 border rounded-lg" placeholder="Trẻ em" />
              <input type="number" defaultValue="0" className="w-full p-3 border rounded-lg" placeholder="Em bé" />
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-full">
                Tìm vé máy bay
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Review Section */}
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

export default FlightBooking;
