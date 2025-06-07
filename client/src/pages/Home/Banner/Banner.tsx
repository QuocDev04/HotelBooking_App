import { FiSearch } from "react-icons/fi"; // optional icon

const Banner = () => {
    return (
        <div className='relative h-screen bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center text-white'>

            {/* Lớp phủ mờ (overlay) */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Nội dung chính */}
            <div className='relative z-10 flex flex-col items-center justify-end h-full px-6 md:px-16 lg:px-24 xl:px-32 text-center'>

                {/* Tiêu đề và mô tả */}
                <div className="mb-32">
                    <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full'>Trải Nghiệm Khách Sạn Tuyệt Vời</p>

                    <h1 className='font-playfair text-3xl md:text-5xl lg:text-6xl font-bold max-w-3xl mt-4'>
                        Khám Phá Điểm Đến Nghỉ Dưỡng Hoàn Hảo Của Bạn
                    </h1>

                    <p className='max-w-xl mt-4 text-sm md:text-base text-white/90'>
                        Sự sang trọng và thoải mái bậc nhất đang chờ đón bạn tại các khách sạn và khu nghỉ dưỡng đẳng cấp. Bắt đầu hành trình của bạn ngay hôm nay.
                    </p>
                </div>
            </div>

            {/* Biểu mẫu tìm kiếm lớn nằm nửa ngoài hình ảnh */}
            <form className='absolute left-1/2 -translate-x-1/2 bottom-[-80px] bg-white/90 backdrop-blur-lg text-gray-700 rounded-2xl shadow-2xl px-8 py-8 flex flex-col md:flex-row gap-6 w-[90%] max-w-6xl z-20'>

                <div className="flex-1">
                    <label htmlFor="destinationInput" className="text-sm font-medium">Điểm đến</label>
                    <input list='destinations' id="destinationInput" type="text" className="w-full rounded border border-gray-200 px-4 py-3 mt-1 text-sm outline-none" placeholder="Nhập điểm đến" required />
                </div>

                <div>
                    <label htmlFor="checkIn" className="text-sm font-medium">Ngày nhận phòng</label>
                    <input id="checkIn" type="date" className="w-full rounded border border-gray-200 px-4 py-3 mt-1 text-sm outline-none" />
                </div>

                <div>
                    <label htmlFor="checkOut" className="text-sm font-medium">Ngày trả phòng</label>
                    <input id="checkOut" type="date" className="w-full rounded border border-gray-200 px-4 py-3 mt-1 text-sm outline-none" />
                </div>

                <div className="w-24">
                    <label htmlFor="guests" className="text-sm font-medium">Số khách</label>
                    <input min={1} max={4} id="guests" type="number" className="w-full rounded border border-gray-200 px-4 py-3 mt-1 text-sm outline-none" placeholder="0" />
                </div>

                <button className='flex items-center justify-center gap-2 bg-black text-white rounded-md px-6 py-3 mt-5 md:mt-auto hover:bg-gray-900 transition'>
                    <FiSearch className="text-lg" />
                    <span>Tìm kiếm</span>
                </button>
            </form>
        </div>

    

    );
};

export default Banner;
