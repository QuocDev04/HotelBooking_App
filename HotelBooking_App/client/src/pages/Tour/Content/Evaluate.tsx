
const Evaluate = () => {
  return (
        <section>
            <h2 className="mb-4 text-2xl font-bold">Đánh giá</h2>
            <div className="text-xl font-bold text-green-600">9 Tuyệt vời</div>
            <div className="grid gap-4 mt-4">
                {[
                    {
                        name: "Nguyệt",
                        date: "01/06/2025",
                        rating: 9.4,
                        comment: "Chuyến đi đáng nhớ, lịch trình trọn vẹn, thích bò Kobe và Shinkansen."
                    },
                    {
                        name: "Hồng",
                        date: "18/05/2025",
                        rating: 9.4,
                        comment: "Điểm đến hợp lý, nhân viên dễ thương, rất hài lòng."
                    }
                ].map((review, i) => (
                    <div key={i} className="p-4 border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">{review.name} - {review.date}</div>
                            <div className="px-2 text-sm text-white bg-green-500 rounded">{review.rating}</div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Evaluate