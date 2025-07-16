
const PriceList = () => {
  return (
      <section>
          <h2 className="mb-4 text-2xl font-bold my-7">Bảng giá (Khởi hành từ Hà Nội)</h2>
          {/* Nút lọc tháng */}
          <div className="flex mb-4 space-x-4">
              <button className="px-4 py-2 font-semibold text-white bg-orange-500 rounded">Tất cả</button>
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded">Tháng 6</button>
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded">Tháng 7</button>
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto">
              <table className="min-w-full text-center bg-white rounded shadow-sm">
                  <thead>
                      <tr className="text-sm font-semibold text-gray-700 bg-gray-100">
                          <th className="px-4 py-2">Ngày khởi hành</th>
                          <th className="px-4 py-2">Hãng tour</th>
                          <th className="px-4 py-2">Giá tour</th>
                          <th className="px-4 py-2">Giữ chỗ</th>
                      </tr>
                  </thead>
                  <tbody>
                      {[
                          {
                              date: "17/06/2025",
                              brand: "Vietjet Air",
                              price: "29.900.000đ",
                              points: "299.000 điểm",
                          },
                          {
                              date: "24/06/2025",
                              brand: "Vietjet Air",
                              price: "29.900.000đ",
                              points: "299.000 điểm",
                          },
                          {
                              date: "01/07/2025",
                              brand: "Vietjet Air",
                              price: "29.900.000đ",
                              points: "299.000 điểm",
                          },
                          {
                              date: "08/07/2025",
                              brand: "Vietjet Air",
                              price: "29.900.000đ",
                              points: "299.000 điểm",
                          },
                          {
                              date: "15/07/2025",
                              brand: "Vietjet Air",
                              price: "29.900.000đ",
                              points: "299.000 điểm",
                          },
                          {
                              date: "22/07/2025",
                              brand: "Vietjet Air",
                              priceOld: "29.900.000đ",
                              price: "28.900.000đ",
                              points: "289.000 điểm",
                              note: "ĐẶT SỚM: Giảm 1 Triệu",
                          },
                          {
                              date: "29/07/2025",
                              brand: "Vietjet Air",
                              priceOld: "29.900.000đ",
                              price: "28.900.000đ",
                              points: "289.000 điểm",
                              note: "ĐẶT SỚM: Giảm 1 Triệu",
                          },
                      ].map((item, i) => (
                          <tr key={i} className="text-sm text-gray-700 border-b">
                              <td className="px-4 py-3">
                                  <div className="font-medium">{item.date}</div>
                                  <div className="text-xs text-green-600">Còn chỗ</div>
                              </td>
                              <td className="px-4 py-3">
                                  <div>{item.brand}</div>
                                  {item.note && (
                                      <div className="mt-1 text-xs text-orange-500">🔖 {item.note}</div>
                                  )}
                              </td>
                              <td className="px-4 py-3">
                                  {item.priceOld ? (
                                      <div>
                                          <span className="text-gray-400 line-through">{item.priceOld}</span>{" "}
                                          <span className="font-bold text-orange-600">{item.price}</span>
                                      </div>
                                  ) : (
                                      <div className="font-bold text-orange-600">{item.price}</div>
                                  )}
                                  <div className="text-xs text-gray-500">💰 {item.points}</div>
                              </td>
                              <td className="px-4 py-3">
                                  <button className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
                                      Giữ chỗ ngay
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </section>
  )
}

export default PriceList
