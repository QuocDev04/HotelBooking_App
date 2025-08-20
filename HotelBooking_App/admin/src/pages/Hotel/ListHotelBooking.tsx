import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Input, Card, Tag, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface HotelBooking {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
    city: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

const ListHotelBooking: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const queryClient = useQueryClient();

  // Fetch hotel bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['hotel-bookings'],
    queryFn: async () => {
      const response = await fetch('/api/hotel-bookings');
      if (!response.ok) throw new Error('Failed to fetch hotel bookings');
      return response.json();
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

  const filteredBookings = bookings.filter((booking: HotelBooking) => {
    const matchesSearch = 
      booking.hotelId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.userId?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.roomType?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesPayment = !paymentFilter || booking.paymentStatus === paymentFilter;
    
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
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'refunded': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'Khách sạn',
      key: 'hotel',
      render: (record: HotelBooking) => (
        <div>
          <div className="font-medium">{record.hotelId?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{record.hotelId?.city || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: HotelBooking) => (
        <div>
          <div className="font-medium">{record.userId?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{record.userId?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType'
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
      dataIndex: 'guests',
      key: 'guests',
      align: 'center' as const
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="font-medium text-green-600">
          {amount?.toLocaleString('vi-VN')} VNĐ
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>
          {getPaymentStatusText(status)}
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
        <Space size="middle">
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
                    <p><strong>Khách sạn:</strong> {record.hotelId?.name}</p>
                    <p><strong>Khách hàng:</strong> {record.userId?.name}</p>
                    <p><strong>Email:</strong> {record.userId?.email}</p>
                    <p><strong>Loại phòng:</strong> {record.roomType}</p>
                    <p><strong>Số khách:</strong> {record.guests}</p>
                    <p><strong>Tổng tiền:</strong> {record.totalAmount?.toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Trạng thái:</strong> {getStatusText(record.status)}</p>
                    <p><strong>Thanh toán:</strong> {getPaymentStatusText(record.paymentStatus)}</p>
                  </div>
                ),
                width: 600
              });
            }}
          >
            Chi tiết
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record._id, record.hotelId?.name || 'N/A')}
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
          </Select>

          <Select
            placeholder="Lọc theo thanh toán"
            value={paymentFilter}
            onChange={setPaymentFilter}
            allowClear
          >
            <Option value="pending">Chờ thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="refunded">Đã hoàn tiền</Option>
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
      </Card>
    </div>
  );
};

export default ListHotelBooking;