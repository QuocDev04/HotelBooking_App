/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import instanceClient from "../../../configs/instance";
import  dayjs from "dayjs";

const CheckOutTour= () => {
  const [showGuestList, setShowGuestList] = useState(true);
  const {id} = useParams()
  const {data} = useQuery({
    queryKey:['bookingTour',id],
    queryFn:() => instanceClient.get(`bookingTour/${id}`)
  })
  console.log(data?.data?.booking);
  const booking = data?.data?.booking
  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Đã thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không rõ';
    }
  };
  return (
    <div className="bg-gradient-to-br  min-h-screen py-8 px-2 md:px-8 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông tin liên lạc & Chi tiết booking */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Thông tin liên lạc */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 transition hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-white text-lg font-bold shadow">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.7 0 8 1.34 8 4v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
              </div>
              <div className="font-bold text-blue-700 text-base bg-gradient-to-r from-blue-100 to-transparent px-2 py-1 rounded">THÔNG TIN LIÊN LẠC</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600">Họ tên</div>
                <div className="text-gray-900">{booking?.fullNameUser}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Email</div>
                <div className="text-gray-900">{booking?.email}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Điện thoại</div>
                <div className="text-gray-900">{booking?.phone}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Địa chỉ</div>
                <div className="text-gray-900">{booking?.address}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Ghi chú</div>
                <div className="text-gray-900">{booking?.note}</div>
              </div>
            </div>
          </div>
          {/* Chi tiết booking */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 transition hover:shadow-2xl">
            <div className="font-bold text-blue-700 text-base mb-4 bg-gradient-to-r from-blue-100 to-transparent px-2 py-1 rounded">CHI TIẾT BOOKING</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-2">
                <div>Ngày tạo: <span className="font-medium text-gray-900">{dayjs(booking?.createdAt).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}</span></div>
                <div>Trị giá booking: <span className="font-medium text-gray-900">{booking?.totalPriceTour.toLocaleString()} đ</span></div>
                <div>Tình trạng: <span className="font-medium text-yellow-600">{getPaymentStatusLabel(booking?.payment_status)}</span></div>
              </div>
            </div>
          </div>
          {/* Danh sách hành khách (accordion) */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 transition hover:shadow-2xl">
            <button
              className="w-full flex items-center justify-between font-bold text-blue-700 text-base mb-4 bg-gradient-to-r from-blue-100 to-transparent px-2 py-1 rounded focus:outline-none select-none"
              onClick={() => setShowGuestList((v) => !v)}
              aria-expanded={showGuestList}
              aria-controls="guest-list-table"
              type="button"
            >
              <span>DANH SÁCH HÀNH KHÁCH</span>
              <span className={`transition-transform duration-300 ${showGuestList ? '' : 'rotate-180'}`}>
                {/* Chevron up/down icon */}
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" /></svg>
              </span>
            </button>
            <div
              id="guest-list-table"
              className={`overflow-hidden transition-all duration-500 ${showGuestList ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
              <table className="min-w-full text-sm border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border px-3 py-2 font-semibold text-gray-700">Họ tên</th>
                    <th className="border px-3 py-2 font-semibold text-gray-700">Ngày sinh</th>
                    <th className="border px-3 py-2 font-semibold text-gray-700">Giới tính</th>
                    <th className="border px-3 py-2 font-semibold text-gray-700">Độ tuổi</th>
                    <th className="border px-3 py-2 font-semibold text-gray-700">Phòng đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...(booking?.adultPassengers ?? []).map((p:any) => ({ ...p, group: 'Người lớn' })),
                    ...(booking?.childPassengers ?? []).map((p: any) => ({ ...p, group: 'Trẻ em' })),
                    ...(booking?.toddlerPassengers ?? []).map((p: any) => ({ ...p, group: 'Trẻ nhỏ' })),
                    ...(booking?.infantPassengers ?? []).map((p: any) => ({ ...p, group: 'Em bé' })),
                  ].map((passenger, index) => {
                    const birthDate = new Date(passenger.birthDate);
                    const age = new Date().getFullYear() - birthDate.getFullYear();
                    return (
                      <tr key={index} className="hover:bg-blue-50 transition">
                        <td className="border px-3 py-2">{passenger.fullName}</td>
                        <td className="border px-3 py-2">
                          {birthDate.toLocaleDateString('vi-VN')}
                        </td>
                        <td className="border px-3 py-2">{passenger.gender}</td>
                        <td className="border px-3 py-2">
                          {passenger.group} ({age} tuổi)
                        </td>
                        <td className="border px-3 py-2">
                          {passenger.singleRoom ? 'Có' : 'Không'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr>
                    <td className="border px-3 py-2 text-right font-semibold" colSpan={4}>Tổng cộng:</td>
                    <td className="border px-3 py-2 text-red-600 font-bold">{booking?.totalPriceTour.toLocaleString()} đ</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        {/* Phiếu xác nhận booking */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-3 transition hover:shadow-2xl">
            <div className="font-bold text-blue-700 text-base mb-2 bg-gradient-to-r from-blue-100 to-transparent px-2 py-1 rounded">PHIẾU XÁC NHẬN BOOKING</div>
            <div className="flex gap-3 items-center">
              <img src={booking?.slotId?.tour?.imageTour[0]} alt="hotel" className="w-24 h-20 object-cover rounded-xl border border-blue-200 shadow" />
              <div className="text-lg font-medium text-gray-700">
                {booking?.slotId?.tour?.nameTour}
              </div>
            </div>
            <div className="text-sm">Mã tour: <span className="font-medium text-gray-700">{booking?.slotId?.tour?._id}</span></div>
            <div className="font-semibold text-xs mt-3 text-blue-700">THÔNG TIN DI CHUYỂN</div>
            {/* Chuyến đi */}
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="text-gray-700">Ngày đi - {dayjs(booking?.slotId?.dateTour).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY")}</span>
              <span className="flex items-center gap-1">
                {/* icon máy bay */}
                <svg width="16" height="16" fill="currentColor" className="text-blue-500" viewBox="0 0 24 24"><path d="M2.5 19.5l19-7.5-19-7.5v6l15 1.5-15 1.5z" /></svg>
                <span className="font-semibold text-blue-700">VU303</span>
              </span>
              <span className="text-gray-700">17:05</span>
              <span className="mx-1 text-gray-400">→</span>
              <span className="text-gray-700">18:10</span>
            </div>
            {/* icon loa */}
            <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03z" /></svg>
              <span>Thông báo!</span>
            </div>
            {/* Chuyến về */}
            {/* <div className="flex items-center gap-2 text-xs mt-2">
              <span className="text-gray-700">Ngày về - 14/07/2025</span>
              <span className="flex items-center gap-1">
                <svg width="16" height="16" fill="currentColor" className="text-blue-500" viewBox="0 0 24 24"><path d="M2.5 19.5l19-7.5-19-7.5v6l15 1.5-15 1.5z" /></svg>
                <span className="font-semibold text-blue-700">VU302</span>
              </span>
              <span className="text-gray-700">18:50</span>
              <span className="mx-1 text-gray-400">→</span>
              <span className="text-gray-700">19:55</span>
            </div> */}
            {/* <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03z" /></svg>
              <span>Thông báo!</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutTour;
