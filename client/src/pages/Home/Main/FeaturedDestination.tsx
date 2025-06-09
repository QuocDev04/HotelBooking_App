import { useEffect, useRef, useState } from "react";

const cardData = [
    {
        title: "Tour Mù Cang Chải 3N2Đ: Hà Nội - Trạm Tấu - Cu Vai",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/1-899ca4dd-af23-44ed-9e51-210b1508a89f.jpg?v=1692719051887",
    },
    {
        title: "Tour Ninh Bình 1N : Hà Nội - Bái Đính - Tràng An",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/1-67804ccb-fc7a-458f-b0ac-f58f7dfac388.jpg?v=1692718756847",
    },
    {
        title: "Tour Hà Nội 1N: Tham Quan Phố Cổ",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/1-43e36583-dd7e-40af-ae2e-315be7974f26.jpg?v=1692718554600",
    },
    {
        title: "Tour Miền Bắc 4N3Đ: HCM - Hạ Long - Sapa - Hà Khẩu Trung Quốc - Công Viên Ánh Sáng",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/1-4fbcc5c3-471f-41dc-95fc-257fb35e2fd2.jpg?v=1688458463893",
    },
    {
        title: "Tour Phú Quốc 3N2Đ: HCM - Grand World - Câu Cá - Lặn Ngắm San Hô",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/2-2b8b63f8-1382-4787-9c7c-d38bf469d2ba.jpg?v=1688457916017",
    },
    {
        title: "Tour Limousine Phan Thiết 3N2Đ: Hồ Tràm - Phan Thiết - Mũi Né - Công Viên Tropicana",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/276541f5-3b47-49c5-b04b-9ef17d84dad4-1458655379.jpg?v=1687925512290",
    },
    {
        title: "Tour Phú Quốc 3N2Đ: Grand World - Cáp Treo Hòn Thơm - Buffet Trưa 3 Miền",
        image: "https://bizweb.dktcdn.net/thumb/large/100/489/447/products/review-grand-world-phu-quoc-3.jpg?v=1687925020523",
    },
];

const FadeUpCard = ({
    card,
    index,
}: {
    card: { title: string; image: string };
    index: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`w-64 sm:w-72 md:w-80 mx-2 sm:mx-3 md:mx-4 h-[28rem] sm:h-[30rem] relative group rounded-xl overflow-hidden shadow-lg transform transition-all duration-700 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
            style={{
                transitionDelay: `${index * 200}ms`,
            }}
        >
            <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
            />
            <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/20">
                <p className="text-white text-base sm:text-lg md:text-xl font-semibold text-center">
                    {card.title}
                </p>
            </div>
        </div>
    );
};

const FeaturedDestination = () => {
    const [stopScroll, setStopScroll] = useState(false);

    return (
        <div className="min-h-full w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col items-center relative overflow-hidden py-12 sm:py-16">
            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

            {/* Header */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start px-4 md:px-8 mb-10">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                        Các địa điểm và phổ biến nhất
                    </h2>
                    <div className="w-16 h-1 mt-2 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] rounded-full" />
                </div>
                <p className="text-gray-600 max-w-xl text-sm md:text-base leading-relaxed">
                    Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và phổ biến nhất.
                    Khám phá một hành trình tuyệt vời đưa bạn vào thế giới của sự sang trọng, tiện nghi
                    và trải nghiệm không thể quên.
                </p>
            </div>

            {/* Marquee Carousel */}
            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setStopScroll(true)}
                onMouseLeave={() => setStopScroll(false)}
            >
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#F5F7FF] to-transparent" />
                <div
                    className="marquee-inner flex w-fit"
                    style={{
                        animationPlayState: stopScroll ? "paused" : "running",
                        animationDuration: cardData.length * 3500 + "ms",
                    }}
                >
                    <div className="flex">
                        {[...cardData, ...cardData].map((card, index) => (
                            <FadeUpCard
                                key={index}
                                card={card}
                                index={index % cardData.length}
                            />
                        ))}
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#F5F7FF] to-transparent" />
            </div>
        </div>
    );
};

export default FeaturedDestination;
