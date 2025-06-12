import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Banner = () => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative">
        <img
          src="https://i.pinimg.com/736x/68/ab/ee/68abee6113e0fdbe28c3b6be1906a426.jpg"
          alt="banner"
          className="w-full h-[600px]"
        />
        {/* Overlay text */}
        <div className="absolute inset-0 bg-black/30 flex items-center px-4 sm:px-8 md:px-20 py-10">
          <div className="text-white max-w-3xl text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 animate-fadeInUp">
              Du lịch cùng Elite Travel
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-6 animate-fadeInUp delay-100">
              Với nguồn lực dồi dào, kinh nghiệm và uy tín trong lĩnh vực dịch vụ du lịch, Lữ hành Elite Travel luôn mang đến cho khách hàng những dịch vụ du lịch giá trị nhất.
            </p>
            <button className="hidden md:inline-block bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 animate-fadeInUp delay-200">
              Tìm hiểu ngay
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow-xl">
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Chọn điểm đi"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Chọn điểm đến"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg py-3 px-6 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Tìm kiếm</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
