import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import { useNavigate, useParams } from 'react-router-dom';
import instanceClient from '../../../../configs/instance';
import type { AxiosError } from 'axios';
import { message } from 'antd';

interface RightTourDetailProps {
    selectedRoom: {
        _id: string;
        nameRoom: string;
        priceRoom: string;
        typeRoom?: string;
        capacityRoom: number
    }[] | null;
}

interface TourData {
    _id: string;
    price: number;
    duration: string;
}

interface BookingTourData {
    userId: string;
    tourId: string;
    bookingDate: Date;
    adultsTour: number;
    childrenTour: number;
    itemRoom: {
        roomId: string;
    }[];
}

const RightTourDetail = ({ selectedRoom }: RightTourDetailProps) => {
    const { id } = useParams<{ id: string }>();
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [adultsTour, setAdultsTour] = useState(1);
    const [childrenTour, setChildrenTour] = useState(0);

    const { data: tour } = useQuery({
        queryKey: ['tour', id],
        queryFn: () => instanceClient.get(`/tour/${id}`),
        enabled: !!id,
    });

    const tours: TourData | undefined = tour?.data?.tour;
    const price = tours?.price ?? 0;

    const getNights = (durationStr: string) => {
        const match = durationStr.match(/(\d+)\s*đêm/);
        return match ? parseInt(match[1], 10) : 1;
    };

    const nights = getNights(tours?.duration || '');

    const { mutate, isLoading } = useMutation({
        mutationFn: async (data: BookingTourData) => {
            try {
                const response = await instanceClient.post(`/bookingTour`, data);
                return response.data;
            } catch (error) {
                const err = error as AxiosError<{ messages: string[] }>;
                const errorMessages = err?.response?.data?.messages;
                throw new Error(errorMessages?.[0] || 'Đã có lỗi xảy ra');
            }
        },
        onSuccess: (data) => {
            const bookingId = data.booking._id;
            navigate(`/bookingall/${bookingId}`);
        },
        onError: (error: Error) => {
            message.error(error.message || 'Đặt tour thất bại');
        },
    });

    const handleBooking = () => {
        if (!userId) {
            message.error('Vui lòng đăng nhập để đặt tour');
            return;
        }

        if (!bookingDate) {
            message.error('Vui lòng chọn ngày đi');
            return;
        }

        if (!selectedRoom || selectedRoom.length === 0) {
            message.error('Vui lòng chọn phòng');
            return;
        }

        const totalCapacity = selectedRoom
            ? selectedRoom.reduce((sum, room) => sum + room.capacityRoom, 0)
            : 0;

        if (totalCapacity < adultsTour + childrenTour) {
            message.error('Vui lòng chọn thêm phòng để phù hợp với số người đi');
            return;
      }
        const data: BookingTourData = {
            userId,
            tourId: id || '',
            bookingDate,
            adultsTour,
            childrenTour,
            itemRoom: selectedRoom.map(room => ({
                roomId: room._id,
              })),
        };

        mutate(data);
    };

    return (
        <div className="max-w-[460px] w-full bg-blue-100/90 p-5 max-md:mt-16 border rounded-4xl border-gray-300/70">
            <h2 className="lg:text-4xl md:text-xl font-medium text-blue-500 my-2">
                {price.toLocaleString()}đ
            </h2>
            <div className="text-sm">
                Mã tour: <strong>{tours?._id?.slice(-5)}</strong>
            </div>
            <hr className="border-gray-300 my-5" />

            {/* Ngày đi */}
            <div className="flex items-center mb-4">
                <div className="rounded-2xl p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 21 22"
                        fill="none"
                    >
                        {/* SVG paths */}
                        <path
                            d="M19 13.5V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 0.999998 3.89543 0.999998 5V17C0.999998 18.1046 1.89543 19 3 19H10.5"
                            stroke="#3B82F6"
                            strokeWidth="2"
                        />
                        <path d="M15 1V5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                        <path d="M5 1V5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                        <path
                            d="M20 16C20 13.2386 17.7614 11 15 11C12.2386 11 10 13.2386 10 16C10 18.7614 12.2386 21 15 21C17.7614 21 20 18.7614 20 16Z"
                            stroke="#3B82F6"
                            strokeWidth="2"
                        />
                        <path
                            d="M15 13.5676V16.0001L16.6216 17.6217"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <DatePicker
                    selected={bookingDate}
                    onChange={(date) => setBookingDate(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    placeholderText="Chọn ngày đi"
                    className="w-[300px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Số lượng người lớn/trẻ em */}
            <div className="space-y-2 my-6">
                {/* Người lớn */}
                <div className="flex items-center justify-between gap-4">
                    <span className="w-24">Người lớn</span>
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                        <button onClick={() => setAdultsTour(Math.max(adultsTour - 1, 1))} className="px-2">-</button>
                        <input
                            type="number"
                            value={adultsTour}
                            readOnly
                            className="h-9 w-16 text-center border-transparent sm:text-sm"
                        />
                        <button onClick={() => setAdultsTour(adultsTour + 1)} className="px-2">+</button>
                    </div>
                    <span className="text-sm text-gray-500 min-w-[80px] text-right">
                        {(price * adultsTour).toLocaleString()}đ
                    </span>
                </div>

                {/* Trẻ con */}
                <div className="flex items-center justify-between gap-4">
                    <span className="w-24">Trẻ con</span>
                    <div className="flex items-center rounded-xl border border-gray-200 dark:border-blue-600">
                        <button onClick={() => setChildrenTour(Math.max(childrenTour - 1, 0))} className="px-2">-</button>
                        <input
                            type="number"
                            value={childrenTour}
                            readOnly
                            className="h-9 w-16 text-center border-transparent sm:text-sm"
                        />
                        <button onClick={() => setChildrenTour(childrenTour + 1)} className="px-2">+</button>
                    </div>
                    <span className="text-sm text-gray-500 min-w-[80px] text-right">
                        {(price * childrenTour).toLocaleString()}đ
                    </span>
                </div>
            </div>

            {/* Thông tin phòng */}
            {selectedRoom && selectedRoom.length > 0 ? (
                selectedRoom?.map((room, index) => (
                    <div key={room._id || index} className="mb-4 border-b pb-4">
                        <div className="mb-1">
                            <strong>Tên phòng:</strong> {room.nameRoom}
                        </div>
                        <div className="text-gray-600 mb-1 italic">{room.typeRoom} - sức chứa tối đa {room.capacityRoom} người</div>
                        <div className="mb-1">
                            <strong>Giá / đêm:</strong>{' '}
                            {Number(room.priceRoom).toLocaleString('vi-VN')} ₫ x {nights} đêm
                        </div>
                        <div className="text-red-600 font-semibold">
                            <strong>Tổng tiền phòng:</strong>{' '}
                            {(Number(room.priceRoom) * nights).toLocaleString('vi-VN')} ₫
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-gray-500 italic">Chưa chọn phòng</div>
            )}
            {/* Tổng tiền */}
            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold text-blue-600">
                <span>Tổng tiền:</span>
                <span>
                    {(
                        price * adultsTour +
                        price * childrenTour +
                        selectedRoom.reduce(
                            (total, room) => total + Number(room.priceRoom) * nights,
                            0
                        )
                    ).toLocaleString('vi-VN')} đ
                </span>
            </div>


            {/* Nút đặt */}
            <div className="flex gap-2 my-6">
                <button
                    onClick={handleBooking}
                    disabled={isLoading}
                    className="flex-1 py-2 text-white bg-blue-400 rounded hover:bg-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Đang đặt...' : 'Đặt ngay'}
                </button>
                <button className="flex-1 py-2 border rounded hover:bg-gray-100">
                    Liên hệ tư vấn
                </button>
            </div>
        </div>
    );
};

export default RightTourDetail;
