/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useTour } from "../useTour/UseTour";

const Schedule = () => {
    const { tour, isLoading, error } = useTour();
    const schedule = tour?.schedules;
    const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // mặc định mở ngày đầu

    if (isLoading) return <p>Đang tải lịch trình...</p>;
    if (error) return <p>Đã xảy ra lỗi khi tải lịch trình.</p>;

    const handleToggle = (idx: number) => {
        setOpenIndexes(prev =>
            prev.includes(idx)
                ? prev.filter(i => i !== idx) // nếu đang mở thì đóng
                : [...prev, idx] // nếu đang đóng thì mở thêm
        );
    };

    return (
        <section>
            <h2 className="mb-4 text-2xl font-bold my-7">Lịch trình</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {schedule?.map((item: any, idx: number) => (
                    <div key={item._id} className="flex">
                        {/* Timeline */}
                        <div className="flex flex-col items-center pt-6 px-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow">
                                {openIndexes.includes(idx) ? "-" : "+"}
                            </span>
                            {idx < schedule.length - 1 && (
                                <span className="w-px flex-1 bg-blue-300"></span>
                            )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 border-b last:border-b-0">
                            <button
                                className="w-full text-left px-0 py-4 focus:outline-none"
                                onClick={() => handleToggle(idx)}
                            >
                                <span className="font-bold text-base text-black">
                                    {item.dayNumber}: {item.location}
                                </span>
                            </button>
                            {openIndexes.includes(idx) && (
                                <div className="pl-0 pb-6">
                                    <div className="text-sm text-gray-800 whitespace-pre-line mb-2">
                                        {item.activity}
                                    </div>
                                    {item.imageTourSchedule && item.imageTourSchedule.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            {item.imageTourSchedule.map((img: string, imgIdx: number) => (
                                                <img
                                                    key={imgIdx}
                                                    src={img}
                                                    alt={`schedule-img-${imgIdx}`}
                                                    className="rounded-lg w-full object-cover"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Schedule;
