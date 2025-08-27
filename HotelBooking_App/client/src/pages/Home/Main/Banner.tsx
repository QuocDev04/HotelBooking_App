/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import instanceClient from '../../../../configs/instance';

import bannerImage from '../../../assets/banner.png';

const Banner = () => {
  const { data, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['location'],
    queryFn: () => instanceClient.get('/location'),
  });

  const locations = data?.data?.location || [];
  console.log(locations);

  const {data:tour, isLoading: isLoadingTours} = useQuery({
    queryKey:['tour'],
    queryFn: () => instanceClient.get('/tour')
  })
  const tours = tour?.data?.tours
  console.log(tours);
  

  const isLoading = isLoadingLocations || isLoadingTours;
  
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e:any) => {
    e.preventDefault();

    
    // Kiểm tra nếu đang loading
    if (isLoading) {
      alert("Đang tải dữ liệu, vui lòng đợi!");
      return;
    }
    
    // Kiểm tra nếu tours chưa được load
    if (!tours || tours.length === 0) {
      alert("Không có dữ liệu tour, vui lòng thử lại!");
      return;
    }
    
    // Lọc những tour có destination hợp lệ
    const validTours = tours.filter((tour:any) => tour.destination && tour.destination._id);
    
    const foundTour = validTours.find(
      (tour:any) =>
        tour.departure_location === departure &&
        tour.destination._id === destination
    );

    
    if (foundTour) {
      navigate(`/detailtour/${foundTour._id}`);
    } else {
      const availableDestinations = validTours
        .filter((tour:any) => tour.departure_location === departure)
        .map((tour:any) => tour.destination.locationName)
        .join(', ');
      
      if (availableDestinations) {
        alert(`Không tìm thấy tour từ ${departure} đến điểm đến đã chọn.\nCác điểm đến có sẵn từ ${departure}: ${availableDestinations}`);
      } else {
        alert(`Hiện tại chưa có tour khởi hành từ ${departure}. Vui lòng chọn điểm khởi hành khác!`);
      }
    }
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative">
        
         <div className="w-full h-[400px] sm:h-[400px] md:h-[500px] lg:h-[600px] 
            bg-gradient-to-r from-[#00CFFF] to-[#001BFF]" />
        <img
          src={bannerImage}
          alt="banner"
          className="absolute top-1/2 right-16 -translate-y-1/2 max-h-[60%] object-contain"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-20 py-10">
          <div className="w-full max-w-7xl mx-auto">
            <div className="p-6 rounded-lg max-w-3xl text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">
                Du lịch cùng Elite Travel
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-6">
                Với nguồn lực dồi dào, kinh nghiệm và uy tín trong lĩnh vực dịch vụ du lịch, 
                Lữ hành Elite Travel luôn mang đến cho khách hàng những dịch vụ du lịch giá trị nhất.
              </p>
              <a href="">
                <button className="hidden md:inline-block bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300">
                  Tìm hiểu ngay
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full px-4 mb-20 md:mb-0">
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Điểm đi */}
                <div className="relative">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  >
                    <option value="" disabled>
                      Chọn điểm đi
                    </option>
                    {[
                      "Hà Nội",
                      "Hồ Chí Minh",
                      "Đà Nẵng",
                      "Hải Phòng",
                      "Cần Thơ",
                      "Huế",
                      "Nha Trang",
                      "Đà Lạt",
                      "Vũng Tàu",
                      "Quảng Ninh",
                      "Bình Dương",
                      "Đồng Nai",
                      "Bắc Ninh",
                      "Thái Nguyên",
                      "Lào Cai",
                      "Phú Quốc",
                      "Hạ Long",
                      "Sapa",
                    ].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Điểm đến - select */}
                <div className="relative">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  >
                    <option value="" disabled>
                      Chọn điểm đến
                    </option>
                    {locations.map((loc:any) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.locationName} - {loc.country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ngày */}
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Nút tìm kiếm */}
                <button
                  type="submit"

                  disabled={isLoading}
                  className={`rounded-lg py-3 px-6 transition-colors flex items-center justify-center gap-2 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>{isLoading ? 'Đang tải...' : 'Tìm kiếm'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
