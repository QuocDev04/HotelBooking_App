import { useState } from "react";

const images = [
  // Thay các link này bằng link ảnh thật của bạn
  "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg",
  "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg",
  "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg",
  "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg",
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/234762091.jpg?k=45540c95d66e3278d194a4a35994dd3491811d644b2a6cb3e3da1b187dfa7d06&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/234762091.jpg?k=45540c95d66e3278d194a4a35994dd3491811d644b2a6cb3e3da1b187dfa7d06&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/234762091.jpg?k=45540c95d66e3278d194a4a35994dd3491811d644b2a6cb3e3da1b187dfa7d06&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/234762091.jpg?k=45540c95d66e3278d194a4a35994dd3491811d644b2a6cb3e3da1b187dfa7d06&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1024x768/234762091.jpg?k=45540c95d66e3278d194a4a35994dd3491811d644b2a6cb3e3da1b187dfa7d06&o=&hp=1",
];

const Roomdetail = () => {
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lấy tối đa 6 ảnh để hiển thị, nếu nhiều hơn 6 thì ảnh cuối là nút "Xem tất cả hình ảnh"
  const showImages =
    images.length > 6 ? images.slice(0, 5) : images.slice(0, 6);
  const hasMore = images.length > 6;
  const totalImages = images.length;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Ảnh khách sạn */}
      <div className="max-w-6xl mx-auto pt-6">
        {/* Hàng ảnh lớn */}
        <div className="grid grid-cols-3 gap-2 h-72 rounded-xl overflow-hidden">
          <div className="col-span-2">
            <img
              src={images[0]}
              alt="Ảnh chính"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <img
              src={images[1]}
              alt="view 1"
              className="w-full h-1/2 object-cover"
            />
            <img
              src={images[2]}
              alt="view 2"
              className="w-full h-1/2 object-cover"
            />
          </div>
        </div>
        {/* Hàng thumbnail */}
        <div className="flex gap-2 mt-2">
          {images.length > 6 ? (
            <>
              {images.slice(3, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb ${idx + 4}`}
                  className="w-32 h-20 object-cover rounded"
                />
              ))}
              <div
                className="relative w-32 h-20 rounded overflow-hidden cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <img
                  src={images[5]}
                  alt="Xem tất cả hình ảnh"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.6)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-center text-sm leading-tight drop-shadow">
                    Xem tất cả hình ảnh
                    <br />({images.length})
                  </span>
                </div>
              </div>
            </>
          ) : (
            images
              .slice(3, 6)
              .map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb ${idx + 4}`}
                  className="w-32 h-20 object-cover rounded"
                />
              ))
          )}
        </div>
      </div>

      {/* Modal hiển thị tất cả hình ảnh */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-700 text-2xl font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`all-img-${idx}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Thông tin khách sạn */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Leaf Beachfront Hotel Da Nang
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                Khách Sạn
              </span>
              <span className="text-yellow-400 text-lg">★ ★ ★ ★</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Giá/phòng/đêm từ</div>
              <div className="text-2xl font-bold text-orange-600">
                1.155.844 VND
              </div>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg">
              Chọn phòng
            </button>
          </div>
        </div>
      </div>

      {/* Đánh giá, vị trí, tiện ích */}
      <div className="max-w-6xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Đánh giá */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-3xl font-bold">9,0</span>
            <span className="text-gray-600 font-semibold">/10</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">Xuất sắc</div>
          <div className="text-xs text-gray-400 mb-2">48 đánh giá</div>
          <div className="w-full border-t pt-2 mt-2">
            <div className="text-sm font-semibold mb-1">
              Khách nói gì về kỳ nghỉ của họ
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Thuy L. T.</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                9.4/10
              </span>
            </div>
            <div className="text-gray-600 text-sm mt-1">
              Tôi đã có 1 trải nghiệm tuyệt vời ở đây...chất lượng 5 sao...tôi
              sẽ quay lại đây nếu có cơ hội
            </div>
          </div>
        </div>
        {/* Vị trí */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">Trong khu vực</span>
            <button className="text-blue-600 text-xs hover:underline flex items-center gap-1">
              <svg
                className="w-4 h-4 inline-block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Xem bản đồ
            </button>
          </div>
          <div className="flex items-center text-sm text-gray-700 mb-1">
            <svg
              className="w-4 h-4 mr-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
              <circle cx="12" cy="10.5" r="3" />
            </svg>
            38 Võ Nguyên Giáp, Mân Thái, Sơn Trà, Đà Nẵng, Việt Nam, 550000
          </div>
          <div className="flex items-center text-xs text-blue-700 mb-2">
            <svg
              className="w-4 h-4 mr-1 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927C9.469 1.837 10.531 1.837 10.951 2.927l1.286 3.319a1 1 0 00.95.69h3.462c1.11 0 1.572 1.424.677 2.09l-2.8 2.034a1 1 0 00-.364 1.118l1.286 3.319c.42 1.09-.34 1.988-1.23 1.322l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.89.666-1.65-.232-1.23-1.322l1.286-3.319a1 1 0 00-.364-1.118L2.074 9.026c-.895-.666-.433-2.09.677-2.09h3.462a1 1 0 00.95-.69l1.286-3.319z" />
            </svg>
            Gần khu vui chơi giải trí
          </div>
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Four Points by Sheraton Danang -{" "}
              <span className="ml-1 text-gray-500">968 m</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Đối diện Sở 35 Cty TNHH Huy Đăng Ngô Q... -{" "}
              <span className="ml-1 text-gray-500">1.65 km</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Biển Phạm Văn Đồng -{" "}
              <span className="ml-1 text-gray-500">2.10 km</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Bảo tàng 3D Art In Paradise Đà Nẵng -{" "}
              <span className="ml-1 text-gray-500">1.24 km</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Đối diện Sở 35 Cty TNHH Huy Đăng Ngô Q... -{" "}
              <span className="ml-1 text-gray-500">1.65 km</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Bệnh viện 199 - Bộ Công An -{" "}
              <span className="ml-1 text-gray-500">2.54 km</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              Trường Cao đẳng Nghề Đà Nẵng -{" "}
              <span className="ml-1 text-gray-500">3.00 km</span>
            </li>
          </ul>
        </div>
        {/* Tiện ích */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Tiện ích chính</span>
            <button className="text-blue-600 text-xs hover:underline flex items-center gap-1">
              Xem thêm
              <svg
                className="w-4 h-4 ml-1 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              {/* Máy lạnh */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="7" width="18" height="6" rx="2" />
                <path d="M3 13h18M8 17v2M12 17v2M16 17v2" />
              </svg>
              Máy lạnh
            </div>
            <div className="flex items-center gap-2">
              {/* Chỗ đậu xe */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="7" width="18" height="10" rx="2" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="16.5" cy="17.5" r="1.5" />
              </svg>
              Chỗ đậu xe
            </div>
            <div className="flex items-center gap-2">
              {/* Hồ bơi */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 20c2-2 6-2 8 0s6 2 8 0" />
                <path d="M12 4v8" />
                <circle cx="12" cy="4" r="2" />
              </svg>
              Hồ bơi
            </div>
            <div className="flex items-center gap-2">
              {/* WiFi */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 8.82A17.89 17.89 0 0112 6c3.31 0 6.42.8 9.18 2.22" />
                <path d="M5.07 13.11A12.94 12.94 0 0112 11c2.21 0 4.3.53 6.07 1.47" />
                <path d="M8.53 17.11A7.94 7.94 0 0112 16c1.13 0 2.21.21 3.18.61" />
                <circle cx="12" cy="20" r="1" />
              </svg>
              WiFi
            </div>
            <div className="flex items-center gap-2">
              {/* Nhà hàng */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 10h16M10 14v6m4-6v6" />
              </svg>
              Nhà hàng
            </div>
            <div className="flex items-center gap-2">
              {/* Thang máy */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="7" y="4" width="10" height="16" rx="2" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              Thang máy
            </div>
            <div className="flex items-center gap-2">
              {/* Lễ tân 24h */}
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Lễ tân 24h
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div className="max-w-6xl mx-auto mt-4 bg-white rounded-xl shadow p-6">
        <div className="text-gray-700 text-sm">
          Leaf Beachfront Hotel Đà Nẵng là một lựa chọn đúng đắn khi bạn đến Đà
          Nẵng. Quầy lễ tân 24 giờ luôn sẵn sàng phục vụ quý khách, từ thủ tục
          nhận phòng đến trả phòng hoặc bất kỳ sự hỗ trợ nào khác. Nhà ăn, bãi
          đỗ xe, nhà hàng, dịch vụ lễ tân, chúng tôi luôn sẵn lòng phục vụ bạn.
          <button className="ml-2 text-blue-600 text-xs hover:underline">
            Xem thêm
          </button>
        </div>
      </div>

      {/* Danh sách phòng */}
      <div className="max-w-6xl mx-auto mt-6">
        <h2 className="text-lg font-bold mb-2">
          Những phòng còn trống tại Leaf Beachfront Hotel Da Nang
        </h2>
        {/* Danh sách phòng (demo 1 phòng) */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/444444444.jpg"
              alt="Phòng Deluxe"
              className="w-32 h-24 object-cover rounded"
            />
            <div>
              <div className="font-semibold">Phòng Deluxe hướng biển</div>
              <div className="text-xs text-gray-500">
                2 người lớn • 1 giường đôi lớn • 32m²
              </div>
              <div className="text-xs text-green-600 font-semibold mt-1">
                Miễn phí hủy phòng
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="text-orange-600 font-bold text-xl">
              1.155.844 VND
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg mt-2">
              Đặt phòng
            </button>
          </div>
        </div>
        {/* Thêm các phòng khác nếu muốn */}
      </div>

      {/* Xung quanh khách sạn */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow p-6">
        <div className="text-lg font-bold mb-2">
          Xung quanh Leaf Beachfront Hotel Da Nang có gì
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cột 1: Bản đồ + địa chỉ */}
          <div>
            <div className="rounded-lg overflow-hidden mb-2">
              <img
                src="" // Thay bằng ảnh bản đồ thật nếu có
                alt="Bản đồ"
                className="w-full h-40 object-cover"
              />
            </div>
            <button className="flex items-center bg-gray-800 text-white px-3 py-1 rounded mb-2 text-sm">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Khám phá nhiều địa điểm hơn
            </button>
            <div className="flex items-center mb-1 text-sm text-gray-700">
              <svg
                className="w-4 h-4 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-1.5 3-6.1 7.7-6.1 7.7s-4.6-4.7-6.1-7.7A8.38 8.38 0 013 10.5 8.5 8.5 0 1112 19a8.5 8.5 0 019-8.5z" />
                <circle cx="12" cy="10.5" r="3" />
              </svg>
              38 Võ Nguyên Giáp, Mân Thái, Sơn Trà, Đà Nẵng, Việt Nam, 550000
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold mt-2">
              Gần khu vui chơi giải trí
            </span>
          </div>
          {/* Cột 2: Địa điểm lân cận */}
          <div>
            <div className="font-semibold mb-2">Địa điểm lân cận</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                    />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">
                    Bảo tàng 3D Art In Paradise Đà Nẵng
                  </span>
                  <span className="block text-xs text-gray-500">
                    Nghệ thuật & Khoa học
                  </span>
                </span>
                <span className="text-xs text-gray-700 ml-2">1.24 km</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <svg
                    id="Icons"
                    enable-background="new 0 0 32 32"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m21 5h-2.1l2-3.5c.2-.5.1-1.1-.4-1.4-.5-.2-1.1-.1-1.4.4l-2.5 4.5h-1.7l2-3.5c.2-.5.1-1.1-.4-1.4-.5-.2-1.1-.1-1.4.4l-2.5 4.5h-1.6c-2.8 0-5 2.2-5 5v9 6c0 .9.4 1.7 1 2.2v1.8c0 1.7 1.3 3 3 3s3-1.3 3-3v-1h6v1c0 1.7 1.3 3 3 3s3-1.3 3-3v-1.8c.6-.5 1-1.3 1-2.2v-6-9c0-2.8-2.2-5-5-5zm-8 19h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zm9 0h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zm2-6h-16v-7h16z" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">
                    Đối Diện Số 35 Cty TNHH Huy Đăng Ngô Q...
                  </span>
                  <span className="block text-xs text-gray-500">
                    Điểm nút giao thông
                  </span>
                </span>
                <span className="text-xs text-gray-700 ml-2">1.65 km</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <svg
                    id="Layer_1"
                    enable-background="new 0 0 90 90"
                    viewBox="0 0 90 90"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="m45.004 8.664c11.254 0 20.387 9.073 20.387 20.268 0 4.351-1.87 10.955-5.825 15.545l-14.562 16.858-14.556-16.853c-3.96-4.59-5.83-11.194-5.83-15.55 0-11.195 9.132-20.268 20.386-20.268zm0-3.882c-13.37 0-24.279 10.851-24.279 24.149 0 5.384 2.032 12.587 6.76 18.069v.006l6.788 7.857h-11.662c-.842.004-1.59.545-1.85 1.34l-8.255 25.41c-.408 1.25.534 2.529 1.855 2.529h61.286c1.327 0 2.263-1.279 1.861-2.529l-8.261-25.41c-.26-.799-1.008-1.34-1.854-1.34h-7.409c-2.733-.135-2.733 4.018 0 3.877h5.993l6.99 21.52h-55.92l6.984-21.52h13.589l5.226 6.049h-3.428c-1.055-.02-1.927.826-1.927 1.881s.872 1.908 1.927 1.887h11.16c1.061.021 1.933-.832 1.933-1.887s-.873-1.9-1.933-1.881h-3.412l15.356-17.783v-.006c4.734-5.482 6.766-12.685 6.766-18.069.001-13.298-10.914-24.149-24.284-24.149z" />
                      <path d="m49.195 33.1c-2.33 2.318-6.052 2.323-8.381.006-2.33-2.318-2.33-6.028 0-8.348 2.33-2.317 6.051-2.312 8.381.006 2.335 2.317 2.335 6.014 0 8.331zm2.763 2.743c3.82-3.798 3.82-10.019 0-13.823-3.825-3.8-10.079-3.8-13.897 0-3.825 3.804-3.825 10.024 0 13.823 3.818 3.8 10.072 3.8 13.897 0z" />
                    </g>
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">
                    Bệnh viện 199 - Bộ Công An
                  </span>
                  <span className="block text-xs text-gray-500">
                    Dịch vụ công
                  </span>
                </span>
                <span className="text-xs text-gray-700 ml-2">2.54 km</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <svg
                    id="Layer_1"
                    enable-background="new 0 0 90 90"
                    viewBox="0 0 90 90"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path d="m45.004 8.664c11.254 0 20.387 9.073 20.387 20.268 0 4.351-1.87 10.955-5.825 15.545l-14.562 16.858-14.556-16.853c-3.96-4.59-5.83-11.194-5.83-15.55 0-11.195 9.132-20.268 20.386-20.268zm0-3.882c-13.37 0-24.279 10.851-24.279 24.149 0 5.384 2.032 12.587 6.76 18.069v.006l6.788 7.857h-11.662c-.842.004-1.59.545-1.85 1.34l-8.255 25.41c-.408 1.25.534 2.529 1.855 2.529h61.286c1.327 0 2.263-1.279 1.861-2.529l-8.261-25.41c-.26-.799-1.008-1.34-1.854-1.34h-7.409c-2.733-.135-2.733 4.018 0 3.877h5.993l6.99 21.52h-55.92l6.984-21.52h13.589l5.226 6.049h-3.428c-1.055-.02-1.927.826-1.927 1.881s.872 1.908 1.927 1.887h11.16c1.061.021 1.933-.832 1.933-1.887s-.873-1.9-1.933-1.881h-3.412l15.356-17.783v-.006c4.734-5.482 6.766-12.685 6.766-18.069.001-13.298-10.914-24.149-24.284-24.149z" />
                      <path d="m49.195 33.1c-2.33 2.318-6.052 2.323-8.381.006-2.33-2.318-2.33-6.028 0-8.348 2.33-2.317 6.051-2.312 8.381.006 2.335 2.317 2.335 6.014 0 8.331zm2.763 2.743c3.82-3.798 3.82-10.019 0-13.823-3.825-3.8-10.079-3.8-13.897 0-3.825 3.804-3.825 10.024 0 13.823 3.818 3.8 10.072 3.8 13.897 0z" />
                    </g>
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">
                    Trường Cao đẳng Nghề Đà Nẵng
                  </span>
                  <span className="block text-xs text-gray-500">Giáo dục</span>
                </span>
                <span className="text-xs text-gray-700 ml-2">3.00 km</span>
              </li>
            </ul>
          </div>
          {/* Cột 3: Phổ biến trong khu vực */}
          <div>
            <div className="font-semibold mb-2">Phổ biến trong khu vực</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <svg
                    id="Icons"
                    enable-background="new 0 0 32 32"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m21 5h-2.1l2-3.5c.2-.5.1-1.1-.4-1.4-.5-.2-1.1-.1-1.4.4l-2.5 4.5h-1.7l2-3.5c.2-.5.1-1.1-.4-1.4-.5-.2-1.1-.1-1.4.4l-2.5 4.5h-1.6c-2.8 0-5 2.2-5 5v9 6c0 .9.4 1.7 1 2.2v1.8c0 1.7 1.3 3 3 3s3-1.3 3-3v-1h6v1c0 1.7 1.3 3 3 3s3-1.3 3-3v-1.8c.6-.5 1-1.3 1-2.2v-6-9c0-2.8-2.2-5-5-5zm-8 19h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zm9 0h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1zm2-6h-16v-7h16z" />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">
                    Đối Diện Số 35 Cty TNHH Huy Đăng Ngô Q...
                  </span>
                  <span className="block text-xs text-gray-500">Khác</span>
                </span>
                <span className="text-xs text-gray-700 ml-2">1.65 km</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                    />
                  </svg>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">Biển Phạm Văn Đồng</span>
                  <span className="block text-xs text-gray-500">
                    Trung tâm giải trí
                  </span>
                </span>
                <span className="text-xs text-gray-700 ml-2">2.10 km</span>
              </li>
              <li className="flex items-center">
                <span className="w-6 flex justify-center">
                  <span className="w-6 flex justify-center">
                    <svg
                      id="Layer_1"
                      enable-background="new 0 0 90 90"
                      viewBox="0 0 90 90"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <path d="m45.004 8.664c11.254 0 20.387 9.073 20.387 20.268 0 4.351-1.87 10.955-5.825 15.545l-14.562 16.858-14.556-16.853c-3.96-4.59-5.83-11.194-5.83-15.55 0-11.195 9.132-20.268 20.386-20.268zm0-3.882c-13.37 0-24.279 10.851-24.279 24.149 0 5.384 2.032 12.587 6.76 18.069v.006l6.788 7.857h-11.662c-.842.004-1.59.545-1.85 1.34l-8.255 25.41c-.408 1.25.534 2.529 1.855 2.529h61.286c1.327 0 2.263-1.279 1.861-2.529l-8.261-25.41c-.26-.799-1.008-1.34-1.854-1.34h-7.409c-2.733-.135-2.733 4.018 0 3.877h5.993l6.99 21.52h-55.92l6.984-21.52h13.589l5.226 6.049h-3.428c-1.055-.02-1.927.826-1.927 1.881s.872 1.908 1.927 1.887h11.16c1.061.021 1.933-.832 1.933-1.887s-.873-1.9-1.933-1.881h-3.412l15.356-17.783v-.006c4.734-5.482 6.766-12.685 6.766-18.069.001-13.298-10.914-24.149-24.284-24.149z" />
                        <path d="m49.195 33.1c-2.33 2.318-6.052 2.323-8.381.006-2.33-2.318-2.33-6.028 0-8.348 2.33-2.317 6.051-2.312 8.381.006 2.335 2.317 2.335 6.014 0 8.331zm2.763 2.743c3.82-3.798 3.82-10.019 0-13.823-3.825-3.8-10.079-3.8-13.897 0-3.825 3.804-3.825 10.024 0 13.823 3.818 3.8 10.072 3.8 13.897 0z" />
                      </g>
                    </svg>
                  </span>
                </span>
                <span className="flex-1">
                  <span className="font-semibold">
                    Four Points by Sheraton Danang
                  </span>
                  <span className="block text-xs text-gray-500">Khác</span>
                </span>
                <span className="text-xs text-gray-700 ml-2">968 m</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Khoảng cách hiển thị dựa trên đường chim bay. Khoảng cách di chuyển
          thực tế có thể khác.
        </div>
      </div>

      {/* Khám phá thêm về khách sạn */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow overflow-hidden">
        {/* Hình ảnh + overlay tiêu đề */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <img
              src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg"
              alt="Leaf Beachfront Hotel"
              className="h-56 w-full object-cover"
            />
            <img
              src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg"
              alt="Leaf Beachfront Hotel"
              className="h-56 w-full object-cover"
            />
            <img
              src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg"
              alt="Leaf Beachfront Hotel"
              className="h-56 w-full object-cover"
            />
          </div>
          {/* Tiêu đề overlay nằm trên ảnh */}
          <div className="absolute left-0 bottom-0 w-full bg-black bg-opacity-70 px-6 py-3">
            <span className="text-white text-lg font-bold">
              Khám phá thêm về Leaf Beachfront Hotel Da Nang
            </span>
          </div>
        </div>
        {/* Nội dung mô tả */}
        <div className="p-6 pt-8">
          <div className="font-bold mb-2">Vị trí</div>
          <div className="mb-4">
            Nghỉ tại Leaf Beachfront Hotel Da Nang là một lựa chọn đúng đắn khi bạn đến thăm Phường Mân Thái.
          </div>
          <div className="font-bold mb-2">Về Leaf Beachfront Hotel Da Nang</div>
          <div>
            Đối với bạn, những du khách mong muốn đi du lịch thoải mái với ngân sách vừa phải, Leaf Beachfront Hotel Da Nang là nơi hoàn hảo để ở, cung cấp các tiện nghi đầy đủ cũng như các dịch vụ tuyệt vời.<br />
            Khách sạn này là sự lựa chọn hoàn hảo cho các cặp đôi đang tìm kiếm một kỳ nghỉ lãng mạn hoặc một nơi nghỉ trăng mật. Tận hưởng những đêm đáng nhớ nhất với người yêu của bạn bằng cách ở tại Leaf Beachfront Hotel Da Nang.
          </div>
        </div>
      </div>

      {/* Chính sách và FAQ */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái */}
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-start min-h-[220px]">
          <div className="font-bold text-lg mb-4">
            Chính sách và những thông tin liên quan của Leaf Beachfront Hotel Da Nang
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            {/* Icon hỏi đáp */}
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <ellipse cx="30" cy="30" rx="30" ry="30" fill="#e3effc"/>
              <ellipse cx="20" cy="40" rx="10" ry="10" fill="#b6dafe"/>
              <text x="15" y="45" fontSize="30" fill="#2196f3">?</text>
            </svg>
          </div>
        </div>
        {/* Cột phải */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow p-0 divide-y border">
            {/* FAQ item */}
            <div>
              <button
                className="w-full text-left px-6 py-4 font-semibold hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                type="button"
                onClick={() => setOpenFaq(0)}
              >
                Những tiện ích tại Leaf Beachfront Hotel Da Nang?
                <span className="ml-2">{openFaq === 0 ? "▲" : "▼"}</span>
              </button>
              {openFaq === 0 && (
                <div className="px-6 pb-4 text-gray-700 text-sm">
                  Máy lạnh, Hồ bơi, Nhà hàng, Lễ tân 24h, Chỗ đậu xe, WiFi, Thang máy...
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left px-6 py-4 font-semibold hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                type="button"
                onClick={() => setOpenFaq(1)}
              >
                Leaf Beachfront Hotel Da Nang có mức giá là bao nhiêu?
                <span className="ml-2">{openFaq === 1 ? "▲" : "▼"}</span>
              </button>
              {openFaq === 1 && (
                <div className="px-6 pb-4 text-gray-700 text-sm">
                  Giá phòng thay đổi theo từng thời điểm, vui lòng kiểm tra trên hệ thống để biết giá chính xác.
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left px-6 py-4 font-semibold hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                type="button"
                onClick={() => setOpenFaq(2)}
              >
                Thời gian nhận phòng và trả phòng của Leaf Beachfront Hotel Da Nang?
                <span className="ml-2">{openFaq === 2 ? "▲" : "▼"}</span>
              </button>
              {openFaq === 2 && (
                <div className="px-6 pb-4 text-gray-700 text-sm">
                  Nhận phòng từ 14:00, trả phòng trước 12:00.
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left px-6 py-4 font-semibold hover:bg-gray-50 flex justify-between items-center focus:outline-none"
                type="button"
                onClick={() => setOpenFaq(3)}
              >
                Leaf Beachfront Hotel Da Nang có phục vụ ăn sáng không?
                <span className="ml-2">{openFaq === 3 ? "▲" : "▼"}</span>
              </button>
              {openFaq === 3 && (
                <div className="px-6 pb-4 text-gray-700 text-sm">
                  Có, khách sạn phục vụ bữa sáng miễn phí cho khách lưu trú.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roomdetail;
