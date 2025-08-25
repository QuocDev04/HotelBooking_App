import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instanceClient from "../../../configs/instance";
import { Heart } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  createdAt: string;
  slug: string;
  likes: number;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await instanceClient.get(`/blog/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  const blog: Blog | undefined = data?.post;

  const likeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await instanceClient.post(`/posts/${id}/like`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", slug] });
    },
  });

  if (isLoading) return <p className="text-center py-10">⏳ Đang tải...</p>;
  if (isError || !blog) return <p className="text-center text-red-500 py-10">❌ Không tìm thấy bài viết</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 my-16">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-extrabold text-gray-900 leading-snug mb-4 text-center">
        {blog.title}
      </h1>

      {/* Meta info */}
      <div className="flex justify-center items-center gap-3 text-sm text-gray-500 mb-6">
        <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
        <span>•</span>
        <span>{blog.author_name || "Admin"}</span>
      </div>

      {/* Ảnh minh họa */}
      {blog.image_url && (
        <div className="flex justify-center mb-8">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="rounded-xl shadow-md max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Nội dung */}
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Like button */}
      <div className="flex justify-center">
        <button
          onClick={() => likeMutation.mutate(blog._id)}
          className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition"
        >
          <Heart size={20} className="fill-white" />
          <span>{blog.likes || 0} Lượt thích</span>
        </button>
      </div>
    </div>
  );
}
