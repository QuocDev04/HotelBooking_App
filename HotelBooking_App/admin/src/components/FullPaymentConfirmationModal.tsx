import React, { useState } from 'react';
import { 
  Modal, 
  Upload, 
  Button, 
  Form, 
  Input, 
  Space, 
  Card, 
  Typography, 
  Row, 
  Col,
  message,
  Alert,
  Divider
} from 'antd';
import './DepositConfirmationModal.css'; // Reuse the same CSS
import { 
  UploadOutlined, 
  CameraOutlined, 
  CheckCircleOutlined,
  FileImageOutlined,
  DollarOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface FullPaymentConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: FullPaymentConfirmationData) => Promise<void>;
  loading?: boolean;
  bookingInfo?: {
    id: string;
    hotelName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    depositAmount: number;
    remainingAmount: number;
    paymentMethod: string;
  };
}

interface FullPaymentConfirmationData {
  bookingId: string;
  proofImages: File[];
  notes: string;
  receivedAmount: number;
  receivedBy: string;
}

export const FullPaymentConfirmationModal: React.FC<FullPaymentConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  loading = false,
  bookingInfo
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];

    // Limit to 1 file only (backend constraint)
    newFileList = newFileList.slice(-1);

    // Read file content for preview
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ có thể upload file hình ảnh!');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Kích thước file phải nhỏ hơn 10MB!');
      return false;
    }

    return false; // Prevent auto upload, we'll handle manually
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (fileList.length === 0) {
        message.error('Vui lòng upload ít nhất 1 hình ảnh chứng minh!');
        return;
      }

      const files = fileList.map(file => file.originFileObj as File);
      
      const confirmationData: FullPaymentConfirmationData = {
        bookingId: bookingInfo?.id || '',
        proofImages: files,
        notes: values.notes || '',
        receivedAmount: values.receivedAmount || bookingInfo?.remainingAmount || 0,
        receivedBy: values.receivedBy || ''
      };

      await onConfirm(confirmationData);
      
      // Reset form after success
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditCardOutlined style={{ color: '#1890ff' }} />
          <span>Xác nhận thanh toán toàn phần</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      className="deposit-confirmation-modal"
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Booking Information */}
        {bookingInfo && (
          <Card size="small" style={{ backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }}>
            <Title level={5} style={{ margin: 0, marginBottom: 12, color: '#1890ff' }}>
              <CreditCardOutlined /> Thông tin thanh toán
            </Title>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12}>
                <Text strong>Khách sạn:</Text>
                <br />
                <Text>{bookingInfo.hotelName}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Khách hàng:</Text>
                <br />
                <Text>{bookingInfo.customerName}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Email:</Text>
                <br />
                <Text>{bookingInfo.customerEmail}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Điện thoại:</Text>
                <br />
                <Text>{bookingInfo.customerPhone}</Text>
              </Col>
            </Row>

            <Divider style={{ margin: '16px 0' }} />
            
            {/* Payment Breakdown */}
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fafafa', 
              borderRadius: '6px',
              marginBottom: '12px'
            }}>
              <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#1890ff' }}>
                Chi tiết thanh toán:
              </Title>
              <Row justify="space-between" style={{ marginBottom: 4 }}>
                <Col><Text>Tổng tiền booking:</Text></Col>
                <Col><Text strong>{formatPrice(bookingInfo.totalAmount)} VNĐ</Text></Col>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 4 }}>
                <Col><Text>Tiền cọc đã thanh toán:</Text></Col>
                <Col><Text style={{ color: '#52c41a' }}>-{formatPrice(bookingInfo.depositAmount)} VNĐ</Text></Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <Row justify="space-between">
                <Col><Text strong style={{ color: '#1890ff' }}>Số tiền còn lại cần thu:</Text></Col>
                <Col>
                  <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                    {formatPrice(bookingInfo.remainingAmount)} VNĐ
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>
        )}

        {/* Important Notice */}
        <Alert
          message="⚠️ Lưu ý quan trọng"
          description={
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>• Bắt buộc phải có <strong>hình ảnh chứng minh</strong> đã nhận thanh toán đầy đủ</Text>
              <Text>• Hình ảnh có thể là: biên lai, ảnh chụp tiền mặt, ảnh chuyển khoản, hóa đơn</Text>
              <Text>• Chỉ upload <strong>1 hình ảnh</strong> rõ nét, mỗi file không quá 10MB</Text>
              <Text>• Sau khi xác nhận, booking sẽ chuyển thành trạng thái <strong>"Hoàn thành"</strong></Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            receivedAmount: bookingInfo?.remainingAmount,
            receivedBy: 'Admin'
          }}
        >
          {/* Image Upload */}
          <Form.Item
            label={
              <span>
                <FileImageOutlined /> Hình ảnh chứng minh thanh toán <span style={{ color: 'red' }}>*</span>
              </span>
            }
            required
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple={false}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length < 1 && (
                <div>
                  <CameraOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div style={{ marginTop: 8 }}>Upload hình ảnh</div>
                </div>
              )}
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Chụp ảnh hoặc upload hình chứng minh đã nhận thanh toán đầy đủ (1 ảnh duy nhất)
            </Text>
          </Form.Item>

          {/* Received Amount */}
          <Form.Item
            name="receivedAmount"
            label="Số tiền đã nhận (VNĐ)"
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền đã nhận' },
              { type: 'number', min: 0, message: 'Số tiền phải lớn hơn 0' }
            ]}
          >
            <Input
              type="number"
              placeholder="Nhập số tiền thực tế đã nhận"
              prefix={<DollarOutlined />}
              style={{ fontSize: 16 }}
            />
          </Form.Item>

          {/* Received By */}
          <Form.Item
            name="receivedBy"
            label="Người nhận tiền"
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận tiền' }]}
          >
            <Input placeholder="Tên nhân viên nhận thanh toán" />
          </Form.Item>

          {/* Notes */}
          <Form.Item
            name="notes"
            label="Ghi chú thêm"
          >
            <TextArea 
              rows={3} 
              placeholder="Ghi chú thêm về việc nhận thanh toán đầy đủ (tùy chọn)..."
            />
          </Form.Item>
        </Form>

        {/* Action Buttons */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Button
              block
              size="large"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy bỏ
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button
              type="primary"
              block
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                border: 'none',
                fontWeight: 600
              }}
            >
              Xác nhận thanh toán đầy đủ
            </Button>
          </Col>
        </Row>

        {/* Final Notice */}
        <Card size="small" style={{ backgroundColor: '#f0f9ff', border: '1px solid #91d5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <CheckCircleOutlined style={{ color: '#1890ff' }} />
            <Text strong style={{ color: '#1890ff' }}>
              Sau khi xác nhận, booking sẽ được đánh dấu là "Hoàn thành"
            </Text>
          </div>
        </Card>
      </Space>
    </Modal>
  );
};
