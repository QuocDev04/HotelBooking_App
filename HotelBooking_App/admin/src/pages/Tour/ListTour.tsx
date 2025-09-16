/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, notification, Popconfirm, Table, Card, Select, Tag, type TableColumnsType } from 'antd';
import { AiFillEdit, AiTwotoneDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import instance from '../../configs/axios';
import { createStyles } from 'antd-style';
import { useState } from 'react';

const { Search } = Input;
const { Option } = Select;

const ListTour = () => {
  const { data } = useQuery({
    queryKey: ['tour'],
    queryFn: async () => instance.get('/tour')
  });
  const queryClient = useQueryClient();

  const [searchName, setSearchName] = useState("");
  const [searchDeparture, setSearchDeparture] = useState("");
  const [searchDuration, setSearchDuration] = useState("");

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

  const { mutate } = useMutation({
    mutationFn: async (id: any) => {
      try {
        return await instance.delete(`/tour/${id}`);
      } catch (error) {
        throw new Error('Xóa Tour Thất Bại');
      }
    },
    onSuccess: () => {
      openNotification(false)(
        "success",
        "Bạn Xóa Thành Công",
        "Bạn Đã Xóa Thành Công",
      );
      queryClient.invalidateQueries({
        queryKey: ["tour"],
      });
    },
    onError: () =>
      openNotification(false)(
        "error",
        "Bạn Xóa Thất Bại",
        "Bạn Đã Xóa Thất Bại",
      ),
  });

  const columns: TableColumnsType = [
    {
      title: 'Tên Tour',
      dataIndex: 'nameTour',
      key: 'nameTour',
      fixed: 'left',
      width: 250,
    },
    {
      title: 'Điểm Đến',
      dataIndex: 'destination',
      key: 'destination',
      render: (_: any, tour: any) =>
        tour?.destination?.locationName + " - " + tour?.destination?.country
    },
    {
      title: 'Nơi Xuất Phát',
      dataIndex: 'departure_location',
      key: 'departure_location',
    },
    {
      title: 'Ảnh Tour',
      dataIndex: 'imageTour',
      key: 'imageTour',
      render: (image: string[]) => {
        const firstImage = image && image.length > 0 ? image[0] : "";
        return firstImage ? (
          <img
            src={firstImage}
            style={{ width: "90px", height: "60px", objectFit: "cover", borderRadius: 6 }}
            alt="Ảnh Tour"
          />
        ) : (
          "Không có ảnh"
        );
      },
    },
    {
      title: 'Số Ngày',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Giá Tour',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) =>
        price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    },
    {
      title: 'Phương Tiện',
      dataIndex: 'itemTransport',
      key: 'itemTransport',
      render: (transports: any[]) => {
        if (!transports || transports.length === 0) return "Không có";
        return (
          <>
            {transports.map((t: any, i: number) => (
              <Tag color="blue" key={i}>
                {t.TransportId?.transportName || "Không rõ"}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: 'Mô Tả Tour',
      dataIndex: 'descriptionTour',
      key: 'descriptionTour',
      ellipsis: true,
      render: (_: any, tour: any) => {
        const limitWords = (text: string, wordLimit: number) => {
          const words = text.split(' ');
          return words.length > wordLimit
            ? words.slice(0, wordLimit).join(' ') + '...'
            : text;
        };
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: limitWords(tour?.descriptionTour || "", 20),
            }}
          />
        );
      }
    },
    {
      title: "Hành động",
      key: "operation",
      fixed: 'right',
      width: 150,
      render: (_: any, tour: any) => (
        <div className="flex gap-2">
          <Link to={`/admin/edit-tour/${tour._id}`}>
            <Button type="primary">
              <AiFillEdit className="text-lg" />
            </Button>
          </Link>
          <Popconfirm
            onConfirm={() => mutate(tour._id)}
            title="Xóa Tour"
            description="Bạn có chắc chắn muốn xóa tour này không?"
            okText="Có"
            cancelText="Không"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button danger>
              <AiTwotoneDelete className="text-lg" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const dataSource = data?.data?.tours.map((tours: any) => ({
    key: tours._id,
    ...tours,
  }));

  // ✅ Lọc dữ liệu theo các điều kiện
  const filteredData = dataSource?.filter((tour: any) =>
    tour?.nameTour?.toLowerCase().includes(searchName.toLowerCase()) &&
    (searchDeparture ? tour?.departure_location?.toLowerCase().includes(searchDeparture.toLowerCase()) : true) &&
    (searchDuration ? tour?.duration?.toString() === searchDuration : true)
  );

  const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
        ${antCls}-table {
          border-radius: 12px;
          overflow: hidden;
        }
      `,
    };
  });
  const { styles } = useStyle();

  return (
    <>
      {contextHolder}
      <Card
        title={<h2 className="text-xl font-bold text-blue-600">Danh sách Tour</h2>}
        extra={
          <div className="flex gap-3">
            <Search
              placeholder="Tên tour..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              style={{ width: 220 }}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Select
              placeholder="Nơi xuất phát"
              allowClear
              style={{ width: 180 }}
              value={searchDeparture || undefined}
              onChange={(value) => setSearchDeparture(value || "")}
            >
              {[...new Set(dataSource?.map((t: any) => t.departure_location))].map((loc) => (
                <Option key={loc} value={loc}>{loc}</Option>
              ))}
            </Select>
            <Select
              placeholder="Số ngày"
              allowClear
              style={{ width: 150 }}
              value={searchDuration || undefined}
              onChange={(value) => setSearchDuration(value || "")}
            >
              {[...new Set(dataSource?.map((t: any) => t.duration))].map((dur) => (
                <Option key={dur} value={dur}>{dur}</Option>
              ))}
            </Select>
            <Button
              onClick={() => {
                setSearchName("");
                setSearchDeparture("");
                setSearchDuration("");
              }}
            >
              Tất cả
            </Button>
          </div>
        }
        className="shadow-md rounded-xl"
      >
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </>
  );
};

export default ListTour;
