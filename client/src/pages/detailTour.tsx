import { useEffect, useState } from "react";

export default function JapanTourPage() {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    fetch("/api/faq")
      .then((res) => res.json())
      .then((data) => setFaqs(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const res = await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: newQuestion,
        author: author || "Ẩn danh",
      }),
    });

    if (res.ok) {
      const newFaq = await res.json();
      setFaqs((prev) => [...prev, newFaq]);
      setNewQuestion("");
      setAuthor("");
    }
  };

  return (
    <div className="max-w-6xl p-4 mx-auto space-y-12">
      {/* Giới thiệu */}
      <section>
        <h1 className="mb-2 text-3xl font-bold">Tour Nhật Bản: Hà Nội - Osaka - Kyoto - Tokyo</h1>
        <p className="text-gray-700">Nhật Bản được mệnh danh là một trong những thiên đường du lịch châu Á...</p>
        <ul className="mt-3 ml-6 text-gray-800 list-disc">
          <li>Ghé thăm công viên thỏ mộng Nara</li>
          <li>Trải nghiệm tàu cao tốc Shinkansen</li>
          <li>Thư giãn trong suối nước nóng onsen</li>
          <li>Thưởng thức thịt bò Kobe</li>
          <li><strong className="text-green-600">Đặc biệt: Hoàn tiền 100% nếu không đỗ visa</strong></li>
        </ul>
      </section>

      {/* Lịch trình */}
      <section>
        <h2 className="mb-3 text-2xl font-bold">Lịch trình tour</h2>
        <ul className="space-y-2">
          {[
            "Hà Nội - Osaka",
            "Osaka - Kobe",
            "Cố đô Kyoto",
            "Fuji - Lễ hội hoa anh đào Kawaguchi",
            "Tokyo",
            "Tokyo - Ngắm hoa anh đào công viên UENO - Hà Nội",
          ].map((day, idx) => (
            <li key={idx} className="p-3 border rounded shadow-sm">
              <span className="font-semibold">Ngày {idx + 1}:</span> {day}
            </li>
          ))}
        </ul>
      </section>

      {/* Bảng giá */}
      <section>
        <h2 className="mb-3 text-2xl font-bold">Bảng giá (Khởi hành từ Hà Nội)</h2>
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Ngày khởi hành</th>
              <th className="p-2">Hãng tour</th>
              <th className="p-2">Giá tour</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {["17/06/2025", "24/06/2025", "01/07/2025", "08/07/2025", "15/07/2025", "22/07/2025", "29/07/2025"].map((date, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{date}</td>
                <td className="p-2">Vietjet Air</td>
                <td className="p-2 font-semibold text-red-600">
                  {idx < 5 ? "29.900.000đ" : "28.900.000đ"}
                </td>
                <td className="p-2">
                  <button className="px-3 py-1 text-white bg-orange-500 rounded">Giữ chỗ ngay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Đánh giá */}
      <section>
        <h2 className="mb-3 text-2xl font-bold">Đánh giá</h2>
        <div className="p-4 mb-4 font-semibold text-green-800 bg-green-100 rounded">
          9.0 Tuyệt vời (30 đánh giá)
        </div>
        <div className="space-y-4">
          {["Nguyệt", "Hồng", "My Dung", "Bình An"].map((name, idx) => (
            <div key={idx} className="pt-3 border-t">
              <div className="font-medium text-green-700">Tuyệt vời - {name}</div>
              <p className="mt-1 text-sm text-gray-700">Chuyến đi đáng nhớ, lịch trình hợp lý, hướng dẫn viên thân thiện...</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hỏi đáp */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Hỏi đáp ({faqs.length})</h2>
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Tên của bạn (tùy chọn)"
            className="w-full p-2 border border-gray-300 rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Mời bạn để lại câu hỏi..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Gửi câu hỏi
          </button>
        </form>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="pt-4 border-t">
              <div className="mb-1 font-semibold text-orange-600">
                {faq.author || "Khách"} hỏi:
              </div>
              <div className="mb-2 text-gray-800">{faq.question}</div>
              {faq.answer && (
                <div className="p-3 text-sm text-gray-700 bg-gray-100 rounded">
                  <strong>BestPrice Travel:</strong> {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}