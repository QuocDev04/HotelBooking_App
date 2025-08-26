import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import instanceClient from '../../../../configs/instance';
import { Link } from 'react-router-dom';

const International = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // gọi API lấy danh sách tours
    const { data } = useQuery({
        queryKey: ['tours'],
        queryFn: () => instanceClient.get('/tour'),
    });

    const tours = data?.data?.tours || [];

    return (
        <>
            {/* Heading */}
            <div className="flex items-center justify-center px-4 md:px-8 mb-10 mt-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-600 leading-snug">
                    Các gói du lịch trong nước & ngoài nước
                </h2>
            </div>

            {/* Chỉ 1 slider chung cho tất cả tour */}
            <div className="relative w-full max-w-screen-xl mx-auto pb-8 overflow-hidden">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            if (
                                swiper.params.navigation &&
                                typeof swiper.params.navigation !== 'boolean'
                            ) {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                                swiper.navigation.destroy();
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }
                        });
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                >
                    {tours.map((tour: any) => (
                        <SwiperSlide key={tour._id}>
                            <article className="relative overflow-hidden rounded-xl shadow-md transition duration-300 hover:shadow-2xl group h-[320px]">
                                <Link to={`/detailtour/${tour._id}`}>
                                 <img
                                    src={tour.imageTour?.[0]}
                                    alt={tour.nameTour}
                                    className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="relative bg-gradient-to-t from-black/70 to-black/10 h-full flex flex-col justify-end items-center text-center p-4">
                                    <h3 className="text-lg font-semibold text-white drop-shadow line-clamp-2">
                                        {tour.nameTour}
                                    </h3>
                                    <p className="text-sm text-white/90 mt-1">
                                        {tour.duration}
                                    </p>
                                    <p className="text-sm text-blue-300 mt-1">
                                        {tour.Address}
                                    </p>
                                </div>
                                </Link>
                                
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Nút điều hướng */}
                <button
                    ref={prevRef}
                    className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white text-gray-800 hover:bg-gray-100 hover:scale-110 p-2 rounded-full shadow-lg transition duration-300"
                >
                    <FaChevronLeft />
                </button>
                <button
                    ref={nextRef}
                    className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white text-gray-800 hover:bg-gray-100 hover:scale-110 p-2 rounded-full shadow-lg transition duration-300"
                >
                    <FaChevronRight />
                </button>
            </div>
        </>
    );
};

export default International;
