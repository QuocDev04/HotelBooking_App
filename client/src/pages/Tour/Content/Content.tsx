import { useQuery } from "@tanstack/react-query"
import instanceClient from "../../../../configs/instance"
import { useParams } from "react-router-dom"
import { useState } from "react"

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
        <section className="space-y-6">
            <h2 className="text-2xl font-bold">Giới thiệu chung</h2>
            {/* Luôn hiển thị mô tả đầy đủ trong khối nền xanh nhạt */}
            <div className="text-base p-4">
                <div
                    dangerouslySetInnerHTML={{
                        __html: description,
                    }}
                />
            </div>
            {/* Bảng giá tour */}
            <div className="overflow-x-auto">
                <table className="min-w-[400px] w-full bg-yellow-50 border border-yellow-200 mb-2">
                    <thead>
                        <tr>
                            <th className="border border-yellow-200 px-4 py-2 text-left">Ngày khởi hành 2025</th>
                            <th className="border border-yellow-200 px-4 py-2 text-left">Số lượng khách/phòng</th>
                            <th className="border border-yellow-200 px-4 py-2 text-left">Giá người lớn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-yellow-200 px-4 py-2">30/08</td>
                            <td className="border border-yellow-200 px-4 py-2">2 khách/phòng</td>
                            <td className="border border-yellow-200 px-4 py-2">3.880.000 VNĐ</td>
                        </tr>
                        <tr>
                            <td className="border border-yellow-200 px-4 py-2"></td>
                            <td className="border border-yellow-200 px-4 py-2">3 - 4 Khách/phòng</td>
                            <td className="border border-yellow-200 px-4 py-2">3.680.000 VNĐ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="text-red-600 font-semibold mb-2 text-center">
                Các chương trình Khuyến mãi dành cho Tour Cô Tô
            </div>

            {/* Nút xem thêm */}
            {description.length > 400 && !showMore && (
                <div className="flex justify-center mb-2">
                    <button
                        className="w-full max-w-[99%] border rounded py-2 text-blue-600 font-medium hover:underline flex items-center justify-center gap-2"
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
                        <table className="min-w-[400px] w-full bg-yellow-50 border border-yellow-200 mb-2">
                            <tbody>
                                <tr>
                                    <td className="border border-yellow-200 px-4 py-2 font-bold align-top w-1/4">Khuyến mãi Đặt xa</td>
                                    <td className="border border-yellow-200 px-4 py-2">
                                        - Đặt tour trước 60 ngày: Giảm ngay 200.000VND<br />
                                        - Đặt tour trước 45 ngày: Giảm ngay 150.000VND<br />
                                        - Đặt tour trước 30 ngày: Giảm ngay 100.000VND
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-yellow-200 px-4 py-2 font-bold align-top">Khuyến mãi Đặt theo Nhóm</td>
                                    <td className="border border-yellow-200 px-4 py-2">
                                        - Giảm ngay 400.000VND/nhóm từ 4 khách trở lên<br />
                                        - Giảm ngay 1.000.000VND/nhóm từ 8 khách trở lên
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-yellow-200 px-4 py-2 font-bold align-top">Khuyến mãi cho Khách hàng thân thiết</td>
                                    <td className="border border-yellow-200 px-4 py-2">
                                        - Giảm ngay 100.000VND/khách<br />
                                        - Giảm ngay 150.000VND/khách cho nhóm KH cũ từ 4 khách trở lên
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-yellow-200 px-4 py-2 font-bold align-top">Khuyến mãi cho Người Cao tuổi</td>
                                    <td className="border border-yellow-200 px-4 py-2">
                                        - Giảm ngay 150.000VND cho khách từ 50 tuổi trở lên<br />
                                        - Giảm ngay 180.000VND/khách cho nhóm từ 4 khách từ 50 tuổi trở lên<br />
                                        - Giảm ngay 200.000VND/khách cho nhóm từ 8 khách từ 50 tuổi trở lên
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="border border-yellow-200 px-4 py-2 text-center text-sm">
                                        *Không áp dụng đồng thời các chương trình Khuyến mãi khác.<br />
                                        * Tặng mũ cói đi biển
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mb-2">
                        <button
                            className="w-full max-w-[99%] border rounded py-2 text-blue-600 font-medium hover:underline flex items-center justify-center gap-2"
                            onClick={() => setShowMore(false)}
                        >
                            <span>Thu gọn</span>
                            <span>▲</span>
                        </button>
                    </div>
                </>
            )}

            {/* Bảng điểm nổi bật */}
            <div className="p-4 bg-blue-50 rounded">
                <h3 className="font-bold text-lg mb-2">Điểm nổi bật</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Tặng mũ cói đi biển</li>
                    <li>Khuyến mãi Đặt xa</li>
                    <li>Khuyến mãi Đặt theo Nhóm</li>
                    <li>Khuyến mãi cho Khách hàng thân thiết</li>
                    <li>Khuyến mãi cho Người Cao tuổi</li>
                </ul>
            </div>
        </section>
    )
}

export default Content
