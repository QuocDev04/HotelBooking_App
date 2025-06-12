import { useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const Roomdetail = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const thumbnails = [
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide1.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png",
  ];

  const [mainImage, setMainImage] = useState(thumbnails[0]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleThumbnailClick = (src: string) => {
    setMainImage(src);
  };
  const pricePerPerson = 15000000;
  const total = (adults + children + infants) * pricePerPerson;
  return (
    <div className="bg-gray-50 min-h-screen pb-10 mt-20">
      <div className="max-w-screen-xl p-4 mx-auto font-sans">
        {/* Title */}
        <h1 className="mb-2 text-2xl font-semibold my-5">
          HCM - Seoul - Đảo Nami - Trượt Tuyết Elysian 5N4Đ
        </h1>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-8">
          {/* Image */}
          <div className="rounded lg:col-span-2">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-4xl">
                <img
                  src={mainImage}
                  className="w-full rounded-lg"
                  alt="Main"
                />
              </div>

              <div className="grid grid-cols-4 max-w-4xl gap-4">
                {thumbnails.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    className="thumb rounded-lg md:h-24 h-14 object-cover cursor-pointer hover:opacity-80"
                    alt={`Thumb ${index + 1}`}
                    onClick={() => handleThumbnailClick(src)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Booking box */}
          <div className="max-w-[460px] w-full bg-blue-100/90 p-5 max-md:mt-16 border rounded-4xl border-gray-300/70">
            <h2 className="lg:text-4xl md:text-xl font-medium text-blue-500 my-2">15.000.000đ</h2>
            <div className="text-sm">Mã tour: <strong>ND006</strong></div>
            <hr className="border-gray-300 my-5" />
            <div className="text-2xl font-bold "></div>

            <div className="flex items-center">
              <div className=" rounded-2xl p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 21 22" fill="none">
                  <path d="M19 13.5V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 0.999998 3.89543 0.999998 5V17C0.999998 18.1046 1.89543 19 3 19H10.5" stroke="#3B82F6" stroke-width="2"></path>
                  <path d="M15 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                  <path d="M5 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                  <path d="M20 16C20 13.2386 17.7614 11 15 11C12.2386 11 10 13.2386 10 16C10 18.7614 12.2386 21 15 21C17.7614 21 20 18.7614 20 16Z" stroke="#3B82F6" stroke-width="2"></path>
                  <path d="M15 13.5676V16.0001L16.6216 17.6217" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
              <div className="w-full">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày đi"
                  className=" w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>





            <div className="space-y-2 my-6">
              <div className="flex items-center justify-between gap-4">
                {/* Label */}
                <span className="w-24">Người lớn</span>

                {/* Nút tăng/giảm */}
                <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                  <button onClick={() => setAdults(Math.max(0, adults - 1))} className="px-2">-</button>
                  <input
                    type="number"
                    id="Quantity"
                    value={adults}
                    readOnly
                    className="h-9 w-16 border-transparent text-center sm:text-sm appearance-none"
                  />

                  <button onClick={() => setAdults(adults + 1)} className="px-2">+</button>
                </div>

                {/* Giá tiền */}
                <span className="text-sm text-gray-500 min-w-[80px] text-right">
                  {(adults * pricePerPerson).toLocaleString()}đ
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Label */}
                <span className="w-24">Người lớn</span>

                {/* Nút tăng/giảm */}
                <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                  <button onClick={() => setAdults(Math.max(0, adults - 1))} className="px-2">-</button>
                  <input
                    type="number"
                    id="Quantity"
                    value={adults}
                    readOnly
                    className="h-9 w-16 border-transparent text-center sm:text-sm appearance-none"
                  />

                  <button onClick={() => setAdults(adults + 1)} className="px-2">+</button>
                </div>

                {/* Giá tiền */}
                <span className="text-sm text-gray-500 min-w-[80px] text-right">
                  {(adults * pricePerPerson).toLocaleString()}đ
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Label */}
                <span className="w-24">Người lớn</span>

                {/* Nút tăng/giảm */}
                <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                  <button onClick={() => setAdults(Math.max(0, adults - 1))} className="px-2">-</button>
                  <input
                    type="number"
                    id="Quantity"
                    value={adults}
                    readOnly
                    className="h-9 w-16 border-transparent text-center sm:text-sm appearance-none"
                  />

                  <button onClick={() => setAdults(adults + 1)} className="px-2">+</button>
                </div>

                {/* Giá tiền */}
                <span className="text-sm text-gray-500 min-w-[80px] text-right">
                  {(adults * pricePerPerson).toLocaleString()}đ
                </span>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold text-blue-600">
              <span>Tổng tiền:</span>
              <span>{total.toLocaleString()}đ</span>
            </div>


            <div className="flex gap-2 my-6">
              <button className="flex-1 py-2 text-white bg-blue-400 rounded hover:bg-blue-500">Đặt ngay</button>
              <button className="flex-1 py-2 border rounded hover:bg-gray-100">Liên hệ tư vấn</button>
            </div>
          </div>
        </div>
      </div>
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
            <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
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
          <div className="flex items-center text-md text-gray-700 mb-1">
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
          <div className="flex items-center text-md text-blue-700 mb-2">
            <svg
              className="w-4 h-4 mr-1 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927C9.469 1.837 10.531 1.837 10.951 2.927l1.286 3.319a1 1 0 00.95.69h3.462c1.11 0 1.572 1.424.677 2.09l-2.8 2.034a1 1 0 00-.364 1.118l1.286 3.319c.42 1.09-.34 1.988-1.23 1.322l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.89.666-1.65-.232-1.23-1.322l1.286-3.319a1 1 0 00-.364-1.118L2.074 9.026c-.895-.666-.433-2.09.677-2.09h3.462a1 1 0 00.95-.69l1.286-3.319z" />
            </svg>
            Gần khu vui chơi giải trí
          </div>
          <ul className="text-md text-gray-700 space-y-1">
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
              <ellipse cx="30" cy="30" rx="30" ry="30" fill="#e3effc" />
              <ellipse cx="20" cy="40" rx="10" ry="10" fill="#b6dafe" />
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
