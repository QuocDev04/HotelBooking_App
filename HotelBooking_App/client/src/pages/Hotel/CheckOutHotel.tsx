import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message, Typography, Row, Col, Divider, Modal } from 'antd';
import { CreditCardOutlined, DollarOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title, Text } = Typography;

interface HotelBooking {
  _id: string;
  hotelId: {
    hotelName: string;
    location: {
      locationName: string;
      country: string;
    };
  };
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  roomBookings: Array<{
    roomTypeName: string;
    numberOfRooms: number;
    pricePerNight: number;
    totalPrice: number;
  }>;
  totalPrice: number;
  depositAmount: number;
  isDeposit: boolean;
  payment_status: string;
  booking_status: string;
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
}

const CheckOutHotel: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<HotelBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/hotel-booking/${bookingId}`);
      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        message.error('Không thể tải thông tin đặt phòng');
        navigate('/hotels');
      }
    } catch (error) {
      console.error('Lỗi khi tải booking:', error);
      message.error('Có lỗi xảy ra khi tải thông tin đặt phòng');
      navigate('/hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDepositPayment = () => {
    setDepositModalVisible(true);
  };

  const handleDepositConfirm = async () => {
    setDepositModalVisible(false);
    await handleVNPayPayment('deposit');
  };

  const handleCashPayment = async () => {
    if (!booking) return;

    try {
      setIsProcessingPayment(true);
      setDepositModalVisible(false);
      
      // Cập nhật booking với payment method là cash
      const response = await axios.put(`http://localhost:8080/api/hotel-booking/confirm-payment/${booking._id}`, {
        payment_method: 'cash',
        payment_status: 'pending_cash_payment'
      });
      
      if (response.data.success) {
        message.success('Đã chọn thanh toán bằng tiền mặt. Vui lòng thanh toán trong vòng 24 giờ.');
        fetchBookingDetails(); // Refresh booking data
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật phương thức thanh toán:', error);
      message.error('Có lỗi xảy ra khi cập nhật phương thức thanh toán.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleVNPayPayment = async (paymentType: 'deposit' | 'full' | 'remaining') => {
    if (!booking) return;

    try {
      setIsProcessingPayment(true);
      
      let amount = 0;
      if (paymentType === 'deposit') {
        amount = booking.depositAmount;
      } else if (paymentType === 'full') {
        amount = booking.totalPrice;
      } else if (paymentType === 'remaining') {
        amount = booking.totalPrice - booking.depositAmount;
      }

      const paymentData = {
        bookingId: booking._id,
        amount: amount,
        orderInfo: `Thanh toán ${paymentType === 'deposit' ? 'đặt cọc' : paymentType === 'full' ? 'toàn bộ' : 'số tiền còn lại'} đặt phòng khách sạn ${booking.hotelId.hotelName}`,
        orderType: 'hotel_booking',
        locale: 'vn',
        returnUrl: `${window.location.origin}/payment-result`,
        ipAddr: '127.0.0.1'
      };

      // Gọi API tạo VNPay payment URL
      const response = await axios.post('http://localhost:8080/api/vnpay/create-hotel-payment', paymentData);
      
      if (response.data.success && response.data.paymentUrl) {
        // Chuyển hướng đến VNPay
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán VNPay:', error);
      message.error('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleRefund = async () => {
    if (!booking) return;

    try {
      setIsProcessingPayment(true);
      
      const refundData = {
        bookingId: booking._id,
        refundType: 'customer_cancellation',
        refundReason: 'Khách hàng yêu cầu hoàn tiền'
      };

      const response = await axios.post('http://localhost:8080/api/vnpay/process-hotel-refund', refundData);
      
      if (response.data.success && response.data.refundUrl) {
        window.location.href = response.data.refundUrl;
      } else {
        throw new Error('Không thể tạo yêu cầu hoàn tiền');
      }
    } catch (error) {
      console.error('Lỗi khi tạo hoàn tiền:', error);
      message.error('Có lỗi xảy ra khi tạo yêu cầu hoàn tiền.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Không tìm thấy thông tin đặt phòng</Text>
      </div>
    );
  }

  const remainingAmount = booking.totalPrice - booking.depositAmount;
  const canPayRemaining = booking.isDeposit && booking.payment_status === 'deposit_paid';
  const canPayFull = booking.payment_status === 'pending';
  const canPayDeposit = booking.payment_status === 'pending';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Thanh toán đặt phòng khách sạn</Title>
      
      <Card style={{ marginBottom: '20px' }}>
        <Title level={4}>Thông tin đặt phòng</Title>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text strong>Khách sạn:</Text>
            <br />
            <Text>{booking.hotelId.hotelName}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Địa điểm:</Text>
            <br />
            <Text>{booking.hotelId.location.locationName}, {booking.hotelId.location.country}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Ngày nhận phòng:</Text>
            <br />
            <Text>{moment(booking.checkInDate).format('DD/MM/YYYY')}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Ngày trả phòng:</Text>
            <br />
            <Text>{moment(booking.checkOutDate).format('DD/MM/YYYY')}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Số đêm:</Text>
            <br />
            <Text>{booking.numberOfNights} đêm</Text>
          </Col>
          <Col span={12}>
            <Text strong>Khách hàng:</Text>
            <br />
            <Text>{booking.guestInfo.fullName}</Text>
          </Col>
        </Row>
        
        <Divider />
        
        <Title level={5}>Chi tiết phòng</Title>
        {booking.roomBookings.map((room, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <Text>{room.roomTypeName} - {room.numberOfRooms} phòng</Text>
            <br />
            <Text type="secondary">{room.pricePerNight.toLocaleString('vi-VN')} VNĐ/đêm × {room.numberOfRooms} phòng = {room.totalPrice.toLocaleString('vi-VN')} VNĐ</Text>
          </div>
        ))}
        
        <Divider />
        
        <Row justify="space-between">
          <Col>
            <Text strong>Tổng tiền:</Text>
          </Col>
          <Col>
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
            </Text>
          </Col>
        </Row>
        
        {booking.isDeposit && (
          <Row justify="space-between" style={{ marginTop: '8px' }}>
            <Col>
              <Text>Tiền cọc (30%):</Text>
            </Col>
            <Col>
              <Text style={{ color: '#52c41a' }}>
                {booking.depositAmount.toLocaleString('vi-VN')} VNĐ
              </Text>
            </Col>
          </Row>
        )}
      </Card>

      <Card>
        <Title level={4}>Tùy chọn thanh toán</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
          Trạng thái thanh toán: <Text strong>{booking.payment_status === 'pending' ? 'Chờ thanh toán' : booking.payment_status === 'deposit_paid' ? 'Đã đặt cọc' : 'Đã thanh toán'}</Text>
        </Text>
        
        <Row gutter={[16, 16]}>
          {canPayDeposit && (
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', border: '1px solid #d9d9d9' }}
                bodyStyle={{ padding: '20px' }}
              >
                <DollarOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '10px' }} />
                <Title level={5}>Đặt cọc 30%</Title>
                <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                  {booking.depositAmount.toLocaleString('vi-VN')} VNĐ
                </Text>
                <br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '10px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  loading={isProcessingPayment}
                  onClick={handleDepositPayment}
                >
                  Thanh toán cọc
                </Button>
              </Card>
            </Col>
          )}
          
          {canPayFull && (
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', border: '1px solid #1890ff' }}
                bodyStyle={{ padding: '20px' }}
              >
                <CreditCardOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '10px' }} />
                <Title level={5}>Thanh toán toàn bộ</Title>
                <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                  {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
                </Text>
                <br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '10px' }}
                  loading={isProcessingPayment}
                  onClick={() => handleVNPayPayment('full')}
                >
                  Thanh toán toàn bộ
                </Button>
              </Card>
            </Col>
          )}
          
          {canPayRemaining && (
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', border: '1px solid #fa8c16' }}
                bodyStyle={{ padding: '20px' }}
              >
                <CreditCardOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '10px' }} />
                <Title level={5}>Thanh toán còn lại</Title>
                <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {remainingAmount.toLocaleString('vi-VN')} VNĐ
                </Text>
                <br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '10px', backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                  loading={isProcessingPayment}
                  onClick={() => handleVNPayPayment('remaining')}
                >
                  Thanh toán còn lại
                </Button>
              </Card>
            </Col>
          )}
        </Row>
        
        {booking.payment_status === 'completed' && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text type="success" style={{ fontSize: '16px' }}>
              ✅ Đã thanh toán đầy đủ
            </Text>
            <br />
            <Button 
              type="default" 
              danger
              style={{ marginTop: '10px' }}
              loading={isProcessingPayment}
              onClick={handleRefund}
            >
              Yêu cầu hoàn tiền
            </Button>
          </div>
        )}
      </Card>

      {/* Modal thông báo thanh toán cọc */}
      <Modal
        title="Thông báo thanh toán cọc"
        open={depositModalVisible}
        onCancel={() => setDepositModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Bạn đã chọn thanh toán cọc cho đặt phòng khách sạn. Vui lòng chọn phương thức thanh toán:
          </p>
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', border: '2px solid #1890ff' }}
                bodyStyle={{ padding: '20px' }}
              >
                <BankOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '10px' }} />
                <Title level={5} style={{ color: '#1890ff' }}>VNPay (Khuyến nghị)</Title>
                <ul style={{ textAlign: 'left', paddingLeft: '20px', marginBottom: '15px' }}>
                  <li>Thanh toán ngay lập tức</li>
                  <li>Bảo mật cao</li>
                  <li>Hỗ trợ nhiều ngân hàng</li>
                  <li>Xác nhận tự động</li>
                </ul>
                <Button 
                  type="primary" 
                  size="large"
                  style={{ width: '100%' }}
                  loading={isProcessingPayment}
                  onClick={handleDepositConfirm}
                >
                  Thanh toán VNPay
                </Button>
              </Card>
            </Col>
            
            <Col span={12}>
              <Card 
                hoverable 
                style={{ textAlign: 'center', border: '1px solid #d9d9d9' }}
                bodyStyle={{ padding: '20px' }}
              >
                <WalletOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '10px' }} />
                <Title level={5} style={{ color: '#52c41a' }}>Tiền mặt</Title>
                <ul style={{ textAlign: 'left', paddingLeft: '20px', marginBottom: '15px' }}>
                  <li>Thanh toán tại văn phòng</li>
                  <li>Thời hạn: 24 giờ</li>
                  <li>Cần xác nhận thủ công</li>
                  <li>Có thể hủy nếu quá hạn</li>
                </ul>
                <Button 
                  type="default"
                  size="large"
                  style={{ width: '100%', borderColor: '#52c41a', color: '#52c41a' }}
                  loading={isProcessingPayment}
                  onClick={handleCashPayment}
                >
                  Chọn tiền mặt
                </Button>
              </Card>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text type="secondary">
              Lưu ý: Sau khi chọn phương thức thanh toán, bạn sẽ không thể thay đổi.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckOutHotel;