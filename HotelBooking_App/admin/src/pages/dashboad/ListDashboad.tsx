/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  DatePicker,
  Select,
  Button,
} from 'antd';
import {
  EyeOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import TourRecently from './TourRecently';
import SumTour from './SumTour';
import Overview from './Overview';
import Revenue from './Revenue';
import Popular from './Popular';
import WeeklyStatistics from './WeeklyStatistics';
import NewCustomersData from './NewCustomersData';
import BookingStats from './BookingStats';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ListDashboad = () => {
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(30, 'day'), dayjs()]);
  const [filterType, setFilterType] = useState('all');
  const [showReport, setShowReport] = useState(false);

  const handleViewReport = () => {
    setShowReport(true);
  };

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <Card
        style={{
          marginBottom: 32,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={1} style={{
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              <TrophyOutlined style={{ marginRight: 12, color: '#faad14' }} />
              Dashboard Analytics
            </Title>
            <Text style={{
              fontSize: '1.1rem',
              color: '#666',
              marginTop: 8,
              display: 'block'
            }}>
              📊 Tổng quan chi tiết về hoạt động kinh doanh và hiệu suất hệ thống
            </Text>
          </Col>
          <Col>
            <Space size="large">
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{
                  width: 160,
                  borderRadius: 8
                }}
                options={[
                  { value: 'all', label: '🎯 Tất cả dịch vụ' },
                  { value: 'hotel', label: '🏨 Khách sạn' },
                  { value: 'tour', label: '🚌 Tour du lịch' },
                ]}
              />
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="large"
                onClick={handleViewReport}
                style={{
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
              >
                📈 Xem báo cáo
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {showReport && (
        <>
          {/* Nếu chọn Tour */}
          {filterType === 'tour' && (
            <>
              {/* Thống kê đặt chỗ */}
              <BookingStats />

              {/* Biểu đồ doanh thu và tour đặt nhiều nhất với glassmorphism */}
              <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Revenue />
                <WeeklyStatistics />
              </Row>

              {/* Biểu đồ đặt tour theo tuần và khách hàng mới với glassmorphism */}
              <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Popular />
                <NewCustomersData />
              </Row>

              {/* Thống kê tổng tour đã đặt day month */}
              <SumTour />

              {/* Bảng thống kê đặt tour gần đây */}
              <TourRecently />
            </>
          )}

          {/* Nếu chọn Hotel */}
          {filterType === 'hotel' && (
            <>
              {/* Ở đây bạn thay bằng các component liên quan khách sạn */}
              <BookingStats />
              <Revenue />
              <NewCustomersData />
            </>
          )}

          {/* Nếu chọn All */}
          {filterType === 'all' && (
            <>
              {/* Thống kê tổng quan với gradient cards */}
              <Overview />

              {/* Thống kê đặt chỗ */}
              <BookingStats />

              {/* Biểu đồ doanh thu và tour đặt nhiều nhất với glassmorphism */}
              <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Revenue />
                <WeeklyStatistics />
              </Row>

              {/* Biểu đồ đặt tour theo tuần và khách hàng mới với glassmorphism */}
              <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Popular />
                <NewCustomersData />
              </Row>

              {/* Thống kê tổng tour đã đặt day month */}
              <SumTour />

              {/* Bảng thống kê đặt tour gần đây */}
              <TourRecently />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ListDashboad;
