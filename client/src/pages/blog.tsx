import React from "react";

export default function Blog() {
    const articles = [
  {
    title: "Khám Phá Biển Cồn Nổi – Viên Ngọc Hoang Sơ Giữa Long Ninh Bình",
    image: "https://minio.fares.vn/mixivivu-dev/tour/blog/images/vhjivvnujyukle6j.webp",
    date: "04/06/2025",
    desc: "Nơi thiên nhiên hoang sơ, trải nghiệm hấp dẫn chờ đón bạn khám phá..."
  },
  {
    title: "Top 5 Trải Nghiệm Hấp Dẫn Khi Đi Biển Đà Nẵng",
    image: "https://minio.fares.vn/mixivivu-dev/tour/blog/images/vhjivvnujyukle6j.webp",
    date: "04/06/2025",
    desc: "Đà Nẵng – thành phố đáng sống nhất Việt Nam không chỉ nổi tiếng với biển xanh..."
  },
  {
    title: "Mùa bướm thơ mộng tại Vườn quốc gia Cúc Phương",
    image: "https://minio.fares.vn/mixivivu-dev/tour/blog/images/vhjivvnujyukle6j.webp",
    date: "03/06/2025",
    desc: "Hàng nghìn cánh bướm trắng muốt bay rợp trời tạo nên khung cảnh thần tiên..."
  },
  {
    title: "Lịch trình chiêm bái và lễ Phật tại chùa Quán Sứ",
    image: "https://minio.fares.vn/mixivivu-dev/tour/blog/images/vhjivvnujyukle6j.webp",
    date: "12/05/2025",
    desc: "Từ ngày 15 – 18, nhiều hoạt động ý nghĩa tại chùa Quán Sứ chào đón du khách..."
  },
  {
    title: "Top 5 quán bún mọc ở Hà Nội nhất định phải thử",
    image: "https://minio.fares.vn/mixivivu-dev/tour/blog/images/vhjivvnujyukle6j.webp",
    date: "02/05/2025",
    desc: "Hà Nội không chỉ nổi tiếng với phở mà còn rất nhiều món ngon khác..."
  },
  {
    title: "Bánh Xíu Páo Nam Định – Món Bánh Nhỏ Mang Hương Vị Lớn",
    image: "https://minio.fares.vn/mixivivu-dev/tour/blog/images/vhjivvnujyukle6j.webp",
    date: "01/05/2025",
    desc: "Làm từ bột mì, thịt xá xíu, trứng, loại bánh này mang hương vị đậm đà khó quên..."
  }
];
  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-2 text-3xl font-bold">
        Hạ Long: Khám phá Sự đặc sắc và Cập nhật tin tức mới nhất
      </h1>
      <p className="mb-6 text-gray-600">
        Hạ Long: Bí mật và Cuộc sống trong Vịnh – Khám phá và Cập nhật những tin tức hấp dẫn từ điểm đến tuyệt vời này.
      </p>

      <div className="flex flex-wrap gap-4 mb-6 ">
        <button className="px-4 py-1 text-sm border rounded-full">Tất cả</button>
        <button className="px-4 py-1 text-sm border rounded-full">Du lịch</button>
        <button className="px-4 py-1 text-sm border rounded-full">Khám phá</button>
        <button className="px-4 py-1 text-sm border rounded-full">Du thuyền</button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {articles.map((article, index) => (
          <div
            key={index}
            className="overflow-hidden transition border shadow-sm rounded-xl hover:shadow-md"
          >
            <img
              src={article.image}
              alt={article.title}
              className="object-cover w-full h-40"
            />
            <div className="p-4">
              <h2 className="mb-2 text-lg font-semibold line-clamp-2">
                {article.title}
              </h2>
              <p className="mb-2 text-sm text-gray-600">{article.date}</p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {article.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <span className="text-sm text-gray-600">Đang xem: 1 - 6 / 135</span>
        <div className="flex gap-1">
          {["Trước", 1, 2, 3, 4, 5, "Tiếp"].map((item, i) => (
            <button
              key={i}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
