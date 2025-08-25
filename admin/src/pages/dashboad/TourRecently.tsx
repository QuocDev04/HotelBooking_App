/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {  Card, Col, Row, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import instanceAdmin from "../../configs/axios"; // lưu ý: dùng instanceAdmin

const TourRecently = () => {
  const { Text } = Typography;

  // Gọi API lấy danh sách booking từ /admin/bookings
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => instanceAdmin.get("/admin/bookings"),
  });

  console.log("DATA LIST BOOKING RAW:", data?.data);

  // Lấy danh sách booking, chỉ lấy đã hoàn thành
  const bookingData =
    data?.data?.bookings
      ?.filter((b: any) => b.payment_status === "completed") // chỉ completed
      ?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      ?.map((b: any) => ({
        key: b._id,
        ...b,
      })) || [];

  // Cấu hình cột giống ListBooking
  const bookingColumns: ColumnsType<any> = [
    {
      title: "Mã đặt tour",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Text code style={{ color: "#1890ff" }}>{id?.slice(0, 6)}</Text>
      ),
    },
    {
      title: "Khách hàng",
      key: "fullNameUser",
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.fullNameUser}
          </div>
          <div className="text-sm text-gray-500">{record.email}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Tour",
      key: "tour",
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record?.slotId?.tour?.nameTour}
          </div>
          <div className="text-sm text-gray-500">
            {record?.slotId?.tour?.departure_location}
          </div>
        </div>
      ),
    },
    {
      title: "Số hành khách",
      key: "passengers",
      render: (_: any, record: any) =>
        record.adultsTour +
        record.childrenTour +
        record.toddlerTour +
        record.infantTour +
        " người",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPriceTour",
      key: "totalPriceTour",
      render: (price) => (
        <Text strong style={{ color: "#52c41a" }}>
          {price?.toLocaleString()}₫
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => {
        const statusConfig: any = {
          confirmed: { color: "green", text: "Đã xác nhận" },
          pending: { color: "orange", text: "Chờ xác nhận" },
          completed: { color: "blue", text: "Hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
          "Thanh toán toàn bộ": { color: "green", text: "Thanh toán toàn bộ" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
  title: "Ngày đặt",
  dataIndex: "createdAt",
  key: "createdAt",
  render: (date: string) =>
    date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Không rõ",
},
  ];

  return (
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
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingCartOutlined style={{ fontSize: 20, color: "white" }} />
              </div>
              <Text strong style={{ fontSize: 18 }}>
                Đặt tour gần đây 
              </Text>
            </Space>
          }
         
        >
          <Table
            columns={bookingColumns}
            dataSource={bookingData}
            loading={isLoading}
            pagination={false}
            size="small"
            scroll={{ y: 300 }}
            rowKey="_id"
            style={{
              borderRadius: 8,
              overflow: "hidden",
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default TourRecently;
