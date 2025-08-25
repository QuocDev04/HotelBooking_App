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

            <div className="rounded lg:col-span-2">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-4xl">
                        <img
                            src={mainImage || ""}
                            className="w-full rounded-lg"
                            alt="Main"
                        />
                    </div>

                    <div className="grid grid-cols-5 max-w-4xl gap-4">
                        {tours?.imageTour?.map((src: string, index: number) => (
                            <img
                                key={index}
                                src={src}
                                className="thumb rounded-lg md:h-24 h-14 object-cover cursor-pointer hover:opacity-80"
                                alt={`Thumb ${index + 1}`}
                                onClick={() => handleThumbnailClick(src)}

                            />
                        ))}
                    </div>
                </div>
            </div>

            <div ref={refDiv}>
                <div className="max-w-6xl mx-auto mt-15 bg-white p-6 rounded-2xl shadow-xl border">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">📅 Lịch Tour Du Lịch</h2>

                    {selectedDate == null ? (
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
                    ) : (
                        <div className="bg-white rounded-2xl  p-6 max-w-3xl mx-auto animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    className="flex items-center gap-1 text-gray-700 font-semibold hover:text-blue-600 transition"
                                >

                                    <span className="text-lg">&larr;</span> Quay lại
                                </button>
                                <span className="text-3xl text-red-600 font-bold tracking-wide">
                                    {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                                </span>
                            </div>


                            {/* <div className="mb-4">
                                <div className="text-center text-blue-700 text-2xl font-bold flex items-center justify-center gap-2 mb-6">
                                    Phương tiện di chuyển {selectedSlot?.tour?.itemTransport?.[0]?.TransportId?.transportType}
                                </div>


                                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                                    
                                    <div className="flex-1 text-center">
                                        <div className="font-semibold text-gray-700">
                                            Ngày đi -{" "}
                                            <span className="text-blue-600">
                                                {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                                            </span>
                                        </div>

                                        <div className="text-xs text-gray-500 mt-1">
                                            <span className="text-red-500 font-bold">
                                                {selectedSlot?.tour?.itemTransport?.[0]?.TransportId?.transportName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden md:block w-px h-16 bg-gray-200 mx-4"></div>


                                   
                                    <div className="flex-1 text-center">
                                        <div className="font-semibold text-gray-700">
                                            Ngày về - <span className="text-blue-600">13/07/2025</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <span className="text-blue-600 font-bold">
                                                {selectedSlot?.tour?.itemTransport?.[0]?.TransportId?.transportNumber}
                                            </span>
                                            <span className="text-gray-600">11:55 <span className="text-xl">→</span> 13:50</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span className="text-red-500 font-bold">
                                                {selectedSlot?.tour?.itemTransport?.[0]?.TransportId?.transportName}
                                            </span>
                                        </div>
                                    </div>
                                </div>


                            </div> */}
                            <div className="hidden md:block w-full h-px bg-gray-200 mx-4 my-6"></div>
                            {/* Giá */}
                            <div className="mb-4">
                                <div className="text-center text-blue-700 text-2xl font-bold mb-6">
                                    Giá Combo
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                                    <div>
                                        <div className="border mb-6 rounded-xl p-4">
                                            <div className="flex justify-between ">
                                                <span>Người lớn</span>

                                                    <span className="text-red-600 font-bold">
                                                        {(selectedSlot?.tour?.finalPrice ?? selectedSlot?.tour?.price)?.toLocaleString('vi-VN')} đ
                                                    </span>

                                            </div>
                                            <div className="text-xs text-gray-500 ">(Từ 12 tuổi trở lên)</div>
                                        </div>

                                        <div className="border mb-6 rounded-xl p-4">
                                            <div className="flex justify-between">
                                                <span>Trẻ em</span>
                                                <span className="text-red-600 font-bold">
                                                    {selectedSlot?.tour?.priceChildren?.toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">(Từ 5 đến 11 tuổi)</div>
                                        </div>

                                    </div>
                                    <div>
                                        <div className="border mb-6 rounded-xl p-4">
                                            <div className="flex justify-between ">
                                                <span>Em bé</span>
                                                <span className="text-red-600 font-bold">
                                                    {selectedSlot?.tour?.priceLittleBaby?.toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 ">(Từ 2 đến 4 tuổi)</div>
                                        </div>

                                        <div className="border mb-6 rounded-xl p-6">
                                            <div className="flex justify-between">
                                                <span>Phụ thu phòng đơn</span>
                                                <span className="text-red-600 font-bold">
                                                    {selectedSlot?.tour?.priceSingleRoom?.toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>
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
