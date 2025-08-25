/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import instanceClient from "../../../configs/instance";
import { useState, useEffect } from "react";
import { Col, Form, Input, Row, Select, DatePicker, Button, message, Modal } from "antd";
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
  const navigate = useNavigate();

  // Lấy id từ params và kiểm tra
  const { id } = useParams();

  // Hàm tính tuổi từ ngày sinh
  const getAge = (birthDate: any) => {
    if (!birthDate) return 0;
    const today = dayjs();
    const dob = dayjs(birthDate);
    return today.diff(dob, "year");
  };

  // Kiểm tra id hợp lệ
  useEffect(() => {
    if (!id || id === 'undefined') {
      message.error('Không tìm thấy thông tin slot tour, vui lòng chọn lại tour!');
      // Chuyển về trang danh sách tour sau 2 giây
      setTimeout(() => {
        navigate('/destinations');
      }, 2000);
    }
  }, [id, navigate]);

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

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("Bạn cần đăng nhập trước khi đặt tour.");
        if (!id) throw new Error("Slot ID không hợp lệ.");

        const { userId: any, slotId: __, ...restData } = data;

        // Xử lý dữ liệu trước khi gửi
        const payload = {
          userId,
          slotId: id,
          ...restData,
        };

        console.log("Sending payload:", payload);
        const res = await instanceClient.post(`/bookingTour`, payload);
        return res.data;
      } catch (error) {
        console.error("Error in booking:", error);
        const err = error as AxiosError<any>;

        // Xử lý các loại lỗi khác nhau
        if (err.response) {
          // Lỗi từ server với response
          const errorData = err.response.data;
          console.error("Server error response:", errorData);

          if (errorData.message) {
            throw new Error(errorData.message);
          } else if (errorData.error) {
            throw new Error(errorData.error);
          } else if (Array.isArray(errorData.messages) && errorData.messages.length > 0) {
            throw new Error(errorData.messages[0]);
          }
        }

        // Lỗi khác
        throw new Error((error as Error).message || 'Đã có lỗi xảy ra khi đặt tour');
      }
    },
    onSuccess: async (data) => {
      console.log('Dữ liệu trả về:', data);
      const bookingId = data.booking._id;

      // Nếu có URL thanh toán VNPay, chuyển hướng trực tiếp
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // Nếu phương thức là chuyển khoản nhưng không có paymentUrl, gọi API để lấy URL
      const paymentMethod = data.booking.payment_method;
      if (paymentMethod === "bank_transfer") {
        try {
          const res = await instanceClient.post(`/vnpay/${bookingId}`);
          console.log("VNPay response:", res?.data);

          if (res.data?.success && res.data?.paymentUrl) {
            window.location.href = res.data.paymentUrl;
          } else {
            message.error("Không thể lấy liên kết thanh toán từ VNPay");
            navigate(`/booking/${bookingId}`);
          }
        } catch (error) {
          console.error("Lỗi khi kết nối VNPay:", error);
          message.error("Đã xảy ra lỗi khi kết nối VNPay");
          navigate(`/booking/${bookingId}`);
        }
      } else if (paymentMethod === "cash") {
        // Xử lý khi thanh toán tiền mặt
        const deadline = data.booking?.cashPaymentDeadline ? new Date(data.booking.cashPaymentDeadline) : new Date(Date.now() + 48 * 60 * 60 * 1000);
        const deadlineStr = deadline.toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });

        Modal.success({
          title: "Đặt tour thành công!",
          content: (
            <div>
              <p>Bạn đã chọn thanh toán tiền mặt tại văn phòng.</p>
              <p className="mt-2 font-semibold">Thông tin thanh toán:</p>
              <ul className="pl-5 mt-1 list-disc">
                <li>Mã đặt tour: {bookingId}</li>
                <li>Số tiền cần thanh toán: {data.depositAmount?.toLocaleString() || Math.round(data.totalAmount * 0.5).toLocaleString()} VNĐ</li>
                <li className="font-semibold text-red-600">Hạn thanh toán: {deadlineStr}</li>
                <li>Địa chỉ: Số 81A ngõ 295 - Phố Bằng Liệt - Phường Lĩnh Nam - Quận Hoàng Mai - Hà Nội</li>
                <li>Thời gian: 9h00 - 17h30 từ thứ 2 - đến thứ 6 và 9h00 - 12h00 thứ 7</li>
              </ul>
              <div className="p-3 mt-3 border border-red-200 rounded bg-red-50">
                <p className="font-semibold text-red-600">⚠️ LƯU Ý QUAN TRỌNG:</p>
                <ul className="mt-1 text-sm text-red-600">
                  <li>• Bạn có 48 giờ để thanh toán tiền cọc kể từ thời điểm đặt tour</li>
                  <li>• Tour sẽ tự động bị hủy nếu quá thời hạn thanh toán</li>
                  <li>• Vui lòng đến văn phòng trước thời hạn để hoàn tất thanh toán</li>
                </ul>
              </div>
            </div>
          ),
          onOk: () => {
            navigate(`/booking/${bookingId}`);
          },
        });
      } else {
        // Nếu không phải thanh toán qua VNPay, chuyển về trang chi tiết booking
        message.success(data.message || "Đặt tour thành công");
        setTimeout(() => {
          navigate(`/booking/${bookingId}`);
        }, 1500);
      }
    },
    onError(error: Error) {
      message.error(error.message || "Đặt tour thất bại!");
    },
  });

  const onFinish = (values: any) => {
    // Chuyển đổi isFullPayment từ chuỗi sang boolean
    const isFullPayment = values.isFullPayment === "true";

    // Kiểm tra nếu là thanh toán cọc và phương thức thanh toán không phải là bank_transfer
    if (!isFullPayment && values.payment_method !== "bank_transfer") {
      // Hiển thị modal thông báo
      setDepositModalVisible(true);
      return;
    }

    // Xử lý các trường ngày tháng
    const processPassengers = (passengers: any[]) => {
      if (!passengers) return [];

      return passengers.map(p => ({
        ...p,
        // Chuyển đổi đối tượng dayjs thành chuỗi ISO nếu cần
        birthDate: p.birthDate ? p.birthDate.toISOString() : null
      }));
    };

    // Bổ sung adultsTour và isFullPayment vào payload
    mutate({
      ...values,
      isFullPayment,
      adultsTour: adultCount,
      childrenTour: kidCount,
      toddlerTour: childCount,
      infantTour: babyCount,
      adultPassengers: processPassengers(values.adultPassengers),
      childPassengers: processPassengers(values.childPassengers),
      toddlerPassengers: processPassengers(values.toddlerPassengers),
      infantPassengers: processPassengers(values.infantPassengers)
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

  // Modal thông báo khi chọn thanh toán cọc nhưng không chọn VNPay
  const [depositModalVisible, setDepositModalVisible] = useState(false);

  const handleDepositConfirm = () => {
    // Ngăn chặn multiple clicks
    if (isLoading) return;

    setDepositModalVisible(false);

    // Lấy tất cả giá trị form hiện tại
    const formValues = form.getFieldsValue();

    // Cập nhật phương thức thanh toán thành VNPay
    formValues.payment_method = "bank_transfer";

    // Xử lý các trường ngày tháng
    const processPassengers = (passengers: any[]) => {
      if (!passengers) return [];

      return passengers.map(p => ({
        ...p,
        birthDate: p.birthDate ? p.birthDate.toISOString() : null
      }));
    };

    // Gọi API với phương thức thanh toán đã cập nhật
    mutate({
      ...formValues,
      isFullPayment: formValues.isFullPayment,
      adultsTour: adultCount,
      childrenTour: kidCount,
      toddlerTour: childCount,
      infantTour: babyCount,
      adultPassengers: processPassengers(formValues.adultPassengers),
      childPassengers: processPassengers(formValues.childPassengers),
      toddlerPassengers: processPassengers(formValues.toddlerPassengers),
      infantPassengers: processPassengers(formValues.infantPassengers)
    });
  };

  const handleCashPayment = () => {
    // Ngăn chặn multiple clicks
    if (isLoading) return;

    setDepositModalVisible(false);

    // Lấy tất cả giá trị form hiện tại
    const formValues = form.getFieldsValue();

    // Đảm bảo phương thức thanh toán là tiền mặt
    formValues.payment_method = "cash";

    // Xử lý các trường ngày tháng
    const processPassengers = (passengers: any[]) => {
      if (!passengers) return [];

      return passengers.map(p => ({
        ...p,
        birthDate: p.birthDate ? p.birthDate.toISOString() : null
      }));
    };

    // Gọi API với phương thức thanh toán tiền mặt
    mutate({
      ...formValues,
      isFullPayment: formValues.isFullPayment,
      adultsTour: adultCount,
      childrenTour: kidCount,
      toddlerTour: childCount,
      infantTour: babyCount,
      adultPassengers: processPassengers(formValues.adultPassengers),
      childPassengers: processPassengers(formValues.childPassengers),
      toddlerPassengers: processPassengers(formValues.toddlerPassengers),
      infantPassengers: processPassengers(formValues.infantPassengers)
    });
  };

  return (
    <div className="min-h-screen px-2 py-8 mt-20 bg-gray-50 md:px-8">
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
      > <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl lg:grid-cols-3">
          {/* Left: Form */}
          <div className="p-6 space-y-6 bg-white shadow lg:col-span-2 rounded-xl">

            {/* Thông tin liên lạc */}
            <div className="mb-2 text-lg font-bold">THÔNG TIN LIÊN LẠC</div>
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
              <div className="mb-2 text-lg font-bold">HÀNH KHÁCH</div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Người lớn */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${adultCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold">Người lớn</span>
                  </div>
                  <div className="flex items-center mb-4 text-xs text-gray-600">
                    Từ 16 trở lên
                    <span className="ml-1 text-gray-400" title="Từ 12 tuổi trở lên">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="px-2 text-2xl" onClick={() => handleAdultCountChange(Math.max(1, adultCount - 1))}>-</button>
                    <span className="w-6 text-xl font-semibold text-center">{adultCount}</span>
                    <button type="button" className="px-2 text-2xl" onClick={() => handleAdultCountChange(adultCount + 1)}>+</button>
                  </div>
                </div>
                {/* Trẻ nhỏ */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${childCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold">Trẻ nhỏ</span>
                  </div>
                  <div className="flex items-center mb-4 text-xs text-gray-600">
                    Từ 2 - 4 tuổi
                    <span className="ml-1 text-gray-400" title="Từ 2 - 4 tuổi">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="px-2 text-2xl" onClick={() => setChildCount(Math.max(0, childCount - 1))}>-</button>
                    <span className="w-6 text-xl font-semibold text-center">{childCount}</span>
                    <button type="button" className="px-2 text-2xl" onClick={() => setChildCount(childCount + 1)}>+</button>
                  </div>
                </div>
                {/* Trẻ em */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${kidCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold">Trẻ em</span>
                  </div>
                  <div className="flex items-center mb-4 text-xs text-gray-600">
                    Từ 5 - 11 tuổi
                    <span className="ml-1 text-gray-400" title="Từ 5 - 11 tuổi">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="px-2 text-2xl" onClick={() => setKidCount(Math.max(0, kidCount - 1))}>-</button>
                    <span className="w-6 text-xl font-semibold text-center">{kidCount}</span>
                    <button type="button" className="px-2 text-2xl" onClick={() => setKidCount(kidCount + 1)}>+</button>
                  </div>
                </div>
                {/* Em bé */}
                <div className={`border rounded-xl p-4 flex flex-col justify-between ${babyCount > 0 ? 'border-black' : 'border-gray-300'} transition`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold">Em bé</span>
                  </div>
                  <div className="flex items-center mb-4 text-xs text-gray-600">
                    Dưới 2 tuổi
                    <span className="ml-1 text-gray-400" title="Dưới 2 tuổi">ℹ️</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button type="button" className="px-2 text-2xl" onClick={() => setBabyCount(Math.max(0, babyCount - 1))}>-</button>
                    <span className="w-6 text-xl font-semibold text-center">{babyCount}</span>
                    <button type="button" className="px-2 text-2xl" onClick={() => setBabyCount(babyCount + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin hành khách - Người lớn */}
            {adultCount > 0 && (
              <div>
                <div className="flex items-center mb-4">  
                  <span className="mr-2 text-2xl">👥</span>
                  <span className="text-lg font-bold">Người lớn</span>
                  <span className="ml-2 italic text-gray-600">(Từ 16 tuổi trở lên)</span>
                </div>
                <Form.List name="adultPassengers">
                  {(fields) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                key={field.key + "_fullName"}
                                name={[field.name, 'fullName']}
                                fieldKey={[field.fieldKey, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                key={field.key + "_gender"}
                                name={[field.name, 'gender']}
                                fieldKey={[field.fieldKey, 'gender']}
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
                                key={field.key + "_birthDate"}
                                name={[field.name, 'birthDate']}
                                fieldKey={[field.fieldKey, 'birthDate']}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập ngày tháng năm sinh' },
                                  {
                                    validator: (_, value) => {
                                      const age = getAge(value);
                                      if (age < 16) {
                                        return Promise.reject("Người lớn phải từ 16 tuổi trở lên");
                                      }
                                      return Promise.resolve();
                                    }
                                  }
                                ]}
                              >
                                <DatePicker />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <div className="flex flex-col items-start">
                                <label className="block mb-1 text-sm font-bold">Phòng đơn</label>
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
                                  <span className="mt-1 text-xs text-gray-500">
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
                  <span className="mr-2 text-2xl">👥</span>
                  <span className="text-lg font-bold">Trẻ nhỏ</span>
                  <span className="ml-2 italic text-gray-600">(Từ 2 - 4 tuổi)</span>
                </div>
                <Form.List name="toddlerPassengers">
                  {(fields) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                key={field.key + "_fullName"}
                                name={[field.name, 'fullName']}
                                fieldKey={[field.fieldKey, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                key={field.key + "_gender"}
                                name={[field.name, 'gender']}
                                fieldKey={[field.fieldKey, 'gender']}
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
                                key={field.key + "_birthDate"}
                                name={[field.name, 'birthDate']}
                                fieldKey={[field.fieldKey, 'birthDate']}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập ngày tháng năm sinh' },
                                  {
                                    validator: (_, value) => {
                                      const age = getAge(value);
                                      if (age < 2 || age > 4) {
                                        return Promise.reject("Trẻ nhỏ phải từ 2 đến 4 tuổi");
                                      }
                                      return Promise.resolve();
                                    }
                                  }
                                ]}
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
                  <span className="mr-2 text-2xl">👥</span>
                  <span className="text-lg font-bold">Trẻ em</span>
                  <span className="ml-2 italic text-gray-600">(Từ 5 - 11 tuổi)</span>
                </div>
                <Form.List name="childPassengers">
                  {(fields) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                key={field.key + "_fullName"}
                                name={[field.name, 'fullName']}
                                fieldKey={[field.fieldKey, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                key={field.key + "_gender"}
                                name={[field.name, 'gender']}
                                fieldKey={[field.fieldKey, 'gender']}
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
                                key={field.key + "_birthDate"}
                                name={[field.name, 'birthDate']}
                                fieldKey={[field.fieldKey, 'birthDate']}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập ngày tháng năm sinh' },
                                  {
                                    validator: (_, value) => {
                                      const age = getAge(value);
                                      if (age < 5 || age > 11) {
                                        return Promise.reject("Trẻ em phải từ 5 đến 11 tuổi");
                                      }
                                      return Promise.resolve();
                                    }
                                  }
                                ]}
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
                  <span className="mr-2 text-2xl">👥</span>
                  <span className="text-lg font-bold">Em bé</span>
                  <span className="ml-2 italic text-gray-600">(Dưới 2 tuổi)</span>
                </div>
                <Form.List name="infantPassengers">
                  {(fields) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} style={{ display: 'flex' }}>
                          <Row gutter={24}>
                            <Col span={10}>
                              <Form.Item
                                key={field.key + "_fullName"}
                                name={[field.name, 'fullName']}
                                fieldKey={[field.fieldKey, 'fullName']}
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                              >
                                <Input placeholder="Nhập họ tên" size="large" />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <Form.Item
                                key={field.key + "_gender"}
                                name={[field.name, 'gender']}
                                fieldKey={[field.fieldKey, 'gender']}
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
                                key={field.key + "_birthDate"}
                                name={[field.name, 'birthDate']}
                                fieldKey={[field.fieldKey, 'birthDate']}
                                rules={[
                                  { required: true, message: 'Vui lòng nhập ngày tháng năm sinh' },
                                  {
                                    validator: (_, value) => {
                                      const age = getAge(value);
                                      if (age >= 2) {
                                        return Promise.reject("Em bé phải dưới 2 tuổi");
                                      }
                                      return Promise.resolve();
                                    }
                                  }
                                ]}
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
              <div className="mb-2 text-lg font-bold">GHI CHÚ</div>
              <Form.Item name="note">
                <TextArea
                  rows={4}
                  placeholder="Vui lòng nhập nội dung lời nhắn bằng tiếng Anh hoặc tiếng Việt"
                />
              </Form.Item>
            </div>
          </div>

          {/* Right: Tóm tắt chuyến đi */}
          <div className="p-6 space-y-6 bg-white shadow rounded-xl">
            <div className="mb-2 text-lg font-bold">TÓM TẮT CHUYẾN ĐI</div>
            <div className="flex items-center space-x-4">
              <img src={tours?.tour?.imageTour[0]} alt="tour" className="object-cover w-24 h-20 border rounded-lg" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{tours?.tour?.nameTour}</div>
                <div className="mt-1 text-xs text-gray-500">Mã tour: {tours?.tour?._id}</div>
              </div>
            </div>
            {/* Thông tin chuyến bay */}
            <div className="p-3 text-sm rounded bg-gray-50">
              <div className="mb-1 font-semibold">THÔNG TIN DI CHUYỂN</div>
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
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Giá Combo </span>
              <span className="text-lg font-bold text-red-600">{tours?.tour?.finalPrice.toLocaleString()} ₫</span>
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
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold">Tổng tiền</span>
              <span className="text-2xl font-bold text-red-600">
                {totalPrice.toLocaleString()} ₫
              </span>
            </div>
            <div className="flex flex-col items-start p-4 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">
                Phương thức thanh toán
              </h4>

              <Form.Item name="payment_method" rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}>
                <div className="flex flex-col w-full gap-2 text-sm text-gray-900">
                  {[
                    { id: "cash", label: "Tiền mặt" },
                    { id: "bank_transfer", label: "Thanh toán qua VNPay" },
                  ].map(({ id, label }) => (
                    <label key={id} htmlFor={id} className="inline-flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200">
                      <input
                        type="radio"
                        id={id}
                        value={id}
                        name="payment_method"
                        className="w-4 h-4 border rounded-full accent-blue-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Form.Item>

              <div className="w-full my-4 border-t border-gray-300"></div>

              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                Tùy chọn thanh toán
              </h4>

              <Form.Item name="isFullPayment" initialValue={false}>
                <div className="flex flex-col w-full gap-2 text-sm text-gray-900">
                  {[
                    {
                      id: "deposit",
                      label: `Đặt cọc 50%`,
                      description: `${Math.round(totalPrice * 0.5).toLocaleString()} ₫`,
                      note: "Thanh toán phần còn lại trước khi khởi hành tour"
                    },
                    {
                      id: "full",
                      label: `Thanh toán đầy đủ`,
                      description: `${totalPrice.toLocaleString()} ₫`,
                      note: "Thanh toán toàn bộ chi phí ngay bây giờ"
                    },
                  ].map(({ id, label, description, note }) => (
                    <label key={id} htmlFor={id} className="inline-flex items-start gap-2 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-200">
                      <input
                        type="radio"
                        id={id}
                        value={id === "full" ? "true" : "false"}
                        name="isFullPayment"
                        defaultChecked={id === "deposit"}
                        className="w-4 h-4 mt-1 border rounded-full accent-blue-600"
                      />
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="font-semibold text-red-600">{description}</div>
                        <div className="text-xs text-gray-500">{note}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Form.Item>

              <div className="flex items-center mt-4">
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
              htmlType="submit"
              className="w-full py-3 font-semibold text-white transition bg-blue-700 rounded-md hover:bg-blue-800"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Hoàn tất đặt tour"}
            </Button>
          </div>
        </div></Form>

      {/* Modal thông báo khi chọn thanh toán cọc nhưng không chọn VNPay */}
      <Modal
        title={<div className="text-xl font-bold text-blue-700">Lựa chọn phương thức đặt cọc</div>}
        open={depositModalVisible}
        onCancel={isLoading ? undefined : () => setDepositModalVisible(false)}
        closable={!isLoading}
        maskClosable={!isLoading}
        footer={null}
        width={600}
        centered
      >
        <div className="py-4">
          <div className="flex items-center mb-4 text-yellow-500">
            <span className="mr-3 text-3xl">ℹ️</span>
            <span className="text-lg font-semibold">Lựa chọn phương thức thanh toán đặt cọc</span>
          </div>

          <p className="mb-4 text-gray-700">
            Bạn có thể chọn một trong các phương thức thanh toán đặt cọc sau:
          </p>

          <div className="space-y-4">
            {/* Tùy chọn thanh toán VNPay */}
            <div
              className={`bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 ${!isLoading ? 'hover:bg-blue-100' : 'opacity-50'}`}
            >
              <div className="flex items-center mb-2">
                <span className="mr-2 text-xl">💳</span>
                <h3 className="font-semibold text-blue-700">Thanh toán qua VNPay (Khuyến nghị)</h3>
              </div>
              <ul className="pl-5 text-gray-700 list-disc">
                <li>Số tiền cần thanh toán: <span className="font-semibold text-red-600">{Math.round(totalPrice * 0.5).toLocaleString()} ₫</span></li>
                <li>Thanh toán ngay trực tuyến qua thẻ</li>
                <li>Xác nhận đặt tour ngay lập tức</li>
                <li>Đảm bảo giữ chỗ cho tour</li>
              </ul>
              <div className="mt-3 text-right">
                <Button
                  type="primary"
                  onClick={handleDepositConfirm}
                  className="bg-blue-600"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Tiếp tục với VNPay"}
                </Button>
              </div>
            </div>

            {/* Tùy chọn thanh toán tiền mặt */}
            <div
              className={`bg-green-50 p-4 rounded-lg border border-green-200 ${!isLoading ? 'hover:bg-green-100' : 'opacity-50'}`}
            >
              <div className="flex items-center mb-2">
                <span className="mr-2 text-xl">💵</span>
                <h3 className="font-semibold text-green-700">Thanh toán tiền mặt tại văn phòng</h3>
              </div>
              <ul className="pl-5 text-gray-700 list-disc">
                <li>Số tiền cần đặt cọc: <span className="font-semibold text-red-600">{Math.round(totalPrice * 0.5).toLocaleString()} ₫</span></li>
                <li>Địa chỉ: Số 81A ngõ 295 - Phố Bằng Liệt - Phường Lĩnh Nam - Quận Hoàng Mai - Hà Nội</li>
                <li>Thời gian: 9h00 - 17h30 từ thứ 2 - đến thứ 6 và 9h00 - 12h00 thứ 7</li>
                <li><span className="font-medium text-red-500">Lưu ý:</span> Tour chỉ được xác nhận sau khi đã thanh toán đặt cọc</li>
              </ul>
              <div className="mt-3 text-right">
                <Button
                  type="default"
                  onClick={handleCashPayment}
                  className="text-white bg-green-600 hover:bg-green-700"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Thanh toán tiền mặt"}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button
              onClick={() => setDepositModalVisible(false)}
              disabled={isLoading}
            >
              Quay lại chỉnh sửa
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Checkout;
