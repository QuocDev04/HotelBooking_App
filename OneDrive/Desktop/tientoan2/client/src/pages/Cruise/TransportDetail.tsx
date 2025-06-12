

const TransportDetail = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Tiêu đề lớn */}
      <h1 className="text-4xl font-extrabold text-[#006CAA] mb-8 text-center">
        Phương tiện: Express Ha Long
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden grid md:grid-cols-2 gap-6">
        {/* Hình ảnh phương tiện */}
        <div className="bg-gray-100">
          <img
            src="data:image/jpeg;base64,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"
            alt="Express Ha Long"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thông tin chia 2 cột */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
          <div>
            <p className="font-semibold">Loại phương tiện:</p>
            <p>Xe Buýt</p>
          </div>
          <div>
            <p className="font-semibold">Tên phương tiện:</p>
            <p>Express Ha Long</p>
          </div>
          <div>
            <p className="font-semibold">Mã số xe:</p>
            <p>HLB123</p>
          </div>
          <div>
            <p className="font-semibold">Nơi khởi hành:</p>
            <p>Hà Nội</p>
          </div>
          <div>
            <p className="font-semibold">Nơi đến:</p>
            <p>Hạ Long</p>
          </div>
          <div>
            <p className="font-semibold">Số ghế trống:</p>
            <p className="text-green-600 font-semibold">40 ghế</p>
          </div>
          <div>
            <p className="font-semibold">Thời gian khởi hành:</p>
            <p>08:00, 15/06/2025</p>
          </div>
          <div>
            <p className="font-semibold">Thời gian đến:</p>
            <p>11:00, 15/06/2025</p>
          </div>

          {/* Giá vé nổi bật, chiếm nguyên 1 cột */}
          <div className="sm:col-span-2 mt-4">
            <p className="text-lg font-bold text-red-600">
              Giá vé: <span className="text-2xl">15.000đ</span>
            </p>
          </div>

          {/* Nút đặt vé */}
          <div className="sm:col-span-2 mt-4">
            <button className="bg-[#006CAA] hover:bg-[#005b91] text-white font-bold px-6 py-3 rounded-lg w-full transition">
              Đặt vé ngay
            </button>
          </div>
        </div>
      </div>

      {/* Phần mô tả thêm */}
      <div className="mt-10 bg-blue-50 p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-[#006CAA] mb-3">Thông tin thêm</h2>
        <p className="text-gray-600">
          Tuyến xe Express Ha Long là sự lựa chọn lý tưởng cho hành trình Hà Nội - Hạ Long. Với dịch vụ an toàn, tiện nghi và giá cả hợp lý, chúng tôi cam kết mang đến trải nghiệm tuyệt vời cho hành khách.
        </p>
      </div>
    </div>
  );
};

export default TransportDetail;
