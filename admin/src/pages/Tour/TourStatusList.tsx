import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Tag, Button, Space, Typography, Image, Badge, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from '../../configs/axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface Tour {
  _id: string;
  tour: {
    _id: string;
    nameTour: string;
    destination: string;
    departure: string;
    imagesTour: string[];
    durationTour: number;
    priceTour: number;
    maxPeople: number;
    tourType: string;
    transport: string;
  };
  dateTour: string;
  availableSeats: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  bookedSeats: number;
  totalRevenue: number;
  depositAmount: number;
  refundAmount: number;
}

const TourStatusList: React.FC = () => {
  const [status, setStatus] = useState<string>('all');

  const { data, isLoading, refetch } = useQuery<{ success: boolean; data: Tour[] }>(
    ['tours', status],
    async () => {
      const response = await axios.get(`/date/status/${status}`);
      return response.data;
    }
  );

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Tag color="green">Sắp diễn ra</Tag>;
      case 'ongoing':
        return <Tag color="blue">Đang diễn ra</Tag>;
      case 'completed':
        return <Tag color="red">Đã hoàn thành</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  const columns = [
    {
      title: 'Tên Tour',
      dataIndex: ['tour', 'nameTour'],
      key: 'nameTour',
      render: (text: string, record: Tour) => (
        <Space>
          <Image 
            width={50} 
            src={record.tour.imagesTour[0]} 
            preview={false} 
            style={{ borderRadius: '5px' }} 
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Điểm đến',
      dataIndex: ['tour', 'destination'],
      key: 'destination',
    },
    {
      title: 'Ngày khởi hành',
      dataIndex: 'dateTour',
      key: 'dateTour',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Số chỗ còn trống',
      key: 'availableSeats',
      render: (text: string, record: Tour) => (
        <Badge 
          count={record.availableSeats} 
          showZero 
          style={{ 
            backgroundColor: record.availableSeats > 0 ? '#52c41a' : '#f5222d',
            fontSize: '12px',
            padding: '0 8px'
          }} 
        />
      ),
    },
    {
      title: 'Số người đã đặt',
      dataIndex: 'bookedSeats',
      key: 'bookedSeats',
      render: (bookedSeats: number) => (
        <Space>
          <TeamOutlined />
          <span>{bookedSeats}</span>
        </Space>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (totalRevenue: number) => (
        <Space>
          <DollarOutlined />
          <span>{totalRevenue.toLocaleString()} VNĐ</span>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: string, record: Tour) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Link to={`/tour/${record.tour._id}`}>
              <Button type="primary" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Xem danh sách đặt chỗ">
            <Link to={`/tour/bookings/${record._id}`}>
              <Button type="default" icon={<TeamOutlined />} size="small" />
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4}>Danh sách Tour theo trạng thái</Title>
          <Select 
            defaultValue="all" 
            style={{ width: 200 }} 
            onChange={handleStatusChange}
            value={status}
          >
            <Option value="all">Tất cả</Option>
            <Option value="upcoming">Sắp diễn ra</Option>
            <Option value="ongoing">Đang diễn ra</Option>
            <Option value="completed">Đã hoàn thành</Option>
          </Select>
        </Space>
        
        <Table 
          columns={columns} 
          dataSource={data?.data} 
          rowKey="_id" 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </Card>
  );
};

export default TourStatusList;