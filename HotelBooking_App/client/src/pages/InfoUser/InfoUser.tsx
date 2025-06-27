import React from 'react'

const bills = [
  {
    id: 'B001',
    hotel: 'Sunshine Hotel',
    room: 'Deluxe Suite',
    date: '2025-06-20',
    nights: 3,
    total: 4500000,
    status: 'Đã thanh toán',
  },
  {
    id: 'B002',
    hotel: 'Ocean View',
    room: 'Standard',
    date: '2025-05-15',
    nights: 2,
    total: 2200000,
    status: 'Chưa thanh toán',
  },
]

const InfoUser = () => {
  return (
    <div className="max-w-screen-xl p-4 mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-6">Thông tin người dùng</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <div className="text-lg font-semibold">Nguyễn Văn A</div>
            <div className="text-gray-500">nguyenvana@email.com</div>
            <div className="text-gray-500">SĐT: 0123 456 789</div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">Các bill bạn đã đặt</h3>
      <p className="mb-4 text-gray-600">Dưới đây là danh sách các bill đặt phòng của bạn:</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Mã Bill</th>
              <th className="py-2 px-4 border-b">Khách sạn</th>
              <th className="py-2 px-4 border-b">Phòng</th>
              <th className="py-2 px-4 border-b">Ngày đặt</th>
              <th className="py-2 px-4 border-b">Số đêm</th>
              <th className="py-2 px-4 border-b">Tổng tiền</th>
              <th className="py-2 px-4 border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="text-center">
                <td className="py-2 px-4 border-b">{bill.id}</td>
                <td className="py-2 px-4 border-b">{bill.hotel}</td>
                <td className="py-2 px-4 border-b">{bill.room}</td>
                <td className="py-2 px-4 border-b">{bill.date}</td>
                <td className="py-2 px-4 border-b">{bill.nights}</td>
                <td className="py-2 px-4 border-b">{bill.total.toLocaleString()}₫</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={
                      bill.status === 'Đã thanh toán'
                        ? 'text-green-600 font-semibold'
                        : 'text-red-500 font-semibold'
                    }
                  >
                    {bill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InfoUser