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
<<<<<<< HEAD
        <>
            <div className="">
                <motion.div
                    key={`${tour._id}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
=======
        <motion.div
            key={`${tour._id}`}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
        >
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                    <div className="relative">
                        <Link to={`/detailtour/${tour._id}`}>
                            <img
                                src={tour?.imageTour[0]}
                                alt={tour?.nameTour}
<<<<<<< HEAD
                                className="w-full object-cover"
=======
                                className="w-full h-48 object-cover"
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                            />
                        </Link>

                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                        {/* Tên tour */}
                        <Link to={`/detailtour/${tour._id}`}>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug truncate">
                            {tour.nameTour}
                        </h3>
                        </Link>


                        {/* Ngày khởi hành, Địa điểm, Đánh giá */}
<<<<<<< HEAD
                        <div className="flex items-center text-sm justify-between mb-2 leading-snug truncate">
                            <div className="flex items-center gap-1 mr-4  text-gray-500">
                                <CalendarIcon className="w-4 h-4" />
                                <span>  {tour.destination.locationName} - {tour.destination.country}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                                <CalendarIcon className="w-4 h-4" />
=======
                        <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{tour.destination?.locationName || 'Chưa có thông tin'} - {tour.destination?.country || 'Chưa có thông tin'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                                <span>Thời gian: {tour.duration}</span>
                            </div>
                        </div>

<<<<<<< HEAD
                        <div className="flex justify-between items-end min-h-[56px]">
=======
                        <div className="flex justify-between items-center mb-3">
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                            <div className="flex flex-col">
                                <span className={`text-sm text-gray-400 line-through ${tour.price > tour.finalPrice ? '' : 'invisible'}`}>
                                    {tour.price.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                    Giá: {(tour.finalPrice ?? tour.price)?.toLocaleString('vi-VN') || "N/A"}đ
                                </span>
                            </div>

                            {tour.discountPercent && (
<<<<<<< HEAD
                                <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded border border-red-400">
=======
                                <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-400">
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                                    <TicketIcon className="w-4 h-4" />
                                    -{tour.discountPercent}%
                                </span>
                            )}
                        </div>


                        {/* Còn chỗ + chi tiết */}
<<<<<<< HEAD
                        <div className="flex justify-between text-sm mb-4 text-gray-600">
=======
                        <div className="flex justify-between items-center text-sm mb-4 text-gray-600">
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                            <span>
                                Còn lại: <strong>{tour.remainingSlots} chỗ</strong>
                            </span>
                            <Link to={`/detailtour/${tour._id}`}>
                                <span className="text-blue-600 hover:underline text-sm cursor-pointer">
                                    Chi tiết
                                </span>
                            </Link>
<<<<<<< HEAD

=======
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
                        </div>
                        <Link to={`/detailtour/${tour._id}`}>
                            <button className="mt-auto w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
                                Đặt ngay
                            </button>
                        </Link>
                    </div>
                </motion.div>
<<<<<<< HEAD
            </div>
        </>
=======
>>>>>>> 8fe707d982c4fac94612094f9351851cfda17024
    )
}

export default TourItem
