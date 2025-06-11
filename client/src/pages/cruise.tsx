import { useEffect, useState } from 'react';

const CruisePage = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tours')
      .then(res => res.json())
      .then(data => setTours(data))
      .catch(err => console.error('Lỗi khi fetch tours:', err));
  }, []);

  return (
    <div className="font-sans text-gray-800">
      {/* FORM TÌM KIẾM */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg md:text-2xl font-bold text-center">
            Bạn lựa chọn du thuyền Hạ Long nào?
          </h2>
          <p className="text-gray-500 text-sm md:text-base text-center mt-1">
            Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
          </p>

          <div className="mt-6 flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-center gap-4">
            <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-[40%] bg-white">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                placeholder="Nhập tên du thuyền"
                className="outline-none w-full text-sm"
              />
            </div>
            <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-[25%] bg-white">
              <span className="text-gray-400 mr-2">📍</span>
              <select className="outline-none w-full text-sm bg-white">
                <option>Tất cả địa điểm</option>
              </select>
            </div>
            <div className="flex items-center border rounded-full px-4 py-2 w-full md:w-[25%] bg-white">
              <span className="text-gray-400 mr-2">💰</span>
              <select className="outline-none w-full text-sm bg-white">
                <option>Tất cả mức giá</option>
              </select>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full text-sm w-full md:w-auto">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* BỐ CỤC DỮ LIỆU */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* SIDEBAR LỌC */}
        <aside className="lg:col-span-1 bg-white rounded-xl border p-4 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-base md:text-lg">Lọc kết quả</h2>
            <button className="text-emerald-500 text-sm">Đặt lại</button>
          </div>
          <h3 className="font-medium mt-4 mb-2 text-sm">Loại du thuyền</h3>
          <label className="block text-sm mb-1">
            <input type="checkbox" className="mr-2" /> cruise
          </label>
        </aside>

        {/* DANH SÁCH TOUR */}
        <main className="lg:col-span-4">
          <p className="font-semibold text-base md:text-lg mb-4">
            Tìm thấy {tours.length} kết quả
          </p>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
  {tours.map((tour) => (
    <div
      key={tour.tour_id}
      className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col"
    >
      <img
        src={tour.imageTour}
        alt={tour.tour_name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-base md:text-lg text-gray-800">
            {tour.tour_name}
          </h3>
          <p className="text-sm text-gray-500">
            {tour.duration} ngày – Tối đa {tour.maxPeople} người
          </p>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="text-emerald-600 font-bold text-sm md:text-base">
            {tour.price.toLocaleString()}đ/khách
          </span>
          <button className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm hover:bg-emerald-600">
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

        </main>
      </div>
    </div>
  );
};

export default CruisePage;
