/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import instanceClient from "../../../configs/instance";
import { Form, Input, message, type FormProps } from "antd";
import type { AxiosError } from "axios";

const BookingRoom = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['bookingTour', id],
    queryFn: () => instanceClient.get(`/bookingTour/${id}`)
  })
  const bookingTour = data?.data?.byId
  const formatDateVN = (dateString:any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(date);
  };
  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await instanceClient.post(`/checkOutBookingTour/${bookingTour._id}`, data)
        return response.data
      } catch (error) {
        const err = error as AxiosError<{ messages: string[] }>;
        const errorMessages = err?.response?.data?.messages;
        throw new Error(errorMessages?.[0] || 'Đã có lỗi xảy ra');
      }
    },
    onSuccess: async (data) => {
      console.log('Dữ liệu trả về:', data);
      const bookingId = data.payment._id;
      const paymentMethod = data?.payment?.payment_method;
      console.log('paymentMethod:', paymentMethod);

      if (paymentMethod === "bank_transfer") {
        try {
          const res = await instanceClient.post(`/vnpay/${bookingId}`, null, {
            params: {
              bookingType: 'tour',
            },
          });
          console.log("VNPay response:", res?.data);

          if (res.data?.success && res.data?.paymentUrl) {
            console.log("Chuyển trang tới VNPAY:", res.data.paymentUrl);
            window.location.href = res.data.paymentUrl;
          } else {
            console.log("Không có paymentUrl hoặc success false");
            message.error("Không thể lấy liên kết thanh toán từ VNPay");
          }
        } catch (error) {
          console.error("Lỗi khi kết nối VNPay:", error);
          message.error("Đã xảy ra lỗi khi kết nối VNPay");
        }
      } else {
        console.log("Không phải phương thức thanh toán bank_transfer");
      }
    },
    
    onError: (error: any) => {
      alert(error.message || 'Đặt tour thất bại');
    },
  })
  const onFinish: FormProps<any>["onFinish"] = (values) => {
    const newValues = {
      ...values,
      BookingTourId: bookingTour._id,
    };
    mutate(newValues);
  };
  return (
    <div className="max-w-screen-xl p-4 mx-auto font-sans">
      {/* Progress Bar */}
      <div className="flex items-center mt-25 mb-10 w-full ">
        {/* Step 1 */}
        <div className="flex items-center flex-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base border-2 border-blue-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="ml-2 font-medium text-black text-[15px]">
            Bạn chọn
          </span>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        </div>
        {/* Step 2 */}
        <div className="flex items-center flex-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-base border-2 border-blue-600">
            2
          </div>
          <span className="ml-2 font-medium text-blue-600 text-[15px]">
            Chi tiết về bạn
          </span>
          <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        </div>
        {/* Step 3 */}
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-white text-gray-400 flex items-center justify-center font-semibold text-base border-2 border-gray-300">
            3
          </div>
          <span className="ml-2 font-medium text-gray-400 text-[15px]">
            Hoàn tất đặt dịch vụ
          </span>
        </div>
      </div>

      {/* Bảng tổng hợp thông tin khách sạn & vé máy bay */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr className="bg-blue-50 text-blue-700 text-left">
              <th className="py-3 px-4 rounded-tl-xl">Dịch vụ</th>
              <th className="py-3 px-4">Thông tin</th>
              <th className="py-3 px-4 rounded-tr-xl">Tóm tắt giá</th>
            </tr>
          </thead>
          <tbody>
            {/* Khách sạn */}
            <tr className="border-b">
              <td className="py-3 px-4 align-top">
                <img
                  src={bookingTour?.tourId?.imageTour[0]}
                  alt="La Vela Saigon Hotel"
                  className="w-56 rounded mb-2"
                />
              </td>
              <td className="py-3 px-4 align-top">
                <div className="font-bold mb-1">{bookingTour?.tourId?.nameTour}</div>
                <div>
                  {bookingTour?.itemRoom?.map((item: any, index: any) => (
                    <div key={index} className="text-lg text-black mb-1">
                      {item.roomId?.nameRoom}
                    </div>
                  ))}
                </div>
                <div className="text-green-700 text-xs font-medium mb-1">
                  Vị trí tuyệt vời – <span className="font-bold">8.8</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Ngày đi: <b>{formatDateVN(bookingTour?.bookingDate)}</b> <br />
                  Ngày về: <b>{formatDateVN(bookingTour?.endTime)}</b> <br />
                  {bookingTour?.tourId?.duration} - {bookingTour?.adultsTour} người lớn - {bookingTour?.childrenTour} trẻ em
                </div>
              </td>
              <td className="py-10 px-4 align-top">
                <div className="font-semibold text-blue-700 mb-1">Tổng cộng</div>
                <div className="text-rose-600 font-bold text-2xl mb-1">
                  {bookingTour?.totalPriceBooking.toLocaleString()} đ
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Booking Form */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center mb-6">
          <div className="font-semibold text-3xl mr-4">
            Nhập thông tin chi tiết của bạn
          </div>
        </div>
        <Form form={form} onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Phần thông tin chính chiếm 2/3 */}
            <div className="md:col-span-2 grid grid-cols-1">
              {/* Họ */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <Form.Item
                  validateTrigger="onBlur"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên" },
                    {
                      pattern: /^[a-zA-Z0-9._]{4,20}$/,
                      message: "Tên phải từ 4–20 ký tự, không chứa khoảng trắng và chỉ gồm chữ, số, dấu _ hoặc ."
                    }
                  ]}
                >
                  <Input
                    size="large"
                    type="text"
                    placeholder="ví dụ: Nguyễn Văn A"
                  />
                </Form.Item>

              </div>

              {/* Địa chỉ email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Địa chỉ email <span className="text-red-500">*</span>
                </label>
                <Form.Item
                  name="emailUser"
                  validateTrigger="onBlur"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const allowedDomains = [
                          "gmail.com",
                          "yahoo.com",
                          "outlook.com",
                          "hotmail.com",
                          "icloud.com"
                        ];
                        const domain = value.split("@")[1]?.toLowerCase();
                        if (!domain || !allowedDomains.includes(domain)) {
                          return Promise.reject(new Error("Sai Địa Chỉ Email"));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập email"
                  />
                </Form.Item>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Form.Item
                  validateTrigger="onBlur"
                  name="phoneUser"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        const phoneRegex = /^0\d{9}$/;

                        if (!phoneRegex.test(value)) {
                          return Promise.reject(
                            new Error("Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số")
                          );
                        }

                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    size="large"
                    type="tel"
                    placeholder="Số điện thoại"
                  />
                </Form.Item>

                <p className="mt-2 text-xs text-gray-500">
                  Cần thiết để chỗ nghỉ xác nhận đặt phòng của bạn
                </p>
              </div>
            </div>


            {/* Phần phương thức thanh toán - nhỏ gọn ở bên phải */}
            <div className="bg-gray-100 border border-gray-300 rounded-md shadow-sm p-4 flex flex-col items-start">
              <h4 className="text-gray-900 text-lg font-semibold mb-4">
                Phương thức thanh toán
              </h4>

              <Form.Item name="payment_method" rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}>
                <div className="text-gray-900 text-sm w-full flex flex-col gap-2">
                  {[
                    { id: "cash", label: "Tiền mặt" },
                    { id: "credit_card", label: "Thẻ tín dụng" },
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
          </div>

          <div className="mb-8 p-6 border border-green-600 rounded-md bg-green-50 shadow-inner">
            <h3 className="text-green-700 font-semibold text-lg mb-2">
              Phòng Deluxe Giường Đôi Nhìn Ra Thành Phố
            </h3>
            <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
              <li>✔ Hủy miễn phí trước 19 tháng 6, 2025</li>
              {/* <li>👤 Khách: {bookingData?.adults} người lớn</li>
              <li>👤 Khách: {bookingData?.children} trẻ con</li> */}
              <li>⭐ Đánh giá: 9.4</li>
              <li>🚭 Không hút thuốc</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition"
          >
            Hoàn tất đặt phòng
          </button>
        </Form>
      </div>
    </div>
  );
};

export default BookingRoom;
