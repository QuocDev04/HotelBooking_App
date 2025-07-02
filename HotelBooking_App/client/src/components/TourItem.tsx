/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import type { Tour } from "../type"
import { motion } from 'framer-motion';
import { CalendarIcon, TicketIcon } from "lucide-react";

type TourItemProps = {
    tour: Tour
}


const TourItem = ({ tour }: TourItemProps) => {
    return (
        <>
            <div className="">
                <motion.div
                    key={`${tour._id}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <div className="relative">
                        <Link to={`/detailtour/${tour._id}`}>
                            <img
                                src={tour?.imageTour[0]}
                                alt={tour?.nameTour}
                                className="w-full object-cover"
                            />
                        </Link>

                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                        {/* Tên tour */}
                        <Link to={`/detailtour/${tour._id}`}><h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug truncate">
                            {tour.nameTour}
                        </h3></Link>


                        {/* Ngày khởi hành, Địa điểm, Đánh giá */}
                        <div className="flex items-center text-sm justify-between mb-2 leading-snug truncate">
                            <div className="flex items-center gap-1 mr-4  text-gray-500">
                                <CalendarIcon className="w-4 h-4" />
                                <span> {tour.departure_location} - {tour.destination?.locationName} - {tour.destination?.country}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Thời gian: {tour.duration}</span>
                            </div>
                        </div>

                        {/* Giá cũ chỉ gạch khi có giá mới */}
                        {tour.price && tour.finalPrice && (
                            <div>
                                <span className="line-through text-gray-400 text-sm">
                                    {tour.price.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-blue-600">
                                <p>Giá: {(tour.finalPrice ?? tour.price)?.toLocaleString('vi-VN') || "N/A"}đ</p>
                            </span>
                            {tour.discountPercent && (
                                <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded border border-red-400">
                                    <TicketIcon className="w-4 h-4" />
                                    -{tour.discountPercent}%
                                </span>
                            )}
                        </div>


                        {/* Còn chỗ + chi tiết */}
                        <div className="flex justify-between text-sm mb-4 text-gray-600">
                            <span>
                                Còn lại: <strong>{tour.remainingSlots} chỗ</strong>
                            </span>
                            <Link to={`/detailtour/${tour._id}`}>
                                <span className="text-blue-600 hover:underline text-sm cursor-pointer">
                                    Chi tiết
                                </span>
                            </Link>

                        </div>

                        <button className="mt-auto w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
                            Đặt ngay
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default TourItem
