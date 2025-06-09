/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarIcon, TicketIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
        id: 4,
        name: "Tour Du Lịch Nha Trang - Vinpearl 3N2Đ",
        location: "Nha Trang",
        price: 2790000,
        oldPrice: 3190000,
        discount: 13,
        rating: 4.6,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/2-2b8b63f8-1382-4787-9c7c-d38bf469d2ba.jpg?v=1688457916017",
        departureDate: "05/08/2025",
        duration: "3 ngày 2 đêm",
        remainingSlots: 4,
    },
    {
        id: 5,
        name: "Tour Du Lịch Phú Quốc 4N3Đ",
        location: "Phú Quốc",
        price: 3590000,
        oldPrice: 3990000,
        discount: 10,
        rating: 4.9,
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/review-grand-world-phu-quoc-3.jpg?v=1687925020523",
        departureDate: "10/08/2025",
        duration: "4 ngày 3 đêm",
        remainingSlots: 6,
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.15,
            duration: 0.6,
            ease: 'easeOut',
        },
    }),
};

const TourOut = () => {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const [swiperInstance, setSwiperInstance] = useState<any>(null);

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;

            // Destroy và khởi tạo lại navigation để nó nhận ref mới
            swiperInstance.navigation.destroy();
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-blue-600 mb-3">
                        Tour Du Lịch Trong Nước
                    </h2>
                    <p className="text-blue-400 max-w-xl mx-auto text-lg">
                        Khám phá những điểm đến hấp dẫn với các tour du lịch được thiết kế đặc biệt dành cho bạn
                    </p>
                </div>
                <div className='relative w-full max-w-screen-5xl mx-auto pb-8 overflow-hidden'>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop
                        onSwiper={(swiper) => setSwiperInstance(swiper)}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="pb-8"
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                    >
                        {tours.map((tour, index) => (
                            <SwiperSlide key={tour.id}>
                                <motion.div
                                    className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    custom={index}
                                    variants={cardVariants}
                                >
                                    {/* Nội dung card tour */}
                                    <div className="relative">
                                        <img
                                            src={tour.image}
                                            alt={tour.name}
                                            className="w-full object-cover h-48"
                                        />
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug overflow-hidden text-ellipsis whitespace-normal h-[3rem]">
                                            {tour.name}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-2 text-sm">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>Thời gian: {tour.duration}</span>
                                            </div>

                                           
                                        </div>

                                        {tour.oldPrice && (
                                            <div>
                                                <span className="line-through text-gray-400 text-sm">
                                                    {tour.oldPrice.toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                        )}

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
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Nút điều hướng */}
                    <button
                        ref={prevRef}
                        className="absolute top-1/2 left-1 -translate-y-1/2 z-10 bg-white text-gray-800 hover:bg-gray-100 hover:scale-110 p-2 rounded-full shadow-lg transition duration-300"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute top-1/2 right-1 -translate-y-1/2 z-10 bg-white text-gray-800 hover:bg-gray-100 hover:scale-110 p-2 rounded-full shadow-lg transition duration-300"
                    >
                        <FaChevronRight />
                    </button>

                </div>


                <div className="flex justify-center">
                    <button className="px-6 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow">
                        Xem thêm tour
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TourOut;
