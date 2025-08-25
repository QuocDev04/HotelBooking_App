/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import instanceClient from "../../../../configs/instance";
import { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from 'react-toastify';

dayjs.extend(utc);
interface TourData {
    dateTour: string;
}
interface LeftTourDetailProps {
    refDiv: React.RefObject<HTMLDivElement | null>;
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
}
function renderEventContent(eventInfo: any) {
    return (
        <div className="text-white font-bold text-xs whitespace-pre-line cursor-pointer">
            {eventInfo.event.title}
        </div>
    );
}
const LeftTourDetail = ({ refDiv, selectedDate, setSelectedDate }: LeftTourDetailProps) => {
    const { id: tourId } = useParams<{ id: string }>();
    const { id } = useParams<{ id: string }>();
    const handleThumbnailClick = (src: string) => {
        setMainImage(src);
    };

    const { data } = useQuery({
        queryKey: ['/date/tour/', tourId],
        queryFn: () => instanceClient.get(`/date/tour/${tourId}`)
    })
    const slots = data?.data?.data || [];

    const { data: tour } = useQuery({
        queryKey: ['tour', id],
        queryFn: () => instanceClient.get(`/tour/${id}`)
    })
    const tours = tour?.data?.tour

    const [mainImage, setMainImage] = useState(tours?.imageTour?.[0]);
    useEffect(() => {
        if (tours?.imageTour?.[0]?.length > 0) {
            setMainImage(tours?.imageTour?.[0]);
        }
    }, [tours]);

    const events = slots?.map((slot: any) => {
        const date = dayjs(slot.dateTour);

        // Nếu có finalPrice thì lấy finalPrice, không thì lấy price
        const priceToShow = tours?.finalPrice ?? tours?.price;

        return {
            title: `Còn: ${slot.availableSeats} chỗ \nGiá: ${priceToShow?.toLocaleString('vi-VN')} đ`,
            date: date.format("YYYY-MM-DD")
        };
    });

    
    function handleDateClick(info: any) {
        const clickedDate = dayjs(info.date).format("YYYY-MM-DD");
        const isDateAvailable = events.some((event: any) => event.date === clickedDate);

        if (isDateAvailable) {
            setSelectedDate(info.date);
            // Tìm slot tương ứng để hiển thị thông tin
            const slot = slots.find((s: any) => dayjs(s.dateTour).format("YYYY-MM-DD") === clickedDate);
            if (slot) {
                console.log("Selected slot:", slot);
                toast.success(`Đã chọn ngày ${dayjs(info.date).format("DD/MM/YYYY")} - Còn ${slot.availableSeats} chỗ`);
            }
        } else {
            // Hiển thị thông báo khi chọn ngày không có tour
            toast.warning("Ngày này không có tour, vui lòng chọn ngày khác");
            console.log("Ngày này không có tour");
        }
    }

    function handleEventClick(clickInfo: any) {
        const clickedDate = dayjs(clickInfo.event.start).format("YYYY-MM-DD");
        const isDateAvailable = events.some((event: any) => event.date === clickedDate);

        if (isDateAvailable) {
            setSelectedDate(clickInfo.event.start);
            // Tìm slot tương ứng để hiển thị thông tin
            const slot = slots.find((s: any) => dayjs(s.dateTour).format("YYYY-MM-DD") === clickedDate);
            if (slot) {
                console.log("Selected slot:", slot);
                toast.success(`Đã chọn ngày ${dayjs(clickInfo.event.start).format("DD/MM/YYYY")} - Còn ${slot.availableSeats} chỗ`);
            }
        } else {
            toast.warning("Ngày này không có tour, vui lòng chọn ngày khác");
            console.log("Ngày này không có tour");
        }
    }
    const selectedSlot = slots?.find((slot: TourData) =>
        dayjs(slot?.dateTour).isSame(selectedDate, 'day')
    );
    return (
        <>
            {/* Image Gallery Section */}
            <div className="p-6">
                <div className="space-y-6">
                    {/* Main Image */}
                    <div className="relative group">
                        <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src={mainImage || ""}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Main tour image"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Image counter */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                {tours?.imageTour?.length || 0} ảnh
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-5 gap-3">
                        {tours?.imageTour?.slice(0, 5).map((src: string, index: number) => (
                            <div 
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={() => handleThumbnailClick(src)}
                            >
                                <div className="aspect-video overflow-hidden rounded-xl shadow-md">
                                    <img
                                        src={src}
                                        className={`w-full h-full object-cover transition-all duration-300 ${
                                            mainImage === src 
                                                ? 'ring-3 ring-blue-500 ring-offset-2' 
                                                : 'group-hover:scale-110 group-hover:brightness-110'
                                        }`}
                                        alt={`Tour image ${index + 1}`}
                                    />
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                                
                                {/* Active indicator */}
                                {mainImage === src && (
                                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                        ✓
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar Section */}
            <div ref={refDiv} className="p-6 border-t border-gray-100">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            📅 Lịch Tour Du Lịch
                        </h2>
                        <p className="text-gray-600">Chọn ngày khởi hành phù hợp với lịch trình của bạn</p>
                    </div>

                    {selectedDate == null ? (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: ''
                                }}
                                height="auto"
                                dayMaxEventRows={2}
                                fixedWeekCount={false}
                                locale="vi"
                                buttonText={{
                                    today: 'Hôm nay'
                                }}
                                events={events}
                                eventContent={renderEventContent}
                                dateClick={handleDateClick}
                                eventClick={handleEventClick}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
                            {/* Header với ngày đã chọn */}
                            <div className="flex justify-between items-center mb-8">
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                    </svg>
                                    Quay lại lịch
                                </button>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Ngày đã chọn</div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                        {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">💰 Bảng giá chi tiết</h3>
                                    <p className="text-gray-600">Giá tour cho ngày đã chọn</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Người lớn */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-500 text-white rounded-full p-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">Người lớn</div>
                                                    <div className="text-sm text-gray-600">(Từ 12 tuổi trở lên)</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {(selectedSlot?.tour?.finalPrice ?? selectedSlot?.tour?.price)?.toLocaleString('vi-VN')}
                                                </div>
                                                <div className="text-sm text-gray-600">VNĐ</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trẻ em */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-500 text-white rounded-full p-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">Trẻ em</div>
                                                    <div className="text-sm text-gray-600">(Từ 5 đến 11 tuổi)</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {selectedSlot?.tour?.priceChildren?.toLocaleString('vi-VN')}
                                                </div>
                                                <div className="text-sm text-gray-600">VNĐ</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Em bé */}
                                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-yellow-500 text-white rounded-full p-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">Em bé</div>
                                                    <div className="text-sm text-gray-600">(Từ 2 đến 4 tuổi)</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {selectedSlot?.tour?.priceLittleBaby?.toLocaleString('vi-VN')}
                                                </div>
                                                <div className="text-sm text-gray-600">VNĐ</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phụ thu phòng đơn */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-500 text-white rounded-full p-2">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">Phụ thu phòng đơn</div>
                                                    <div className="text-sm text-gray-600">(Nếu ở một mình)</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {selectedSlot?.tour?.priceSingleRoom?.toLocaleString('vi-VN')}
                                                </div>
                                                <div className="text-sm text-gray-600">VNĐ</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Note */}
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="text-sm text-blue-800">
                                            <div className="font-semibold mb-1">Lưu ý về giá tour:</div>
                                            <ul className="space-y-1 text-blue-700">
                                                <li>• Giá đã bao gồm VAT và các phí dịch vụ</li>
                                                <li>• Trẻ em dưới 2 tuổi được miễn phí (không chiếm ghế, giường)</li>
                                                <li>• Giá có thể thay đổi tùy theo thời điểm cao điểm</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LeftTourDetail;
