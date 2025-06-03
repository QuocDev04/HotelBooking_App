import { Button, Col, Form, Input, Row, Select } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddTour = () => {
  const requiredLabel = (text: string) => (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">➕ Thêm Tour Mới</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <Form layout="vertical" name="add-tour" validateTrigger="onBlur">
            <Row gutter={[32, 32]}>
              {/* Cột trái */}
              <Col xs={24} lg={16}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Tên Tour")}
                  name="nameRoom"
                  rules={[{ required: true, message: "Tên Tour không được để trống" }]}
                >
                  <Input placeholder="VD: Tour Hạ Long 3N2Đ" size="large" />
                </Form.Item>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Điểm Đến")}
                      name="capacityRoom"
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
                      name="priceRoom"
                      rules={[
                        { required: true, message: "Nhập nơi xuất phát" },
                        { min: 2, max: 100, message: "Phải từ 2–100 ký tự" },
                      ]}
                    >
                      <Input placeholder="VD: Hà Nội" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label={requiredLabel("Số Ngày")} name="addressRoom" 
                      required={false}
                                >
                      <Input placeholder="VD: 3 ngày 2 đêm" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      required={false}
                      label={requiredLabel("Giá mỗi đêm")}
                      name="pricePerNight"
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
                      <Input type="number" placeholder="VD: 1500000" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label={requiredLabel("Số người tối đa")} name="maxPeople" 
                      required={false}
                                >
                      <Input placeholder="VD: 20" size="large" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="Giá Khuyến Mãi" name="discountPrice">
                      <Input type="number" placeholder="VD: 1200000" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="📝 Mô tả Tour" name="descriptionRoom" className="mt-6">
                  <ReactQuill className="h-[300px]" theme="snow" />
                </Form.Item>
              </Col>

              {/* Cột phải */}
              <Col xs={24} lg={8}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Loại Tour")}
                  name="typeRoom"
                  rules={[{ required: true, message: "Vui lòng chọn loại tour" }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn loại tour"
                    options={[
                      { label: "Nội địa", value: "noi-dia" },
                      { label: "Quốc tế", value: "quoc-te" },
                    ]}
                  />
                </Form.Item>

                {/* (Tuỳ chọn) Upload ảnh hoặc thêm lựa chọn khác */}
              </Col>

              {/* Nút Submit */}
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200"
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
