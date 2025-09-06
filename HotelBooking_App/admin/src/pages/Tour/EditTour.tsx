/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
  type GetProp,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import instance from "../../configs/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const EditTour = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [value, setValue] = useState(""); // descriptionTour
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // 🟢 Lấy dữ liệu tour
  const { data } = useQuery({
    queryKey: ["tour", id],
    queryFn: async () => instance.get(`/tour/${id}`), // ✅ dùng GET
    enabled: !!id,
  });

  // 🟢 Lấy location
  const { data: location } = useQuery({
    queryKey: ["location"],
    queryFn: async () => instance.get("/location"),
  });

  // 🟢 Lấy transport
  const { data: transport } = useQuery({
    queryKey: ["transport"],
    queryFn: () => instance.get("/transport"),
  });
  const transports = transport?.data?.transport;

  // 🟢 Update tour
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) =>
      await instance.put(`/tour/${id}`, payload),
    onSuccess: () => {
      navigate("/admin/list-tour");
      message.success("Bạn đã sửa Tour thành công 🎉", 2);
      queryClient.invalidateQueries({ queryKey: ["tour"] });
    },
    onError: () => {
      message.error("Bạn sửa Tour thất bại. Vui lòng thử lại sau!");
    },
  });

  // 🟢 Khi có dữ liệu → set vào form
  useEffect(() => {
    if (data?.data?.tour && transports?.length >= 0) {
      const tour = data.data.tour;

      if (tour.discountExpiryDate) {
        tour.discountExpiryDate = dayjs(tour.discountExpiryDate);
      }

      if (tour.imageTour) {
        setFileList(
          tour.imageTour.map((url: string, index: number) => ({
            uid: index.toString(),
            name: `imageTour${index}`,
            status: "done",
            url,
          }))
        );
      }

      if (tour.descriptionTour) {
        setValue(tour.descriptionTour);
      }

      const transportId = tour.itemTransport?.map(
        (item: any) => item.TransportId?._id || item._id
      );

      form.setFieldsValue({
        ...tour,
        itemTransport: transportId,
        destination: tour.destination?._id || tour.destination,
      });
    }
  }, [data?.data?.tour, transports, form]);

  // 🟢 Preview & Upload
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList }) =>
    setFileList(fileList);

  // 🟢 Submit form
  const onFinish = (values: any) => {
    const imageUrls = fileList
      .filter((file) => file.status === "done")
      .map((file) => (file.url ? file.url : file.response?.secure_url));

    const payload = {
      ...values,
      imageTour: imageUrls,
      itemTransport: values.itemTransport?.map((id: any) => ({
        TransportId: id,
      })),
      descriptionTour: value,
    };

    console.log("📤 Sending:", payload);
    mutate(payload);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">✏️ Sửa Tour</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            validateTrigger="onBlur"
          >
            <Row gutter={[32, 32]}>
              {/* Cột trái */}
              <Col xs={24} lg={16}>
              <Form.Item
  label="Tên Tour"
  name="nameTour"
  rules={[
    { required: true, message: "Không được để trống" },
    {
      validator: async (_, value) => {
        if (!value) return;
        try {
          // Gọi API check trùng tên (ngoại trừ tour hiện tại)
          const res = await instance.get(`/tour?search=${value}`);
          const existed = res.data.tours.some(
            (t: any) => t.nameTour === value && t._id !== id
          );
          if (existed) {
            return Promise.reject("Tên tour đã tồn tại, vui lòng nhập tên khác!");
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  ]}
>
  <Input placeholder="VD: Tour Hạ Long 3N2Đ" size="large" />
</Form.Item>


                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      label="Điểm Đến"
                      name="destination"
                      rules={[{ required: true, message: "Chọn điểm đến" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Chọn điểm đến"
                        options={location?.data?.location?.map((loc: any) => ({
                          label: `${loc.locationName} - ${loc.country}`,
                          value: loc._id,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      label="Nơi Xuất Phát"
                      name="departure_location"
                      rules={[{ required: true, message: "Nhập nơi xuất phát" }]}
                    >
                      <Input size="large" placeholder="VD: Hà Nội" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      label="Số Ngày"
                      name="duration"
                      rules={[{ required: true, message: "Nhập số ngày" }]}
                    >
                      <Input size="large" placeholder="VD: 3 ngày 2 đêm" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
  <Col span={8}>
    <Form.Item label="Giá Tour" name="price">
      <InputNumber
        size="large"
        style={{ width: "100%" }}
        min={0}
        formatter={(v) => (v ? `${Number(v).toLocaleString("vi-VN")} ₫` : "")}
        parser={(v) => v?.replace(/[₫\s,.]/g, "") || ""}
      />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item label="Giá Trẻ Em" name="priceChildren">
      <InputNumber size="large" style={{ width: "100%" }} min={0} />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item label="Giá Trẻ Nhỏ" name="priceLittleBaby">
      <InputNumber size="large" style={{ width: "100%" }} min={0} />
    </Form.Item>
  </Col>
</Row>

{/* 🟢 Thêm giảm giá */}
<Row gutter={24}>
  <Col span={8}>
    <Form.Item
      label="Phần trăm giảm giá (%)"
      name="discountPercent"
      rules={[
        {
          type: "number",
          min: 1,
          max: 100,
          message: "Phần trăm phải từ 1 đến 100",
        },
      ]}
    >
      <InputNumber
        min={1}
        max={100}
        placeholder="VD: 15 (15%)"
        size="large"
        style={{ width: "100%" }}
      />
    </Form.Item>
  </Col>

  <Col span={8}>
    <Form.Item
      label="Ngày hết hạn giảm giá"
      name="discountExpiryDate"
      rules={[
        ({ getFieldValue }) => ({
          validator(_, value) {
            const discount = getFieldValue("discountPercent");
            if (!discount || discount <= 0) return Promise.resolve();
            if (!value)
              return Promise.reject(new Error("Vui lòng chọn ngày hết hạn"));
            if (value.isBefore(dayjs())) {
              return Promise.reject(
                new Error("Ngày hết hạn phải lớn hơn hiện tại")
              );
            }
            return Promise.resolve();
          },
        }),
      ]}
    >
      <DatePicker
        showTime
        size="large"
        style={{ width: "100%" }}
        placeholder="Chọn ngày giờ hết hạn"
        disabledDate={(current) =>
          current && current < dayjs().startOf("day")
        }
      />
    </Form.Item>
  </Col>
</Row>


                <Form.Item label="Mô tả Tour" name="descriptionTour">
                  <ReactQuill
                    className="h-[300px]"
                    theme="snow"
                    value={value}
                    onChange={setValue}
                  />
                </Form.Item>
              </Col>

              {/* Cột phải */}
              <Col xs={24} lg={8}>
                <Form.Item label="Ảnh Tour" name="imageTour">
                  <Upload
                    listType="picture-card"
                    action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                    data={{ upload_preset: "demo-upload" }}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple
                    fileList={fileList}
                    accept="image/png, image/jpeg"
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  {previewImage && (
                    <Image
                      wrapperStyle={{ display: "none" }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (v) => setPreviewOpen(v),
                        afterOpenChange: (v) => !v && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  name="featured"
                  label="Sản phẩm nổi bật"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    onClick={() => navigate("/admin/list-tour")}
                    size="large"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 mt-10"
                  >
                    ⬅ Quay lại
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                    loading={isPending}
                  >
                    ✅ Xác Nhận Sửa Tour
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditTour;
