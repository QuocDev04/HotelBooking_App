import { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Tag, Image, Input, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instanceAdmin } from '../../configs/axios';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

interface Blog {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    status: 'draft' | 'published' | 'archived';
    tags: string[];
    views: number;
    createdAt: string;
    updatedAt: string;
}

const ListBlog = () => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<any>(null);
    const queryClient = useQueryClient();

    // Fetch blogs
    const { data: blogsData, isLoading } = useQuery({
        queryKey: ['blogs', searchText, statusFilter, dateRange],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchText) params.append('search', searchText);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (dateRange && dateRange[0] && dateRange[1]) {
                params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
                params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
            }
            const response = await instanceAdmin.get(`/admin/blogs?${params.toString()}`);
            return response.data;
        },
    });

    // Delete blog mutation
    const deleteBlogMutation = useMutation({
        mutationFn: (id: string) => instanceAdmin.delete(`/admin/blogs/${id}`),
        onSuccess: () => {
            message.success('Xóa blog thành công!');
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
        onError: () => {
            message.error('Có lỗi xảy ra khi xóa blog!');
        },
    });

    // Toggle status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => 
            instanceAdmin.patch(`/admin/blogs/${id}/status`, { status }),
        onSuccess: () => {
            message.success('Cập nhật trạng thái thành công!');
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
        onError: () => {
            message.error('Có lỗi xảy ra khi cập nhật trạng thái!');
        },
    });

    const handleDelete = (id: string) => {
        deleteBlogMutation.mutate(id);
    };

    const handleStatusChange = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        toggleStatusMutation.mutate({ id, status: newStatus });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'green';
            case 'draft': return 'orange';
            case 'archived': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'published': return 'Đã xuất bản';
            case 'draft': return 'Bản nháp';
            case 'archived': return 'Đã lưu trữ';
            default: return status;
        }
    };

    const columns: ColumnsType<Blog> = [
        {
            title: 'Hình ảnh',
            dataIndex: 'featuredImage',
            key: 'featuredImage',
            width: 100,
            render: (image: string) => (
                <Image
                    width={60}
                    height={40}
                    src={image}
                    alt="Blog image"
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
            ),
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: Blog) => (
                <div>
                    <div className="font-semibold text-gray-900 mb-1">{title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{record.excerpt}</div>
                </div>
            ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            width: 120,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            width: 150,
            render: (tags: string[]) => (
                <div>
                    {tags?.slice(0, 2).map((tag, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                            {tag}
                        </Tag>
                    ))}
                    {tags?.length > 2 && (
                        <Tag color="default">+{tags.length - 2}</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'views',
            key: 'views',
            width: 100,
            render: (views: number) => (
                <div className="flex items-center gap-1">
                    <EyeOutlined className="text-gray-400" />
                    <span>{views || 0}</span>
                </div>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 200,
            render: (_, record: Blog) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => window.open(`/admin/edit-blog/${record._id}`, '_self')}
                    >
                        Sửa
                    </Button>
                    <Button
                        type={record.status === 'published' ? 'default' : 'primary'}
                        size="small"
                        onClick={() => handleStatusChange(record._id, record.status)}
                        loading={toggleStatusMutation.isPending}
                    >
                        {record.status === 'published' ? 'Ẩn' : 'Xuất bản'}
                    </Button>
                    <Popconfirm
                        title="Xóa blog"
                        description="Bạn có chắc chắn muốn xóa blog này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            loading={deleteBlogMutation.isPending}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">📝</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Quản lý Blog</span>
                    </div>
                }
                extra={
                    <Link to="/admin/add-blog">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
                        >
                            Thêm Blog Mới
                        </Button>
                    </Link>
                }
                className="shadow-lg"
            >
                {/* Filters */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Search
                            placeholder="Tìm kiếm theo tiêu đề..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={setSearchText}
                            onChange={(e) => !e.target.value && setSearchText('')}
                        />
                        <Select
                            placeholder="Lọc theo trạng thái"
                            size="large"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { label: 'Tất cả', value: 'all' },
                                { label: 'Đã xuất bản', value: 'published' },
                                { label: 'Bản nháp', value: 'draft' },
                                { label: 'Đã lưu trữ', value: 'archived' },
                            ]}
                        />
                        <RangePicker
                            placeholder={['Từ ngày', 'Đến ngày']}
                            size="large"
                            value={dateRange}
                            onChange={setDateRange}
                            format="DD/MM/YYYY"
                        />
                        <Button
                            size="large"
                            onClick={() => {
                                setSearchText('');
                                setStatusFilter('all');
                                setDateRange(null);
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={blogsData?.blogs || []}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        total: blogsData?.total || 0,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} của ${total} blog`,
                    }}
                    scroll={{ x: 1200 }}
                    className="shadow-sm"
                />
            </Card>
        </div>
    );
};

export default ListBlog;