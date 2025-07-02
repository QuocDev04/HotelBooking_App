import React from "react";

export default function PaymentPage() {
  return (
    <div className="font-sans text-gray-800 bg-white">

      {/* Content */}
      <main className="max-w-4xl px-4 py-10 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Hình thức thanh toán</h1>

        <div className="space-y-10">
          {/* QR Payment */}
          <section>
            <h2 className="mb-2 font-semibold">1. Thanh toán trực tuyến bằng mã QR:</h2>
            <p className="mb-4 text-sm">Để dễ và nhanh, quý khách có thể chọn hình thức thanh toán bằng cách quét QR trên website...</p>
            <div className="p-6 border rounded-lg shadow">
              <div className="grid items-center grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2 text-center">
                  <div className="text-lg font-bold">19:37</div>
                  <img src="https://img.vietqr.io/image/970422-226485769-compact2.png" alt="QR Code" className="h-40 mx-auto" />
                  <p className="text-sm">Quét mã để thanh toán</p>
                </div>
                <div className="space-y-2 text-sm md:col-span-2">
                  <p><strong>Số tiền:</strong> <span className="text-lg font-bold text-green-600">1,956,000 VND</span></p>
                  <p><strong>Số tài khoản:</strong> 226485769</p>
                  <p><strong>Chủ tài khoản:</strong> Công Ty TNHH Du Lịch Và Dịch Vụ Mùi Vị Vivu</p>
                  <p><strong>Ngân hàng:</strong> MB Bank</p>
                  <p><strong>Nội dung:</strong> mùi vị light24100000944</p>
                  <button className="px-4 py-1 text-white bg-green-500 rounded hover:bg-green-600">Đã thanh toán</button>
                  <p className="text-xs text-gray-500">Vui lòng chờ trong giây lát. Nếu bạn đã thanh toán mà vẫn chưa xác nhận được, vui lòng gọi: 0792.925.555</p>
                </div>
              </div>
              <div className="mt-4 font-semibold text-right">Tổng tiền: <span className="text-green-600">1,956,000 VND</span></div>
            </div>
          </section>

          {/* Bank Transfer */}
          <section>
            <h2 className="mb-2 font-semibold">2. Thanh toán bằng chuyển khoản ngân hàng:</h2>
            <p className="text-sm">Tên tài khoản: Công Ty TNHH Du Lịch và dịch vụ Elite Travel</p>
            <p className="text-sm">Số tài khoản: 226485769</p>
            <p className="text-sm">Tại Ngân hàng TMCP Quân đội - MB Bank</p>
            <p className="text-sm">Chi nhánh: Hoàng Quốc Việt</p>
          </section>

          {/* Office Payment */}
          <section>
            <h2 className="mb-2 font-semibold">3. Thanh toán tại văn phòng của Elite Travel:</h2>
            <p className="text-sm">Địa chỉ: Số 81A ngõ 295 - Phố Bằng Liệt - Phường Lĩnh Nam - Quận Hoàng Mai - Hà Nội - Việt Nam</p>
            <p className="text-sm">Hotline và hỗ trợ khách hàng: 0792 922 010</p>
            <p className="text-sm">Giờ làm việc: 9h00 - 17h30 từ thứ 2 - đến thứ 6 và 9h00 - 12h00 thứ 7</p>
          </section>
        </div>
      </main>
    </div>
  );
}
