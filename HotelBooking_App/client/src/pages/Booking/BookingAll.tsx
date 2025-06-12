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
            Hoàn tất đặt dịch vụ
          </span>
        </div>
      </div>

      {/* Bảng tổng hợp thông tin khách sạn & vé máy bay */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-blue-50 text-blue-700 text-left">
              <th className="py-3 px-4 rounded-tl-xl">Dịch vụ</th>
              <th className="py-3 px-4">Thông tin</th>
              <th className="py-3 px-4 rounded-tr-xl">Tóm tắt giá</th>
            </tr>
          </thead>
          <tbody>
            {/* Khách sạn */}
            <tr className="border-b">
              <td className="py-3 px-4 align-top">
                <div className="font-semibold">Khách sạn</div>
                <img
                  src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=414x232"
                  alt="La Vela Saigon Hotel"
                  className="w-32 rounded mb-2"
                />
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-bold mb-1">La Vela Saigon Hotel</div>
                <div className="text-xs text-gray-700 mb-1">
                  280 Nam Ky Khoi Nghia, Quận 3, TP. Hồ Chí Minh
                </div>
                <div className="text-green-700 text-xs font-medium mb-1">
                  Vị trí tuyệt vời – <span className="font-bold">8.8</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Nhận phòng: <b>T3, 24/6/2025</b> <br />
                  Trả phòng: <b>T4, 25/6/2025</b> <br />
                  1 đêm, 2 người lớn
                </div>
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-semibold text-blue-700 mb-1">Tổng cộng</div>
                <div className="text-rose-600 font-bold text-lg mb-1">
                  VND 2.839.200
                </div>
                <div className="text-xs text-gray-500">Đã bao gồm thuế và phí</div>
              </td>
            </tr>
            {/* Vé máy bay */}
            <tr className="border-b">
              <td className="py-3 px-4 align-top">
                <div className="font-semibold">Vé máy bay</div>
                <img
                  src="https://r-xx.bstatic.com/data/airlines_logo/VJ.png"
                  alt="Vé máy bay Hà Nội - Đà Nẵng"
                  className="w-32 rounded mb-2"
                />
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-bold mb-1">Hà Nội → Đà Nẵng</div>
                <div className="text-xs text-gray-700 mb-1">
                  Chuyến bay VN1234 · Vietnam Airlines
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  08:00 - 09:20, 24/06/2025 <br />
                  1 người lớn, Hành lý 20kg
                </div>
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-semibold text-blue-700 mb-1">Tổng cộng</div>
                <div className="text-rose-600 font-bold text-lg mb-1">
                  VND 1.500.000
                </div>
                <div className="text-xs text-gray-500">Đã bao gồm thuế và phí</div>
              </td>
            </tr>
            {/* Du thuyền Hạ Long */}
            <tr className="border-b">
              <td className="py-3 px-4 align-top">
                <div className="font-semibold">Du thuyền</div>
                <img
                  src="https://owa.bestprice.vn/images/cruises/uploads/du-thuyen-scarlet-pearl-646c3975252b5.jpg"
                  alt="Du thuyền Hạ Long"
                  className="w-32 rounded mb-2"
                />
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-bold mb-1">Heritage Cruise Hạ Long</div>
                <div className="text-xs text-gray-700 mb-1">
                  Bến Tuần Châu, Hạ Long, Quảng Ninh
                </div>
                <div className="text-green-700 text-xs font-medium mb-1">
                  Đánh giá tuyệt vời – <span className="font-bold">9.2</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Nhận phòng: <b>T6, 28/6/2025</b> <br />
                  Trả phòng: <b>T7, 29/6/2025</b> <br />
                  1 đêm, 2 người lớn, phòng Suite
                </div>
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-semibold text-blue-700 mb-1">Tổng cộng</div>
                <div className="text-rose-600 font-bold text-lg mb-1">
                  VND 5.500.000
                </div>
                <div className="text-xs text-gray-500">Đã bao gồm thuế và phí</div>
              </td>
            </tr>
            {/* Transport Hà Nội → Đà Nẵng */}
            <tr>
              <td className="py-3 px-4 align-top">
                <div className="font-semibold">Transport</div>
                <img
                  src="https://bizweb.dktcdn.net/100/512/250/products/z5799136239352-df7f815b7855772c82820f34d539b5f9-93765ade-3f48-42ab-83b3-7478e137ef25-2d6044cf-d293-449e-ace1-af7a2ed17fe2-0a173ee9-b664-4e21-b97f-f57bef5d5156-c00f5f2d-38a5-44b9-85e5-109a46c0d3da.jpg?v=1725525083750"
                  alt="Xe khách Hà Nội - Đà Nẵng"
                  className="w-32 rounded mb-2"
                />
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-bold mb-1">Xe khách giường nằm</div>
                <div className="text-xs text-gray-700 mb-1">
                  Tuyến: Hà Nội → Đà Nẵng
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Xuất phát: <b>20:00, 24/06/2025</b> <br />
                  Đến nơi: <b>08:00, 25/06/2025</b> <br />
                  1 người lớn, giường nằm, nước uống miễn phí
                </div>
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-semibold text-blue-700 mb-1">Tổng cộng</div>
                <div className="text-rose-600 font-bold text-lg mb-1">
                  VND 600.000
                </div>
                <div className="text-xs text-gray-500">Đã bao gồm thuế và phí</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Booking Form */}
      <div className="bg-white rounded-lg p-6 shadow-md">
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
            Hoàn tất đặt dịch vụ
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingRoom;
