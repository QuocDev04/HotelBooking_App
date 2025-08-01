import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Progress, Spin, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axios from '../../configs/axios';
import dayjs from 'dayjs';

const { Title } = Typography;

interface TourStatsData {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  totalBookedSeats: number;
  totalRevenue: number;
  totalDeposit: number;
  totalRefund: number;
}

const TourStats: React.FC = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: TourStatsData }>(
    ['tourStats'],
    async () => {
      const response = await axios.get('/stats');
      return response.data;
    },
    {
      refetchInterval: 60000, // Refresh every minute
      staleTime: 30000, // Consider data fresh for 30 seconds
    }
  );

  const stats = data?.data;

  // Tính tỷ lệ phần trăm
  const upcomingPercent = stats ? Math.round((stats.upcoming / stats.total) * 100) : 0;
  const ongoingPercent = stats ? Math.round((stats.ongoing / stats.total) * 100) : 0;
  const completedPercent = stats ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải dữ liệu</div>;
  }

  return (
    <div className="tour-stats">
      <Title level={4}>Thống kê Tour</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số tour"
              value={stats?.total || 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tour sắp diễn ra"
              value={stats?.upcoming || 0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
            <Progress percent={upcomingPercent} status="active" strokeColor="#3f8600" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tour đang diễn ra"
              value={stats?.ongoing || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalendarOutlined />}
            />
            <Progress percent={ongoingPercent} status="active" strokeColor="#1890ff" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tour đã hoàn thành"
              value={stats?.completed || 0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
            <Progress percent={completedPercent} status="active" strokeColor="#cf1322" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người tham gia"
              value={stats?.totalBookedSeats || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats?.totalRevenue || 0}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng tiền cọc"
              value={stats?.totalDeposit || 0}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng tiền hoàn trả"
              value={stats?.totalRefund || 0}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TourStats;