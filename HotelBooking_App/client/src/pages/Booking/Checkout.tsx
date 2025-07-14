/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import instanceClient from "../../../configs/instance";
import { useState, useEffect } from "react";
import { Col, Form, Input, Row, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { AxiosError } from "axios";

// Khởi tạo plugin
dayjs.extend(utc);
dayjs.extend(timezone);
const { TextArea } = Input;




const Checkout = () => {
  const [form] = Form.useForm();
  const [singleRoom, setSingleRoom] = useState([false]);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [kidCount, setKidCount] = useState(0);
  const [babyCount, setBabyCount] = useState(0);
  const handleAdultCountChange = (newCount: any) => {
    setAdultCount(newCount);
    setSingleRoom((prev) => {
      const newArray = [...prev];
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) newArray.push(false);
      } else if (newCount < prev.length) {
        newArray.length = newCount;
      }
      return newArray;
    });
  };

  const handleToggleSingleRoom = (index: number) => {
    setSingleRoom((prev) => {
      const newSingleRoom = [...prev];
      newSingleRoom[index] = !newSingleRoom[index];

      // Cập nhật vào form
      const currentAdults = form.getFieldValue("adultPassengers") || [];
      currentAdults[index] = {
        ...currentAdults[index],
        singleRoom: newSingleRoom[index],
      };
      form.setFieldsValue({ adultPassengers: currentAdults });

      return newSingleRoom;
    });
  };

  // Cập nhật form fields khi số lượng thay đổi
  useEffect(() => {
    const currentValues = form.getFieldsValue();

    const syncList = (fieldName: string, count: number) => {
      const currentList = currentValues[fieldName] || [];

      if (count > currentList.length) {
        const newList = [...currentList];
        for (let i = currentList.length; i < count; i++) {
          newList.push({ fullName: '', gender: 'Nam', birthDate: null, singleRoom: singleRoom[i] || false, });
        }
        form.setFieldsValue({ [fieldName]: newList });
      } else if (count < currentList.length) {
        // Giữ lại phần đã nhập, chỉ cắt bớt nếu cần
        const newList = currentList.slice(0, count);
        form.setFieldsValue({ [fieldName]: newList });
      }
    };

    syncList('adultPassengers', adultCount);
    syncList('childPassengers', kidCount);
    syncList('toddlerPassengers', childCount);
    syncList('infantPassengers', babyCount);
  }, [adultCount, kidCount, childCount, babyCount, form]);


  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['/date/slot', id],
    queryFn: () => instanceClient.get(`/date/slot/${id}`)
  });

  const tours = data?.data?.data;
  console.log(tours);

  const totalSingleRoomPrice = singleRoom.reduce(
    (sum, val) => (val ? sum + (tours?.tour?.priceSingleRoom || 0) : sum),
    0
  );

  const requiredLabel = (text: string) => (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("Bạn cần đăng nhập trước khi đặt tour.");
        if (!id) throw new Error("Slot ID không hợp lệ.");

        const { userId: any, slotId: __, ...restData } = data;

        const payload = {
          userId,
          slotId: id,
          ...restData,
        };

        const res = await instanceClient.post(`/bookingTour`, payload);
        return res.data;
      } catch (error) {
        const err = error as AxiosError<{ messages: string[] }>;
        const errorMessages = err?.response?.data?.messages;
        throw new Error(errorMessages?.[0] || (error as Error).message || 'Đã có lỗi xảy ra');
      }
    },
    onSuccess(data) {
      window.location.href = data.paymentUrl
    },
    onError(error: Error) {
      message.error(error.message || "Đặt tour thất bại!");
    },
  });

  const onFinish = (values: any) => {
    // Bổ sung adultsTour vào payload
    mutate({
      ...values,
      adultsTour: adultCount,
      childrenTour: kidCount,
      toddlerTour: childCount,
      infantTour: babyCount
    });
  };


  const totalPrice = (adultCount * (tours?.tour?.finalPrice || 0) +
    totalSingleRoomPrice +
    kidCount * (tours?.tour?.priceChildren || 0) +
    childCount * (tours?.tour?.priceLittleBaby || 0));
  const onGenderChange = (index: number, newGender: string) => {
    const currentValues = form.getFieldValue('adultPassengers') || [];
    const updated = [...currentValues];

    // Giữ nguyên các trường khác
    updated[index] = {
      ...updated[index],
      gender: newGender,
    };

    form.setFieldsValue({ adultPassengers: updated });
  };
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-2 md:px-8 mt-20">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          adultPassengers: [{ fullName: '', gender: '', birthDate: null }],
          childPassengers: [{ fullName: '', gender: '', birthDate: null }],
          toddlerPassengers: [{ fullName: '', gender: '', birthDate: null }],
          infantPassengers: [{ fullName: '', gender: '', birthDate: null }]
        }}
      > <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">

            {/* Thông tin liên lạc */}
            <div className="font-bold text-lg mb-2">THÔNG TIN LIÊN LẠC</div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Họ tên")}
                  name="fullNameUser"
                  rules={[{ required: true, message: "Họ tên không được để trống" }]}
                >
                  <Input placeholder="Nhập họ tên của bạn" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Điện thoại")}
                  name="phone"
                  rules={[
                    { required: true, message: "Điện thoại không được để trống" },
                    { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  required={false}
                  label={requiredLabel("Email")}
                  name="email"
                  rules={[
                    { required: true, message: "Email không được để trống" },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input placeholder="Nhập email của bạn" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                >
                  <Input placeholder="Nhập địa chỉ (không bắt buộc)" size="large" />
                </Form.Item>
              </Col>
            </Row>

            {/* Hành khách */}
            <div>
              <div className="font-bold text-lg mb-2">HÀNH KHÁCH</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Người lớn */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${adultCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base">Người lớn</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-4">
                    Từ 12 trở lên
                    <span className="ml-1 text-gray-400" title="Từ 12 tuổi trở lên">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="text-2xl px-2" onClick={() => handleAdultCountChange(Math.max(1, adultCount - 1))}>-</button>
                    <span className="text-xl font-semibold w-6 text-center">{adultCount}</span>
                    <button type="button" className="text-2xl px-2" onClick={() => handleAdultCountChange(adultCount + 1)}>+</button>
                  </div>
                </div>
                {/* Trẻ nhỏ */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${childCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base">Trẻ nhỏ</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-4">
                    Từ 2 - 4 tuổi
                    <span className="ml-1 text-gray-400" title="Từ 2 - 4 tuổi">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="text-2xl px-2" onClick={() => setChildCount(Math.max(0, childCount - 1))}>-</button>
                    <span className="text-xl font-semibold w-6 text-center">{childCount}</span>
                    <button type="button" className="text-2xl px-2" onClick={() => setChildCount(childCount + 1)}>+</button>
                  </div>
                </div>
                {/* Trẻ em */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${kidCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base">Trẻ em</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-4">
                    Từ 5 - 11 tuổi
                    <span className="ml-1 text-gray-400" title="Từ 5 - 11 tuổi">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="text-2xl px-2" onClick={() => setKidCount(Math.max(0, kidCount - 1))}>-</button>
                    <span className="text-xl font-semibold w-6 text-center">{kidCount}</span>
                    <button type="button" className="text-2xl px-2" onClick={() => setKidCount(kidCount + 1)}>+</button>
                  </div>
                </div>
                {/* Em bé */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${babyCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base">Em bé</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 mb-4">
                    Dưới 2 tuổi
                    <span className="ml-1 text-gray-400" title="Dưới 2 tuổi">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="text-2xl px-2" onClick={() => setBabyCount(Math.max(0, babyCount - 1))}>-</button>
                    <span className="text-xl font-semibold w-6 text-center">{babyCount}</span>
                    <button type="button" className="text-2xl px-2" onClick={() => setBabyCount(babyCount + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin hành khách - Người lớn */}
            {adultCount > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">👥</span>
                  <span className="font-bold text-lg">Người lớn</span>
                  <span className="italic text-gray-600 ml-2">(Từ 12 tuổi trở lên)</span>
                </div>
                <Form.List name="adultPassengers">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'gender']}
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                              >
                                <Select
                                  placeholder="Chọn giới tính"
                                  options={[
                                    { label: 'Nam', value: 'Nam' },
                                    { label: 'Nữ', value: 'Nữ' },
                                  ]}
                                  onChange={(value) => onGenderChange(index, value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'birthDate']}
                                rules={[{ required: true, message: 'Vui lòng nhập ngày tháng năm sinh' }]}
                              >
                                <DatePicker />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <div className="flex flex-col items-start">
                                <label className="block text-sm font-bold mb-1">Phòng đơn</label>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSingleRoom(index)}
                                  className={`relative w-10 h-6 flex items-center rounded-full transition-colors duration-300 focus:outline-none border
          ${singleRoom[index]
                                      ? "bg-blue-500 border-blue-500"
                                      : "bg-gray-300 border-gray-400"
                                    }`}
                                >
                                  <span
                                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300
          ${singleRoom[index] ? "translate-x-4" : ""}`}
                                  />
                                </button>
                                {singleRoom[index] && (
                                  <span className="text-xs text-gray-500 mt-1">
                                    {tours?.tour?.priceSingleRoom?.toLocaleString()} <span className="italic">₫</span>
                                  </span>
                                )}
                              </div>
                            </Col>
                          </Row>

                        </div>
                      ))}
                    </>
                  )}
                </Form.List>

              </div>
            )}
            {/* Thông tin hành khách - Trẻ nhỏ */}
            {childCount > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">👥</span>
                  <span className="font-bold text-lg">Trẻ nhỏ</span>
                  <span className="italic text-gray-600 ml-2">(Từ 2 - 4 tuổi)</span>
                </div>
                <Form.List name="toddlerPassengers">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'gender']}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Chọn giới tính"
                                  options={[
                                    { label: 'Nam', value: 'Nam' },
                                    { label: 'Nữ', value: 'Nữ' },
                                  ]}
                                  onChange={(value) => onGenderChange(index, value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'birthDate']}
                                rules={[{ required: true }]}
                              >
                                <DatePicker />
                              </Form.Item>
                            </Col>

                          </Row>

                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </div>
            )}
            {/* Thông tin hành khách - Trẻ em */}
            {kidCount > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">👥</span>
                  <span className="font-bold text-lg">Trẻ em</span>
                  <span className="italic text-gray-600 ml-2">(Từ 5 - 11 tuổi)</span>
                </div>
                <Form.List name="childPassengers">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'gender']}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Chọn giới tính"
                                  options={[
                                    { label: 'Nam', value: 'Nam' },
                                    { label: 'Nữ', value: 'Nữ' },
                                  ]}
                                  onChange={(value) => onGenderChange(index, value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'birthDate']}
                                rules={[{ required: true }]}
                              >
                                <DatePicker />
                              </Form.Item>
                            </Col>

                          </Row>

                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </div>
            )}
            {/* Thông tin hành khách - Em bé */}
            {babyCount > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">👥</span>
                  <span className="font-bold text-lg">Em bé</span>
                  <span className="italic text-gray-600 ml-2">(Dưới 2 tuổi)</span>
                </div>
                <Form.List name="infantPassengers">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'gender']}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Chọn giới tính"
                                  options={[
                                    { label: 'Nam', value: 'Nam' },
                                    { label: 'Nữ', value: 'Nữ' },
                                  ]}
                                  onChange={(value) => onGenderChange(index, value)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'birthDate']}
                                rules={[{ required: true }]}
                              >
                                <DatePicker />
                              </Form.Item>
                            </Col>

                          </Row>

                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </div>
            )}

            {/* Ghi chú */}
            <div>
              <div className="font-bold text-lg mb-2">GHI CHÚ</div>
              <Form.Item name="note">
                <TextArea
                  rows={4}
                  placeholder="Vui lòng nhập nội dung lời nhắn bằng tiếng Anh hoặc tiếng Việt"
                />
              </Form.Item>
            </div>
          </div>

          {/* Right: Tóm tắt chuyến đi */}
          <div className="bg-white rounded-xl shadow p-6 space-y-6">
            <div className="font-bold text-lg mb-2">TÓM TẮT CHUYẾN ĐI</div>
            <div className="flex items-center space-x-4">
              <img src={tours?.tour?.imageTour[0]} alt="tour" className="w-24 h-20 object-cover rounded-lg border" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{tours?.tour?.nameTour}</div>
                <div className="text-xs text-gray-500 mt-1">Mã tour: {tours?.tour?._id}</div>
              </div>
            </div>
            {/* Thông tin chuyến bay */}
            <div className="bg-gray-50 rounded p-3 text-sm">
              <div className="font-semibold mb-1">THÔNG TIN DI CHUYỂN</div>
              <div className="flex justify-between mb-1">
                <span>Ngày đi - {dayjs(tours?.dateTour).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}</span>
                <span>17:05</span>
                <span className="text-gray-400">✈️</span>
                <span>18:50</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày về - 14/07/2025</span>
                <span>19:55</span>
                <span className="text-gray-400">✈️</span>
                <span>21:40</span>
              </div>
            </div>
            {/* Giá */}
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Giá Combo </span>
              <span className="text-red-600 font-bold text-lg">{tours?.tour?.finalPrice.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Người lớn</span>
              <span>{adultCount} x {tours?.tour?.finalPrice.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Trẻ em</span>
              <span>{kidCount} x {tours?.tour?.priceChildren.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Trẻ nhỏ</span>
              <span>{childCount} x {tours?.tour?.priceLittleBaby.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Em bé</span>
              <span>{babyCount} x 0₫</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Phụ thu phòng đơn</span>
              <span>{totalSingleRoomPrice.toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl">Tổng tiền</span>
              <span className="text-red-600 font-bold text-2xl">
                {totalPrice.toLocaleString()} ₫
              </span>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-md shadow-sm p-4 flex flex-col items-start">
              <h4 className="text-gray-900 text-lg font-semibold mb-4">
                Phương thức thanh toán
              </h4>

              <Form.Item name="payment_method" rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}>
                <div className="text-gray-900 text-sm w-full flex flex-col gap-2">
                  {[
                    { id: "cash", label: "Tiền mặt" },
                    { id: "bank_transfer", label: "Thanh Toán qua Vnpay" },
                  ].map(({ id, label }) => (
                    <label key={id} htmlFor={id} className="inline-flex items-center cursor-pointer gap-2">
                      <input
                        type="radio"
                        id={id}
                        value={id}
                        name="payment_method"
                        className="h-4 w-4 rounded-full accent-blue-600 border"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Form.Item>
              <div className="flex items-center">
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/paymentCard/amexLogo.svg"
                  alt="amexLogo"
                  className="h-6"
                />
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/paymentCard/visaLogoColored.svg"
                  alt="visaLogoColored"
                  className="h-6"
                />
                <img
                  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/paymentCard/masterCardLogo.svg"
                  alt="masterCardLogo"
                  className="h-6"
                />
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded text-lg transition"
              onClick={() => form.submit()}
            >
              XÁC NHẬN
            </Button>
          </div>
        </div></Form>

    </div>
  );
};

export default Checkout;
