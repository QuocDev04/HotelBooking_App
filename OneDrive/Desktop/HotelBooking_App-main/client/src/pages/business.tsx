import React from 'react';

const tourList = [
  {
    title: "Lịch trình phù hợp với yêu cầu của doanh nghiệp",
    desc: "Lựa chọn du thuyền phù hợp theo yêu cầu, số lượng người, thời gian và ngân sách.",
    img: "https://www.google.com/imgres?q=%E1%BA%A3nh%20du%20l%E1%BB%8Bch&imgurl=http%3A%2F%2Fdulichtoday.vn%2Fwp-content%2Fuploads%2F2017%2F04%2Fvinh-Ha-Long.jpg&imgrefurl=https%3A%2F%2Fdulichtoday.vn%2Fblog%2Fhinh-anh-du-lich-viet-nam-hap-dan-qua-top-5-dia-diem-tuyet-voi.html&docid=VGLOnuhk5H-X5M&tbnid=gQnPC_7JieA4KM&vet=12ahUKEwjUn83Q4eONAxVEsFYBHR8FN-IQM3oECBwQAA..i&w=900&h=600&hcb=2&ved=2ahUKEwjUn83Q4eONAxVEsFYBHR8FN-IQM3oECBwQAA"
  },
  {
    title: "Lịch trình phù hợp với yêu cầu của doanh nghiệp",
    desc: "Lựa chọn du thuyền phù hợp theo yêu cầu, số lượng người, thời gian và ngân sách.",
    img: "/assets/tour2.jpg"
  },
  {
    title: "Lịch trình phù hợp với yêu cầu của doanh nghiệp",
    desc: "Lựa chọn du thuyền phù hợp theo yêu cầu, số lượng người, thời gian và ngân sách.",
    img: "/assets/tour3.jpg"
  }
];

const BusinessPage = () => {
  return (
    <div className="px-6 lg:px-20 py-10 max-w-screen-xl mx-auto">
      {/* Phần tìm kiếm */}
      <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-center">
        <h2 className="text-2xl font-semibold mb-2">Bạn lựa chọn du thuyền Hạ Long nào?</h2>
        <p className="text-gray-500 mb-4">Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn</p>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Nhập tên du thuyền"
            className="border rounded-lg px-4 py-2 w-full lg:w-1/3"
          />
          <select className="border rounded-lg px-4 py-2 w-full lg:w-1/6">
            <option>Tất cả lịch trình</option>
          </select>
          <select className="border rounded-lg px-4 py-2 w-full lg:w-1/6">
            <option>Tất cả mức giá</option>
          </select>
          <button className="bg-teal-500 text-white px-6 py-2 rounded-lg">Tìm kiếm</button>
        </div>
      </div>

      {/* Mô tả */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">
          Mixivivu – Tour Du thuyền Hạ Long:<br />
          Kết nối doanh nghiệp, khám phá vẻ đẹp tự nhiên
        </h3>
        <p className="text-gray-600">
          Với sứ mệnh trải nghiệm thực tế, Công ty TNHH Dịch vụ MixiVivu mong muốn đưa du thuyền Hạ Long trở
          thành một lựa chọn đầu tiên cho doanh nghiệp. Nhiều chương trình du lịch hợp đồng, ảo dưỡng, kết nối
          nhóm sẽ đem đến cho quý doanh nghiệp sự hài lòng và thuận tiện...
        </p>
        <button className="mt-6 bg-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-600">
          Liên hệ với Elite Travel
        </button>
      </div>

      {/* Danh sách tour */}
      <div className="mt-10 grid gap-6">
        {tourList.map((tour, index) => (
          <div key={index} className="flex items-center gap-6 p-4 border border-gray-300 rounded-xl shadow-sm bg-white">
            <img
              src={tour.img}
              alt="Tour"
              className="w-[150px] h-[100px] object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold text-base">{tour.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{tour.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessPage;
