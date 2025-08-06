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

        return {
            title: `Còn: ${slot.availableSeats} chỗ \nGiá: ${tours?.finalPrice?.toLocaleString('vi-VN')} đ`,
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
                
            </div>
        </>
    );
};

export default LeftTourDetail;
