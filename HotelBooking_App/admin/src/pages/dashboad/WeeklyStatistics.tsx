/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Space, Typography } from "antd";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import instance from "../../configs/axios";

const WeeklyStatistics = () => {
    const { Text } = Typography;

    const { data: weeklyBookingData } = useQuery({
        queryKey: ["weeklyRevenue"],
        queryFn: () => instance.get("/admin/bookings/revenue?groupBy=week"),
    });

    console.log("Weekly revenue data:", weeklyBookingData?.data?.data.revenueByPeriod);

    const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7','CN'];

    const revenueData = weeklyBookingData?.data?.data || {};
    const weeklyData = revenueData.revenueByPeriod || [];

    // Tính tuần hiện tại của năm
    const now = new Date();
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const currentWeekNumber = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);

    // Lấy dữ liệu tuần hiện tại
    const currentWeekData = weeklyData.find(item => 
        item._id.year === now.getFullYear() && item._id.week === currentWeekNumber
    ) || { bookings: 0, revenue: 0 };

    // Tạo dữ liệu cho 7 ngày trong tuần từ dữ liệu tuần hiện tại
    const chartData = daysOfWeek.map(day => ({
        day,
        bookings: Math.floor(currentWeekData.bookings / 7),
        revenue: Math.floor(currentWeekData.revenue / 7)
    }));

    const customTicks = [10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000];

    return (
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
                            yAxisId="left"
                            orientation="left"
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#d9d9d9' }}
                            label={{ value: 'Số tour', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            ticks={customTicks}
                            tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                            tick={{ fill: "#666", fontSize: 12 }}
                            axisLine={{ stroke: "#d9d9d9" }}
                            domain={[0, 50_000_000]}
                            label={{ value: 'Doanh thu (VNĐ)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip
                            formatter={(value: any, name: any) => [
                                name === 'bookings' ? `${value} tour` : `${(value / 1_000_000).toFixed(1)}M VNĐ`,
                                name === 'bookings' ? 'Số tour đặt' : 'Doanh thu'
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
                            yAxisId="left"
                            dataKey="bookings"
                            name="Số tour đặt"
                            fill="url(#barGradient1)"
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="revenue"
                            name="Doanh thu"
                            fill="url(#barGradient2)"
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
    );
}

export default WeeklyStatistics;
