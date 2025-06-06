/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Image, Input, InputNumber, message, Row, Select, Upload, type FormProps, type GetProp, type UploadFile, type UploadProps } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import instance from "../../configs/axios";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const AddTour = () => {
  const [value, setValue] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const requiredLabel = (text: string) => (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );

  const { mutate } = useMutation({
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
        content: "Bạn thêm phòng thành công",
      });
      form.resetFields();
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Bạn thêm phòng thất bại. Vui lòng thử lại sau!",
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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">➕ Thêm Tour Mới</h1>
        </div>
        {contextHolder}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <Form layout="vertical" name="add-tour" validateTrigger="onBlur"
            onFinish={onFinish}
            form={form}>
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
                        { required: true, message: "Nhập điểm đến" },
                        { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                      ]}
                    >
                      <Input placeholder="VD: Đà Nẵng" size="large" />
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
                  <Col span={8}>
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
                      />
                    </Form.Item>
                  </Col>


                  <Col span={8}>
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


                  <Col span={8}>
                    <Form.Item label="Giá Khuyến Mãi" name="promotion_price">
                      <Input type="number" placeholder="VD: 1200000" size="large" />
                    </Form.Item>
                  </Col>
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
                </Form.Item>

                <Form.Item
                  required={false}
                  label={requiredLabel("Ảnh Phòng")}
                  name="imageTour"
                  rules={[
                    {
                      validator: () => {
                        if (fileList.length === 0) {
                          return Promise.reject(new Error('Vui lòng chọn ít nhất 1 ảnh phòng'));
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
