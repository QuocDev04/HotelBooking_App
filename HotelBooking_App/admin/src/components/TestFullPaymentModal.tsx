import React, { useState } from 'react';
import { Button, Card, Space, message, Row, Col } from 'antd';
import { FullPaymentConfirmationModal } from './FullPaymentConfirmationModal';
import { DepositConfirmationModal } from './DepositConfirmationModal';

// Component test cho cả 2 modal
const TestFullPaymentModal: React.FC = () => {
  const [depositVisible, setDepositVisible] = useState(false);
  const [fullPaymentVisible, setFullPaymentVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockBookingInfo = {
    id: '65f1234567890abcdef12345',
    hotelName: 'Khách sạn Grand Palace 5 sao',
    customerName: 'Nguyễn Văn Minh',
    customerEmail: 'nguyenvanminh@gmail.com',
    customerPhone: '0901234567',
    totalAmount: 6000000, // 6M VND
    depositAmount: 1800000, // 30% = 1.8M VND
    remainingAmount: 4200000, // 70% = 4.2M VND
    paymentMethod: 'cash'
  };

  const handleDepositConfirm = async (data: any) => {
    setLoading(true);
    
    console.log('Deposit confirmation data:', data);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      message.success('Xác nhận đặt cọc thành công!');
      setDepositVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleFullPaymentConfirm = async (data: any) => {
    setLoading(true);
    
    console.log('Full payment confirmation data:', data);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      message.success('Xác nhận thanh toán đầy đủ thành công!');
      setFullPaymentVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Card title="🧪 Test Admin Payment Confirmation Modals">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {/* Buttons */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Button 
                type="primary" 
                onClick={() => setDepositVisible(true)}
                size="large"
                block
                style={{ 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  border: 'none'
                }}
              >
                🏦 Xác Nhận Cọc (30%)
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button 
                type="primary" 
                onClick={() => setFullPaymentVisible(true)}
                size="large"
                block
                style={{ 
                  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                  border: 'none'
                }}
              >
                💰 Xác Nhận Thanh Toán Đầy Đủ (70%)
              </Button>
            </Col>
          </Row>
          
          {/* Instructions */}
          <div style={{ 
            padding: '16px', 
            background: '#f0f2f5', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong>🔍 Hướng dẫn test:</strong>
            <br />
            <strong>1. Test Modal Cọc:</strong>
            <br />
            • Upload hình ảnh chứng minh nhận tiền cọc
            <br />
            • Điền số tiền: 1,800,000 VNĐ (30%)
            <br />
            • Thêm tên người nhận và ghi chú
            <br />
            <br />
            <strong>2. Test Modal Thanh Toán Đầy Đủ:</strong>
            <br />
            • Upload hình ảnh chứng minh nhận phần còn lại
            <br />
            • Điền số tiền: 4,200,000 VNĐ (70%)
            <br />
            • Thêm tên người nhận và ghi chú
            <br />
            <br />
            <strong>3. Kiểm tra:</strong>
            <br />
            • Validation form (bắt buộc có ảnh)
            <br />
            • Preview hình ảnh upload
            <br />
            • Loading states
            <br />
            • Console output với data
            <br />
            • Responsive design
          </div>

          {/* Mock Data Display */}
          <div style={{ 
            padding: '16px', 
            background: '#fff7e6', 
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #ffd591'
          }}>
            <strong>📊 Mock Booking Data:</strong>
            <Row gutter={[16, 8]} style={{ marginTop: 8 }}>
              <Col xs={24} sm={12}>
                <strong>Khách sạn:</strong> {mockBookingInfo.hotelName}
              </Col>
              <Col xs={24} sm={12}>
                <strong>Khách hàng:</strong> {mockBookingInfo.customerName}
              </Col>
              <Col xs={24} sm={12}>
                <strong>Email:</strong> {mockBookingInfo.customerEmail}
              </Col>
              <Col xs={24} sm={12}>
                <strong>Điện thoại:</strong> {mockBookingInfo.customerPhone}
              </Col>
              <Col xs={24} sm={12}>
                <strong>Tổng tiền:</strong> {mockBookingInfo.totalAmount.toLocaleString('vi-VN')} VNĐ
              </Col>
              <Col xs={24} sm={12}>
                <strong>Phương thức:</strong> {mockBookingInfo.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
              </Col>
              <Col xs={24} sm={12}>
                <strong style={{ color: '#52c41a' }}>Tiền cọc (30%):</strong> {mockBookingInfo.depositAmount.toLocaleString('vi-VN')} VNĐ
              </Col>
              <Col xs={24} sm={12}>
                <strong style={{ color: '#1890ff' }}>Còn lại (70%):</strong> {mockBookingInfo.remainingAmount.toLocaleString('vi-VN')} VNĐ
              </Col>
            </Row>
          </div>

          {/* Flow Description */}
          <Card size="small" title="📋 Workflow Admin" style={{ backgroundColor: '#f0f9ff' }}>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <strong>Bước 1:</strong> Booking được tạo với status "pending"
              <br />
              <strong>Bước 2:</strong> Admin xác nhận cọc → status chuyển thành "deposit_paid"
              <br />
              <strong>Bước 3:</strong> Admin xác nhận thanh toán đầy đủ → status chuyển thành "completed"
              <br />
              <br />
              <strong style={{ color: '#1890ff' }}>🔒 Yêu cầu hình ảnh chứng minh cho cả 2 bước!</strong>
            </div>
          </Card>
        </Space>
        
        {/* Modals */}
        <DepositConfirmationModal
          visible={depositVisible}
          onCancel={() => setDepositVisible(false)}
          onConfirm={handleDepositConfirm}
          loading={loading}
          bookingInfo={mockBookingInfo}
        />

        <FullPaymentConfirmationModal
          visible={fullPaymentVisible}
          onCancel={() => setFullPaymentVisible(false)}
          onConfirm={handleFullPaymentConfirm}
          loading={loading}
          bookingInfo={mockBookingInfo}
        />
      </Card>
    </div>
  );
};

export default TestFullPaymentModal;
