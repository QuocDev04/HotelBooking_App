/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Select, Tag, Button, Popconfirm, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../configs/axios";
import dayjs from "dayjs";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ListTime = () => {
    const [selectedTour, setSelectedTour] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    // Fetch all tours
    const { data: tourData, isLoading: isTourLoading } = useQuery({
        queryKey: ["tour"],
        queryFn: async () => instance.get("/tour"),
    });
    const tours = tourData?.data?.tours || [];

    // Fetch slots for selected tour
    const { data: slotData, isLoading: isSlotLoading } = useQuery({
        queryKey: ["slots", selectedTour],
        queryFn: async () => {
            if (!selectedTour) return [];
            const res = await instance.get(`/date/tour/${selectedTour}`);
            return res.data.data || [];
        },
        enabled: !!selectedTour,
    });
    const slots = slotData || [];

    // Delete slot mutation
    const { mutate: deleteSlot, isPending: isDeleting } = useMutation({
        mutationFn: async (slotId: string) => {
            return await instance.delete(`/date/slot/${slotId}`);
        },
        onSuccess: () => {
            messageApi.success("Xóa slot thành công!");
            queryClient.invalidateQueries({ queryKey: ["slots", selectedTour] });
        },
        onError: () => {
            messageApi.error("Xóa slot thất bại!");
        },
    });

    // Table columns
    const columns = [
        {
            title: "Ngày diễn ra",
            dataIndex: "dateTour",
            key: "dateTour",
            render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
        },
        {
            title: "Số chỗ còn lại",
            dataIndex: "availableSeats",
            key: "availableSeats",
            render: (seats: number) => <Tag color={seats > 0 ? "green" : "red"}>{seats}</Tag>,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/edit-time-tour/${record._id}`)}
                        type="primary"
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa slot này?"
                        description="Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => deleteSlot(record._id)}
                        okButtonProps={{ loading: isDeleting, danger: true }}
                    >
                        <Button 
                            icon={<DeleteOutlined />} 
                            danger 
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // Prepare tour options
    const tourOptions = tours.map((tour: any) => ({
        label: `${tour.nameTour} (${tour.destination?.locationName || ''} - ${tour.destination?.country || ''})`,
        value: String(tour._id),
        key: String(tour._id),
    }));

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">📅 Danh Sách Ngày & Số Chỗ Tour</h1>
                {contextHolder}
                <div className="mb-6">
                    <Select
                        showSearch
                        placeholder="Chọn tour để xem ngày & số chỗ"
                        loading={isTourLoading}
                        options={tourOptions}
                        value={selectedTour}
                        onChange={setSelectedTour}
                        style={{ width: 400 }}
                        size="large"
                        filterOption={(input, option) =>
                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={slots.map((slot: any) => ({ ...slot, key: String(slot._id) }))}
                    loading={isSlotLoading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: selectedTour ? "Không có slot nào cho tour này." : "Vui lòng chọn tour." }}
                />
            </div>
        </div>
    );
};

export default ListTime;