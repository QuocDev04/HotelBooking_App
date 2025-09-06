/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const requiredLabel = (text: string) => (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );

  // Lấy danh sách location
  const { data: location } = useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      return await instance.get("/location");
    },
  });

  // Mutation thêm tour
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      return await instance.post("/tour", data);
    },
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

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];
  const modules = { toolbar: toolbarOptions };

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

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // ✅ sửa lỗi: bỏ itemTransport
  const onFinish: FormProps<any>["onFinish"] = (values) => {
    const imageUrls = fileList
      .filter((file) => file.status === "done")
      .map((file) => file.response?.secure_url);

    const newValues = {
      ...values,
      imageTour: imageUrls,
    };

    console.log("Data being sent:", newValues);
    mutate(newValues);
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
          <h1 className="text-3xl font-bold text-blue-600">➕ Thêm Tour Mới</h1>
        </div>
        {contextHolder}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Form
            layout="vertical"
            name="add-tour"
            validateTrigger="onBlur"
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues) => {
              if ("discountPercent" in changedValues) {
                const discountPercent = changedValues.discountPercent;
                if (!discountPercent || discountPercent <= 0) {
                  form.setFieldsValue({ discountExpiryDate: null });
                }
              }
            }}
          >
            <Row gutter={[32, 32]}>
              {/* Cột trái */}
              <Col xs={24} lg={16}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Tên Tour")}
                  name="nameTour"
                  rules={[
                    { required: true, message: "Tên Tour không được để trống" },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        try {
                          const res = await instance.get("/tour");
                          const tours = res.data?.tours || [];
                          const isDuplicate = tours.some(
                            (tour: any) =>
                              tour.nameTour.trim().toLowerCase() ===
                              value.trim().toLowerCase()
                          );
                          if (isDuplicate) {
                            return Promise.reject(
                              new Error(
                                "Tên tour này đã tồn tại, vui lòng nhập tên khác!"
                              )
                            );
                          }
                          return Promise.resolve();
                        } catch {
                          return Promise.reject(
                            new Error("Không thể kiểm tra tên tour, thử lại sau")
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input placeholder="VD: Tour Hạ Long 3N2Đ" size="large" />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Điểm Đến")}
                      name="destination"
                      rules={[
                        { required: true, message: "Nhập điểm đến" },
                        { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn Địa Chỉ"
                        disabled={isPending}
                        size="large"
                        options={location?.data?.location?.map((loc: any) => ({
                          label: loc.locationName + " - " + loc.country,
                          value: loc._id,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Nơi Xuất Phát")}
                      name="departure_location"
                      rules={[
                        { required: true, message: "Nhập nơi xuất phát" },
                        { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                      ]}
                    >
                      <Input placeholder="VD: Hà Nội" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Số Ngày")}
                      name="duration"
                      rules={[
                        { required: true, message: "Vui lòng nhập số ngày" },
                        {
                          pattern: /^\d+\s*ngày(\s*\d+\s*đêm)?$/i,
                          message:
                            "Định dạng không hợp lệ. VD: 1 ngày hoặc 3 ngày 2 đêm",
                        },
                      ]}
                    >
                      <Input
                        placeholder="VD: 1 ngày hoặc 3 ngày 2 đêm"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Giá Tour")}
                      name="price"
                      rules={[
                        {
                          validator(_, value) {
                            const num = Number(value);
                            if (!value) return Promise.reject("Vui lòng nhập giá");
                            if (isNaN(num) || !Number.isInteger(num))
                              return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0)
                              return Promise.reject("Giá phải lớn hơn 0");
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="VD: 2000000"
                        size="large"
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          value ? `${Number(value).toLocaleString("vi-VN")} ₫` : ""
                        }
                        parser={(value) =>
                          value ? value.replace(/[₫\s,.]/g, "") : ""
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
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

                  <Col span={6}>
                    <Form.Item
                      label="Ngày hết hạn giảm giá"
                      name="discountExpiryDate"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const discount = getFieldValue("discountPercent");
                            if (!discount || discount <= 0) return Promise.resolve();
                            if (!value)
                              return Promise.reject(
                                new Error("Vui lòng chọn ngày hết hạn")
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
                        disabled={!discountPercent || discountPercent <= 0}
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

                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Giá Trẻ em")}
                      name="priceChildren"
                      rules={[
                        {
                          validator(_, value) {
                            const num = Number(value);
                            if (!value) return Promise.reject("Vui lòng nhập giá");
                            if (isNaN(num) || !Number.isInteger(num))
                              return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0)
                              return Promise.reject("Giá phải lớn hơn 0");
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="VD: 2000000"
                        size="large"
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          value ? `${Number(value).toLocaleString("vi-VN")} ₫` : ""
                        }
                        parser={(value) =>
                          value ? value.replace(/[₫\s,.]/g, "") : ""
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Giá Trẻ Nhỏ")}
                      name="priceLittleBaby"
                      rules={[
                        {
                          validator(_, value) {
                            const num = Number(value);
                            if (!value) return Promise.reject("Vui lòng nhập giá");
                            if (isNaN(num) || !Number.isInteger(num))
                              return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0)
                              return Promise.reject("Giá phải lớn hơn 0");
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="VD: 2000000"
                        size="large"
                        style={{ width: "100%" }}
                        min={0}
                        formatter={(value) =>
                          value ? `${Number(value).toLocaleString("vi-VN")} ₫` : ""
                        }
                        parser={(value) =>
                          value ? value.replace(/[₫\s,.]/g, "") : ""
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="📝 Mô tả Tour"
                  name="descriptionTour"
                  className="mt-6"
                >
                  <ReactQuill
                    className="h-[300px]"
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    modules={modules}
                  />
                </Form.Item>
              </Col>

              {/* Cột phải */}
              <Col xs={24} lg={8}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Ảnh Tour")}
                  name="imageTour"
                  rules={[
                    {
                      validator: () => {
                        if (fileList.length === 0) {
                          return Promise.reject(
                            new Error("Vui lòng chọn ít nhất 1 ảnh Tour")
                          );
                        }
                        const hasSuccessFile = fileList.some(
                          (file) => file.status === "done"
                        );
                        if (!hasSuccessFile) {
                          return Promise.reject(
                            new Error(
                              "Vui lòng đợi ảnh upload xong hoặc chọn ảnh hợp lệ"
                            )
                          );
                        }
                        return Promise.resolve();
                      },
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
                        onVisibleChange: (visible) =>
                          setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
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

              {/* Nút Submit */}
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
                    className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 mt-10"
                  >
                    ✅ Xác Nhận Thêm Tour
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

export default AddTour;
