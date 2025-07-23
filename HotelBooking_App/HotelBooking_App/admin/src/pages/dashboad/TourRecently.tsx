/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShoppingCartOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Row, Space, Table, Tag, Typography } from "antd"
import instance from "../../configs/axios";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const TourRecently = () => {
    const { Text } = Typography;
    const { data } = useQuery({
        queryKey: ['checkOutBookingTour'],
        queryFn: () => instance.get('/checkOutBookingTour')
    })
    const bookingColumns: ColumnsType<any> = [
        {
            title: 'Mã đặt tour',
            dataIndex: '_id',
            key: '_id',
            render: (id) => (
                <Text code style={{ color: '#1890ff' }}>
                    {id.slice(0, 5)}
                </Text>
            )
        },
        {
            title: 'Khách hàng',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Tour',
            dataIndex: 'nameTour',
            key: 'nameTour',
            render: (_: any, record: any) => (
                <Text strong>
                    {record?.BookingTourId?.tourId?.nameTour.slice(0,20) + '...'}
                </Text>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {amount.toLocaleString('vi-VN')} VNĐ
                </Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'payment_status',
            key: 'payment_status',
            render: (status) => {
                const statusConfig = {
                    confirmed: { color: 'green', text: 'Đã xác nhận' },
                    pending: { color: 'orange', text: 'Chờ xác nhận' },
                    completed: { color: 'blue', text: 'Hoàn thành' },
                    cancelled: { color: 'red', text: 'Đã hủy' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
    ]
    const bookingData = data?.data?.getCheckOutUserTour.map((bookingData: any) => ({
        key: bookingData._id,
        ...bookingData,
    }));
    return (
        <div>
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                 <Col xs={24} lg={24}>
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
                                <ShoppingCartOutlined style={{ fontSize: 20, color: 'white' }} />
                            </div>
                            <Text strong style={{ fontSize: 18 }}> Đặt tour gần đây</Text>
                        </Space>
                    }
                    extra={
                        <Button
                            type="link"
                            style={{
                                color: '#4facfe',
                                fontWeight: 600,
                                fontSize: 14
                            }}
                        >
                            📋 Xem tất cả
                        </Button>
                    }
                >
                    <Table
                        columns={bookingColumns}
                        dataSource={bookingData}
                        pagination={false}
                        size="small"
                        scroll={{ y: 300 }}
                        style={{
                            borderRadius: 8,
                            overflow: 'hidden'
                        }}
                    />
                </Card>
            </Col>
            </Row>
           
        </div>
    )
}

export default TourRecently