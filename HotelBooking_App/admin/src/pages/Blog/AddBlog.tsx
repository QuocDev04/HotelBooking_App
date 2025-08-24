import { useState } from 'react';
import { Form, Input, Button, Card, Upload, message, Select, Switch, Row, Col } from 'antd';
import { PlusOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { instanceAdmin } from '../../configs/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { UploadFile, UploadProps } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

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

const AddBlog = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
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

    // Create blog mutation
    const createBlogMutation = useMutation({
        mutationFn: (data: BlogFormData) => instanceAdmin.post('/admin/blogs', data),
        onSuccess: () => {
            message.success('Tạo blog thành công!');
            navigate('/admin/list-blog');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo blog!');
        },
    });

    const handleSubmit = (values: any) => {
        const blogData: BlogFormData = {
            ...values,
            content,
            featuredImage: fileList[0]?.response?.secure_url || fileList[0]?.url || '',
            tags: values.tags || [],
        };

        createBlogMutation.mutate(blogData);
    };

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
        </div>
    );

    const commonTags = [
        'Du lịch', 'Khám phá', 'Ẩm thực', 'Văn hóa', 'Thiên nhiên',
        'Phiêu lưu', 'Nghỉ dưỡng', 'Lịch sử', 'Kiến trúc', 'Festival',
        'Mẹo du lịch', 'Kinh nghiệm', 'Điểm đến', 'Hoạt động'
    ];

    return (
        <div className="p-6">
            <Card
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">✍️</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Thêm Blog Mới</span>
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
                                {form.getFieldValue('title') || 'Tiêu đề blog'}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600 mb-4">
                                <span>Tác giả: {form.getFieldValue('author') || 'Chưa có tác giả'}</span>
                                <span>•</span>
                                <span>Trạng thái: {form.getFieldValue('status') === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</span>
                            </div>
                            {fileList[0] && (
                                <img
                                    src={fileList[0].url || fileList[0].response?.secure_url}
                                    alt="Featured"
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            )}
                            <p className="text-lg text-gray-700 mb-6">
                                {form.getFieldValue('excerpt') || 'Mô tả ngắn về blog'}
                            </p>
                        </div>
                        <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: content || '<p>Nội dung blog sẽ hiển thị ở đây...</p>' }}
                        />
                    </div>
                ) : (
                    // Edit Mode
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            status: 'draft',
                            author: 'Admin'
                        }}
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
                                            <Option value="published">Xuất bản ngay</Option>
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
                                            {fileList.length >= 1 ? null : uploadButton}
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

                                {/* Action Buttons */}
                                <Card>
                                    <div className="space-y-3">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            size="large"
                                            block
                                            loading={createBlogMutation.isPending}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                                        >
                                            Lưu Blog
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

export default AddBlog;