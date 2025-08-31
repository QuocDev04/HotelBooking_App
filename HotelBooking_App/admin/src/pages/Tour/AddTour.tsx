/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Col, DatePicker, Form, Image, Input, InputNumber, message, Row, Select, Space, Upload, type FormProps, type GetProp, type UploadFile, type UploadProps } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import instance from "../../configs/axios";
import { Option } from "antd/lib/mentions";
import dayjs from "dayjs";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const AddTour = () => {
  const [value, setValue] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const discountPercent = Form.useWatch('discountPercent', form);
  const requiredLabel = (text: string) => (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );
  const { data } = useQuery({
    queryKey: ['transport'],
    queryFn: () => instance.get('/transport')
  })
  const transports = data?.data?.transport;
  const { data: location } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      return await instance.get("/location")
    }
  })
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await instance.post("/tour", data)
      } catch (error) {
        throw new Error("Failed to add tour")
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn thêm Tour thành công",
      });
      form.resetFields();
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Bạn thêm Tour thất bại. Vui lòng thử lại sau!",
      });
    },
  })

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const modules = {
    toolbar: toolbarOptions,
  };
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
  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    const imageUrls = fileList
      .filter((file) => file.status === "done")
      .map((file) => file.response?.secure_url);



    const newValues = {
      ...values,
      imageTour: imageUrls,
      itemTransport: values.itemTransport.map((id: any) => ({ TransportId: id })),
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
          <Form layout="vertical" name="add-tour" validateTrigger="onBlur"
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues) => {
              if ('discountPercent' in changedValues) {
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
                  rules={[{ required: true, message: "Tên Tour không được để trống" }]}
                >
                  <Input placeholder="VD: Tour Hạ Long 3N2Đ" size="large" />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Điểm Đến")}
                      name="destination"
                      rules={[
                        { required: true, message: "Chọn điểm đến" },
                      ]}
                    >
                      <Select placeholder="Chọn Địa Chỉ" disabled={isPending} style={{ width: "100%" }}
                        size="large" options={location?.data?.location?.map((location: any) => ({
                          label: location.locationName + ' - ' + location.country,
                          value: location._id
                        }))}
                        onChange={(value) => {
                          // Cập nhật giá trị của trường category
                          form.setFieldsValue({
                            location: value,
                          });
                        }} />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
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

                  <Col span={8}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Số Ngày")}
                      name="duration"
                      rules={[
                        { required: true, message: "Vui lòng nhập số ngày" },
                        {
                          pattern: /^\d+\s*ngày(\s*\d+\s*đêm)?$/i,
                          message: "Định dạng không hợp lệ. VD: 1 ngày hoặc 3 ngày 2 đêm",
                        },
                      ]}
                    >
                      <Input placeholder="VD: 1 ngày hoặc 3 ngày 2 đêm" size="large" />
                    </Form.Item>
                  </Col>

                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Thời gian khởi hành"
                      name="departure_time"
                      rules={[
                        {
                          pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                          message: "Định dạng thời gian không hợp lệ. VD: 06:00",
                        },
                      ]}
                    >
                      <Input placeholder="VD: 06:00" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Thời gian kết thúc"
                      name="return_time"
                      rules={[
                        {
                          pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                          message: "Định dạng thời gian không hợp lệ. VD: 18:00",
                        },
                      ]}
                    >
                      <Input placeholder="VD: 18:00" size="large" />
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
                            if (isNaN(num) || !Number.isInteger(num)) return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0) return Promise.reject("Giá phải lớn hơn 0");
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
                      label={requiredLabel("Số người tối đa")}
                      name="maxPeople"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (value === undefined || value === null) {
                              return Promise.reject("Vui lòng nhập số người ");
                            }
                            if (value < 4) {
                              return Promise.reject("Không được nhỏ hơn 4 người");
                            }
                            if (value > 100) {
                              return Promise.reject("Không được lớn hơn 100 người");
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="VD: 20"
                        size="large"
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </Col>


                  <Col span={6}>
                    <Form.Item
                      label="Phần trăm giảm giá (%)"
                      name="discountPercent"
                      rules={[
                        { type: 'number', min: 1, max: 100, message: 'Phần trăm phải từ 1 đến 100' }
                      ]}
                    >
                      <InputNumber min={1} max={100} placeholder="VD: 15 (15%)" size="large"
                        style={{ width: "100%" }} />
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
                            if (!value) return Promise.reject(new Error("Vui lòng chọn ngày hết hạn"));
                            if (value.isBefore(dayjs())) {
                              return Promise.reject(new Error("Ngày hết hạn phải lớn hơn hiện tại"));
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

                        disabledDate={(current) => {
                          // Không cho chọn ngày trước hôm nay
                          return current && current < dayjs().startOf("day");
                        }}
                        disabledTime={(current) => {
                          if (!current) return {};
                          if (current.isSame(dayjs(), "day")) {
                            return {
                              disabledHours: () =>
                                Array.from({ length: 24 }, (_, i) => i).filter((h) => h < dayjs().hour()),
                              disabledMinutes: () =>
                                Array.from({ length: 60 }, (_, i) => i).filter((m) => m < dayjs().minute()),
                              disabledSeconds: () =>
                                Array.from({ length: 60 }, (_, i) => i).filter((s) => s < dayjs().second()),
                            };
                          }
                          return {};
                        }}
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
                            if (isNaN(num) || !Number.isInteger(num)) return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0) return Promise.reject("Giá phải lớn hơn 0");
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
                            if (isNaN(num) || !Number.isInteger(num)) return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0) return Promise.reject("Giá phải lớn hơn 0");
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
                      label={requiredLabel("Giá Phụ Thu Phòng Đơn")}
                      name="priceSingleRoom"
                      rules={[
                        {
                          validator(_, value) {
                            const num = Number(value);
                            if (!value) return Promise.reject("Vui lòng nhập giá");
                            if (isNaN(num) || !Number.isInteger(num)) return Promise.reject("Giá phải là số nguyên");
                            if (num <= 0) return Promise.reject("Giá phải lớn hơn 0");
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
                  {/* <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Ngày Diễn Ra Tour")}
                      name="dateTour"
                    >
                      <DatePicker
                        showTime={{ format: "HH:mm" }}
                        format="YYYY-MM-DD HH:mm"
                        size="large"
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày giờ diễn ra"
                        disabledDate={(current) => current && current < dayjs().startOf("day")}
                        disabledTime={(current) => {
                          const now = dayjs();
                          if (current && current.isSame(now, "day")) {
                            const hour = now.hour();
                            const minute = now.minute();

                            return {
                              disabledHours: () =>
                                Array.from({ length: hour }, (_, i) => i),
                              disabledMinutes: (selectedHour) =>
                                selectedHour === hour
                                  ? Array.from({ length: minute }, (_, i) => i)
                                  : [],
                            };
                          }
                          return {};
                        }}
                      />
                    </Form.Item>
                  </Col> */}
                 <Col span={6}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Loại Tour")}
                      name="tourType"
                      rules={[{ required: true, message: "Vui lòng chọn loại tour" }]}
                    >
                      <Select
                        size="large"
                        placeholder="Chọn loại tour"
                        options={[
                          { label: "Nội địa", value: "noidia" },
                          { label: "Quốc tế", value: "quocte" },
                        ]}
                      />
                    </Form.Item></Col>
                </Row>
               
                 
                <Form.Item label="📝 Mô tả Tour" name="descriptionTour" className="mt-6">
                  <ReactQuill className="h-[300px]"
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    modules={modules} />
                </Form.Item>
              </Col>

              {/* Cột phải */}
              <Col xs={24} lg={8}>

                <Form.Item
                  required={false}
                  label={requiredLabel("Chọn Phương Tiện")}
                  name="itemTransport"
                  rules={[{ required: true, message: "Vui lòng chọn Phương Tiện" }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn phương tiện"
                    mode="multiple"               // cho phép chọn nhiều
                    allowClear
                  >
                    {transports?.map((transport: any) => (
                      <Option key={transport?._id} value={transport._id}>
                        {transport.transportName} - {transport.transportType}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  required={false}
                  label={requiredLabel("Ảnh Tour")}
                  name="imageTour"
                  rules={[
                    {
                      validator: () => {
                        if (fileList.length === 0) {
                          return Promise.reject(new Error('Vui lòng chọn ít nhất 1 ảnh Tour'));
                        }
                        // Kiểm tra các file đã upload thành công (status === 'done')
                        const hasSuccessFile = fileList.some(file => file.status === 'done');
                        if (!hasSuccessFile) {
                          return Promise.reject(new Error('Vui lòng đợi ảnh upload xong hoặc chọn ảnh hợp lệ'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                    data={{ upload_preset: 'demo-upload' }}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    multiple
                    // disabled={isPending}
                    accept="image/png, image/jpeg"
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  {previewImage && (
                    <Image
                      wrapperStyle={{ display: "none" }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </Form.Item>
                <Form.Item name="featured" label="Sản phẩm nổi bật" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Col>

              {/* Nút Submit */}
              <Col span={24}>
                <Form.Item>
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
