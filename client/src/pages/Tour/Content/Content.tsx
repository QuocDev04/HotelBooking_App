import { useQuery } from "@tanstack/react-query"
import instanceClient from "../../../../configs/instance"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { FaStar } from "react-icons/fa";

const Content = () => {
    const { id } = useParams()
    const { data: tour } = useQuery({
        queryKey: ['tour'],
        queryFn: () => instanceClient.get(`tour/${id}`)
    })
    const tours = tour?.data?.tour

    const [showMore, setShowMore] = useState(false)
    const description = tours?.descriptionTour || ""
    const shortDesc = description.slice(0, 400)

    return (
        <section className="space-y-10">
            <h2 className="text-2xl font-bold mb-2 text-blue-700">Giới thiệu chung</h2>
            <div className="text-base p-6 bg-blue-50 rounded-2xl shadow-lg border border-blue-100">
                <div
                    dangerouslySetInnerHTML={{
                        __html: description,
                    }}
                />
            </div>
            {/* Bảng giá tour */}
            <div className="overflow-x-auto">
                <table className="min-w-[400px] w-full bg-yellow-50 border border-yellow-200 mb-4 rounded-2xl shadow-lg">
                    <thead>
                        <tr>
                            <th className="border border-yellow-200 px-5 py-3 text-left bg-yellow-100 text-lg font-semibold">Ngày khởi hành 2025</th>
                            <th className="border border-yellow-200 px-5 py-3 text-left bg-yellow-100 text-lg font-semibold">Số lượng khách/phòng</th>
                            <th className="border border-yellow-200 px-5 py-3 text-left bg-yellow-100 text-lg font-semibold">Giá người lớn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-yellow-100 transition">
                            <td className="border border-yellow-200 px-5 py-3">30/08</td>
                            <td className="border border-yellow-200 px-5 py-3">2 khách/phòng</td>
                            <td className="border border-yellow-200 px-5 py-3 font-semibold text-orange-600">3.880.000 VNĐ</td>
                        </tr>
                        <tr className="hover:bg-yellow-100 transition">
                            <td className="border border-yellow-200 px-5 py-3"></td>
                            <td className="border border-yellow-200 px-5 py-3">3 - 4 Khách/phòng</td>
                            <td className="border border-yellow-200 px-5 py-3 font-semibold text-orange-600">3.680.000 VNĐ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="text-red-600 font-semibold mb-2 text-center text-lg tracking-wide">
                Các chương trình Khuyến mãi dành cho Tour Cô Tô
            </div>

            {/* Nút xem thêm */}
            {description.length > 400 && !showMore && (
                <div className="flex justify-center mb-2">
                    <button
                        className="w-full max-w-[99%] border rounded-xl py-2 text-blue-600 font-semibold hover:bg-blue-50 hover:underline flex items-center justify-center gap-2 bg-white shadow transition"
                        onClick={() => setShowMore(true)}
                    >
                        <span>Xem thêm</span>
                        <span>▼</span>
                    </button>
                </div>
            )}

            {/* Hiện bảng khuyến mãi khi showMore */}
            {showMore && (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-[400px] w-full bg-yellow-50 border border-yellow-200 mb-2 rounded-2xl shadow-lg">
                            <tbody>
                                <tr className="hover:bg-yellow-100 transition">
                                    <td className="border border-yellow-200 px-5 py-3 font-bold align-top w-1/4">Khuyến mãi Đặt xa</td>
                                    <td className="border border-yellow-200 px-5 py-3">
                                        <span className="block mb-1">- Đặt tour trước 60 ngày: <span className="font-semibold text-green-600">Giảm ngay 200.000VND</span></span>
                                        <span className="block mb-1">- Đặt tour trước 45 ngày: <span className="font-semibold text-green-600">Giảm ngay 150.000VND</span></span>
                                        <span className="block">- Đặt tour trước 30 ngày: <span className="font-semibold text-green-600">Giảm ngay 100.000VND</span></span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-100 transition">
                                    <td className="border border-yellow-200 px-5 py-3 font-bold align-top">Khuyến mãi Đặt theo Nhóm</td>
                                    <td className="border border-yellow-200 px-5 py-3">
                                        <span className="block mb-1">- Giảm ngay <span className="font-semibold text-green-600">400.000VND</span>/nhóm từ 4 khách trở lên</span>
                                        <span className="block">- Giảm ngay <span className="font-semibold text-green-600">1.000.000VND</span>/nhóm từ 8 khách trở lên</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-100 transition">
                                    <td className="border border-yellow-200 px-5 py-3 font-bold align-top">Khuyến mãi cho Khách hàng thân thiết</td>
                                    <td className="border border-yellow-200 px-5 py-3">
                                        <span className="block mb-1">- Giảm ngay <span className="font-semibold text-green-600">100.000VND</span>/khách</span>
                                        <span className="block">- Giảm ngay <span className="font-semibold text-green-600">150.000VND</span>/khách cho nhóm KH cũ từ 4 khách trở lên</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-yellow-100 transition">
                                    <td className="border border-yellow-200 px-5 py-3 font-bold align-top">Khuyến mãi cho Người Cao tuổi</td>
                                    <td className="border border-yellow-200 px-5 py-3">
                                        <span className="block mb-1">- Giảm ngay <span className="font-semibold text-green-600">150.000VND</span> cho khách từ 50 tuổi trở lên</span>
                                        <span className="block mb-1">- Giảm ngay <span className="font-semibold text-green-600">180.000VND</span>/khách cho nhóm từ 4 khách từ 50 tuổi trở lên</span>
                                        <span className="block">- Giảm ngay <span className="font-semibold text-green-600">200.000VND</span>/khách cho nhóm từ 8 khách từ 50 tuổi trở lên</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="border border-yellow-200 px-5 py-3 text-center text-sm text-gray-600 bg-yellow-100 rounded-b-2xl">
                                        *Không áp dụng đồng thời các chương trình Khuyến mãi khác.<br />
                                        * Tặng mũ cói đi biển
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mb-2">
                        <button
                            className="w-full max-w-[99%] border rounded-xl py-2 text-blue-600 font-semibold hover:bg-blue-50 hover:underline flex items-center justify-center gap-2 bg-white shadow transition"
                            onClick={() => setShowMore(false)}
                        >
                            <span>Thu gọn</span>
                            <span>▲</span>
                        </button>
                    </div>
                </>
            )}

            {/* Bảng điểm nổi bật */}
            <div className="p-6 bg-blue-50 rounded-2xl shadow-lg border border-blue-100">
                <h3 className="font-bold text-lg mb-3 text-blue-700 flex items-center gap-2">
                    <FaStar className="text-yellow-400" /> Điểm nổi bật
                </h3>
                <ul className="list-none pl-0 space-y-2 text-base">
                    <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Tặng mũ cói đi biển</li>
                    <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Khuyến mãi Đặt xa</li>
                    <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Khuyến mãi Đặt theo Nhóm</li>
                    <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Khuyến mãi cho Khách hàng thân thiết</li>
                    <li className="flex items-center gap-2"><FaStar className="text-yellow-400" /> Khuyến mãi cho Người Cao tuổi</li>
                </ul>
            </div>
        </section>
    )
}

export default Content
