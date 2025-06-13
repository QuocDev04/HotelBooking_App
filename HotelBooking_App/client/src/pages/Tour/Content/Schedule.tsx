/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTour } from "../useTour/UseTour";
const Schedule = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const {tour,isLoading, error}  = useTour();
    const schedule = tour?.schedules
    if (isLoading) return <p>Đang tải lịch trình...</p>;
    if (error) return <p>Đã xảy ra lỗi khi tải lịch trình.</p>;
    return (
        <section>
            <h2 className="mb-4 text-2xl font-bold">🗓️ Lịch trình tour</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {schedule?.map((item:any, index:any) => (
                    <div
                        key={item._id}
                        className="px-4 py-3 border-b last:border-b-0 cursor-pointer transition-all"
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-600">
                                {item.dayNumber}: {item.location}
                            </span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </div>

                        {openIndex === index && (
                            <div className="mt-3 text-sm text-gray-700">
                                <div className="whitespace-pre-line mb-2">{item.activity}</div>

                                {item.imageTourSchedule && item.imageTourSchedule.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {item.imageTourSchedule.map((img: string, idx: number) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`schedule-img-${idx}`}
                                                className="rounded-lg w-full h-40 object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Schedule;
