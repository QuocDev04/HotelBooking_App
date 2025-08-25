import React, { useState } from 'react';
import { Button, Card, Space, message } from 'antd';
import { DepositConfirmationModal } from './DepositConfirmationModal';

// Component test cho DepositConfirmationModal
const TestDepositConfirmationModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockBookingInfo = {
    id: '65f1234567890abcdef12345',
    hotelName: 'Khách sạn Grand Palace 5 sao',
    customerName: 'Nguyễn Văn Minh',
    customerEmail: 'nguyenvanminh@gmail.com',
    customerPhone: '0901234567',
    totalAmount: 6000000, // 6M VND
    depositAmount: 1800000, // 30% = 1.8M VND
    paymentMethod: 'cash'
  };

  const handleConfirm = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    console.log('Deposit confirmation data:', data);
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Simulate successful confirmation
      message.success('Xác nhận đặt cọc thành công!');
      setVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="🧪 Test Admin Deposit Confirmation Modal">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            onClick={() => setVisible(true)}
            size="large"
          >
            Mở Modal Xác Nhận Cọc (Admin)
          </Button>
          
          <div style={{ 
            padding: '16px', 
            background: '#f0f2f5', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong>Hướng dẫn test:</strong>
            <br />
            1. Click nút trên để mở modal admin
            <br />
            2. Upload ít nhất 1 hình ảnh chứng minh
            <br />
            3. Điền thông tin người nhận tiền
            <br />
            4. Thêm ghi chú (tùy chọn)
            <br />
            5. Click "Xác nhận đã nhận tiền cọc"
            <br />
            6. Kiểm tra console để xem data được gửi
          </div>

          <div style={{ 
            padding: '16px', 
            background: '#fff7e6', 
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #ffd591'
          }}>
            <strong>Mock Data:</strong>
            <br />
            • Khách sạn: {mockBookingInfo.hotelName}
            <br />
            • Khách hàng: {mockBookingInfo.customerName}
            <br />
            • Tổng tiền: {mockBookingInfo.totalAmount.toLocaleString('vi-VN')} VNĐ
            <br />
            • Tiền cọc: {mockBookingInfo.depositAmount.toLocaleString('vi-VN')} VNĐ
          </div>
        </Space>
        
        <DepositConfirmationModal
          visible={visible}
          onCancel={() => setVisible(false)}
          onConfirm={handleConfirm}
          loading={loading}
          bookingInfo={mockBookingInfo}
        />
      </Card>
    </div>
  );
};

export default TestDepositConfirmationModal;
