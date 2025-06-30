/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useState } from 'react';
const TourPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState<any[]>([])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const { id } = useParams();
  const { data: tour } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => instanceClient.get(`/tour/${id}`)
  })
  const { data: room } = useQuery({
    queryKey: ['room'],
    queryFn: () => instanceClient.get('/room')
  })
  const rooms = room?.data?.rooms
  const toggleSelectRoom = (roomItem: any) => {
    if (selectedRoom.some(r => r._id === roomItem._id)) {
      // Nếu đã chọn rồi thì bỏ chọn
      setSelectedRoom(prev => prev.filter(r => r._id !== roomItem._id));
    } else {
      // Nếu chưa chọn thì thêm vào
      setSelectedRoom(prev => [...prev, roomItem]);
    }
  };
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
              <div className="text-sm font-semibold text-blue-500">{tour?.data?.tour?.available_slots}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3">
            <LeftTourDetail />
            <div className="mt-8">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Tổng quan
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'rooms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('rooms')}
                >
                  Phòng nghỉ
                </button>
              </div>
              {activeTab === 'overview' && (
                <div className="mt-6">
                  <Content />
                  <Schedule />
                  <PriceList />
                  <Evaluate />
                  <QA />
                </div>
              )}
              {activeTab === 'rooms' && (
                <div className="space-y-6 max-w-3xl mt-6">
                  {rooms?.map((room: any) => {
                    const isSelected = selectedRoom.some((r: any) => r._id === room._id);
                    const isAvailable = room.statusRoom === 'available';
                    const isWaiting = room.statusRoom === 'waiting';
                    const isFull = room.statusRoom === 'full';
                    const isCancelled = room.statusRoom === 'cancelled';

                    let roomStatusText = '';
                    if (isWaiting) roomStatusText = 'Chờ xác nhận';
                    else if (isFull) roomStatusText = 'Đã đầy';
                    else if (isCancelled) roomStatusText = 'Đã hủy';
                    else if (!isAvailable) roomStatusText = 'Không khả dụng';

                    return (
                      <div
                        key={room._id}
                        className={`border rounded-lg overflow-hidden transition-all p-4 bg-blue-100 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => isAvailable && toggleSelectRoom(room)}
                        title={!isAvailable ? `Phòng ${roomStatusText}` : ''}
                        style={{ borderColor: '#2563eb' }}
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={room.imageRoom[0]}
                            alt={room.typeRoom}
                            className="rounded-lg w-full md:w-64 h-40 object-cover border border-gray-300 shadow-sm"
                          />
                          <div className="flex flex-col flex-1 justify-between">
                            <div>
                              <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg md:text-xl text-black">
                                  {room.nameRoom?.split(' ').slice(0, 5).join(' ') + '...' || ''}
                                </h3>
                                <div className="md:mt-0 text-right">
                                  <div className="flex items-center space-x-1 md:space-x-2">
                                    <p className="text-blue-700 font-bold text-lg md:text-xl">
                                      {new Intl.NumberFormat('vi-VN').format(room.priceRoom)}₫
                                    </p>
                                    <p className="text-sm text-gray-700">/khách</p>
                                  </div>
                                </div>
                              </div>
                              <p className="text-blue-400 mt-1">
                                {room.typeRoom} - sức chứa tối đa {room.capacityRoom} người
                              </p>
                              <p
                                className="my-2"
                                dangerouslySetInnerHTML={{
                                  __html: room.descriptionRoom?.split(' ').slice(0, 7).join(' ') + '...' || '',
                                }}
                              />
                              <div className="flex flex-wrap gap-2 mt-3 max-h-16 overflow-hidden">
                                {room.amenitiesRoom?.map((item: any, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs whitespace-nowrap"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isAvailable) return;
                                if (isSelected) {
                                  setSelectedRoom(selectedRoom.filter((r) => r._id !== room._id));
                                } else {
                                  setSelectedRoom([...selectedRoom, room]);
                                }
                              }}
                              className={`mt-4 w-full py-2 rounded-lg ${isAvailable
                                  ? isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                              disabled={!isAvailable}
                            >
                              {!isAvailable
                                ? roomStatusText
                                : isSelected
                                  ? 'Bỏ chọn'
                                  : 'Chọn phòng'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3 h-full">
            <RightTourDetail selectedRoom={selectedRoom} />
          </div>
        </div>
      </div >
    </>
  );
};

export default TourPage;
