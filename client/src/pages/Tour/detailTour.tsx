import React, { useState } from 'react';

const TourPage = () => {
    const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const pricePerPerson = 15000000;
  const total = (adults + children + infants) * pricePerPerson;
  return (
    <>
        <div className="max-w-screen-xl p-4 mx-auto font-sans">
      {/* Title */}
      <h1 className="mb-2 text-2xl font-semibold">
        HCM - Seoul - Đảo Nami - Trượt Tuyết Elysian 5N4Đ
      </h1>

      {/* Icons */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <span className="text-blue-600">★ ★ ★ ★ ☆</span>
        </div>
        <div className="flex items-center gap-1">Khởi hành từ <strong>HCM</strong></div>
        <div className="flex items-center gap-1">Điểm đến <strong>Hàn Quốc</strong></div>
        <div className="flex items-center gap-1">Thời gian <strong>5N4Đ</strong></div>
        <div className="flex items-center gap-1">Số chỗ <strong>Còn chỗ</strong></div>
        <div className="flex items-center gap-1">Di chuyển bằng <strong>Máy bay</strong></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Image */}
        <div className="md:col-span-2">
          <img
            src="https://cdn2.ivivu.com/2022/12/tour-han-quoc-tuyet-ivivu.jpg"
            alt="Tour"
            className="object-cover w-full h-auto rounded-lg"
          />

          <div className="flex gap-2 mt-2 overflow-auto">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <img
                key={i}
                src={`https://placehold.co/100x70?text=Ảnh+${i + 1}`}
                alt="Thumb"
                className="border rounded-lg"
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span>Chia sẻ:</span>
            <div className="flex gap-2">
              <button className="hover:text-blue-600">Fb</button>
              <button className="hover:text-sky-500">P</button>
              <button className="hover:text-blue-400">Tw</button>
            </div>
          </div>
        </div>

        {/* Booking box */}
        <div className="p-4 space-y-4 rounded-lg bg-blue-50">
          <div className="text-2xl font-bold text-blue-700">15.000.000đ</div>
          <div className="text-sm">Mã tour: <strong>ND006</strong></div>

          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-200 rounded">Giảm 50%</span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-200 rounded">Giảm 15%</span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-200 rounded">Giảm 10k</span>
          </div>

          <div>
            <label className="text-sm font-medium">Chọn Ngày đi</label>
            <input type="date" className="w-full p-2 mt-1 border rounded" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Người lớn</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-2">-</button>
                <span>{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="px-2">+</button>
                <span className="text-sm text-gray-500">{(adults * pricePerPerson).toLocaleString()}đ</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Trẻ em</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setChildren(Math.max(0, children - 1))} className="px-2">-</button>
                <span>{children}</span>
                <button onClick={() => setChildren(children + 1)} className="px-2">+</button>
                <span className="text-sm text-gray-500">{(children * pricePerPerson).toLocaleString()}đ</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Em bé</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setInfants(Math.max(0, infants - 1))} className="px-2">-</button>
                <span>{infants}</span>
                <button onClick={() => setInfants(infants + 1)} className="px-2">+</button>
                <span className="text-sm text-gray-500">{(infants * pricePerPerson).toLocaleString()}đ</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-lg font-bold text-blue-600 border-t">
            Tổng tiền: {total.toLocaleString()}đ
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Đặt ngay</button>
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
        <ol className="pl-5 space-y-2 text-gray-800 list-decimal">
          <li>Hà Nội - Osaka</li>
          <li>Osaka - Kobe</li>
          <li>Cố đô Kyoto</li>
          <li>Fuji - Lễ hội hoa anh đào Kawaguchi</li>
          <li>Tokyo</li>
          <li>Tokyo - Công viên UENO - Hà Nội</li>
        </ol>
      </section>

      {/* Bảng giá */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Bảng giá (Khởi hành từ Hà Nội)</h2>
        <div className="grid gap-4">
          {[
            { date: "17/06/2025", price: "29.900.000đ", points: "299.000 điểm" },
            { date: "24/06/2025", price: "29.900.000đ", points: "299.000 điểm" },
            { date: "22/07/2025", price: "28.900.000đ", points: "289.000 điểm", discount: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
              <div>
                <div className="text-sm font-semibold">{item.date}</div>
                <div className="font-bold text-orange-600">{item.price}</div>
                <div className="text-xs text-gray-500">+ {item.points}</div>
              </div>
              <button className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
                Giữ chỗ ngay
              </button>
            </div>
          ))}
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
