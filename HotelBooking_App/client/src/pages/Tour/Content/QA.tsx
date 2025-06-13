
const QA = () => {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Hỏi đáp</h2>
      <div className="space-y-4">
        {[
          {
            question: "Tour đi Nhật Bản ngày 10.06.2025 có thêm được 2 chỗ nữa không?",
            answer: "Dạ hiện vẫn còn nhận được 2 khách nữa ạ."
          },
          {
            question: "Tour có ghé Kobe để ăn thịt bò không?",
            answer: "Tour có ghé thành phố Kobe, tùy chương trình sẽ có trải nghiệm bò Kobe."
          }
        ].map((item, i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm">
            <p className="font-medium">Q: {item.question}</p>
            <p className="mt-2 text-sm text-gray-700">A: {item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default QA
