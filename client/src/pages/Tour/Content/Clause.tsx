import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaChild, FaPlusCircle, FaInfoCircle, FaSyncAlt } from "react-icons/fa";

const clauses = [
    {
        title: "Giá tour bao gồm",
        icon: <FaCheckCircle className="text-blue-500 mr-2" />,
        content: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Xe du lịch đời mới, điều hòa, tiện nghi Hà Nội – Ao Tiên – Hà Nội.</li>
                <li>Khách sạn trên đảo Cô Tô 2** tiêu chuẩn 2 người/phòng, 3 – 4 người/phòng, điều hòa, tiện nghi đầy đủ.</li>
                <li>01 Bữa ăn chính theo lịch trình suất 150.000 VNĐ/người, 3 bữa ăn trên đảo suất 180.000 VNĐ/người + 1 bữa BBQ 300.000 VNĐ/người + 2 bữa sáng 45.000 VNĐ/bữa phụ.</li>
                <li>Tàu cao tốc Ao Tiên – Cô Tô – Ao Tiên khứ hồi.</li>
                <li>Xe (ô tô hoặc xe điện) tham quan theo lịch trình trên đảo.</li>
                <li>Vé thắng cảnh thăm quan theo chương trình.</li>
                <li>Bảo hiểm du lịch mức 50.000.000 VNĐ/người/vụ.</li>
                <li>HDV tiếng Việt nhiệt tình, kinh nghiệm.</li>
                <li>Nước uống trên xe tiêu chuẩn 1 chai/người/ngày.</li>
                <li>Tặng mũ cói đi biển</li>
                <li>Thuế VAT</li>
            </ul>
        )
    },
    {
        title: "Giá tour không bao gồm",
        icon: <FaTimesCircle className="text-blue-500 mr-2" />,
        content: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Đồ uống gọi thêm trong các bữa ăn.</li>
                <li>Chi phí cá nhân (giặt là, quà tặng...).</li>
                <li>Chi phí thăm Cô Tô con</li>
                <li>Tiền tip lái xe, HDV</li>
                <li>Trẻ em từ 0 - 5 tuổi: Miễn phí tour, ăn ngủ chung với bố mẹ. (Hai người lớn chỉ được kèm 01 trẻ em. Từ trẻ em thứ 2 phụ thu 50% người lớn). Trẻ em từ 1 tuổi trở lên đóng 600.000VNĐ vé tàu cao tốc</li>
                <li>Trẻ em từ 6 - 10 tuổi: Phụ thu 75% tour. Trẻ em ngủ chung giường với bố mẹ.</li>
                <li>Trẻ em từ 11 tuổi trở lên: Tính như người lớn</li>
                <li>Phụ thu phòng đơn 400.000 VNĐ/khách/ 1 đêm (Áp dụng trong trường hợp khách muốn ở 01 mình 01 phòng trong suốt hành trình).</li>
                <li>Phụ thu HDV tiếng Anh 10$/ngày</li>
                <li>Khách nước ngoài phụ thu 250.000 VNĐ/người/ngày, khi đi mang theo 2 bản photo hộ chiếu và bản gốc để đối chiếu.</li>
                <li>Thị trấn Cô Tô – Cầu cảng ( bến tàu ) = 1km</li>
                <li>Thị trấn Cô Tô – Tượng đài Bác Hồ, con đường tình yêu = 100 – 300m</li>
                <li>Thị trấn Cô Tô – Ngọn hải đăng = 4km</li>
                <li>Thị trấn Cô Tô – Bãi tắm Hồng Vàn = 5km</li>
                <li>Thị trấn Cô Tô – Cảng quân sự Bắc Vàn = 8km</li>
                <li>Thị trấn Cô Tô – Bãi tắm Vàn Chảy = 6km</li>
                <li>Thị trấn Cô Tô – Bãi đá Cầu Mỵ = 3km</li>
                <li>Thị trấn Cô Tô – Bến tàu ra Cô Tô Con = 7km</li>
                <li>Vì lý do thời tiết (thiên tai, bão lũ, gió giật mạnh, giống lốc), chiến tranh, phong tỏa do các hoạt động quân sự... cảng vụ không cấp phép cho tàu cao tốc Ao Tiên – Cô Tô – Ao Tiên hoạt động sẽ giải quyết như sau:</li>
                <li>+Thông báo đến trước khi khởi hành tour Hà Nội: Group tour sẽ dời ngày khởi hành theo yêu cầu của Quý khách. Trong trường hợp hai bên không thỏa thuận được ngày đi cụ thể; bên B sẽ hoàn trả lại 100% toàn bộ tiền đặt cọc tour cho Bên A.</li>
                <li>+Nếu thông báo đến sau khi xe đã khởi hành từ Hà Nội và vẫn chưa lên tàu cao tốc ra đảo: Quý khách sẽ thanh toán cho Group tour những dịch vụ đã sử dụng (tiền xe: 450.000 VNĐ/khách) (trừ trẻ em miễn phí), tiền ăn trưa bữa đầu: 160.000/suất/người lớn.</li>
                <li>+Nếu thông báo cấm tàu chiều về Cô Tô – Vân Đồn: Quý khách chịu toàn bộ chi phí phát sinh: ăn, phòng nghỉ và các chi phí khác. Group tour sẽ thanh toán công tác phí HDV phát sinh trong những ngày ở lại đảo và xe ô tô lưu đêm trên cảng Ao Tiên.</li>
            </ul>
        )
    },
    {
        title: "Chính sách trẻ em",
        icon: <FaChild className="text-blue-500 mr-2" />,
        content: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Trẻ em từ 0 - 5 tuổi: Miễn phí tour, ăn ngủ chung với bố mẹ. (Hai người lớn chỉ được kèm 01 trẻ em. Từ trẻ em thứ 2 phụ thu 50% người lớn). Trẻ em từ 1 tuổi trở lên đóng 600.000VNĐ vé tàu cao tốc</li>
                <li>Trẻ em từ 6 - 10 tuổi: Phụ thu 75% tour. Trẻ em ngủ chung giường với bố mẹ.</li>
                <li>Trẻ em từ 11 tuổi trở lên: Tính như người lớn</li>
            </ul>
        )
    },
    {
        title: "Quy định phụ thu",
        icon: <FaPlusCircle className="text-blue-500 mr-2" />,
        content: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Phụ thu phòng đơn 400.000VNĐ/khách/ 1 đêm (Áp dụng trong trường hợp khách muốn ở 01 mình 01 phòng trong suốt hành trình).</li>
                <li>Phụ thu HDV tiếng Anh 10$/ngày</li>
                <li>Khách nước ngoài phụ thu 250.000 VNĐ/người/ngày, khi đi mang theo 2 bản photo hộ chiếu và bản gốc để đối chiếu.</li>
            </ul>
        )
    },
    {
        title: "Lưu ý",
        icon: <FaInfoCircle className="text-blue-500 mr-2" />,
        content: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Thị trấn Cô Tô – Cầu cảng ( bến tàu ) = 1km</li>
                <li>Thị trấn Cô Tô – Tượng đài Bác Hồ, con đường tình yêu = 100 – 300m</li>
                <li>Thị trấn Cô Tô – Ngọn hải đăng = 4km</li>
                <li>Thị trấn Cô Tô – Bãi tắm Hồng Vàn = 5km</li>
                <li>Thị trấn Cô Tô – Cảng quân sự Bắc Vàn = 8km</li>
                <li>Thị trấn Cô Tô – Bãi tắm Vàn Chảy = 6km</li>
                <li>Thị trấn Cô Tô – Bãi đá Cầu Mỵ = 3km</li>
                <li>Thị trấn Cô Tô – Bến tàu ra Cô Tô Con = 7km</li>
                <li>Vì lý do thời tiết (thiên tai, bão lũ, gió giật mạnh, giống lốc), chiến tranh, phong tỏa do các hoạt động quân sự... cảng vụ không cấp phép cho tàu cao tốc Ao Tiên – Cô Tô – Ao Tiên hoạt động sẽ giải quyết như sau:</li>
                <li>+Thông báo đến trước khi khởi hành tour Hà Nội: Group tour sẽ dời ngày khởi hành theo yêu cầu của Quý khách. Trong trường hợp hai bên không thỏa thuận được ngày đi cụ thể; bên B sẽ hoàn trả lại 100% toàn bộ tiền đặt cọc tour cho Bên A.</li>
                <li>+Nếu thông báo đến sau khi xe đã khởi hành từ Hà Nội và vẫn chưa lên tàu cao tốc ra đảo: Quý khách sẽ thanh toán cho Group tour những dịch vụ đã sử dụng (tiền xe: 450.000 VNĐ/khách) (trừ trẻ em miễn phí), tiền ăn trưa bữa đầu: 160.000/suất/người lớn.</li>
                <li>+Nếu thông báo cấm tàu chiều về Cô Tô – Vân Đồn: Quý khách chịu toàn bộ chi phí phát sinh: ăn, phòng nghỉ và các chi phí khác. Group tour sẽ thanh toán công tác phí HDV phát sinh trong những ngày ở lại đảo và xe ô tô lưu đêm trên cảng Ao Tiên.</li>
            </ul>
        )
    },
    {
        title: "Chính sách hoàn hủy",
        icon: <FaSyncAlt className="text-blue-500 mr-2" />,
        content: (
            <ul className="list-disc pl-4 space-y-1">
                <li>Hủy tour ngay sau khi đăng ký đến 10 ngày trước ngày khởi hành, phạt 30% trên giá tour.</li>
                <li>Hủy tour trong vòng từ 5 – 10 ngày trước ngày khởi hành, phạt 50% trên giá tour.</li>
                <li>Hủy tour trong vòng từ 3 – 5 ngày trước ngày khởi hành, phạt 75% trên giá tour.</li>
                <li>Hủy tour trong vòng từ 0 – 3 ngày trước ngày khởi hành, phạt 100% giá trị tour</li>
                <li>Ngày lễ tết không hoàn, không hủy, không đổi, không áp dụng chính sách hủy trên</li>
            </ul>
        )
    }
];

const Clause = () => {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const handleToggle = (idx: number) => {
        setOpenIndexes(prev =>
            prev.includes(idx)
                ? prev.filter(i => i !== idx)
                : [...prev, idx]
        );
    };

    return (
        <section className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Bao gồm và điều khoản</h2>
            <div className="space-y-4">
                {clauses.map((item, idx) => (
                    <div key={idx} className="bg-white border rounded-lg">
                        <button
                            className="flex items-center w-full px-6 py-5 text-left focus:outline-none"
                            onClick={() => handleToggle(idx)}
                        >
                            {item.icon}
                            <span className="font-semibold text-base flex-1">{item.title}</span>
                            <span className="text-blue-500">{openIndexes.includes(idx) ? "˄" : "˅"}</span>
                        </button>
                        {openIndexes.includes(idx) && (
                            <div className="px-6 pb-5 text-gray-700 text-sm">
                                {item.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Clause;