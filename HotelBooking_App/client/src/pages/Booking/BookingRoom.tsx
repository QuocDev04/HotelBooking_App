import React from "react";

const BookingRoom = () => {
  return (
    <div className="max-w-screen-xl p-4 mx-auto font-sans">
      {/* Progress Bar */}
      <div className="flex items-center mt-25 mb-10 w-full ">
        {/* Step 1 */}
        <div className="flex items-center flex-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base border-2 border-blue-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="ml-2 font-medium text-black text-[15px]">
            Bạn chọn
          </span>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        </div>
        {/* Step 2 */}
        <div className="flex items-center flex-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base border-2 border-blue-600">
            2
          </div>
          <span className="ml-2 font-medium text-blue-600 text-[15px]">
            Chi tiết về bạn
          </span>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        </div>
        {/* Step 3 */}
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-white text-gray-400 flex items-center justify-center font-semibold text-base border-2 border-gray-300">
            3
          </div>
          <span className="ml-2 font-medium text-gray-400 text-[15px]">
            Hoàn tất đặt phòng
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6 p-6">
        {/* Left: Hotel Info */}
        <div className="w-3/12 bg-white rounded-xl p-3 shadow-md flex flex-col gap-2">
          <img
            src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=414x232"
            alt="La Vela Saigon Hotel"
            className="w-full rounded-lg mb-2 h-36 object-cover"
          />
          <div className="text-xs text-gray-500 flex items-center gap-1">
            Khách sạn
            <span className="text-yellow-500 ml-1">★★★★★</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 text-yellow-500"
            >
              <path d="M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" />
            </svg>
          </div>
          <div className="font-bold text-base mb-1">La Vela Saigon Hotel</div>
          <div className="text-xs text-gray-700 mb-1">
            280 Nam Ky Khoi Nghia, Ward 8, District 3, Quận 3, TP. Hồ Chí Minh,
            Việt Nam
          </div>
          <div className="text-green-700 text-xs font-medium mb-1">
            Vị trí tuyệt vời – <span className="font-bold">8.8</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded font-semibold">
              8.9
            </span>
            <span className="text-xs text-gray-700">
              Tuyệt vời · 9.321 đánh giá
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-700 mb-2">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 21h8M12 17v4m8-4a8 8 0 10-16 0 8 8 0 0016 0z"
                />
              </svg>
              WiFi miễn phí
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 21h14M12 17v4m-7-4a7 7 0 1114 0 7 7 0 01-14 0z"
                />
              </svg>
              Chỗ đỗ xe
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-pink-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 21h8M12 17v4m8-4a8 8 0 10-16 0 8 8 0 0016 0z"
                />
              </svg>
              Nhà hàng
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-cyan-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2"
                />
              </svg>
              Hồ bơi
            </div>
          </div>
          {/* Chi tiết đặt phòng */}
          <div className="border border-blue-200 rounded-lg p-3 bg-blue-50 mb-1">
            <div className="font-semibold text-sm text-blue-700 flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Chi tiết đặt phòng của bạn
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex-1">
                <div className="text-gray-500">Nhận phòng</div>
                <div className="font-bold text-blue-700">
                  T3, 24 tháng 6 2025
                </div>
                <div className="text-gray-400 text-xs">15:00 – 00:00</div>
              </div>
              <div className="flex-1 border-l border-gray-200 pl-3">
                <div className="text-gray-500">Trả phòng</div>
                <div className="font-bold text-blue-700">
                  T4, 25 tháng 6 2025
                </div>
                <div className="text-gray-400 text-xs">00:00 – 12:00</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Tổng thời gian lưu trú:{" "}
              <span className="font-bold text-black">1 đêm</span>
            </div>
          </div>
          {/* Tóm tắt giá */}
          <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/50 mb-2 shadow-sm">
            <div className="font-semibold text-base mb-2 text-blue-700">
              Tóm tắt giá
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Giá gốc</span>
              <span className="font-semibold">VND 4.732.000</span>
            </div>
            <div className="flex justify-between text-sm mb-0">
              <span className="font-medium">Ưu Đãi Mùa Du Lịch</span>
              <span className="text-red-500 font-semibold">
                - VND 1.892.800
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-1 w-2/3">
              Chỉ nghỉ này đang có ưu đãi cho các kỳ lưu trú từ 28 tháng 3 – 30
              tháng 9, 2025.
            </div>
            <div className="my-3 px-3 py-2 rounded bg-blue-100 flex flex-col items-start">
              <span className="text-xs line-through text-gray-400">
                VND 4.732.000
              </span>
              <span className="text-xl font-bold text-blue-900">
                Tổng cộng <span className="text-rose-600">VND 2.839.200</span>
              </span>
              <span className="text-xs text-gray-500">
                Đã bao gồm thuế và phí
              </span>
            </div>
            <div className="font-semibold text-base mb-2 mt-2 text-blue-700">
              Thông tin giá
            </div>
            <div className="flex items-center text-sm mb-1">
              <span className="mr-2">✔</span>
              <span>Bao gồm VND 210.311 phí và thuế</span>
            </div>
            <div className="flex items-center text-sm mb-1">
              <span className="mr-2">💰</span>
              <span>
                Đặt cọc để phòng hư hại
                <span className="block text-gray-400 text-xs">
                  (Được hoàn trả toàn bộ)
                </span>
              </span>
              <span className="ml-auto font-semibold">VND 4.000.000</span>
            </div>
            <a
              href="#"
              className="text-blue-600 text-xs hover:underline mt-2 inline-block"
            >
              Xem chi tiết
            </a>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="w-9/12 bg-white rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-6">
            <div className="font-semibold text-3xl mr-4">
              Nhập thông tin chi tiết của bạn
            </div>
          </div>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ */}
              <div className="mb-4">
                <label className="text-sm font-medium flex items-center gap-1">
                  Họ (tiếng Anh)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ví dụ: Nguyễn"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              {/* Địa chỉ email */}
              <div className="mb-4">
                <label className="text-sm font-medium flex items-center gap-1">
                  Địa chỉ email
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này
                </div>
              </div>
              {/* Quốc gia */}
              <div className="mb-4">
                <label className="text-sm font-medium flex items-center gap-1">
                  Vùng/quốc gia
                  <span className="text-red-500">*</span>
                </label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none">
                  <option>Việt Nam</option>
                  <option>Khác</option>
                </select>
              </div>
              {/* Số điện thoại */}
              <div className="mb-4">
                <label className="text-sm font-medium flex items-center gap-1">
                  Số điện thoại
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Cần thiết để chỗ nghỉ xác nhận đặt phòng của bạn
                </div>
              </div>
            </div>
            <div className="border border-green-600 rounded p-3 mb-4 bg-white">
              <div className="text-green-600 font-semibold text-base">
                Phòng Deluxe Giường Đôi Nhìn Ra Thành Phố
              </div>
              <div className="text-sm my-1">
                ✔ Hủy miễn phí trước 19 tháng 6, 2025
              </div>
              <div className="text-sm">👤 Khách: 2 người lớn</div>
              <div className="text-sm">⭐ Đánh giá: 9.4</div>
              <div className="text-sm">🚭 Không hút thuốc</div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold text-base transition"
            >
              Hoàn tất đặt phòng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingRoom;
