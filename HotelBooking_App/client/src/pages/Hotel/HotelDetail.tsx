import React, { useState, useEffect } from 'react';
import './HotelDetail.css';
import {
  Row,
  Col,
  Card,
  Button,
  Rate,
  Tag,
  Image,
  Divider,
  DatePicker,
  InputNumber,
  Select,
  message,
  Modal,
  Form,
  Input,
  Spin,
  Carousel,
  Typography,
  Space,
} from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

interface Hotel {
  _id: string;
  hotelName: string;
  description: string;
  location: {
    locationName: string;
    country: string;
  };
  starRating: number;
  hotelImages: string[];
  roomTypes: Array<{
    _id: string;
    typeName: string;
    basePrice: number;
    finalPrice: number;
    maxOccupancy: number;
    amenities: string[];
    images: string[];
    totalRooms: number;
    discountPercentage: number;
  }>;
  hotelAmenities: Array<{
    name: string;
  }>;
  policies: {
    checkIn: string;
    checkOut: string;
    petPolicy: string;
    smokingPolicy: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  averageRating: number;
  totalReviews: number;
}

interface RoomAvailability {
  roomTypeIndex: number;
  roomType: any;
  availableRooms: number;
}

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Get initial values from URL params
  const initialCheckIn = searchParams.get('checkIn') || moment().add(1, 'day').format('YYYY-MM-DD');
  const initialCheckOut = searchParams.get('checkOut') || moment().add(2, 'days').format('YYYY-MM-DD');
  const initialGuests = Number(searchParams.get('guests')) || 2;
  
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [datePickerValue, setDatePickerValue] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchHotelDetail();
    }
  }, [id]);

  // Đồng bộ datePickerValue với checkInDate và checkOutDate
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      setDatePickerValue([moment(checkInDate), moment(checkOutDate)]);
    } else {
      setDatePickerValue(null);
    }
  }, [checkInDate, checkOutDate]);

  const fetchHotelDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/hotels/${id}`);
      if (response.data.success) {
        setHotel(response.data.data);
        // Kiểm tra availability sau khi load hotel
        if (checkInDate && checkOutDate) {
          checkAvailability(response.data.data);
        }
      } else {
        message.error('Không tìm thấy khách sạn');
        navigate('/hotels');
      }
    } catch (error) {
      message.error('Không thể tải thông tin khách sạn');
      navigate('/hotels');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (hotelData?: Hotel) => {
    const currentHotel = hotelData || hotel;
    if (!currentHotel || !checkInDate || !checkOutDate) return;
    
    setCheckingAvailability(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/hotels/${currentHotel._id}/availability?checkIn=${checkInDate}&checkOut=${checkOutDate}`
      );
      
      if (response.data.success) {
        setAvailability(response.data.data.availableRoomTypes || []);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleDateChange = (dates: any) => {
    setDatePickerValue(dates);
    
    if (!dates || dates.length === 0) {
      setCheckInDate('');
      setCheckOutDate('');
      setAvailability([]);
      return;
    }
    
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      const checkIn = moment(dates[0]);
      const checkOut = moment(dates[1]);
      
      const daysDiff = checkOut.diff(checkIn, 'days');
      if (daysDiff < 1) {
        message.error('Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày');
        return;
      }
      
      if (daysDiff > 30) {
        message.error('Thời gian lưu trú không được quá 30 ngày');
        return;
      }
      
      const newCheckIn = checkIn.format('YYYY-MM-DD');
      const newCheckOut = checkOut.format('YYYY-MM-DD');
      
      setCheckInDate(newCheckIn);
      setCheckOutDate(newCheckOut);
      
      if (hotel) {
        checkAvailability();
      }
    }
  };

  const handleBookRoom = (roomType: any, availableRooms: number, price: number) => {
    setSelectedRoomType({ ...roomType, availableRooms, price });
    setBookingModalVisible(true);
  };

  const handleBookingSubmit = async (values: any) => {
    setBookingLoading(true);
    try {
      const bookingData = {
        hotelId: hotel?._id,
        roomTypeIndex: hotel?.roomTypes.findIndex(rt => rt._id === selectedRoomType._id),
        checkInDate,
        checkOutDate,
        numberOfRooms: values.numberOfRooms,
        totalGuests: guests,
        guestInfo: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          specialRequests: values.specialRequests || ''
        },
        payment_method: values.paymentMethod
      };

      const response = await axios.post('http://localhost:8080/api/hotel-booking', bookingData);
      
      if (response.data.success) {
        message.success('Đặt phòng thành công!');
        setBookingModalVisible(false);
        form.resetFields();
        checkAvailability();
      } else {
        message.error(response.data.message || 'Đặt phòng thất bại');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt phòng');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Không tìm thấy khách sạn</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '80px auto 0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/hotels')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        
        <Title level={2}>{hotel.hotelName}</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Rate disabled defaultValue={hotel.starRating} />
          <Text><EnvironmentOutlined /> {hotel.location.locationName}, {hotel.location.country}</Text>
          <Text>({hotel.totalReviews} đánh giá)</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Hotel Info */}
        <Col xs={24} lg={16}>
          {/* Images */}
          {hotel.hotelImages && hotel.hotelImages.length > 0 ? (
            <Card style={{ marginBottom: '24px' }}>
              <Carousel autoplay>
                {hotel.hotelImages.map((image, index) => (
                  <div key={index}>
                    <Image
                      src={image}
                      alt={`${hotel.hotelName} - ${index + 1}`}
                      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Carousel>
            </Card>
          ) : (
            <Card style={{ marginBottom: '24px' }}>
              <div style={{
                width: '100%',
                height: '400px',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
                <Text>Không có hình ảnh khách sạn</Text>
              </div>
            </Card>
          )}

          {/* Hotel Description */}
          <Card title="Mô tả khách sạn" style={{ marginBottom: '24px' }}>
            <Paragraph>{hotel.description}</Paragraph>
          </Card>

          {/* Amenities */}
          {hotel.hotelAmenities && hotel.hotelAmenities.length > 0 && (
            <Card title="Tiện ích" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                {hotel.hotelAmenities.map((amenity, index) => (
                  <Col key={index} xs={12} sm={8} md={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                      <span>{typeof amenity === 'string' ? amenity : (typeof amenity.name === 'string' ? amenity.name : (amenity.name?.name || amenity || 'Tiện ích'))}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {/* Policies */}
          <Card title="Chính sách khách sạn" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Giờ nhận phòng:</Text> {hotel.policies.checkIn}
              </Col>
              <Col span={12}>
                <Text strong>Giờ trả phòng:</Text> {hotel.policies.checkOut}
              </Col>
              <Col span={24}>
                <Text strong>Chính sách thú cưng:</Text> {hotel.policies.petPolicy === 'true' || hotel.policies.petPolicy === true ? 'Được phép' : 'Không được phép'}
              </Col>
              <Col span={24}>
                <Text strong>Chính sách hút thuốc:</Text> {hotel.policies.smokingPolicy === 'true' || hotel.policies.smokingPolicy === true ? 'Được phép' : 'Không được phép'}
              </Col>
            </Row>
          </Card>

          {/* Contact Info */}
          <Card title="Thông tin liên hệ">
            <Space direction="vertical">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                <Text>{hotel.contactInfo.phone}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MailOutlined style={{ marginRight: 8 }} />
                <Text>{hotel.contactInfo.email}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Column - Booking */}
        <Col xs={24} lg={8}>
          <Card title="Đặt phòng" style={{ position: 'sticky', top: '24px' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Chọn ngày:</Text>
              <RangePicker
                style={{ width: '100%', marginTop: 8 }}
                value={datePickerValue}
                onChange={handleDateChange}
                disabledDate={(current) => current && current < moment().startOf('day')}
                placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                format="DD/MM/YYYY"
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Số khách:</Text>
              <InputNumber
                min={1}
                max={10}
                value={guests}
                onChange={(value) => setGuests(value || 1)}
                style={{ width: '100%', marginTop: 8 }}
              />
            </div>
            
            <Divider />
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Loại phòng có sẵn:</Text>
              {checkingAvailability && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin spinning={true} tip="Đang kiểm tra phòng trống...">
                    <div style={{ minHeight: '50px' }}></div>
                  </Spin>
                </div>
              )}
            </div>
            
            {!checkInDate || !checkOutDate ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', background: '#f5f5f5', borderRadius: '8px' }}>
                <Text>Vui lòng chọn ngày nhận và trả phòng để xem phòng trống</Text>
              </div>
            ) : !checkingAvailability && availability.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', background: '#fff2e8', borderRadius: '8px' }}>
                <Text>Không có phòng trống trong thời gian này</Text>
              </div>
            ) : null}
            
            {!checkingAvailability && availability.map((room, index) => {
              const roomType = room.roomType;
              if (!roomType) return null;
              
              return (
                <Card key={index} size="small" style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>{roomType.typeName || 'Không có tên'}</Text>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Sức chứa: {roomType.maxOccupancy || 0} khách
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 8 }}>
                    {roomType.amenities && roomType.amenities.slice(0, 3).map((amenity: string, i: number) => (
                      <Tag key={i} size="small">{typeof amenity === 'string' ? amenity : (typeof amenity.name === 'string' ? amenity.name : (amenity.name?.name || amenity || 'Tiện ích'))}</Tag>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1890ff' }}>
                        {roomType.finalPrice ? roomType.finalPrice.toLocaleString('vi-VN') : '0'} VNĐ
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>/ đêm</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Còn {room.availableRooms} phòng
                      </div>
                    </div>
                    
                    <Button
                      type="primary"
                      size="small"
                      disabled={room.availableRooms === 0}
                      onClick={() => handleBookRoom(roomType, room.availableRooms, roomType.finalPrice || 0)}
                    >
                      Đặt phòng
                    </Button>
                  </div>
                </Card>
              );
            })}
          </Card>
        </Col>
      </Row>

      {/* Booking Modal */}
      <Modal
        title="Đặt phòng khách sạn"
        open={bookingModalVisible}
        onCancel={() => {
          setBookingModalVisible(false);
          setSelectedRoomType(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedRoomType && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleBookingSubmit}
          >
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Title level={4}>Thông tin đặt phòng</Title>
              <p><strong>Khách sạn:</strong> {hotel.hotelName}</p>
              <p><strong>Loại phòng:</strong> {selectedRoomType?.typeName || 'Không có tên'}</p>
              <p><strong>Ngày nhận phòng:</strong> {moment(checkInDate).format('DD/MM/YYYY')}</p>
              <p><strong>Ngày trả phòng:</strong> {moment(checkOutDate).format('DD/MM/YYYY')}</p>
              <p><strong>Số đêm:</strong> {moment(checkOutDate).diff(moment(checkInDate), 'days')} đêm</p>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số lượng phòng"
                  name="numberOfRooms"
                  rules={[{ required: true, message: 'Vui lòng chọn số lượng phòng!' }]}
                  initialValue={1}
                >
                  <InputNumber
                    min={1}
                    max={selectedRoomType.availableRooms}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phương thức thanh toán"
                  name="paymentMethod"
                  rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                >
                  <Select placeholder="Chọn phương thức thanh toán">
                    <Option value="cash">Tiền mặt</Option>
                    <Option value="bank_transfer">Chuyển khoản</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Yêu cầu đặc biệt"
              name="specialRequests"
            >
              <Input.TextArea rows={3} placeholder="Nhập yêu cầu đặc biệt (tùy chọn)" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={bookingLoading}>
                  Xác nhận đặt phòng
                </Button>
                <Button onClick={() => {
                  setBookingModalVisible(false);
                  setSelectedRoomType(null);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default HotelDetail;