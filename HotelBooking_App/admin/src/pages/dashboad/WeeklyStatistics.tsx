/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Space, Typography } from "antd"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import instance from "../../configs/axios";
import dayjs from "dayjs";

const WeeklyStatistics = () => {
    const { Text } = Typography;
    const { data: weeklyBookingData } = useQuery({
        queryKey: ["checkOutBookingTour"],
        queryFn: () => instance.get("/checkOutBookingTour"),
    });

    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const weeklyBookingDataRaw = weeklyBookingData?.data?.getCheckOutUserTour || [];

    const groupedData = weeklyBookingDataRaw.reduce((acc: any, booking: any) => {
        const dayIndex = dayjs(booking.BookingTourId?.createdAt).day(); 
        const dayName = daysOfWeek[dayIndex];

        if (!acc[dayName]) {
            acc[dayName] = { day: dayName, bookings: 0, revenue: 0 };
        }

        acc[dayName].bookings += 1;
        acc[dayName].revenue += booking.amount;

        return acc;
    }, {});

    const chartData = daysOfWeek.map(day => groupedData[day] || { day, bookings: 0, revenue: 0 });
    const customTicks = [10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000];

  return (
    <>
          <Col xs={24} lg={12}>
              <Card
                  style={{
                      borderRadius: 16,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)'
                  }}
                  title={
                      <Space>
                          <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}>
                              <CalendarOutlined style={{ fontSize: 20, color: 'white' }} />
                          </div>
                          <Text strong style={{ fontSize: 18 }}>📅 Đặt tour theo ngày trong tuần</Text>
                      </Space>
                  }
              >
                  <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                              dataKey="day"
                              tick={{ fill: '#666', fontSize: 12 }}
                              axisLine={{ stroke: '#d9d9d9' }}
                          />
                          <YAxis
                              ticks={customTicks}
                              tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                              tick={{ fill: "#666", fontSize: 12 }}
                              axisLine={{ stroke: "#d9d9d9" }}
                              domain={[0, 50_000_000]}
                          />
                          <Tooltip
                              formatter={(value: any, name: any) => [
                                  name === 'Tổng số tour đã đặt trong 1 ngày' ? `${value} đặt tour` : `${(value / 1000000).toFixed(1)}M VNĐ`,
                                  name === 'Tổng số tour đã đặt trong 1 ngày' ? 'Số đặt tour' : 'Doanh thu'
                              ]}
                              contentStyle={{
                                  borderRadius: 8,
                                  border: 'none',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(10px)'
                              }}
                          />
                          <Legend />
                          <Bar
                              dataKey="bookings"
                              name="Tổng số tour đã đặt trong 1 ngày"
                              fill="blue"
                              radius={[6, 6, 0, 0]}
                          />
                          <Bar
                              dataKey="revenue"
                              name="Tổng số doanh thu trong 1 ngày"
                              fill="red"
                              radius={[6, 6, 0, 0]}
                          />
                          <defs>
                              <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#43e97b" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#38f9d7" stopOpacity={0.8} />
                              </linearGradient>
                              <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.8} />
                              </linearGradient>
                          </defs>
                      </BarChart>
                  </ResponsiveContainer>
              </Card>
          </Col>
    </>
  )
}

export default WeeklyStatistics
