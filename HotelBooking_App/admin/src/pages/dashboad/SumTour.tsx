/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Space, Typography, Spin } from "antd";
import instance from "../../configs/axios";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const SumTour = () => {
    const { Text } = Typography;

    const { data, isLoading } = useQuery({
        queryKey: ["checkOutBookingTour"],
        queryFn: () => instance.get("/checkOutBookingTour"),
    });
    
    const bookings = data?.data?.getCheckOutUserTour || [];

    // Lấy ngày hiện tại
    const today = dayjs();
    const startOfWeek = dayjs().startOf("week");
    const endOfWeek = dayjs().endOf("week");
    const startOfMonth = dayjs().startOf("month");
    const endOfMonth = dayjs().endOf("month");

    // Lọc theo từng mốc thời gian
    const todayCount = bookings.filter((item: any) =>
        dayjs(item.BookingTourId?.createdAt).isSame(today, "day")
    ).length;

    const weekCount = bookings.filter((item: any) => {
        const date = dayjs(item.BookingTourId?.createdAt);
        return date.isBetween(startOfWeek, endOfWeek, null, "[]");
    }).length;

    const monthCount = bookings.filter((item: any) => {
        const date = dayjs(item.BookingTourId?.createdAt);
        return date.isBetween(startOfMonth, endOfMonth, null, "[]");
    }).length;

    return (
        <div>
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} lg={24}>
                    <Card
                        style={{
                            borderRadius: 16,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(10px)",
                        }}
                        title={
                            <Space>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background:
                                            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CalendarOutlined style={{ fontSize: 20, color: "white" }} />
                                </div>
                                <Text strong style={{ fontSize: 18 }}>
                                    Tổng tour đã đặt
                                </Text>
                            </Space>
                        }
                    >
                        {isLoading ? (
                            <Spin />
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 20px",
                                    background:
                                        "linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)",
                                    borderRadius: 12,
                                    margin: "16px 0",
                                }}
                            >
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background:
                                            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 24px",
                                        boxShadow: "0 8px 25px rgba(79, 172, 254, 0.3)",
                                    }}
                                >
                                    <CalendarOutlined style={{ fontSize: 36, color: "white" }} />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        marginTop: 24,
                                    }}
                                >
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 700,
                                                color: "#4facfe",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {todayCount}
                                        </div>
                                        <Text style={{ color: "#666", fontSize: 14 }}>Hôm nay</Text>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 700,
                                                color: "#00f2fe",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {weekCount}
                                        </div>
                                        <Text style={{ color: "#666", fontSize: 14 }}>
                                            Tuần này
                                        </Text>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 700,
                                                color: "#667eea",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {monthCount}
                                        </div>
                                        <Text style={{ color: "#666", fontSize: 14 }}>
                                            Tháng này
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SumTour;
