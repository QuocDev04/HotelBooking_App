/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons'; // ✅ thêm SearchOutlined
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, notification, Popconfirm, Table, type TableColumnsType } from 'antd'; // ✅ thêm Input
import { AiFillEdit, AiTwotoneDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import instance from '../../configs/axios';
import { createStyles } from 'antd-style';
import { useState } from 'react';

const ListTour = () => {
  const { data } = useQuery({
    queryKey: ['tour'],
    queryFn: async () => instance.get('/tour')
  })
  const queryClient = useQueryClient();
  console.log(data?.data?.tours);

  // ✅ Thêm state tìm kiếm
  const [searchText, setSearchText] = useState("");

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
        return await instance.delete(`/tour/${id}`)
      } catch (error) {
        throw new Error('Xóa Tour Thất Bại')
      }
    },
    onSuccess: () => {
      openNotification(false)(
        "success",
        "Bạn Xóa Thành Công",
        "Bạn Đã Xóa Thành Công",
      )
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
  const { Search } = Input;

  const columns: TableColumnsType = [
    {
      title: 'Tên Tour',
      dataIndex: 'nameTour',
      key: 'nameTour',
      fixed: 'left',
      width: 350,
    },
    {
      title: 'Điểm Đến',
      dataIndex: 'destination',
      key: 'destination',
      render:(_:any, tour:any) => {
        return tour?.destination?.locationName + " - " + tour?.destination?.country
      }
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
      title: 'Số Ngày',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Giá Tour',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
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
      render: (_: any, tour: any) => {
        return (
          <div>
            <Link to={`/admin/edit-tour/${tour._id}`}>
              <Button type="primary" className="mr-2">
                <AiFillEdit className="text-xl" />
              </Button>
            </Link>
            <Popconfirm
              onConfirm={() => mutate(tour._id)}
              title="Xóa Tour"
              description="Bạn có chắc chắn muốn xóa tour này không?"
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

  const dataSource = data?.data?.tours.map((tours: any) => ({
    key: tours._id,
    ...tours,
  }));

  // ✅ Lọc danh sách theo từ khóa nhập vào
  const filteredData = dataSource?.filter((tour: any) =>
    tour?.nameTour?.toLowerCase().includes(searchText.toLowerCase())
  );

  const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `,
    };
  });
  const { styles } = useStyle();

  return (
    <>
      {contextHolder}

      {/* ✅ Thanh tìm kiếm bên phải */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
  <Search
    placeholder="Tìm kiếm theo tên tour..."
    allowClear
    enterButton="Tìm kiếm"
    size="middle"
    style={{ width: 350 }}
    onChange={(e) => setSearchText(e.target.value)}
  />
</div>

      <div>
        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={filteredData} // ✅ dùng filteredData thay vì dataSource gốc
          pagination={{ pageSize: 50 }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  )
}

export default ListTour
