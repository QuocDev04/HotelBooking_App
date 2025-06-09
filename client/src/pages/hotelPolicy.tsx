import React from "react";

export const FAQ = () => {
  const faqs = [
    {
      question: "Dịch vụ xe đưa đón có bao gồm trong giá tour không?",
      answer: "Xe đưa đón là dịch vụ bổ sung và không bao gồm trong giá tour. Quý khách cần đặt thêm nếu có nhu cầu."
    },
    {
      question: "Nhà hàng của du thuyền phục vụ bữa ăn theo phong cách gì?",
      answer: "Thực đơn đa dạng và phục vụ theo phong cách Á – Âu. Có yêu cầu ăn chay hoặc dị ứng, vui lòng báo trước."
    },
    {
      question: "Tôi có được phép mang thú cưng lên tàu không?",
      answer: "Thú cưng không được phép mang lên tàu du lịch."
    },
    {
      question: "Du thuyền có dịch vụ massage không?",
      answer: "Có. Du thuyền có cung cấp dịch vụ massage chuyên nghiệp (có tính phí, không bao gồm trong giá tour)."
    },
    {
      question: "Nếu ngày đi tour của tôi đúng vào sinh nhật thì có ưu đãi gì không?",
      answer: "Nếu khách hàng có sinh nhật trùng với ngày đi tour, vui lòng báo trước để nhận ưu đãi đặc biệt (nếu có)."
    },
    {
      question: "Trên tàu có WIFI không?",
      answer: "Trên tàu vẫn có khu vực có sóng và kết nối được WiFi, tuy nhiên kết nối có thể bị gián đoạn."
    },
    {
      question: "Tàu có phụ thu vào cuối tuần không?",
      answer: "Tàu có phụ thu vào cuối tuần và ngày lễ. Phí cụ thể được hiển thị rõ ràng khi đặt tour."
    },
    {
      question: "Du thuyền có tour mấy ngày?",
      answer: "Du thuyền cung cấp tour 2 ngày 1 đêm hoặc 3 ngày 2 đêm."
    },
    {
      question: "Thời gian di chuyển từ bến ra tàu có lâu không?",
      answer: "Từ bến tàu đến du thuyền mất khoảng 10-15 phút bằng tàu trung chuyển."
    },
    {
      question: "Du thuyền có cung cấp dịch vụ chèo kayak không?",
      answer: "Có. Quý khách có thể đăng ký hoạt động này khi đặt tour hoặc khi lên tàu."
    },
    {
      question: "Phụ nữ mang thai có thể đi lên tàu không?",
      answer: "Phụ nữ mang thai từ 32 tuần trở lên được khuyến nghị không nên đi du thuyền."
    },
    {
      question: "Đồ uống có bao gồm trong giá tour không?",
      answer: "Giá tour không bao gồm đồ uống, quý khách cần thanh toán riêng."
    }
  ];

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Câu hỏi thường gặp</h1>
      {faqs.map((item, index) => (
        <div key={index} className="p-4 mb-4 bg-white border rounded-lg shadow">
          <h2 className="mb-1 text-base font-medium">{item.question}</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};