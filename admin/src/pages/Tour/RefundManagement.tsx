import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Modal, Form, Select, Input, message, Row, Col, Statistic, Typography } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../configs/axios';
import dayjs from 'dayjs';
import { DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface TourInfo {
  nameTour: string;
  destination: string;
  departure: string;
}

interface SlotInfo {
  _id: string;
  dateTour: string;
  tour: TourInfo;
}

interface Booking {
  _id: string;
  userId: User;
  slotId: SlotInfo;
  totalPriceTour: number;
  depositAmount: number;
  payment_status: string;
  payment_method: string;
  cancellation_date: string;
  cancellation_reason: string;
  refund_amount: number;
  refund_status: string | null;
  refund_method: string | null;
  refund_date: string | null;
  refund_note: string | null;
}

interface RefundStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  totalAmount: number;
  pendingAmount: number;
  processingAmount: number;
  completedAmount: number;
}

const RefundManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Lấy danh sách hoàn tiền
  const { data: refundList, isLoading: isLoadingRefunds } = useQuery<{ success: boolean; data: Booking[] }>(
    ['refunds', selectedStatus],
    async () => {
      const params = selectedStatus ? { status: selectedStatus } : {};
      const response = await axios.get('/admin/refunds', { params });
      return response.data;
    }
  );

  // Lấy thống kê hoàn tiền
  const { data: refundStats, isLoading: isLoadingStats } = useQuery<{ success: boolean; data: RefundStats }>(
    ['refundStats'],
    async () => {
      const response = await axios.get('/admin/refunds/stats');
      return response.data;
    }
  );

  // Mutation để cập nhật trạng thái hoàn tiền
  const updateRefundMutation = useMutation(
    async ({ bookingId, data }: { bookingId: string; data: any }) => {
      return axios.put(`/admin/refunds/${bookingId}`, data);
    },
    {
      onSuccess: () => {
        message.success('Cập nhật trạng thái hoàn tiền thành công');
        queryClient.invalidateQueries(['refunds']);
        queryClient.invalidateQueries(['refundStats']);
        setIsModalVisible(false);
        form.resetFields();
      },
      onError: (error: any) => {
        message.error(`Lỗi: ${error.response?.data?.message || 'Không thể cập nhật trạng thái hoàn tiền'}`);
      },
    }
  );

  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(value);
  };

  const showUpdateModal = (booking: Booking) => {
    setSelectedBooking(booking);
    form.setFieldsValue({
      refund_status: booking.refund_status || 'pending',
      refund_method: booking.refund_method || '',
      refund_note: booking.refund_note || '',
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (selectedBooking) {
        updateRefundMutation.mutate({
          bookingId: selectedBooking._id,
          data: values,
        });
      }
    });
  };

  const getStatusTag = (status: string | null) => {
    switch (status) {
      case 'pending':
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Đang chờ</Tag>;
      case 'processing':
        return <Tag color="blue" icon={<ExclamationCircleOutlined />}>Đang xử lý</Tag>;
      case 'completed':
        return <Tag color="green" icon={<CheckCircleOutlined />}>Đã hoàn tiền</Tag>;
      default:
        return <Tag color="default">Chưa có trạng thái</Tag>;
    }
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: ['userId', 'name'],
      key: 'userName',
      render: (text: string, record: Booking) => (
        <div>
          <div>{record.userId.name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.userId.email}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.userId.phone}</div>
        </div>
      ),
    },
    {
      title: 'Tour',
      dataIndex: ['slotId', 'tour', 'nameTour'],
      key: 'tourName',
      render: (text: string, record: Booking) => (
        <div>
          <div>{record.slotId.tour.nameTour}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.slotId.tour.departure} - {record.slotId.tour.destination}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Ngày khởi hành: {dayjs(record.slotId.dateTour).format('DD/MM/YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày hủy',
      dataIndex: 'cancellation_date',
      key: 'cancellationDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Lý do hủy',
      dataIndex: 'cancellation_reason',
      key: 'cancellationReason',
      ellipsis: true,
    },
    {
      title: 'Số tiền hoàn trả',
      dataIndex: 'refund_amount',
      key: 'refundAmount',
      render: (amount: number) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {amount.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'refund_status',
      key: 'refundStatus',
      render: (status: string | null) => getStatusTag(status),
    },
    {
      title: 'Phương thức',
      dataIndex: 'refund_method',
      key: 'refundMethod',
      render: (method: string | null) => method || 'Chưa xác định',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: Booking) => (
        <Button 
          type="primary" 
          onClick={() => showUpdateModal(record)}
          disabled={record.refund_status === 'completed'}
        >
          Cập nhật
        </Button>
      ),
    },
  ];

  const stats = refundStats?.data;

  return (
    <div className="refund-management">
      <Title level={4}>Quản lý hoàn tiền</Title>
      
      {/* Thống kê hoàn tiền */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số yêu cầu hoàn tiền"
              value={stats?.total || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ xử lý"
              value={stats?.pending || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
              suffix={stats?.pendingAmount ? `(${stats.pendingAmount.toLocaleString()} VNĐ)` : ''}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats?.processing || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ExclamationCircleOutlined />}
              suffix={stats?.processingAmount ? `(${stats.processingAmount.toLocaleString()} VNĐ)` : ''}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã hoàn tiền"
              value={stats?.completed || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              suffix={stats?.completedAmount ? `(${stats.completedAmount.toLocaleString()} VNĐ)` : ''}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>Lọc theo trạng thái:</span>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn trạng thái"
            allowClear
            onChange={handleStatusChange}
            value={selectedStatus}
          >
            <Option value="pending">Đang chờ</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="completed">Đã hoàn tiền</Option>
          </Select>
        </Space>
      </div>

      {/* Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={refundList?.data}
        rowKey="_id"
        loading={isLoadingRefunds}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái hoàn tiền"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={updateRefundMutation.isLoading}
      >
        {selectedBooking && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="refund_status"
              label="Trạng thái hoàn tiền"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Option value="pending">Đang chờ</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="completed">Đã hoàn tiền</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="refund_method"
              label="Phương thức hoàn tiền"
              rules={[{ required: true, message: 'Vui lòng chọn phương thức hoàn tiền' }]}
            >
              <Select>
                <Option value="cash">Tiền mặt</Option>
                <Option value="bank_transfer">Chuyển khoản</Option>
              </Select>
            </Form.Item>

            <Form.Item name="refund_note" label="Ghi chú">
              <TextArea rows={4} />
            </Form.Item>

            <div style={{ marginBottom: 16 }}>
              <strong>Thông tin khách hàng:</strong>
              <p>Tên: {selectedBooking.userId.name}</p>
              <p>Email: {selectedBooking.userId.email}</p>
              <p>Số điện thoại: {selectedBooking.userId.phone}</p>
            </div>

            <div>
              <strong>Thông tin hoàn tiền:</strong>
              <p>Số tiền hoàn trả: {selectedBooking.refund_amount.toLocaleString()} VNĐ</p>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default RefundManagement;