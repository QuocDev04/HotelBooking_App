/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from 'react-router-dom';
import instanceClient from '../../../configs/instance';
import LeftTourDetail from './Left/LeftTourDetail';
import Content from './Content/Content';
import RightTourDetail from './Right/RightTourDetail';
import Schedule from './Content/Schedule';
import Evaluate from './Content/Evaluate';
import { useEffect, useRef, useState } from 'react';

const TourPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();

  // Hàm scroll
  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const { id: tourId } = useParams<{ id: string }>();
  const { data: tourD } = useQuery({
    queryKey: ['/date/tour/', tourId],
    queryFn: () => instanceClient.get(`/date/tour/${tourId}`)
  })
  const slots = tourD?.data?.data || [];
  console.log(slots);
  
  const { data: tour } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => instanceClient.get(`/tour/${id}`)
  })
  const tours = tour?.data?.tour

  // Thêm useEffect để log các giá trị quan trọng
  useEffect(() => {
    console.log("Selected date:", selectedDate);
    console.log("Available slots:", slots);
    
    // Tìm slot phù hợp với ngày đã chọn
    if (selectedDate && slots.length > 0) {
      const matchingSlot = slots.find(slot => 
        new Date(slot.dateTour).toDateString() === selectedDate.toDateString()
      );
      console.log("Matching slot:", matchingSlot);
    }
  }, [selectedDate, slots]);

  // Hàm vừa reset ngày vừa cuộn xuống lịch
  const handleChooseOtherDate = () => {
    setSelectedDate(null);
    scrollToCalendar();
  };

  // Cập nhật hàm setSelectedDate để log thêm thông tin
  const handleDateSelect = (date: Date | null) => {
    console.log("Date selected:", date);
    setSelectedDate(date);
    
    // Kiểm tra xem có slot nào cho ngày này không
    if (date && slots.length > 0) {
      const matchingSlot = slots.find(slot => 
        new Date(slot.dateTour).toDateString() === date.toDateString()
      );
      console.log("Matching slot after selection:", matchingSlot);
    }
  };
  return (
    <>
      <div className="max-w-screen-xl p-4 mx-auto font-sans mt-20">
        {/* Title */}
        <h1 className="mb-2 text-2xl font-semibold">
          {tours?.nameTour}
        </h1>
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
              <div className="text-sm font-semibold text-blue-500">{tours?.departure_location}</div>
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
              <div className="text-sm font-semibold text-blue-500">{tours?.destination?.locationName} - {tours?.destination?.country}</div>
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
              <div className="text-sm font-semibold text-blue-500">{tours?.duration}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3">
            <LeftTourDetail
              refDiv={calendarRef}
              selectedDate={selectedDate}
              setSelectedDate={handleDateSelect}
            />
            <div className="mt-8">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Tổng quan
                </button>
              </div>
              {activeTab === 'overview' && (
                <div className="mt-6">
                  <Content />
                  <Schedule />
                  <Evaluate />
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <RightTourDetail
              onChooseDate={selectedDate ? handleChooseOtherDate : scrollToCalendar}
              selectedDate={selectedDate}
              tour={tours}
              slots={slots} 
            />
          </div>
        </div>
      </div >
    </>
  );
};

export default TourPage;
