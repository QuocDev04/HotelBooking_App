// src/pages/admin/BlogListAdmin.tsx
import {
    Table,
    Button,
    Space,
    Popconfirm,
    message,
    Tag,
    Image,
    Tooltip,
  } from "antd";
  import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LikeOutlined,
  } from "@ant-design/icons";
  import { useNavigate } from "react-router-dom";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { instanceAdmin } from "../../configs/axios";
  
  const BlogListAdmin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
  
    // Fetch danh sách blog
    const { data, isLoading } = useQuery({
      queryKey: ["blogs"],
      queryFn: async () => {
        const res = await instanceAdmin.get("/blog");
        return res.data; // ✅ { posts: [...] }
      },
    });
  
    // Delete blog
    const deleteMutation = useMutation({
      mutationFn: (id: string) => instanceAdmin.delete(`/posts/${id}`),
      onSuccess: () => {
        message.success("Xóa thành công!");
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      },
      onError: () => {
        message.error("Lỗi khi xóa!");
      },
    });
  
    const columns = [
      {
        title: "Ảnh",
        dataIndex: "image_url",
        key: "image_url",
        render: (url: string) =>
          url ? (
            <Image
              src={url}
              alt="thumbnail"
              width={80}
              height={60}
              style={{ objectFit: "cover", borderRadius: 6 }}
            />
          ) : (
            "—"
          ),
      },
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        render: (val: string) => (
          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: val }} />} placement="topLeft">
            <div
              dangerouslySetInnerHTML={{
                __html: val.length > 80 ? val.slice(0, 80) + "..." : val,
              }}
            />
          </Tooltip>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string) =>
          status === "published" ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="orange">Draft</Tag>
          ),
      },
      {
        title: "Tác giả",
        dataIndex: "author_name",
        key: "author_name",
      },
      {
        title: "Likes",
        dataIndex: "likes",
        key: "likes",
        render: (val: number) => (
          <span>
            <LikeOutlined style={{ color: "#1677ff" }} /> {val}
          </span>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (val: string) => new Date(val).toLocaleDateString(),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_: any, record: any) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/blogs/edit/${record._id}`)}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              onConfirm={() => deleteMutation.mutate(record._id)}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ];
  
    return (
      <div style={{ padding: 20 }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Danh sách Blog</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/add-blogs")}
          >
            Thêm mới
          </Button>
        </div>
  
        <Table
          columns={columns}
          dataSource={data?.posts}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            pageSize: 8, // ✅ Hiển thị 8 blog / trang
            showSizeChanger: false, // Ẩn đổi số lượng
            showQuickJumper: true, // Nhảy tới trang bất kỳ
          }}
        />
      </div>
    );
  };
  
  export default BlogListAdmin;
  