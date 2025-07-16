import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { instanceAdmin } from '../../configs/axios';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

interface BookingStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  pendingCancel: number;
}

const BookingStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => instanceAdmin.get('/admin/bookings/stats'),
    refetchInterval: 10000, // Cập nhật mỗi 10 giây
    staleTime: 0, // Luôn coi data là stale để cập nhật ngay
    refetchOnWindowFocus: true // Refetch khi focus lại window
  });

  const bookingStats: BookingStats = stats?.data || {
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    pendingCancel: 0
  };

  const getCompletionRate = () => {
    if (bookingStats.total === 0) return 0;
    return Math.round((bookingStats.completed / bookingStats.total) * 100);
  };

  const getCancellationRate = () => {
    if (bookingStats.total === 0) return 0;
    return Math.round((bookingStats.cancelled / bookingStats.total) * 100);
  };

  if (isLoading) {
    return (
      <Card style={{ marginBottom: 24, borderRadius: 16 }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Title level={3} style={{ marginBottom: 24, color: '#1f2937' }}>
        📊 Thống kê đặt chỗ
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title="Tổng đặt chỗ"
              value={bookingStats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              background: 'linear-gradient(135deg, #faad14 0%, #ff7a45 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title="Chờ thanh toán"
              value={bookingStats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title="Đã thanh toán"
              value={bookingStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
              color: 'white',
              borderRadius: 12
            }}
          >
            <Statistic
              title="Đã hủy"
              value={bookingStats.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card size="small" style={{ borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: '#52c41a' }}>
                Tỷ lệ hoàn thành
              </Title>
            </div>
            <Progress
              percent={getCompletionRate()}
              strokeColor={{
                '0%': '#52c41a',
                '100%': '#73d13d',
              }}
              format={(percent) => `${percent}%`}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              {bookingStats.completed} / {bookingStats.total} đặt chỗ đã hoàn thành
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card size="small" style={{ borderRadius: 12 }}>
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, color: '#ff4d4f' }}>
                Tỷ lệ hủy
              </Title>
            </div>
            <Progress
              percent={getCancellationRate()}
              strokeColor={{
                '0%': '#ff4d4f',
                '100%': '#ff7875',
              }}
              format={(percent) => `${percent}%`}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              {bookingStats.cancelled} / {bookingStats.total} đặt chỗ đã hủy
            </div>
          </Card>
        </Col>
      </Row>

      {bookingStats.pendingCancel > 0 && (
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card
              size="small"
              style={{
                background: 'linear-gradient(135deg, #faad14 0%, #ff7a45 100%)',
                color: 'white',
                borderRadius: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Title level={5} style={{ margin: 0, color: 'white' }}>
                    ⚠️ Cần xử lý
                  </Title>
                  <div style={{ fontSize: '14px', marginTop: 4 }}>
                    {bookingStats.pendingCancel} đặt chỗ đang chờ xác nhận hủy
                  </div>
                </div>
                <ExclamationCircleOutlined style={{ fontSize: '24px', color: 'white' }} />
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default BookingStats; 