/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table'
import Table from 'antd/es/table';
import React from 'react'
import instance from '../../configs/axios';
import { Link } from 'react-router-dom';
import { Button, notification, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  AiTwotoneDelete,
  AiFillEdit,
} from "react-icons/ai";
const ListRoom = () => {
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
  const {data} = useQuery({
    queryKey:['room'],
    queryFn: async() => instance.get('/room')
  })
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await instance.delete(`/room/${id}`);
      } catch (error) {
        throw new Error("error");
      }
    },
    onSuccess: () => {
      openNotification(false)(
        "success",
        "Bạn Xóa Thành Công",
        "Bạn Đã Xóa Thành Công",
      )
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
    },
    onError: () =>
      openNotification(false)(
        "error",
        "Bạn Xóa Thất Bại",
        "Bạn Đã Xóa Thất Bại",
      ),
  });
  console.log(data?.data?.rooms);
  
  const columns: ColumnsType<any> = [
    {
      title: 'Tên Phòng',
      dataIndex: 'nameRoom',
      key: 'nameRoom',
      width: 150,
    },
    {
      title: 'Giá Phòng',
      dataIndex: 'priceRoom',
      key: 'priceRoom',
      width: 150,
      render: (priceRoom: number) => priceRoom.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    },
    {
      title: 'Sức Chứa',
      dataIndex: 'capacityRoom',
      key: 'capacityRoom',
      width: 150,
    },
    {
      title: 'Ảnh Phòng',
      dataIndex: 'imageRoom',
      key: 'imageRoom',
      width: 150,
      render: (image: string[]) => {
        const firstImage =
          image && image.length > 0 ? image[0] : "";
        return firstImage ? (
          <img
            src={firstImage}
            style={{ width: "100px", height: "auto" }}
            alt="Ảnh phụ"
          />
        ) : (
          "Không có ảnh nào"
        );
      },
    },
    {
      title: 'Loại Phòng',
      dataIndex: 'typeRoom',
      key: 'typeRoom',
      width: 150,
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'addressRoom',
      key: 'addressRoom',
      width: 150,
    },
    {
      title: 'Dich Vụ Phòng',
      dataIndex: 'amenitiesRoom',
      key: 'amenitiesRoom',
      width: 150,
      render: (amenitiesRoom) => {
        if (!Array.isArray(amenitiesRoom) || amenitiesRoom.length === 0) {
          return 'Không có tiện nghi';
        }
        return (
          <div>
            {amenitiesRoom.map((item, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                ✅ {item}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Mô Tả Phòng',
      dataIndex: 'descriptionRoom',
      key: 'descriptionRoom',
      width: 150,
      ellipsis: true,
      render: (_: any, room: any) => {
        const limitWords = (text: string, wordLimit: number) => {
          const words = text.split(' ');
          return words.length > wordLimit
            ? words.slice(0, wordLimit).join(' ') + '...'
            : text;
        };

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: limitWords(room?.descriptionRoom || "", 20),
            }}
          />
        );
      }
    },
    {
      title: "Hành động",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (_: any, room: any) => {
        return (
          <div>
            <Link to={`/admin/edit-room/${room._id}`}>
              <Button type="primary" className="mr-2">
                <AiFillEdit className="text-xl" />
              </Button>
            </Link>
            <Popconfirm
              onConfirm={() => mutate(room._id)}
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
  ]
  const dataSource = data?.data.rooms.map((room: any) => ({
    key: room._id,
    ...room,
  }));
  return (
    <div>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 50 }}
      />
    </div>
  )
}

export default ListRoom
