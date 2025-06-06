/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification, Popconfirm, Table, type TableColumnsType } from "antd";
import instance from "../../configs/axios";
import { Link } from "react-router-dom";
import { AiFillEdit, AiTwotoneDelete } from "react-icons/ai";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ListTourSchedule = () => {
    const queryClient = useQueryClient();
    const [api, contextHolder] = notification.useNotification();
    const openNotification =
        (pauseOnHover: boolean) =>
            (type: "success" | "error", message: string, description: string) => {
                api.open({
                    message,
                    description,
                    type,
                    showProgress: true,
                    pauseOnHover,
                });
        };
    const { data } = useQuery({
        queryKey: ['tourschedule'],
        queryFn: () => instance.get('/tourschedule')
    });
    const {mutate} = useMutation({
        mutationFn: async(id:any) =>{
            try {
                return await instance.delete(`/tourschedule/${id}`)
            } catch (error) {
                throw new Error("Fail")
            }
        },
        onSuccess: () => {
            openNotification(false)(
                "success",
                "Bạn Xóa Thành Công",
                "Bạn Đã Xóa Thành Công",
            )
            queryClient.invalidateQueries({
                queryKey: ["tourschedule"],
            });
        },
        onError: () =>
            openNotification(false)(
                "error",
                "Bạn Xóa Thất Bại",
                "Bạn Đã Xóa Thất Bại",
            ),
    })
    const columns: TableColumnsType<any> = [
        {
            title: 'Tên Tour',
            key: 'tourName',
            fixed: 'left',
            width: 200,
            render: (record: any) => (
                <div>{record?.Tour?.nameTour || 'Không có tên tour'}</div>
            ),
        },
        {
            title: 'Lịch Trình Chi Tiết',
            key: 'schedules',
            width: 600,
            render: (record: any) => (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #ccc' }}>Ngày</th>
                            <th style={{ textAlign: 'left', padding: '4px', borderBottom: '1px solid #ccc' }}>Hoạt Động</th>
                            <th style={{ textAlign: 'left', padding: '4px', borderBottom: '1px solid #ccc' }}>Địa Điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record?.schedules?.map((schedule: any, index: number) => (
                            <tr key={index}>
                                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{schedule.dayNumber}</td>
                                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{schedule.activity}</td>
                                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>{schedule.location}</td>
                            </tr>
                        )) || (
                                <tr>
                                    <td colSpan={3} style={{ padding: '4px' }}>Không có lịch trình</td>
                                </tr>
                            )}
                    </tbody>
                </table>
            ),
        },
        {
            title: "Hành động",
            key: "operation",
            fixed: 'right',
            width: 100,
            render: (_: any, tour: any) => {
                return (
                    <div>
                        <Link to={`/edit-tourschedule/${tour._id}`}>
                            <Button type="primary" className="mr-2">
                                <AiFillEdit className="text-xl" />
                            </Button>
                        </Link>
                        <Popconfirm
                            onConfirm={() => mutate(tour._id)}
                            title="Xóa Sản Phẩm"
                            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                            okText="Có"
                            cancelText="Không"
                            icon={
                                <QuestionCircleOutlined
                                    style={{ color: "red" }}
                                />
                            }
                        >
                            <Button danger>
                                <AiTwotoneDelete className="text-lg" />
                            </Button>
                        </Popconfirm>
                    </div>
                );
            },
          },
    ];

    const dataSource = data?.data?.tourSchedule.map((tourSchedule: any) => ({
        key: tourSchedule._id,
        ...tourSchedule,
    }));

    return (
        <div>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 50 }}
                scroll={{ x: 900 }}
            />
        </div>
    );
};

export default ListTourSchedule;
