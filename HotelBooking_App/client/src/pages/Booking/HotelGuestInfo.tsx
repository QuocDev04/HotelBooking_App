/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import type { AxiosError } from "axios";
import { Form, Input, message, DatePicker, Select, Card, Button, Typography, Row, Col, Divider } from "antd";
import { UserOutlined, CalendarOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cho BookingData
interface BookingData {
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  hotelId?: string;
  roomType?: string;
  price?: number;
}

const  HotelGuestInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      message.error("Không tìm thấy thông tin đặt phòng. Vui lòng chọn phòng lại.");
      navigate("/hotels");
    }
  }, [navigate]);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await fetch('http://localhost:8080/api/hotel-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return await response.json();
      } catch (error) {
        throw new Error('Đã có lỗi xảy ra khi đặt phòng');
      }
    },

    onSuccess: async (data) => {
      const paymentMethod = data?.data?.payment_method;
      const paymentType = data?.data?.paymentType;
      console.log("databongking", data?.data?._id);
      
      if (paymentMethod === "bank_transfer") {
        try {
          const res = await fetch(`http://localhost:8080/api/vnpay/${data?.data?._id}`, {
            method: 'POST'
          }).then(res => res.json());
          
          console.log("VNPay response:", res?.data);

          if (res.data?.success && res.data?.paymentUrl) {
            window.location.href = res.data.paymentUrl;
          } else {
            message.error("Không thể lấy liên kết thanh toán từ VNPay");
          }
        } catch (error) {
          message.error("Đã xảy ra lỗi khi kết nối VNPay");
        }
      } else if (paymentMethod === "cash") {
        // Xử lý thanh toán tiền mặt
        if (paymentType === "deposit") {
          message.success("Đặt phòng thành công! Vui lòng thanh toán cọc để hoàn tất.");
        } else {
          message.success("Đặt phòng thành công!");
        }
        navigate("/booking-success");
      } else {
        // Fallback
        message.success("Đặt phòng thành công!");
        navigate("/booking-success");
      }
    },

    onError: (error: any) => {
      message.error(error.message || "Có lỗi xảy ra khi đặt phòng");
    }
  });

  const onFinish = (values: any) => {
    if (!bookingData?.roomId) {
      message.error("Vui lòng chọn phòng trước khi đặt.");
      return;
    }

    setLoading(true);

    const payload = {
      userId: localStorage.getItem("userId"),
      hotelId: bookingData?.hotelId,
      checkInDate: bookingData?.check_in_date,
      checkOutDate: bookingData?.check_out_date,
      fullNameUser: values.userName,
      email: values.emailName,
      phone: values.phoneName,
      address: values.address,
      roomBookings: [{
        roomTypeIndex: parseInt(bookingData?.roomId || '0'),
        numberOfRooms: 1,
        guests: values.guests ? values.guests.map((guest: any) => ({
          fullName: guest.fullName,
          gender: guest.gender,
          birthDate: guest.birthDate ? dayjs(guest.birthDate).format('YYYY-MM-DD') : new Date('1990-01-01')
        })) : [],
        specialRequests: values.specialRequests || ''
      }],
      payment_method: values.payment_method,
      paymentType: values.paymentType,
      note: values.note || '',
      specialRequests: values.specialRequests || ''
    };

    console.log("Payload gửi đi:", payload);
    mutate(payload);
  };

  const checkInDate = bookingData?.check_in_date ? new Date(bookingData.check_in_date) : null;
  const checkOutDate = bookingData?.check_out_date ? new Date(bookingData.check_out_date) : null;
  
  let numberOfNights = 0;
  if (checkInDate && checkOutDate) {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  const formattedCheckIn = dayjs(bookingData?.check_in_date ?? "")
    .add(7, 'hour')
    .format("DD/MM/YYYY [lúc] HH:mm");
  const formattedCheckOut = dayjs(bookingData?.check_out_date ?? "")
    .add(7, 'hour')
    .format("DD/MM/YYYY [lúc] HH:mm");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800">
            Thông tin khách lưu trú
          </Title>
          <Text className="text-gray-600 text-lg">
            Vui lòng điền đầy đủ thông tin cho tất cả khách lưu trú
          </Text>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-2 text-green-600 font-medium">Chọn phòng</span>
            </div>
            <div className="w-16 h-0.5 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                2
              </div>
              <span className="ml-2 text-blue-600 font-medium">Thông tin khách</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center">
                3
              </div>
              <span className="ml-2 text-gray-400">Hoàn tất</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Guest Information Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <Form onFinish={onFinish} form={form} layout="vertical" size="large">
                {/* Contact Information */}
                <div className="mb-8">
                  <Title level={4} className="flex items-center mb-4">
                    <UserOutlined className="mr-2 text-blue-500" />
                    Thông tin liên hệ
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="userName"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ và tên" },
                          { min: 2, message: "Tên phải có ít nhất 2 ký tự" }
                        ]}
                      >
                        <Input placeholder="Nhập họ và tên" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phoneName"
                        rules={[
                          { required: true, message: "Vui lòng nhập số điện thoại" },
                          { pattern: /^0\d{9}$/, message: "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số" }
                        ]}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Email"
                        name="emailName"
                        rules={[
                          { required: true, message: "Vui lòng nhập email" },
                          { type: 'email', message: "Email không hợp lệ" }
                        ]}
                      >
                        <Input placeholder="Nhập email" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Địa chỉ"
                        name="address"
                      >
                        <Input placeholder="Nhập địa chỉ (tùy chọn)" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                                 {/* Guest Information */}
                 <div className="mb-8">
                   <Title level={4} className="flex items-center mb-6">
                     <UserOutlined className="mr-2 text-green-500" />
                     Thông tin khách lưu trú ({bookingData?.adults} người)
                   </Title>
                  
                  {/* Guest 1 (Main Guest) */}
                  <Card size="small" className="mb-4 border-blue-200 bg-blue-50">
                    <Title level={5} className="text-blue-800 mb-4 flex items-center">
                      <UserOutlined className="mr-2" />
                      Khách 1 (Người đặt)
                    </Title>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label="Họ và tên"
                          name={['guests', 0, 'fullName']}
                          rules={[{ required: true, message: 'Vui lòng nhập họ và tên khách 1!' }]}
                        >
                          <Input placeholder="Nhập họ và tên khách 1" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Giới tính"
                          name={['guests', 0, 'gender']}
                          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                          <Select placeholder="Chọn giới tính">
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="Ngày sinh"
                          name={['guests', 0, 'birthDate']}
                          rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                        >
                          <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Chọn ngày sinh"
                            format="DD/MM/YYYY"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  {/* Guest 2 (if adults > 1) */}
                  {bookingData?.adults && bookingData.adults > 1 && (
                    <Card size="small" className="mb-4 border-green-200 bg-green-50">
                      <Title level={5} className="text-green-800 mb-4 flex items-center">
                        <UserOutlined className="mr-2" />
                        Khách 2
                      </Title>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            label="Họ và tên"
                            name={['guests', 1, 'fullName']}
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên khách 2!' }]}
                          >
                            <Input placeholder="Nhập họ và tên khách 2" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label="Giới tính"
                            name={['guests', 1, 'gender']}
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                          >
                            <Select placeholder="Chọn giới tính">
                              <Option value="male">Nam</Option>
                              <Option value="female">Nữ</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label="Ngày sinh"
                            name={['guests', 1, 'birthDate']}
                            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                          >
                            <DatePicker 
                              style={{ width: '100%' }} 
                              placeholder="Chọn ngày sinh"
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  )}

                                     {/* Additional Guests (if adults > 2) */}
                   {bookingData?.adults && bookingData.adults > 2 && (
                     <div className="mb-4">
                       {Array.from({ length: bookingData.adults - 2 }, (_, index) => (
                        <Card key={index} size="small" className="mb-4 border-orange-200 bg-orange-50">
                          <Title level={5} className="text-orange-800 mb-4">
                            Khách {index + 3}
                          </Title>
                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item
                                label="Họ và tên"
                                name={['guests', index + 2, 'fullName']}
                                rules={[{ required: true, message: `Vui lòng nhập họ và tên khách ${index + 3}!` }]}
                              >
                                <Input placeholder={`Nhập họ và tên khách ${index + 3}`} />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label="Giới tính"
                                name={['guests', index + 2, 'gender']}
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                              >
                                <Select placeholder="Chọn giới tính">
                                  <Option value="male">Nam</Option>
                                  <Option value="female">Nữ</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label="Ngày sinh"
                                name={['guests', index + 2, 'birthDate']}
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                              >
                                <DatePicker 
                                  style={{ width: '100%' }} 
                                  placeholder="Chọn ngày sinh"
                                  format="DD/MM/YYYY"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <Divider />

                {/* Payment Information */}
                <div className="mb-8">
                  <Title level={4} className="flex items-center mb-4">
                    <PhoneOutlined className="mr-2 text-purple-500" />
                    Thông tin thanh toán
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Loại thanh toán"
                        name="paymentType"
                        rules={[{ required: true, message: "Vui lòng chọn loại thanh toán" }]}
                        initialValue="full"
                      >
                        <Select placeholder="Chọn loại thanh toán">
                          <Option value="full">Thanh toán toàn bộ</Option>
                          <Option value="deposit">Thanh toán cọc (30%)</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                                         <Col span={12}>
                       <Form.Item
                         label="Phương thức thanh toán"
                         name="payment_method"
                         rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
                         initialValue="bank_transfer"
                       >
                                                 <Select placeholder="Chọn phương thức thanh toán">
                          <Option value="bank_transfer">VNPay</Option>
                          <Option value="cash">Tiền mặt</Option>
                        </Select>
                       </Form.Item>
                     </Col>
                  </Row>
                </div>

                {/* Special Requests & Notes */}
                <div className="mb-8">
                  <Title level={4} className="flex items-center mb-4">
                    <PhoneOutlined className="mr-2 text-orange-500" />
                    Yêu cầu đặc biệt & Ghi chú
                  </Title>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Yêu cầu đặc biệt"
                        name="specialRequests"
                      >
                        <Input.TextArea 
                          placeholder="Nhập yêu cầu đặc biệt (nếu có)" 
                          rows={3}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Ghi chú"
                        name="note"
                      >
                        <Input.TextArea 
                          placeholder="Ghi chú thêm" 
                          rows={3}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="px-12 py-3 h-auto text-lg font-semibold"
                  >
                    Hoàn tất đặt phòng
                  </Button>
                </div>
              </Form>
            </Card>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <Card title="Tóm tắt đặt phòng" className="shadow-lg sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <CalendarOutlined className="mr-2" />
                  <div>
                    <div className="font-medium">Ngày nhận phòng</div>
                    <div>{formattedCheckIn}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <CalendarOutlined className="mr-2" />
                  <div>
                    <div className="font-medium">Ngày trả phòng</div>
                    <div>{formattedCheckOut}</div>
                  </div>
                </div>

                                 <div className="flex items-center text-gray-600">
                   <UserOutlined className="mr-2" />
                   <div>
                     <div className="font-medium">Số khách</div>
                     <div>{bookingData?.adults} người, {bookingData?.children} trẻ em</div>
                   </div>
                 </div>

                <div className="flex items-center text-gray-600">
                  <HomeOutlined className="mr-2" />
                  <div>
                    <div className="font-medium">Thời gian lưu trú</div>
                    <div>{numberOfNights} đêm</div>
                  </div>
                </div>

                <Divider />

                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Tóm tắt thanh toán:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Giá phòng/đêm:</span>
                      <span className="font-medium">
                        {bookingData?.price ? new Intl.NumberFormat('vi-VN').format(bookingData.price) : '0'} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số đêm:</span>
                      <span className="font-medium">{numberOfNights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng tiền:</span>
                      <span className="font-medium text-lg text-blue-600">
                        {bookingData?.price ? new Intl.NumberFormat('vi-VN').format(bookingData.price * numberOfNights) : '0'} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Phí cọc (30%):</span>
                      <span>
                        {bookingData?.price ? new Intl.NumberFormat('vi-VN').format(Math.floor(bookingData.price * numberOfNights * 0.3)) : '0'} VNĐ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 mb-2">Thông tin quan trọng:</div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Vui lòng điền đầy đủ thông tin cho tất cả khách</li>
                    <li>• Thông tin sẽ được sử dụng để check-in</li>
                    <li>• Có thể hủy miễn phí trước 24h</li>
                    <li>• Thanh toán cọc: 30% tổng tiền</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelGuestInfo;
