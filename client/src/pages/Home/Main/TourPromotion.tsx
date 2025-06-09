import { StarIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, TicketIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Tour {
    id: number;
    name: string;
    location: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    rating: number;
    image: string;
    departureDate?: string;
    duration?: string;
    remainingSlots?: number;
}

const tours: Tour[] = [
    {
        id: 1,
        name: "Tour Du Lịch Đà Nẵng - Hội An - Bà Nà 3N2Đ",
        location: "Đà Nẵng",
        price: 2990000,
        oldPrice: 3590000,
        discount: 17,
        rating: 4.8,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/276541f5-3b47-49c5-b04b-9ef17d84dad4-1458655379.jpg?v=1687925512290",
        departureDate: "20/07/2025",
        duration: "3 ngày 2 đêm",
        remainingSlots: 5,
    },
    {
        id: 2,
        name: "Tour Du Lịch Hội An - Cù Lao Chàm 2N1Đ",
        location: "Hội An",
        price: 1990000,
        oldPrice: 2290000,
        discount: 13,
        rating: 4.9,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/thap-eiffel-khang-dinh-tam-co-kien-truc-phap-tren-the-gioi-thap-eiffel2.jpg?v=1687919470253",
        departureDate: "25/07/2025",
        duration: "2 ngày 1 đêm",
        remainingSlots: 3,
    },
    {
        id: 3,
        name: "Tour Du Lịch Hạ Long - Tuần Châu 2N1Đ",
        location: "Hạ Long",
        price: 2490000,
        oldPrice: 2790000,
        discount: 11,
        rating: 4.7,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/phat-quang-son-nam-hoa-tu-1-1511.jpg?v=1687882521033",
        departureDate: "30/07/2025",
        duration: "2 ngày 1 đêm",
        remainingSlots: 2,
    },
    {
        id: 1,
        name: "Tour Du Lịch Đà Nẵng - Hội An - Bà Nà 3N2Đ",
        location: "Đà Nẵng",
        price: 2990000,
        oldPrice: 3590000,
        discount: 17,
        rating: 4.8,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/276541f5-3b47-49c5-b04b-9ef17d84dad4-1458655379.jpg?v=1687925512290",
        departureDate: "20/07/2025",
        duration: "3 ngày 2 đêm",
        remainingSlots: 5,
    },
    {
        id: 2,
        name: "Tour Du Lịch Hội An - Cù Lao Chàm 2N1Đ",
        location: "Hội An",
        price: 1990000,
        oldPrice: 2290000,
        discount: 13,
        rating: 4.9,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/thap-eiffel-khang-dinh-tam-co-kien-truc-phap-tren-the-gioi-thap-eiffel2.jpg?v=1687919470253",
        departureDate: "25/07/2025",
        duration: "2 ngày 1 đêm",
        remainingSlots: 3,
    },
    {
        id: 3,
        name: "Tour Du Lịch Hạ Long - Tuần Châu 2N1Đ",
        location: "Hạ Long",
        price: 2490000,
        oldPrice: 2790000,
        discount: 11,
        rating: 4.7,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/phat-quang-son-nam-hoa-tu-1-1511.jpg?v=1687882521033",
        departureDate: "30/07/2025",
        duration: "2 ngày 1 đêm",
        remainingSlots: 2,
    },
    // Thêm tour khác nếu cần
];

// Animation variants cho từng card
const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.1, 
            duration: 0.6,
            ease: 'easeOut',
        },
    }),
};

const TourPromotion = () => {
    return (
        <section className="py-16 bg-gradient-to-b bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-blue-600 mb-3">
                        Tour Du Lịch Nổi Bật
                    </h2>
                    <p className="text-blue-400 max-w-2xl mx-auto text-lg">
                        Khám phá những điểm đến hấp dẫn với các tour du lịch được thiết kế đặc biệt dành cho bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map((tour, index) => (
                        <motion.div
                            key={`${tour.id}-${index}`}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            custom={index}
                            variants={cardVariants}
                        >
                            <div className="relative">
                                <img
                                    src={tour.image}
                                    alt={tour.name}
                                    className="w-full object-cover"
                                />
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                {/* Tên tour */}
                                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
                                    {tour.name}
                                </h3>

                                {/* Ngày khởi hành, Địa điểm, Đánh giá */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Khởi hành: {tour.departureDate}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>Thời gian: {tour.duration}</span>
                                    </div>
                                </div>

                                {/* Giá cũ */}
                                {tour.oldPrice && (
                                    <div>
                                        <span className="line-through text-gray-400 text-sm">
                                            {tour.oldPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                )}

                                {/* Giá hiện tại + mã giảm giá */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-bold text-blue-600">
                                        {tour.price.toLocaleString('vi-VN')}đ
                                    </span>
                                    {tour.discount && (
                                        <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded border border-red-400">
                                            <TicketIcon className="w-4 h-4" />
                                            -{tour.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Còn chỗ + chi tiết */}
                                <div className="flex justify-between text-sm mb-4 text-gray-600">
                                    <span>
                                        Còn lại: <strong>{tour.remainingSlots} chỗ</strong>
                                    </span>
                                    <span className="text-blue-600 hover:underline text-sm cursor-pointer">
                                        Chi tiết
                                    </span>
                                </div>

                                <button className="mt-auto w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
                                    Đặt ngay
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center">
                    <button className="px-6 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow">
                        Xem thêm tour
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TourPromotion;
