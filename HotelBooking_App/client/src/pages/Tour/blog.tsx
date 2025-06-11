import React from "react";

export default function Blog() {
    return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="mb-6 bg-white border border-blue-500 shadow-md rounded-xl">
            <div className="px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-t-xl">
              Danh mục tour
            </div>
            <div className="px-4 py-3 space-y-2">
              <button className="block w-full text-left text-black-700 hover:underline">Tour trong nước</button>
              <button className="block w-full text-left text-black-700 hover:underline">Tour nước ngoài</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-md rounded-xl">
            <div className="px-4 py-2 font-semibold text-gray-800 bg-gray-100 rounded-t-xl">
              Cẩm nang du lịch
            </div>
            <ul className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                  <img
                    src="https://via.placeholder.com/60"
                    alt=""
                    className="object-cover w-16 h-12 rounded"
                  />
                  <p className="text-sm font-medium text-gray-700 line-clamp-2">
                    Du lịch Đà Lạt – Cẩm nang từ A đến Z (update thông tin 2024)
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-6 md:col-span-3">
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
              >
                <img
                  src="https://via.placeholder.com/600x300"
                  alt="Blog Thumbnail"
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <p className="mb-1 text-sm text-gray-400">Thứ Hai, 25/12/2023 - Nguyễn Anh Dũng</p>
                  <h3 className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600">
                    Tiêu đề bài viết blog hấp dẫn
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    Mô tả ngắn gọn nội dung bài viết để người dùng hiểu nhanh nội dung chính.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button className="w-8 h-8 font-semibold text-white bg-blue-600 rounded-full shadow">1</button>
            <button className="w-8 h-8 text-gray-600 bg-white border rounded-full hover:bg-gray-100">2</button>
          </div>
        </main>
      </div>
    </div>
  );
};


