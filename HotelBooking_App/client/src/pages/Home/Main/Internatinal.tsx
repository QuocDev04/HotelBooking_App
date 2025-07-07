import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const International = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const products = [
        {
            id: 1,
            name: 'Hà Nội',
            description: 'Jeans thời trang phong cách hiện đại.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_1.jpg?1743654439525',
        },
        {
            id: 2,
            name: 'Đà Nẵng',
            description: 'Chất liệu cotton thoáng mát.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_2.jpg?1743654439525',
        },
        {
            id: 3,
            name: 'Đà Lạt',
            description: 'Phù hợp cho mọi hoạt động hàng ngày.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_3.jpg?1743654439525',
        },
        {
            id: 4,
            name: 'Phú Quốc',
            description: 'Giữ ấm và nổi bật phong cách đường phố.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_4.jpg?1743654439525',
        },
        {
            id: 5,
            name: 'Châu Á',
            description: 'Trang phục phong cách hiện đại.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_5.jpg?1743654439525',
        },
        {
            id: 6,
            name: 'Châu Mỹ',
            description: 'Thời trang năng động và phá cách.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_6.jpg?1743654439525',
        },
        {
            id: 7,
            name: 'Châu Âu',
            description: 'Phong cách thanh lịch và hiện đại.',
            image1: 'https://bizweb.dktcdn.net/thumb/large/100/489/447/themes/912592/assets/cate_7.jpg?1743654439525',
        },
    ];

    return (
        <>
            {/* Heading */}
            <div className="flex items-center justify-center px-4 md:px-8 mb-10 mt-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-600 leading-snug">
                    Các gói trong nước và ngoài nước phổ biến
                </h2>
            </div>

            {/* Swiper Section */}
            <div className="relative w-full max-w-screen-xl mx-auto pb-12 overflow-hidden">
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
                            if (typeof swiper.params.navigation !== 'boolean') {
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
                    {products.map((product) => (
                        <SwiperSlide key={product.id}>
                            <article className="relative overflow-hidden rounded-xl shadow-md transition duration-300 hover:shadow-2xl group h-[280px]">
                                <img
                                    src={product.image1}
                                    alt={product.name}
                                    className="absolute inset-0 h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="relative bg-gradient-to-t from-black/70 to-black/10 h-full flex flex-col justify-end items-center text-center p-4">
                                    <h3 className="text-2xl font-semibold text-white drop-shadow">{product.name}</h3>
                                    <p className="text-sm text-white/90 mt-1 line-clamp-2">{product.description}</p>
                                </div>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Buttons */}
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
