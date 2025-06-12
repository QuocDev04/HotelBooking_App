import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
const TourPage = () => {
  const itinerary = [
    { day: "Ngày 1", title: "Hà Nội - Osaka" },
    { day: "Ngày 2", title: "Osaka - Kobe" },
    { day: "Ngày 3", title: "Cố đô Kyoto" },
    { day: "Ngày 4", title: "Fuji - Lễ hội hoa anh đào Kawaguchi Festival" },
    { day: "Ngày 5", title: "Tokyo" },
    { day: "Ngày 6", title: "Tokyo - Ngắm hoa anh đào công viên UENO - Hà Nội" },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    <>
      <div className="max-w-screen-xl p-4 mx-auto font-sans mt-32">
        {/* Title */}
        <h1 className="mb-2 text-2xl font-semibold">
          HCM - Seoul - Đảo Nami - Trượt Tuyết Elysian 5N4Đ
        </h1>

        {/* Icons */}
        <div className="flex flex-wrap gap-4 mb-4 text-3xl text-gray-700">
          <div className="flex items-center gap-1">
            <span className="text-blue-600">★ ★ ★ ★ ☆</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                <path d="M9.01107 1.625C13.103 1.625 16.9043 4.90179 16.9043 9.03571C16.9043 11.7682 15.9811 13.7001 14.434 15.9524C12.707 18.4667 10.5018 20.8338 9.51601 21.8515C9.23162 22.1451 8.76735 22.1451 8.48296 21.8515C7.4972 20.8338 5.29202 18.4667 3.56496 15.9524C2.01787 13.7001 1.09473 11.7682 1.09473 9.03571C1.09473 4.90179 4.89588 1.625 8.98782 1.625" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <path d="M11.9637 9.47235C11.9637 11.1256 10.6409 12.4928 9.00411 12.4928C7.36733 12.4928 6.03516 11.1256 6.03516 9.47235C6.03516 7.81912 7.36733 6.56542 9.00411 6.56542C10.6409 6.56542 11.9637 7.81912 11.9637 9.47235Z" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Khởi hành từ</div>
              <div className="text-sm font-semibold text-blue-500">HCM</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                <path d="M9.01107 1.625C13.103 1.625 16.9043 4.90179 16.9043 9.03571C16.9043 11.7682 15.9811 13.7001 14.434 15.9524C12.707 18.4667 10.5018 20.8338 9.51601 21.8515C9.23162 22.1451 8.76735 22.1451 8.48296 21.8515C7.4972 20.8338 5.29202 18.4667 3.56496 15.9524C2.01787 13.7001 1.09473 11.7682 1.09473 9.03571C1.09473 4.90179 4.89588 1.625 8.98782 1.625" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <path d="M11.9637 9.47235C11.9637 11.1256 10.6409 12.4928 9.00411 12.4928C7.36733 12.4928 6.03516 11.1256 6.03516 9.47235C6.03516 7.81912 7.36733 6.56542 9.00411 6.56542C10.6409 6.56542 11.9637 7.81912 11.9637 9.47235Z" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Khởi hành từ</div>
              <div className="text-sm font-semibold text-blue-500">HCM</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                <path d="M19 13.5V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 0.999998 3.89543 0.999998 5V17C0.999998 18.1046 1.89543 19 3 19H10.5" stroke="#3B82F6" stroke-width="2"></path>
                <path d="M15 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                <path d="M5 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                <path d="M20 16C20 13.2386 17.7614 11 15 11C12.2386 11 10 13.2386 10 16C10 18.7614 12.2386 21 15 21C17.7614 21 20 18.7614 20 16Z" stroke="#3B82F6" stroke-width="2"></path>
                <path d="M15 13.5676V16.0001L16.6216 17.6217" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Khởi hành từ</div>
              <div className="text-sm font-semibold text-blue-500">HCM</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path d="M14.5 6.5C14.5 9.12336 12.3733 11.25 9.75 11.25C7.12668 11.25 5 9.12336 5 6.5C5 3.87664 7.12668 1.75 9.75 1.75C12.3733 1.75 14.5 3.87664 14.5 6.5Z" stroke="#3B82F6" stroke-width="2"></path>
                <path d="M19 22V20C19 16.6863 16.3137 14 13 14H7C3.68629 14 1 16.6863 1 20V22" stroke="#3B82F6" stroke-width="2"></path>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Khởi hành từ</div>
              <div className="text-sm font-semibold text-blue-500">HCM</div>
            </div>
          </div>
          <div className="flex items-center text-blue-500">
            <div className=" rounded-2xl p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                width="24"
                height="24"
                viewBox="0 0 50 50"
                preserveAspectRatio="xMidYMid meet"
                fill="currentColor"
                stroke="none"
              >
                <g transform="translate(0 50) scale(0.1 -0.1)" fill="currentColor" stroke="none">
                  <path d="M374 439 l-62 -62 -123 42 -123 41 -23 -22 c-13 -12 -23 -25 -23 -29 0 -4 21 -20 48 -35 26 -15 71 -43 101 -62 l53 -34 -53 -54 c-50 -51 -57 -54 -89 -49 -29 5 -40 2 -58 -18 l-22 -23 50 -18 c45 -16 51 -22 68 -67 l18 -49 23 24 c19 20 22 32 17 59 -6 31 -2 37 48 86 l55 52 34 -53 c18 -29 46 -74 61 -100 15 -27 31 -48 35 -48 4 0 17 10 29 23 l21 23 -39 124 -40 124 60 61 c63 63 71 83 44 109 -26 27 -47 18 -110 -45z" />
                </g>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Khởi hành từ</div>
              <div className="text-sm font-semibold text-blue-500">HCM</div>
            </div>
          </div>
        </div>

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
      <div className="max-w-screen-xl p-6 mx-auto space-y-10">
        {/* Giới thiệu */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Giới thiệu</h2>
          <p>
            Nhật Bản được mệnh danh là thiên đường du lịch với phong cảnh và văn hóa đặc sắc. Lịch trình: Hà Nội - Osaka - Kyoto - Tokyo 6N5Đ.
          </p>
          <ul className="pl-5 text-sm text-gray-700 list-disc">
            <li>Ghé thăm công viên Nara</li>
            <li>Trải nghiệm tàu cao tốc Shinkansen</li>
            <li>Thư giãn tại suối nước nóng onsen</li>
            <li>Thưởng thức thịt bò vùng đất Kobe</li>
            <li>Hoàn tiền 100% nếu không đỗ Visa</li>
          </ul>
        </section>

        {/* Lịch trình */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Lịch trình tour</h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {itinerary.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 border-b cursor-pointer last:border-b-0"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {item.day}: {item.title}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                {openIndex === index && (
                  <div className="mt-2 text-sm text-gray-600">
                    {/* Nội dung chi tiết có thể thay thế tại đây nếu cần */}
                    Nội dung chi tiết sẽ được cập nhật...
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-500 rounded hover:bg-blue-50">
              Tải lịch trình tour
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Bảng giá */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Bảng giá (Khởi hành từ Hà Nội)</h2>

          {/* Nút lọc tháng */}
          <div className="flex mb-4 space-x-4">
            <button className="px-4 py-2 font-semibold text-white bg-orange-500 rounded">Tất cả</button>
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded">Tháng 6</button>
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded">Tháng 7</button>
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-center bg-white rounded shadow-sm">
              <thead>
                <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                  <th className="px-4 py-2">Ngày khởi hành</th>
                  <th className="px-4 py-2">Hãng tour</th>
                  <th className="px-4 py-2">Giá tour</th>
                  <th className="px-4 py-2">Giữ chỗ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "17/06/2025",
                    brand: "Vietjet Air",
                    price: "29.900.000đ",
                    points: "299.000 điểm",
                  },
                  {
                    date: "24/06/2025",
                    brand: "Vietjet Air",
                    price: "29.900.000đ",
                    points: "299.000 điểm",
                  },
                  {
                    date: "01/07/2025",
                    brand: "Vietjet Air",
                    price: "29.900.000đ",
                    points: "299.000 điểm",
                  },
                  {
                    date: "08/07/2025",
                    brand: "Vietjet Air",
                    price: "29.900.000đ",
                    points: "299.000 điểm",
                  },
                  {
                    date: "15/07/2025",
                    brand: "Vietjet Air",
                    price: "29.900.000đ",
                    points: "299.000 điểm",
                  },
                  {
                    date: "22/07/2025",
                    brand: "Vietjet Air",
                    priceOld: "29.900.000đ",
                    price: "28.900.000đ",
                    points: "289.000 điểm",
                    note: "ĐẶT SỚM: Giảm 1 Triệu",
                  },
                  {
                    date: "29/07/2025",
                    brand: "Vietjet Air",
                    priceOld: "29.900.000đ",
                    price: "28.900.000đ",
                    points: "289.000 điểm",
                    note: "ĐẶT SỚM: Giảm 1 Triệu",
                  },
                ].map((item, i) => (
                  <tr key={i} className="text-sm text-gray-700 border-b">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.date}</div>
                      <div className="text-xs text-green-600">Còn chỗ</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{item.brand}</div>
                      {item.note && (
                        <div className="mt-1 text-xs text-orange-500">🔖 {item.note}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.priceOld ? (
                        <div>
                          <span className="text-gray-400 line-through">{item.priceOld}</span>{" "}
                          <span className="font-bold text-orange-600">{item.price}</span>
                        </div>
                      ) : (
                        <div className="font-bold text-orange-600">{item.price}</div>
                      )}
                      <div className="text-xs text-gray-500">💰 {item.points}</div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
                        Giữ chỗ ngay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Đánh giá */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Đánh giá</h2>
          <div className="text-xl font-bold text-green-600">9 Tuyệt vời</div>
          <div className="grid gap-4 mt-4">
            {[
              {
                name: "Nguyệt",
                date: "01/06/2025",
                rating: 9.4,
                comment: "Chuyến đi đáng nhớ, lịch trình trọn vẹn, thích bò Kobe và Shinkansen."
              },
              {
                name: "Hồng",
                date: "18/05/2025",
                rating: 9.4,
                comment: "Điểm đến hợp lý, nhân viên dễ thương, rất hài lòng."
              }
            ].map((review, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{review.name} - {review.date}</div>
                  <div className="px-2 text-sm text-white bg-green-500 rounded">{review.rating}</div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{review.comment}</p>


              </div>
            ))}
          </div>
        </section>

        {/* Hỏi đáp */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Hỏi đáp</h2>
          <div className="space-y-4">
            {[
              {
                question: "Tour đi Nhật Bản ngày 10.06.2025 có thêm được 2 chỗ nữa không?",
                answer: "Dạ hiện vẫn còn nhận được 2 khách nữa ạ."
              },
              {
                question: "Tour có ghé Kobe để ăn thịt bò không?",
                answer: "Tour có ghé thành phố Kobe, tùy chương trình sẽ có trải nghiệm bò Kobe."
              }
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-sm">
                <p className="font-medium">Q: {item.question}</p>
                <p className="mt-2 text-sm text-gray-700">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default TourPage;
