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
  // Thêm các trường mới từ dữ liệu hủy tour
  cancelledAt?: string;
  cancelReason?: string;
  cancelRequestedAt?: string;
  isDeposit?: boolean;
  isFullyPaid?: boolean;
  createdAt: string;
  updatedAt: string;
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

// Hàm tính toán chính sách hoàn tiền dựa trên ngày hủy và ngày khởi hành
const calculateRefundPolicy = (cancelDate: string, departureDate: string, depositAmount: number) => {
  const cancelDay = dayjs(cancelDate);
  const departureDay = dayjs(departureDate);
  const daysUntilDeparture = departureDay.diff(cancelDay, 'day');
  
  let refundPercentage = 0;
  let policyText = '';
  
  if (daysUntilDeparture > 30) {
    refundPercentage = 100;
    policyText = 'Hoàn 100% tiền cọc (hủy trước >30 ngày)';
  } else if (daysUntilDeparture >= 15) {
    refundPercentage = 70;
    policyText = 'Hoàn 70% tiền cọc (hủy trước 15-30 ngày)';
  } else if (daysUntilDeparture >= 7) {
    refundPercentage = 50;
    policyText = 'Hoàn 50% tiền cọc (hủy trước 7-14 ngày)';
  } else if (daysUntilDeparture >= 4) {
    refundPercentage = 30;
    policyText = 'Hoàn 30% tiền cọc (hủy trước 4-6 ngày)';
  } else {
    refundPercentage = 0;
    policyText = 'Không hoàn tiền (hủy trước <4 ngày)';
  }
  
  const calculatedRefund = Math.round(depositAmount * refundPercentage / 100);
  
  return {
    daysUntilDeparture,
    refundPercentage,
    policyText,
    calculatedRefund
  };
};

const RefundManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Lấy danh sách hoàn tiền
  const { data: refundList, isLoading: isLoadingRefunds } = useQuery<{ success: boolean; data: Booking[] }>({
    queryKey: ['refunds', selectedStatus],
    queryFn: async () => {
      const params = selectedStatus ? { status: selectedStatus } : {};
      const response = await axios.get('/admin/refunds', { params });
      return response.data;
    }
  });

  // Lấy thống kê hoàn tiền
  const { data: refundStats, isLoading: isLoadingStats } = useQuery<{ success: boolean; data: RefundStats }>({
    queryKey: ['refundStats'],
    queryFn: async () => {
      const response = await axios.get('/admin/refunds/stats');
      return response.data;
    }
  });

  // Mutation để cập nhật trạng thái hoàn tiền
  const updateRefundMutation = useMutation({
    mutationFn: async ({ bookingId, data }: { bookingId: string; data: any }) => {
      return axios.put(`/admin/refunds/${bookingId}`, data);
    },
    onSuccess: () => {
      message.success('Cập nhật trạng thái hoàn tiền thành công');
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refundStats'] });
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

  // Hàm tính chính sách hoàn tiền dựa trên ngày hủy
  const calculateRefundPolicy = (cancelDate: string, tourDate: string, depositAmount: number) => {
    const cancelDateTime = new Date(cancelDate);
    const tourDateTime = new Date(tourDate);
    const daysUntilDeparture = Math.ceil((tourDateTime.getTime() - cancelDateTime.getTime()) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    let policyText = "";
    
    if (daysUntilDeparture > 30) {
      refundPercentage = 100;
      policyText = "Hoàn 100% (>30 ngày)";
    } else if (daysUntilDeparture >= 15) {
      refundPercentage = 70;
      policyText = "Hoàn 70% (15-30 ngày)";
    } else if (daysUntilDeparture >= 7) {
      refundPercentage = 50;
      policyText = "Hoàn 50% (7-14 ngày)";
    } else if (daysUntilDeparture >= 4) {
      refundPercentage = 30;
      policyText = "Hoàn 30% (4-6 ngày)";
    } else {
      refundPercentage = 0;
      policyText = "Không hoàn tiền (<4 ngày)";
    }
    
    const calculatedRefund = (depositAmount * refundPercentage) / 100;
    
    return {
      daysUntilDeparture,
      refundPercentage,
      policyText,
      calculatedRefund
    };
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: ['userId', 'name'],
      key: 'userName',
      render: (text: string, record: Booking) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.userId.name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.userId.email}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.userId.phone}</div>
        </div>
      ),
    },
    {
      title: 'Tour & Thông tin đặt chỗ',
      dataIndex: ['slotId', 'tour', 'nameTour'],
      key: 'tourName',
      render: (text: string, record: Booking) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.slotId.tour.nameTour}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.slotId.tour.departure} → {record.slotId.tour.destination}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Ngày khởi hành: {dayjs(record.slotId.dateTour).format('DD/MM/YYYY')}
          </div>
          <div style={{ fontSize: '12px', color: record.isDeposit ? '#1890ff' : '#888' }}>
            {record.isDeposit ? `Đã đặt cọc: ${record.depositAmount?.toLocaleString()} VNĐ` : 'Chưa thanh toán'}
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin hủy tour',
      key: 'cancellationInfo',
      render: (text: string, record: Booking) => {
        const cancelDate = record.cancelledAt || record.cancellation_date;
        return (
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <strong>Ngày hủy:</strong> {dayjs(cancelDate).format('DD/MM/YYYY HH:mm')}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              <strong>Lý do:</strong> {record.cancelReason || record.cancellation_reason || 'Không có lý do'}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Chính sách hoàn tiền',
      key: 'refundPolicy',
      render: (text: string, record: Booking) => {
        const cancelDate = record.cancelledAt || record.cancellation_date;
        const depositAmount = record.depositAmount || 0;
        
        if (!cancelDate || !record.slotId.dateTour || !depositAmount) {
          return <span style={{ color: '#999' }}>Không đủ thông tin</span>;
        }
        
        const policy = calculateRefundPolicy(cancelDate, record.slotId.dateTour, depositAmount);
        
        return (
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <strong>Số ngày trước tour:</strong> {policy.daysUntilDeparture} ngày
            </div>
            <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '2px' }}>
              <strong>Chính sách:</strong> {policy.policyText}
            </div>
            <div style={{ fontSize: '12px', color: '#52c41a', marginTop: '2px' }}>
              <strong>Số tiền tính toán:</strong> {policy.calculatedRefund.toLocaleString()} VNĐ
            </div>
          </div>
        );
      },
    },
    {
      title: 'Số tiền hoàn trả thực tế',
      dataIndex: 'refund_amount',
      key: 'refundAmount',
      render: (amount: number, record: Booking) => {
        const cancelDate = record.cancelledAt || record.cancellation_date;
        const depositAmount = record.depositAmount || 0;
        
        let calculatedAmount = 0;
        if (cancelDate && record.slotId.dateTour && depositAmount) {
          const policy = calculateRefundPolicy(cancelDate, record.slotId.dateTour, depositAmount);
          calculatedAmount = policy.calculatedRefund;
        }
        
        const isDifferent = Math.abs(amount - calculatedAmount) > 1000; // Chênh lệch > 1000 VNĐ
        
        return (
          <div>
            <div style={{ 
              color: isDifferent ? '#ff4d4f' : '#1890ff', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {amount.toLocaleString()} VNĐ
            </div>
            {isDifferent && (
              <div style={{ fontSize: '10px', color: '#ff4d4f' }}>
                ⚠️ Khác với chính sách
              </div>
            )}
          </div>
        );
      },
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
        width={800}
      >
        {selectedBooking && (
          <div>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
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
                </Col>
              </Row>

              <Form.Item name="refund_note" label="Ghi chú">
                <TextArea rows={3} placeholder="Nhập ghi chú về việc hoàn tiền..." />
              </Form.Item>
            </Form>

            {/* Thông tin chi tiết */}
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card size="small" title="Thông tin khách hàng" style={{ marginBottom: 16 }}>
                  <p><strong>Tên:</strong> {selectedBooking.userId.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.userId.email}</p>
                  <p><strong>Số điện thoại:</strong> {selectedBooking.userId.phone}</p>
                </Card>

                <Card size="small" title="Thông tin tour">
                  <p><strong>Tour:</strong> {selectedBooking.slotId.tour.nameTour}</p>
                  <p><strong>Tuyến:</strong> {selectedBooking.slotId.tour.departure} → {selectedBooking.slotId.tour.destination}</p>
                  <p><strong>Ngày khởi hành:</strong> {dayjs(selectedBooking.slotId.dateTour).format('DD/MM/YYYY')}</p>
                  <p><strong>Tổng giá tour:</strong> {selectedBooking.totalPriceTour.toLocaleString()} VNĐ</p>
                  {selectedBooking.isDeposit && (
                    <p><strong>Số tiền đặt cọc:</strong> {selectedBooking.depositAmount?.toLocaleString()} VNĐ</p>
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <Card size="small" title="Thông tin hủy tour">
                  <p><strong>Ngày hủy:</strong> {dayjs(selectedBooking.cancelledAt || selectedBooking.cancellation_date).format('DD/MM/YYYY HH:mm')}</p>
                  <p><strong>Lý do hủy:</strong> {selectedBooking.cancelReason || selectedBooking.cancellation_reason || 'Không có lý do'}</p>
                </Card>

                {(() => {
                  const cancelDate = selectedBooking.cancelledAt || selectedBooking.cancellation_date;
                  const depositAmount = selectedBooking.depositAmount || 0;
                  
                  if (!cancelDate || !selectedBooking.slotId.dateTour || !depositAmount) {
                    return (
                      <Card size="small" title="Chính sách hoàn tiền" style={{ marginTop: 16 }}>
                        <p style={{ color: '#999' }}>Không đủ thông tin để tính toán chính sách hoàn tiền</p>
                      </Card>
                    );
                  }
                  
                  const policy = calculateRefundPolicy(cancelDate, selectedBooking.slotId.dateTour, depositAmount);
                  const isDifferent = Math.abs(selectedBooking.refund_amount - policy.calculatedRefund) > 1000;
                  
                  return (
                    <Card size="small" title="Chính sách hoàn tiền" style={{ marginTop: 16 }}>
                      <p><strong>Số ngày trước tour:</strong> {policy.daysUntilDeparture} ngày</p>
                      <p><strong>Chính sách áp dụng:</strong> <span style={{ color: '#1890ff' }}>{policy.policyText}</span></p>
                      <p><strong>Số tiền theo chính sách:</strong> <span style={{ color: '#52c41a' }}>{policy.calculatedRefund.toLocaleString()} VNĐ</span></p>
                      <p><strong>Số tiền hoàn trả thực tế:</strong> 
                        <span style={{ color: isDifferent ? '#ff4d4f' : '#1890ff', fontWeight: 'bold' }}>
                          {selectedBooking.refund_amount.toLocaleString()} VNĐ
                        </span>
                      </p>
                      {isDifferent && (
                        <div style={{ 
                          background: '#fff2f0', 
                          border: '1px solid #ffccc7', 
                          borderRadius: '4px', 
                          padding: '8px', 
                          marginTop: '8px'
                        }}>
                          <span style={{ color: '#ff4d4f' }}>⚠️ Số tiền hoàn trả khác với chính sách tiêu chuẩn</span>
                        </div>
                      )}
                    </Card>
                  );
                })()}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RefundManagement;