import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Input, Card, Tag, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, CheckOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { instanceAdmin } from "../../configs/axios";
import { DepositConfirmationModal } from '../../components/DepositConfirmationModal';
import { FullPaymentConfirmationModal } from '../../components/FullPaymentConfirmationModal';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface HotelBooking {
  _id: string;
  hotelId: {
    _id: string;
    hotelName: string;
    location: {
      locationName: string;
      country: string;
    };
    address: string;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  fullNameUser: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  totalGuests: number;
  totalPrice: number;
  payment_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'pending_cancel' | 'deposit_paid';
  payment_method: 'cash' | 'bank_transfer';
  roomBookings: Array<{
    roomTypeName: string;
    numberOfRooms: number;
    pricePerNight: number;
    totalPrice: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const ListHotelBooking: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [fullPaymentModalVisible, setFullPaymentModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<HotelBooking | null>(null);
  const queryClient = useQueryClient();

  // Fetch hotel bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['hotel-bookings'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/api/admin/hotel-bookings');
      if (!response.ok) throw new Error('Failed to fetch hotel bookings');
      const data = await response.json();
      return data.bookings || [];
    }
  });

  // Delete booking mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/hotel-bookings/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      message.success('Xóa đặt phòng thành công!');
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi xóa đặt phòng!');
    }
  });

  // Confirm deposit payment mutation with image proof
  const confirmPaymentMutation = useMutation({
    mutationFn: async (data: { bookingId: string; proofImages: File[]; notes: string; receivedAmount: number; receivedBy: string }) => {
      const formData = new FormData();
      formData.append('note', data.notes); // Backend expects 'note', not 'notes'
      formData.append('receivedAmount', data.receivedAmount.toString());
      formData.append('receivedBy', data.receivedBy);
      
      // Backend chỉ nhận 1 file, lấy file đầu tiên
      if (data.proofImages && data.proofImages.length > 0) {
        formData.append('paymentImage', data.proofImages[0]); // Backend expects 'paymentImage'
      }

      const response = await instanceAdmin.put(`/admin/hotel-bookings/confirm-payment/${data.bookingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      message.success('Xác nhận đặt cọc thành công!');
      setDepositModalVisible(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận đặt cọc!');
    }
  });

  // Confirm full payment mutation with image proof
  const confirmFullPaymentMutation = useMutation({
    mutationFn: async (data: { bookingId: string; proofImages: File[]; notes: string; receivedAmount: number; receivedBy: string }) => {
      const formData = new FormData();
      formData.append('note', data.notes); // Backend expects 'note', not 'notes'
      formData.append('receivedAmount', data.receivedAmount.toString());
      formData.append('receivedBy', data.receivedBy);
      
      // Backend chỉ nhận 1 file, lấy file đầu tiên
      if (data.proofImages && data.proofImages.length > 0) {
        formData.append('paymentImage', data.proofImages[0]); // Backend expects 'paymentImage'
      }

      const response = await instanceAdmin.put(`/admin/hotel-bookings/confirm-full-payment/${data.bookingId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-bookings'] });
      message.success('Xác nhận thanh toán đầy đủ thành công!');
      setFullPaymentModalVisible(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán đầy đủ!');
    }
  });

  const handleDelete = (id: string, hotelName: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa đặt phòng tại "${hotelName}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(id)
    });
  };

  const handleConfirmDeposit = (booking: HotelBooking) => {
    setSelectedBooking(booking);
    setDepositModalVisible(true);
  };

  const handleDepositConfirmation = async (data: any) => {
    await confirmPaymentMutation.mutateAsync(data);
  };

  const handleConfirmFullPayment = (booking: HotelBooking) => {
    setSelectedBooking(booking);
    setFullPaymentModalVisible(true);
  };

  const handleFullPaymentConfirmation = async (data: any) => {
    await confirmFullPaymentMutation.mutateAsync(data);
  };

  const filteredBookings = bookings.filter((booking: HotelBooking) => {
    const matchesSearch = 
      booking.hotelId?.hotelName?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.fullNameUser?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.phone?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.payment_status === statusFilter;
    const matchesPayment = !paymentFilter || booking.payment_method === paymentFilter;
    
    const matchesDate = !dateRange || (
      dayjs(booking.checkInDate).isBetween(dateRange[0], dateRange[1], 'day', '[]') ||
      dayjs(booking.checkOutDate).isBetween(dateRange[0], dateRange[1], 'day', '[]')
    );

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      case 'pending_cancel': return 'volcano';
      case 'deposit_paid': return 'cyan';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'blue';
      case 'cash': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      case 'pending_cancel': return 'Chờ hủy';
      case 'deposit_paid': return 'Đã đặt cọc';
      default: return status;
    }
  };

  const getPaymentStatusText = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Chuyển khoản';
      case 'cash': return 'Tiền mặt';
      default: return method;
    }
  };

  const columns = [
    {
      title: 'Khách sạn',
      key: 'hotel',
      render: (record: HotelBooking) => (
        <div>
          <div className="font-medium">{record.hotelId?.hotelName || 'N/A'}</div>
          <div className="text-sm text-gray-500">{record.hotelId?.location?.locationName || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: HotelBooking) => (
        <div>
          <div className="font-medium">{record.fullNameUser || 'N/A'}</div>
          <div className="text-sm text-gray-500">{record.email || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Loại phòng',
      key: 'roomType',
      render: (record: HotelBooking) => (
        <div>
          {record.roomBookings?.map((room, index) => (
            <div key={index} className="text-sm">
              {room.roomTypeName} ({room.numberOfRooms} phòng)
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Check-in / Check-out',
      key: 'dates',
      render: (record: HotelBooking) => (
        <div>
          <div className="text-sm">
            <strong>Nhận:</strong> {dayjs(record.checkInDate).format('DD/MM/YYYY')}
          </div>
          <div className="text-sm">
            <strong>Trả:</strong> {dayjs(record.checkOutDate).format('DD/MM/YYYY')}
          </div>
        </div>
      )
    },
    {
      title: 'Số khách',
      dataIndex: 'totalGuests',
      key: 'totalGuests',
      align: 'center' as const
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (amount: number) => (
        <span className="font-medium text-green-600">
          {amount?.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => (
        <Tag color={getPaymentStatusColor(method)}>
          {getPaymentStatusText(method)}
        </Tag>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: HotelBooking) => (
        <Space size="middle" wrap>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => {
              Modal.info({
                title: 'Chi tiết đặt phòng',
                content: (
                  <div className="space-y-2">
                    <p><strong>Mã đặt phòng:</strong> {record._id}</p>
                    <p><strong>Khách sạn:</strong> {record.hotelId?.hotelName}</p>
                    <p><strong>Địa điểm:</strong> {record.hotelId?.location?.locationName}</p>
                    <p><strong>Khách hàng:</strong> {record.fullNameUser}</p>
                    <p><strong>Email:</strong> {record.email}</p>
                    <p><strong>Điện thoại:</strong> {record.phone}</p>
                    <p><strong>Loại phòng:</strong></p>
                    {record.roomBookings?.map((room, index) => (
                      <div key={index} className="ml-4">
                        <p>- {room.roomTypeName}: {room.numberOfRooms} phòng × {room.pricePerNight?.toLocaleString('vi-VN')} VNĐ</p>
                      </div>
                    ))}
                    <p><strong>Số khách:</strong> {record.totalGuests}</p>
                    <p><strong>Số đêm:</strong> {record.numberOfNights}</p>
                    <p><strong>Tổng tiền:</strong> {record.totalPrice?.toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Trạng thái:</strong> {getStatusText(record.payment_status)}</p>
                    <p><strong>Phương thức thanh toán:</strong> {getPaymentStatusText(record.payment_method)}</p>
                  </div>
                ),
                width: 600
              });
            }}
          >
            Chi tiết
          </Button>
          {record.payment_status === 'pending' && (
            <Button 
              type="default"
              icon={<CheckOutlined />} 
              size="small"
              onClick={() => handleConfirmDeposit(record)}
              loading={confirmPaymentMutation.isPending}
            >
              Xác nhận cọc
            </Button>
          )}
          {record.payment_status === 'deposit_paid' && (
            <Button 
              type="default"
              icon={<DollarOutlined />} 
              size="small"
              onClick={() => handleConfirmFullPayment(record)}
              loading={confirmFullPaymentMutation.isPending}
            >
              Xác nhận thanh toán
            </Button>
          )}
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record._id, record.hotelId?.hotelName || 'N/A')}
            loading={deleteMutation.isPending}
          >
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý đặt phòng khách sạn</h1>
            <p className="text-gray-600 mt-1">Danh sách tất cả đặt phòng khách sạn trong hệ thống</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Tìm kiếm theo khách sạn, khách hàng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
          >
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="cancelled">Đã hủy</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="pending_cancel">Chờ hủy</Option>
            <Option value="deposit_paid">Đã đặt cọc</Option>
          </Select>

          <Select
            placeholder="Lọc theo phương thức thanh toán"
            value={paymentFilter}
            onChange={setPaymentFilter}
            allowClear
          >
            <Option value="cash">Tiền mặt</Option>
            <Option value="bank_transfer">Chuyển khoản</Option>
          </Select>

          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            value={dateRange}
            onChange={setDateRange}
            format="DD/MM/YYYY"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đặt phòng`
          }}
          scroll={{ x: 1200 }}
          className="shadow-sm"
        />

        {/* Deposit Confirmation Modal */}
        <DepositConfirmationModal
          visible={depositModalVisible}
          onCancel={() => {
            setDepositModalVisible(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleDepositConfirmation}
          loading={confirmPaymentMutation.isPending}
          bookingInfo={selectedBooking ? {
            id: selectedBooking._id,
            hotelName: selectedBooking.hotelId?.hotelName || 'N/A',
            customerName: selectedBooking.fullNameUser || 'N/A',
            customerEmail: selectedBooking.email || 'N/A',
            customerPhone: selectedBooking.phone || 'N/A',
            totalAmount: selectedBooking.totalPrice || 0,
            depositAmount: Math.floor((selectedBooking.totalPrice || 0) * 0.3), // 30% deposit
            paymentMethod: selectedBooking.payment_method || 'cash'
          } : undefined}
        />

        {/* Full Payment Confirmation Modal */}
        <FullPaymentConfirmationModal
          visible={fullPaymentModalVisible}
          onCancel={() => {
            setFullPaymentModalVisible(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleFullPaymentConfirmation}
          loading={confirmFullPaymentMutation.isPending}
          bookingInfo={selectedBooking ? {
            id: selectedBooking._id,
            hotelName: selectedBooking.hotelId?.hotelName || 'N/A',
            customerName: selectedBooking.fullNameUser || 'N/A',
            customerEmail: selectedBooking.email || 'N/A',
            customerPhone: selectedBooking.phone || 'N/A',
            totalAmount: selectedBooking.totalPrice || 0,
            depositAmount: Math.floor((selectedBooking.totalPrice || 0) * 0.3), // 30% deposit
            remainingAmount: Math.floor((selectedBooking.totalPrice || 0) * 0.7), // 70% remaining
            paymentMethod: selectedBooking.payment_method || 'cash'
          } : undefined}
        />
      </Card>
    </div>
  );
};

export default ListHotelBooking;