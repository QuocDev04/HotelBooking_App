import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Upload, message, Select, Row, Col, Spin } from 'antd';
import { SaveOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { instanceAdmin } from '../../configs/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { UploadFile, UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface BlogData {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    status: 'draft' | 'published';
    tags: string[];
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
}

interface BlogFormData {
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    status: 'draft' | 'published';
    tags: string[];
    metaTitle?: string;
    metaDescription?: string;
}

const EditBlog = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewMode, setPreviewMode] = useState(false);

    // Quill editor modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['blockquote', 'code-block'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'indent',
        'align', 'link', 'image', 'video', 'blockquote', 'code-block'
    ];

    // Fetch blog data
    const { data: blogData, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => instanceAdmin.get(`/admin/blogs/${id}`).then(res => res.data),
        enabled: !!id,
    });

    // Update blog mutation
    const updateBlogMutation = useMutation({
        mutationFn: (data: BlogFormData) => instanceAdmin.put(`/admin/blogs/${id}`, data),
        onSuccess: () => {
            message.success('Cập nhật blog thành công!');
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['blog', id] });
            navigate('/admin/list-blog');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật blog!');
        },
    });

    // Initialize form when blog data is loaded
    useEffect(() => {
        if (blogData) {
            form.setFieldsValue({
                title: blogData.title,
                excerpt: blogData.excerpt,
                author: blogData.author,
                status: blogData.status,
                tags: blogData.tags,
                metaTitle: blogData.metaTitle,
                metaDescription: blogData.metaDescription,
            });
            setContent(blogData.content);
            
            if (blogData.featuredImage) {
                setFileList([{
                    uid: '-1',
                    name: 'featured-image',
                    status: 'done',
                    url: blogData.featuredImage,
                }]);
            }
        }
    }, [blogData, form]);

    const handleSubmit = (values: any) => {
        const blogFormData: BlogFormData = {
            ...values,
            content,
            featuredImage: fileList[0]?.response?.secure_url || fileList[0]?.url || '',
            tags: values.tags || [],
        };

        updateBlogMutation.mutate(blogFormData);
    };

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const commonTags = [
        'Du lịch', 'Khám phá', 'Ẩm thực', 'Văn hóa', 'Thiên nhiên',
        'Phiêu lưu', 'Nghỉ dưỡng', 'Lịch sử', 'Kiến trúc', 'Festival',
        'Mẹo du lịch', 'Kinh nghiệm', 'Điểm đến', 'Hoạt động'
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!blogData) {
        return (
            <div className="text-center p-8">
                <h3>Không tìm thấy blog</h3>
                <Button onClick={() => navigate('/admin/list-blog')}>Quay lại</Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">✏️</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Chỉnh sửa Blog</span>
                    </div>
                }
                extra={
                    <div className="flex gap-2">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? 'Chế độ chỉnh sửa' : 'Xem trước'}
                        </Button>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/list-blog')}
                        >
                            Quay lại
                        </Button>
                    </div>
                }
                className="shadow-lg"
            >
                {previewMode ? (
                    // Preview Mode
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {form.getFieldValue('title') || blogData.title}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <span>Tác giả: {form.getFieldValue('author') || blogData.author}</span>
                                <span>•</span>
                                <span>Trạng thái: {(form.getFieldValue('status') || blogData.status) === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span>
                                <span>•</span>
                                <span>Cập nhật: {new Date(blogData.updatedAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            {fileList[0] && (
                                <img
                                    src={fileList[0].url || fileList[0].response?.secure_url}
                                    alt="Featured"
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            <p className="text-lg text-gray-700 mb-6">
                                {form.getFieldValue('excerpt') || blogData.excerpt}
                            </p>
                        </div>
                        <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content || blogData.content }}
                        />
                    </div>
                ) : (
                    // Edit Mode
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Row gutter={24}>
                            <Col xs={24} lg={16}>
                                {/* Main Content */}
                                <Card title="Nội dung chính" className="mb-6">
                                    <Form.Item
                                        name="title"
                                        label="Tiêu đề blog"
                                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                                    >
                                        <Input
                                            placeholder="Nhập tiêu đề blog..."
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="excerpt"
                                        label="Mô tả ngắn"
                                        rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}
                                    >
                                        <TextArea
                                            placeholder="Mô tả ngắn về nội dung blog..."
                                            rows={3}
                                            maxLength={200}
                                            showCount
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Nội dung blog"
                                        required
                                    >
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Viết nội dung blog của bạn..."
                                            style={{ height: '400px', marginBottom: '50px' }}
                                        />
                                    </Form.Item>
                                </Card>

                                {/* SEO Settings */}
                                <Card title="Cài đặt SEO" className="mb-6">
                                    <Form.Item
                                        name="metaTitle"
                                        label="Meta Title"
                                    >
                                        <Input
                                            placeholder="Tiêu đề SEO (tùy chọn)"
                                            maxLength={60}
                                            showCount
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="metaDescription"
                                        label="Meta Description"
                                    >
                                        <TextArea
                                            placeholder="Mô tả SEO (tùy chọn)"
                                            rows={3}
                                            maxLength={160}
                                            showCount
                                        />
                                    </Form.Item>
                                </Card>
                            </Col>

                            <Col xs={24} lg={8}>
                                {/* Sidebar */}
                                <Card title="Cài đặt xuất bản" className="mb-6">
                                    <Form.Item
                                        name="status"
                                        label="Trạng thái"
                                    >
                                        <Select size="large">
                                            <Option value="draft">Bản nháp</Option>
                                            <Option value="published">Xuất bản</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="author"
                                        label="Tác giả"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
                                    >
                                        <Input placeholder="Tên tác giả" />
                                    </Form.Item>
                                </Card>

                                <Card title="Ảnh đại diện" className="mb-6">
                                    <Form.Item>
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            fileList={fileList}
                                            onChange={handleUploadChange}
                                            action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                                            data={{ upload_preset: 'demo-upload' }}
                                            accept="image/*"
                                            maxCount={1}
                                        >
                                            {fileList.length >= 1 ? null : (
                                                <div>
                                                    <div className="text-2xl mb-2">📷</div>
                                                    <div>Tải ảnh lên</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Card>

                                <Card title="Tags" className="mb-6">
                                    <Form.Item
                                        name="tags"
                                        label="Chọn tags"
                                    >
                                        <Select
                                            mode="tags"
                                            placeholder="Chọn hoặc thêm tags"
                                            options={commonTags.map(tag => ({ label: tag, value: tag }))}
                                        />
                                    </Form.Item>
                                </Card>

                                {/* Blog Info */}
                                <Card title="Thông tin blog" className="mb-6">
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>ID: {blogData._id}</div>
                                        <div>Tạo: {new Date(blogData.createdAt).toLocaleString('vi-VN')}</div>
                                        <div>Cập nhật: {new Date(blogData.updatedAt).toLocaleString('vi-VN')}</div>
                                    </div>
                                </Card>

                                {/* Action Buttons */}
                                <Card>
                                    <div className="space-y-3">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            size="large"
                                            block
                                            loading={updateBlogMutation.isPending}
                                            className="bg-gradient-to-r from-orange-500 to-red-600 border-0"
                                        >
                                            Cập nhật Blog
                                        </Button>
                                        <Button
                                            size="large"
                                            block
                                            onClick={() => navigate('/admin/list-blog')}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default EditBlog;