import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "../../../configs/instance";
import { Link } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  createdAt: string;
  slug: string;
}

export default function Blog() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await instanceClient.get("/blog");
      return res.data;
    },
  });

  const blogs: Blog[] = data?.posts || [];

  // 📌 State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4; // số blog mỗi trang

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  // Tính index
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  if (isLoading) return <p className="text-center">Đang tải...</p>;
  if (isError) return <p className="text-center text-red-500">Lỗi khi tải dữ liệu</p>;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
              <div className="px-5 py-3 font-bold text-gray-800 bg-gray-100">
                Cẩm nang du lịch
              </div>
              <ul className="divide-y divide-gray-100">
                {blogs.slice(0, 5).map((blog) => (
                  <li
                    key={blog._id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <Link to={`/blog/${blog.slug}`} className="flex items-center gap-4">
                      <img
                        src={blog.image_url || "https://via.placeholder.com/60"}
                        alt={blog.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <p className="text-sm font-medium text-gray-700 line-clamp-2">
                        {blog.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main */}
          <main className="md:col-span-3 space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              {currentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow transition transform hover:scale-[1.01] hover:shadow-md"
                >
                  <Link to={`/blog/${blog.slug}`}>
                    <img
                      src={blog.image_url || "https://via.placeholder.com/600x300"}
                      alt={blog.title}
                      className="object-cover w-full h-48"
                    />
                  </Link>
                  <div className="p-5">
                    <p className="text-sm text-gray-400 mb-1">
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN")} -{" "}
                      {blog.author_name}
                    </p>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="block text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {blog.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
