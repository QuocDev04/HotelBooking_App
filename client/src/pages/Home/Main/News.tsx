const News = () => {
    const news = [
        {
            title: "Du hành ngược thời gian tại làng dân gian Naganeupseong Hàn Quốc",
            date: "02/07/2023",
            author: "Nguyễn Thị Kim Anh",
            excerpt:
                "Với lịch sử gần 700 năm, ngôi làng pháo đài Naganeupseong của Hàn Quốc khiến người ta ngỡ ngàng bởi thời gian dường như ngừng lại ở nơi đây...",
            image:
                "https://bizweb.dktcdn.net/100/489/447/articles/6-1.jpg?v=1688305324900",
        },
        {
            title: "Cắm trại ở Chư Nâm ngắm thiên đường mây ở độ cao",
            date: "02/07/2023",
            author: "Nguyễn Thị Kim Anh",
            excerpt:
                "Đỉnh Chư Nam Gia Lai là địa điểm dừng chân hấp dẫn thu hút những người đam mê trekking, khám phá thiên nhiên và cắm trại...",
            image:
                "https://bizweb.dktcdn.net/100/489/447/articles/5.jpg?v=1688305387470",
        },
        {
            title: "Kinh nghiệm cắm trại trên núi Bà Đen Tây Ninh cuối tuần siêu trải nghiệm",
            date: "02/07/2023",
            author: "Nguyễn Thị Kim Anh",
            excerpt:
                "Cắm trại núi Bà Đen đang là một trong những hoạt động hấp dẫn được nhiều bạn trẻ quan tâm. Cảnh quan hoang sơ tuyệt đẹp...",
            image:
                "https://bizweb.dktcdn.net/100/489/447/articles/4.jpg?v=1688305102097",
        },
    ];

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white"><div className="max-w-screen-lg mx-auto py-16 px-4 md:px-8">
            
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-blue-600 mb-3">
                    Tin tức mới nhất
                </h2>
                <p className="text-blue-400 max-w-xl mx-auto text-lg">
                    Tour du lịch <strong>Trong nước</strong> với <strong>Elite Travel</strong>. Hành hương đầu xuân - Tận hưởng bản sắc Việt.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {item.date} &nbsp; | &nbsp; {item.author}
                            </p>
                            <p className="text-gray-700 mt-2 text-sm">{item.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div></div>
        
    );
};

export default News;
  