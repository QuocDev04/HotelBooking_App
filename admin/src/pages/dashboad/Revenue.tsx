/* eslint-disable @typescript-eslint/no-explicit-any */
import { DollarOutlined } from "@ant-design/icons";
import { Card, Col, Space, Typography } from "antd";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import instance from "../../configs/axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const Revenue = () => {
    const { Text } = Typography;

    const { data: revenueChartData } = useQuery({
        queryKey: ["checkOutBookingTour"],
        queryFn: () => instance.get("/checkOutBookingTour"),
    });

    const rawData = revenueChartData?.data?.getCheckOutUserTour || [];

    const getAllMonths = () => {
        return Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
    };

    const groupedData = () => {
        const mapMonthToAmount: Record<string, number> = {};

        rawData.forEach((item: any) => {
            const monthNumber = dayjs(item.payment_date || item.createdAt).month() + 1;
            const monthKey = `Tháng ${monthNumber}`;
            mapMonthToAmount[monthKey] = (mapMonthToAmount[monthKey] || 0) + (item.amount || 0);
        });

        return getAllMonths().map((month) => ({
            month,
            "Số Tiền": mapMonthToAmount[month] || 0,
        }));
    };

    const chartData = groupedData();

    const totalRevenue = rawData.reduce(
        (acc: number, cur: any) => acc + (cur.amount || 0),
        0
    );
    const customTicks = [10_000_000, 20_000_000, 30_000_000, 40_000_000, 50_000_000];
    return (
        <>

            <Col xs={24} lg={12}>
                <Card
                    style={{
                        borderRadius: 16,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                    }}
                    title={
                        <Space >
                            <Space>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <DollarOutlined style={{ fontSize: 20, color: "white" }} />
                                </div>
                                <Text strong style={{ fontSize: 18 }}>
                                    📈 Doanh thu theo tháng
                                </Text>
                            </Space>
                            <Text style={{ fontSize: 16, color: "#333" }}>
                                Tổng doanh thu: {(totalRevenue / 1_000_000).toFixed(1)}M VNĐ
                            </Text>
                        </Space>
                    }
                >
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: "#666", fontSize: 12 }}
                                axisLine={{ stroke: "#d9d9d9" }}
                            />
                            <YAxis
                                ticks={customTicks}
                                tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                                tick={{ fill: "#666", fontSize: 12 }}
                                axisLine={{ stroke: "#d9d9d9" }}
                                domain={[0, 50_000_000]} 
                            />
                            <Tooltip
                                formatter={(value: any) => [
                                    `${(value / 1_000_000).toFixed(1)}M VNĐ`,
                                    "Doanh thu",
                                ]}
                                labelFormatter={(label) => label}
                                contentStyle={{
                                    borderRadius: 8,
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(10px)",
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Số Tiền"
                                stroke="url(#gradient)"
                                strokeWidth={4}
                                dot={{
                                    fill: "#f093fb",
                                    strokeWidth: 3,
                                    r: 6,
                                    stroke: "#fff",
                                }}
                                activeDot={{
                                    r: 8,
                                    stroke: "#fff",
                                    strokeWidth: 3,
                                }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f093fb" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f5576c" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Col>
        </>
    );
};

export default Revenue;
