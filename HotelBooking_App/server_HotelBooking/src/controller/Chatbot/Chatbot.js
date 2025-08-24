const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Danh sách câu hỏi và trả lời mẫu
const FAQ = {
    "chính sách hủy tour": `Quy Định Hủy Tour\n\n
  Hủy trước 15 ngày so với ngày khởi hành: Hoàn 100% giá trị tour (trừ phí ngân hàng, phí dịch vụ nếu có).\n\n
  Hủy từ 14 - 7 ngày trước ngày khởi hành: Hoàn 50% giá trị tour.\n\n
  Hủy dưới 7 ngày hoặc không tham gia: Không hoàn tiền.\n\n
  Lưu ý: Thời gian hủy được tính từ lúc nhận được thông báo chính thức của khách hàng qua email hoặc hệ thống đặt tour.`,
    "điều khoản đặt tour": `Điều khoản đặt tour\n\n
  \nĐiều khoản này áp dụng cho tất cả các khách hàng sử dụng dịch vụ đặt tour trực tuyến trên website của chúng tôi. Khi đặt tour, khách hàng được xem như đã đọc, hiểu và đồng ý với các điều khoản sau.\n
  \nQuy Trình Đặt Tour:\n
  \nKhách hàng lựa chọn tour, điền đầy đủ thông tin cá nhân và thông tin liên hệ chính xác.\n\n
  Hoàn tất thanh toán theo hướng dẫn trên website.
  \n\nXác nhận đặt tour sẽ được gửi qua email trong vòng 24 giờ sau khi thanh toán thành công.\n\n
  Giá Cả và Thanh Toán:\n\n
  Giá tour được niêm yết công khai trên website và có thể thay đổi tùy theo thời điểm đặt.\n\n
  Thanh toán có thể được thực hiện bằng chuyển khoản ngân hàng, ví điện tử hoặc các phương thức được hỗ trợ trên hệ thống.\n\nCác khoản phí dịch vụ, phụ thu (nếu có) sẽ được thông báo trước khi khách hàng xác nhận thanh toán.\n\n
  Chính Sách Hủy Tour và Hoàn Tiền:\n\n
  Hủy trước 15 ngày so với ngày khởi hành: Hoàn 100% giá trị tour.\n\n
  Hủy từ 7 - 14 ngày trước ngày khởi hành: Hoàn 50% giá trị tour.\n\n
  Hủy dưới 7 ngày hoặc không tham gia: Không hoàn tiền.\n\n
  Trong trường hợp bất khả kháng (thiên tai, dịch bệnh, yêu cầu của cơ quan chức năng), chính sách hoàn tiền/hỗ trợ sẽ được xem xét linh hoạt.`,
    "chính sách hoàn tiền": `Chính sách hoàn tiền: Khách hàng gửi yêu cầu hoàn tiền qua hệ thống hoặc email trong vòng 48 giờ sau khi hủy tour.\n\n
  Thời gian xử lý hoàn tiền: từ 7 - 14 ngày làm việc tùy theo phương thức thanh toán ban đầu.\n\n
  Số tiền hoàn trả sẽ khấu trừ các khoản phí phát sinh (nếu có) như phí ngân hàng, phí visa, vé máy bay đã xuất, v.v.`,
};

function findAnswer(message) {
    const lower = message.toLowerCase();
    if (lower.includes("điều khoản")) return FAQ["điều khoản đặt tour"];
    if (lower.includes("hoàn tiền")) return FAQ["chính sách hoàn tiền"];
    if (lower.includes("hủy tour") || lower.includes("huỷ tour") || lower.includes("hủy") || lower.includes("huỷ")) return FAQ["chính sách hủy tour"];
    for (const key in FAQ) {
        if (lower.includes(key)) return FAQ[key];
    }
    return "Xin lỗi, mình chỉ hỗ trợ thông tin về chính sách, điều khoản, hủy/hoàn tour. Bạn vui lòng hỏi đúng nội dung nhé!";
}
app.post("/chat", (req, res) => {
    const { message } = req.body;
    const reply = findAnswer(message || "");
    res.json({ reply });
});

app.listen(3001, () => {
    console.log("Chatbot backend running at http://localhost:3001");
});