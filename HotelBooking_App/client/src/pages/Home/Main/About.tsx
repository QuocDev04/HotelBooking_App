import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.5, duration: 0.6 },
    }),
};

const AboutUs = () => {
    const highlights = [
        { number: 27, label: "Năm hình thành và phát triển" },
        { number: 6, label: "Văn phòng nước ngoài" },
        { number: 43, label: "Chi nhánh và giao dịch" },
        { number: 15, label: "Công ty thành viên" },
    ];

    return (
        <>
            <div className="mt-20 min-h-[700px] py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        {/* Text Section */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="w-full md:w-1/2 space-y-6 text-left"
                        >
                            <motion.h4 variants={fadeInUp} custom={0} className="text-blue-400 text-3xl md:text-4xl font-semibold uppercase tracking-wide">
                                VỀ CHÚNG TÔI
                            </motion.h4>
                            <motion.h2 variants={fadeInUp} custom={1} className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                                Công ty cổ phần <span className="text-blue-400">Elite Travel</span>
                            </motion.h2>
                            <motion.p variants={fadeInUp} custom={2} className="text-gray-200 text-lg text-white leading-relaxed">
                                Chúng tôi luôn lắng nghe và chia sẻ mong muốn của từng Quý khách hàng,
                                mang lại sự hài lòng về dịch vụ và thái độ phục vụ của từng nhân viên.
                                Mỗi dịch vụ là một mắt xích kết nối hoàn hảo cho chuyến đi của Quý khách.
                                Hạnh phúc và sự hài lòng của khách hàng chính là giá trị cốt lõi của chúng tôi.
                            </motion.p>
                            <div className="grid grid-cols-1 gap-6 mt-8">
                                {highlights.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fadeInUp}
                                        custom={3 + i}
                                        className="flex items-baseline text-4xl"
                                    >
                                        <span className="text-blue-400 text-5xl font-bold mr-4">
                                            {String(item.number).padStart(2, "0")}
                                        </span>
                                        <span className="leading-tight text-white text-2xl">{item.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Image Section */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="w-full md:w-1/2 relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center"
                        >
                            {/* Image 1 */}
                            <motion.img
                                custom={0}
                                variants={fadeInUp}
                                src="https://i.pinimg.com/736x/f6/5d/ea/f65dea5017f8fdc298d49d6753197717.jpg"
                                alt="Pool"
                                className="absolute top-0 left-1/2 w-56 md:w-72 rounded-2xl shadow-2xl z-10 rotate-[6deg] -translate-x-1/2 transition-transform duration-500 hover:scale-105"
                            />

                            {/* Image 2 */}
                            <motion.img
                                custom={1}
                                variants={fadeInUp}
                                src="https://i.pinimg.com/736x/fc/94/12/fc94123c91b63e453980abd64b2925cd.jpg"
                                alt="Villa"
                                className="absolute top-32 left-1/3 w-56 md:w-72 rounded-2xl shadow-2xl z-20 rotate-[-20deg] -translate-x-1/2 transition-transform duration-500 hover:scale-105"
                            />

                            {/* Image 3 */}
                            <motion.img
                                custom={2}
                                variants={fadeInUp}
                                src="https://i.pinimg.com/736x/45/85/70/45857057981d48c1a63e2b9a11539f16.jpg"
                                alt="View"
                                className="absolute top-64 left-2/3 w-64 md:w-80 rounded-2xl shadow-2xl z-30 rotate-[5deg] -translate-x-1/2 transition-transform duration-500 hover:scale-105"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <div className="flex flex-wrap items-center justify-center gap-6">
                    {/* Box 1 */}
                    <div className="w-80 border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
                        <div className="flex flex-col items-center px-5 py-4 relative">
                            <img
                                className="h-24 w-24 absolute -top-14 rounded-full object-cover border-4 border-white shadow"
                                src="https://i.pinimg.com/736x/a0/fa/cd/a0facd0bfff2ebbc27ebfb66cf66b272.jpg"
                                alt="tourInfo"
                            />
                            <div className="pt-12 text-center">
                                <h1 className="text-lg font-medium text-gray-800">
                                    Các Thông Tin Tour Mới Nhất
                                </h1>
                                <p className="text-gray-800/80 mt-1">
                                    Luôn cập nhật các thông tin mới nhất, đầy đủ nhất về các tour tốt nhất hiện nay.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Box 2 */}
                    <div className="w-80 border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
                        <div className="flex flex-col items-center px-5 py-4 relative">
                            <img
                                className="h-24 w-24 absolute -top-14 rounded-full object-cover border-4 border-white shadow"
                                src="https://bizweb.dktcdn.net/100/489/447/themes/912592/assets/why_2.png?1743654439525"
                                alt="consultant"
                            />
                            <div className="pt-12 text-center">
                                <h1 className="text-lg font-medium text-gray-800">
                                    Chuyên Gia Tư Vấn Chi Tiết Nhất
                                </h1>
                                <p className="text-gray-800/80 mt-1">
                                    Các tư vấn viên chuyên nghiệp luôn sẵn sàng hỗ trợ bạn tận tâm và chi tiết nhất.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Box 3 */}
                    <div className="w-80 border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5">
                        <div className="flex flex-col items-center px-5 py-4 relative">
                            <img
                                className="h-24 w-24 absolute -top-14 rounded-full object-cover border-4 border-white shadow"
                                src="https://bizweb.dktcdn.net/100/489/447/themes/912592/assets/why_3.png?1743654439525"
                                alt="promotion"
                            />
                            <div className="pt-12 text-center">
                                <h1 className="text-lg font-medium text-gray-800">
                                    Khuyến Mãi & Giá Luôn Tốt Nhất
                                </h1>
                                <p className="text-gray-800/80 mt-1">
                                    Các chương trình khuyến mãi hấp dẫn và giá tour cạnh tranh được cập nhật liên tục.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUs;
