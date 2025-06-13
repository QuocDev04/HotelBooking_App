import { useQuery } from '@tanstack/react-query';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from 'react-router-dom';
import instanceClient from '../../../configs/instance';
import LeftTourDetail from './Left/LeftTourDetail';
import Content from './Content/Content';
import RightTourDetail from './Right/RightTourDetail';
import Schedule from './Content/Schedule';
import PriceList from './Content/PriceList';
import Evaluate from './Content/Evaluate';
import QA from './Content/QA';
import { useEffect } from 'react';
const TourPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const { id } = useParams();
  const { data: tour } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => instanceClient.get(`/tour/${id}`)
  })

  return (
    <>
      <div className="max-w-screen-xl p-4 mx-auto font-sans mt-32">
        {/* Title */}
        <h1 className="mb-2 text-2xl font-semibold">
          {tour?.data?.tour.nameTour}
        </h1>

        {/* Icons */}
        <div className="flex flex-wrap gap-4 mb-4 text-3xl text-gray-700">
          <div className="flex items-center gap-1">
            <span className="text-blue-600">★ ★ ★ ★ ☆</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                <path d="M9.01107 1.625C13.103 1.625 16.9043 4.90179 16.9043 9.03571C16.9043 11.7682 15.9811 13.7001 14.434 15.9524C12.707 18.4667 10.5018 20.8338 9.51601 21.8515C9.23162 22.1451 8.76735 22.1451 8.48296 21.8515C7.4972 20.8338 5.29202 18.4667 3.56496 15.9524C2.01787 13.7001 1.09473 11.7682 1.09473 9.03571C1.09473 4.90179 4.89588 1.625 8.98782 1.625" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <path d="M11.9637 9.47235C11.9637 11.1256 10.6409 12.4928 9.00411 12.4928C7.36733 12.4928 6.03516 11.1256 6.03516 9.47235C6.03516 7.81912 7.36733 6.56542 9.00411 6.56542C10.6409 6.56542 11.9637 7.81912 11.9637 9.47235Z" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Khởi hành từ</div>
              <div className="text-sm font-semibold text-blue-500">{tour?.data?.tour.departure_location}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                <path d="M9.01107 1.625C13.103 1.625 16.9043 4.90179 16.9043 9.03571C16.9043 11.7682 15.9811 13.7001 14.434 15.9524C12.707 18.4667 10.5018 20.8338 9.51601 21.8515C9.23162 22.1451 8.76735 22.1451 8.48296 21.8515C7.4972 20.8338 5.29202 18.4667 3.56496 15.9524C2.01787 13.7001 1.09473 11.7682 1.09473 9.03571C1.09473 4.90179 4.89588 1.625 8.98782 1.625" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <path d="M11.9637 9.47235C11.9637 11.1256 10.6409 12.4928 9.00411 12.4928C7.36733 12.4928 6.03516 11.1256 6.03516 9.47235C6.03516 7.81912 7.36733 6.56542 9.00411 6.56542C10.6409 6.56542 11.9637 7.81912 11.9637 9.47235Z" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Điểm đến</div>
              <div className="text-sm font-semibold text-blue-500">{tour?.data?.tour?.destination}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                <path d="M19 13.5V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 0.999998 3.89543 0.999998 5V17C0.999998 18.1046 1.89543 19 3 19H10.5" stroke="#3B82F6" stroke-width="2"></path>
                <path d="M15 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                <path d="M5 1V5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"></path>
                <path d="M20 16C20 13.2386 17.7614 11 15 11C12.2386 11 10 13.2386 10 16C10 18.7614 12.2386 21 15 21C17.7614 21 20 18.7614 20 16Z" stroke="#3B82F6" stroke-width="2"></path>
                <path d="M15 13.5676V16.0001L16.6216 17.6217" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Thời gian</div>
              <div className="text-sm font-semibold text-blue-500">{tour?.data?.tour?.duration}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className=" rounded-2xl p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path d="M14.5 6.5C14.5 9.12336 12.3733 11.25 9.75 11.25C7.12668 11.25 5 9.12336 5 6.5C5 3.87664 7.12668 1.75 9.75 1.75C12.3733 1.75 14.5 3.87664 14.5 6.5Z" stroke="#3B82F6" stroke-width="2"></path>
                <path d="M19 22V20C19 16.6863 16.3137 14 13 14H7C3.68629 14 1 16.6863 1 20V22" stroke="#3B82F6" stroke-width="2"></path>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-sm text-gray-500">Số chỗ còn nhận</div>
              <div className="text-sm font-semibold text-blue-500">{tour?.data?.tour?.maxPeople}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-8">
          {/* Image */}
          <LeftTourDetail/>

          {/* Booking box */}
          <RightTourDetail/>
        </div>
      </div>
      <div className="max-w-screen-xl p-6 mx-auto space-y-10">
        {/* Giới thiệu */}
        <Content/>

        {/* Lịch trình */}
        <Schedule/>

        {/* Bảng giá */}
        <PriceList/>

        {/* Đánh giá */}
        <Evaluate/>

        {/* Hỏi đáp */}
        <QA/>
      </div>
    </>
  );
};

export default TourPage;
