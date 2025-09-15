/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  type FormProps,
  type GetProp,
  type UploadFile,
  type UploadProps,
} from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import instance from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const AddTour = () => {
  const [value, setValue] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const discountPercent = Form.useWatch("discountPercent", form);
  const navigate = useNavigate();

  // Dấu * đứng TRƯỚC label
  const req = (txt: string) => (
    <span>
      <span className="text-red-500 mr-1">*</span>
      {txt}
    </span>
  );

  // Lấy danh sách location
  const { data: location } = useQuery({
    queryKey: ["location"],
    queryFn: async () => await instance.get("/location"),
  });

  // Thêm tour
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => await instance.post("/tour", data),
    onSuccess: () => {
      navigate("/admin/list-tour");
      message.success("Bạn đã thêm Tour thành công 🎉");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Bạn thêm Tour thất bại. Vui lòng thử lại sau!";
      message.error(errorMessage);
    },
  });

  // Preview Upload
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

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  // Submit
  const onFinish: FormProps<any>["onFinish"] = (values) => {
    const imageUrls = fileList
      .filter((f) => f.status === "done")
      .map((f) => f.response?.secure_url);
    mutate({ ...values, imageTour: imageUrls });
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
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Thêm mới Tour</h1>
        {contextHolder}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Form
            layout="vertical"
            requiredMark={false}
            name="add-tour"
            validateTrigger="onBlur"
            form={form}
            onFinish={onFinish}
            onValuesChange={(changed) => {
              if ("discountPercent" in changed) {
                const d = changed.discountPercent;
                if (!d || d <= 0)
                  form.setFieldsValue({ discountExpiryDate: null });
              }
            }}
          >
            <Row gutter={[24, 16]}>
              {/* TRÁI: 16 cột */}
              <Col xs={24} lg={16}>
                {/* Tên Tour */}
                <Form.Item
                  label={req("Tên Tour")}
                  name="nameTour"
                  rules={[
                    { required: true, message: "Tên Tour không được để trống" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        const cleanValue = String(value)
                          .replace(/\s+/g, " ") // gộp nhiều khoảng trắng
                          .trim()
                          .toLowerCase();
                        try {
                          const res = await instance.get("/tour");
                          const tours = res.data?.tours || [];
                          const dup = tours.some(
                            (t: any) =>
                              t.nameTour
                                .replace(/\s+/g, " ")
                                .trim()
                                .toLowerCase() === cleanValue
                          );
                          return dup
                            ? Promise.reject(
                                new Error(
                                  "Tên tour này đã tồn tại, vui lòng nhập tên khác!"
                                )
                              )
                            : Promise.resolve();
                        } catch {
                          return Promise.reject(
                            new Error(
                              "Không thể kiểm tra tên tour, thử lại sau"
                            )
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="VD: Tour Hạ Long 3N2Đ" />
                </Form.Item>

                {/* Điểm đến - Nơi xuất phát - Số ngày */}
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      label={req("Điểm Đến")}
                      name="destination"
                      rules={[{ required: true, message: "Nhập điểm đến" }]}
                    >
                      <Select
                        placeholder="Chọn địa chỉ"
                        disabled={isPending}
                        options={location?.data?.location?.map((loc: any) => ({
                          label: `${loc.locationName} - ${loc.country}`,
                          value: loc._id,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={req("Nơi Xuất Phát")}
                      name="departure_location"
                      rules={[
                        { required: true, message: "Nhập nơi xuất phát" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const destination = getFieldValue("destination");
                            if (!destination || !value) return Promise.resolve();
                            if (destination === value.trim()) {
                              return Promise.reject(
                                new Error(
                                  "Nơi xuất phát không được trùng với điểm đến!"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input placeholder="VD: Hà Nội" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={req("Số Ngày")}
                      name="duration"
                      rules={[
                        { required: true, message: "Vui lòng nhập số ngày" },
                        {
                          pattern: /^\d+\s*ngày(\s*\d+\s*đêm)?$/i,
                          message: "VD: 1 ngày hoặc 3 ngày 2 đêm",
                        },
                      ]}
                    >
                      <Input placeholder="VD: 3 ngày 2 đêm" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Giá Tour - Giá Trẻ Em - Giá Trẻ Nhỏ */}
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      label={req("Giá Tour")}
                      name="price"
                      rules={[
                        {
                          validator(_, v) {
                            const n = Number(v);
                            if (!v)
                              return Promise.reject("Vui lòng nhập giá");
                            if (!Number.isInteger(n))
                              return Promise.reject("Giá phải là số nguyên");
                            if (n <= 0)
                              return Promise.reject("Giá phải lớn hơn 0");
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(val) =>
                          val
                            ? `${Number(val).toLocaleString("vi-VN")} ₫`
                            : ""
                        }
                        parser={(val) =>
                          val ? val.replace(/[₫\s,.]/g, "") : ""
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label={req("Giá Trẻ Em")} name="priceChildren">
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(val) =>
                          val
                            ? `${Number(val).toLocaleString("vi-VN")} ₫`
                            : ""
                        }
                        parser={(val) =>
                          val ? val.replace(/[₫\s,.]/g, "") : ""
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={req("Giá Trẻ Nhỏ")}
                      name="priceLittleBaby"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(val) =>
                          val
                            ? `${Number(val).toLocaleString("vi-VN")} ₫`
                            : ""
                        }
                        parser={(val) =>
                          val ? val.replace(/[₫\s,.]/g, "") : ""
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Giảm giá - Ngày hết hạn */}
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Phần trăm giảm giá (%)"
                      name="discountPercent"
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={1}
                        max={100}
                        placeholder="VD: 15"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày hết hạn giảm giá"
                      name="discountExpiryDate"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const d = getFieldValue("discountPercent");
                            if (!d || d <= 0) return Promise.resolve();
                            if (!value)
                              return Promise.reject(
                                new Error("Vui lòng chọn ngày")
                              );
                            if (value.isBefore(dayjs())) {
                              return Promise.reject(
                                new Error(
                                  "Ngày hết hạn phải lớn hơn hiện tại"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        disabled={
                          !discountPercent || discountPercent <= 0
                        }
                        placeholder="Chọn ngày giờ hết hạn"
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Mô tả */}
                <Form.Item label="Mô tả Tour" name="descriptionTour">
                  <div
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={value}
                      onChange={setValue}
                      style={{ height: 250 }}
                    />
                  </div>
                </Form.Item>
              </Col>

              {/* PHẢI: 8 cột */}
              <Col xs={24} lg={8}>
                <Form.Item
                  label={req("Ảnh Tour")}
                  name="imageTour"
                  rules={[
                    {
                      validator: () =>
                        fileList.length
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Vui lòng chọn ít nhất 1 ảnh Tour")
                            ),
                    },
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                    data={{ upload_preset: "demo-upload" }}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple
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
                        afterOpenChange: (v) =>
                          !v && setPreviewImage(""),
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
            </Row>

            {/* Nút */}
            <Form.Item style={{ marginTop: 8 }}>
              <Button
                onClick={() => navigate("/admin/list-tour")}
                className="w-full"
                style={{ marginBottom: 8 }}
              >
                ⬅ Quay lại
              </Button>
              <Button type="primary" htmlType="submit" className="w-full">
                ✅ Xác Nhận Thêm Tour
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddTour;
