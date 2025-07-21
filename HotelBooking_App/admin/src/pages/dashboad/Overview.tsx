/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DollarOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import instance from "../../configs/axios";

const Overview = () => {

    const {
        data: bookingRes,
        isLoading: bookingLoading,
        isError: bookingError,
    } = useQuery({
        queryKey: ["admin/bookings"],
        queryFn: () => instance.get("/admin/bookings")
    });
console.log(bookingRes);

    const {
        data: userRes,
        isLoading: userLoading,
        isError: userError,
    } = useQuery({
        queryKey: ["user"],
        queryFn: () => instance.get("/user")
    });

    if (bookingLoading || userLoading) return <Spin size="large" />;
    if (bookingError || userError) return <div>Đã có lỗi xảy ra…</div>;

    const bookings = bookingRes?.data?.bookings || [];
    const users = userRes?.data?.user || [];

    // Tổng khách hàng
    const totalCustomer = users.length;

    // Tổng lượt đặt tour
    const totalBooking = bookings.length;

    const totalRevenue = bookings.reduce((sum:any, b:any) => {
        const price =
            typeof b.amount === "number"
                ? b.amount
                : b.
                totalPriceTour || 0;
        return sum + price;
    }, 0);

    const completedBooking = bookings.filter(
        (b:any) => b.payment_status === "completed"
    ).length;
    const completionRate = totalBooking
        ? Number(((completedBooking / totalBooking) * 100).toFixed(1))
        : 0;

    return (
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Tổng khách hàng */}
            <OverviewCard
                title="Tổng khách hàng"
                icon={<UserOutlined />}
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                mainValue={totalCustomer}
            />

            {/* Doanh thu tháng */}
            <OverviewCard
                title="Doanh thu tháng"
                icon={<DollarOutlined />}
                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                mainValue={`${totalRevenue.toLocaleString()} VNĐ`}
            />

            {/* Đặt tour */}
            <OverviewCard
                title="Đặt tour"
                icon={<ShoppingCartOutlined />}
                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                mainValue={totalBooking}
            />

            {/* Tỷ lệ hoàn thành */}
            <OverviewCard
                title="Tỷ lệ hoàn thành"
                icon={<StarOutlined />}
                gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                mainValue={`${completionRate}%`}
            />
        </Row>
    );
};

interface CardProps {
    title: string;
    icon: React.ReactNode;
    gradient: string;
    mainValue: string | number;
}

const OverviewCard = ({
    title,
    icon,
    gradient,
    mainValue,
}: CardProps) => {
    const { Text } = Typography;
    return (
        <Col xs={24} sm={12} lg={6}>
            <Card
                style={{
                    borderRadius: 16,
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                    border: "none",
                    background: gradient,
                    color: "white",
                }}
                bodyStyle={{ padding: 24 }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 12,
                            background: "rgba(255, 255, 255, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 16,
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <Text
                            style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 14 }}
                        >
                            {title}
                        </Text>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>
                            {mainValue}
                        </div>
                    </div>
                </div>
            </Card>
        </Col>
    );
};

export default Overview;
  