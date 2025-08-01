export default function Blog() {
  return (
    <div className="min-h-screen py-8 my-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề blog */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Khám Phá Blog Du Lịch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những câu chuyện, kinh nghiệm, và cẩm nang du lịch hữu ích từ khắp mọi miền đất nước và thế giới.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            {/* Danh mục tour */}
            <div className="bg-white border border-blue-500 shadow-lg rounded-2xl overflow-hidden">
              <div className="px-5 py-3 text-lg font-bold text-white bg-blue-500">
                Danh mục tour
              </div>
              <div className="px-5 py-4 space-y-3">
                <button className="block w-full text-left text-gray-800 hover:text-blue-600 transition">
                  Tour trong nước
                </button>
                <button className="block w-full text-left text-gray-800 hover:text-blue-600 transition">
                  Tour nước ngoài
                </button>
              </div>
            </div>

            {/* Cẩm nang du lịch */}
            <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="px-5 py-3 font-bold text-gray-800 bg-gray-100">
                Cẩm nang du lịch
              </div>
              <ul className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((_, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <img
                      src="https://via.placeholder.com/60"
                      alt="Ảnh minh họa"
                      className="w-16 h-12 rounded object-cover"
                    />
                    <p className="text-sm font-medium text-gray-700 line-clamp-2">
                      Du lịch Đà Lạt – Cẩm nang từ A đến Z (update thông tin 2024)
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Nội dung chính */}
          <main className="md:col-span-3 space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              {[1, 2, 3, 4].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow transition transform hover:scale-[1.01] hover:shadow-md"
                >
                  <img
                    src="https://via.placeholder.com/600x300"
                    alt="Blog Thumbnail"
                    className="object-cover w-full h-48"
                  />
                  <div className="p-5">
                    <p className="text-sm text-gray-400 mb-1">
                      Thứ Hai, 25/12/2023 - Nguyễn Anh Dũng
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition">
                      Tiêu đề bài viết blog hấp dẫn
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      Mô tả ngắn gọn nội dung bài viết để người dùng hiểu nhanh nội dung chính.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center gap-2 pt-4">
              <button className="w-9 h-9 font-semibold text-white bg-blue-600 rounded-full shadow hover:bg-blue-700 transition">
                1
              </button>
              <button className="w-9 h-9 text-gray-600 bg-white border rounded-full hover:bg-gray-100 transition">
                2
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
