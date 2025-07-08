import { useQuery } from "@tanstack/react-query"
import instanceClient from "../../configs/instance"
import { useState } from "react"

// Define bill type interface
interface Bill {
    _id: string;
    roomId: string;
    nameRoom: string;
    locationId: string;
    amenitiesRoom: string[];
    capacityRoom: number;
    priceRoom: number;
    statusRoom: string;
    typeRoom: string;
    imageRoom: string[];
    createdAt: string;
    updatedAt: string;
    waitingSince?: string;
    // Additional properties that might exist
    id?: string;
    BookingTourId?: {
        tourId?: {
            nameTour?: string;
            imageTour?: string;
            destination?: string;
            departure_location?: string;
            duration?: number;
            description?: string;
            tourType?: string;
        };
    };
    phoneUser?: string;
    emailUser?: string;
    amount?: number;
    payment_status?: string;
    hotel?: string;
    room?: string;
    date?: string;
    nights?: number;
    total?: number;
    status?: string;
    itemRoom?: Bill[];
}

const InfoUser = () => {
    const userId = localStorage.getItem("userId");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { data: user } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => instanceClient.get(`user/${userId}`)
    })
    console.log('user', user?.data?.user);
    const users = user?.data?.user || [];

    const { data: bill } = useQuery({
        queryKey: ['checkOutBookingTour', userId],
        queryFn: () => instanceClient.get(`checkOutBookingTour/${userId}`)
    })

    const bills: Bill[] = bill?.data?.data || [];
    console.log(bills);

    // Filter bills based on status
    const filteredBills = selectedStatus === "all"
        ? bills
        : bills.filter(bill => bill.payment_status === selectedStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Đã thanh toán';
            case 'pending':
                return 'Chờ thanh toán';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const handleViewDetail = (bill: Bill) => {
        setSelectedBill(bill);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedBill(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12 ">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 my-20">
                        Thông tin người dùng
                    </h1>
                    <p className="text-lg text-gray-600">
                        Quản lý và theo dõi các đặt phòng và tour du lịch của bạn
                    </p>
                </div>

                {/* User Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                        <div className="relative">
                            <img
                                src={users?.avatar || "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"}
                                alt="avatar"
                                className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
                            />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{users?.username}</h2>
                            <div className="space-y-1 text-gray-600">
                                <div className="flex items-center justify-center md:justify-start space-x-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span>{users?.email}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start space-x-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <span>{users?.phone_number}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng đặt chỗ</p>
                                <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã thanh toán</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bills.filter(bill => bill.payment_status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chờ thanh toán</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bills.filter(bill => bill.payment_status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bills.reduce((sum, bill) => sum + (bill.amount || bill.total || 0), 0).toLocaleString()}₫
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <h3 className="text-2xl font-bold text-gray-900">Danh sách đặt chỗ</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setSelectedStatus("all")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "all"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setSelectedStatus("completed")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "completed"
                                    ? "bg-green-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Đã thanh toán
                            </button>
                            <button
                                onClick={() => setSelectedStatus("pending")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "pending"
                                    ? "bg-yellow-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Chờ thanh toán
                            </button>
                            <button
                                onClick={() => setSelectedStatus("cancelled")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "cancelled"
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Đã hủy
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bills Grid */}
                {filteredBills.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đặt chỗ nào</h3>
                        <p className="text-gray-600">Bạn chưa có lịch sử đặt phòng hoặc tour du lịch nào.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBills.map((bill: Bill, index: number) => (
                            <div key={bill._id || bill.id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                {/* Main Content */}
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        {/* Left Side - Room Info */}
                                        <div className="flex-1 mb-6 lg:mb-0">
                                            <div className="flex items-start space-x-4">
                                                {/* Room Image */}
                                                <div className="flex-shrink-0">
                                                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-lg overflow-hidden ${bill?.BookingTourId?.tourId?.nameTour
                                                        ? 'bg-gradient-to-br from-purple-400 to-pink-500'
                                                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
                                                        }`}>
                                                        {bill?.BookingTourId?.tourId?.nameTour ? (
                                                            // Tour image
                                                            bill?.BookingTourId?.tourId?.imageTour ? (
                                                                <img
                                                                    src={bill.BookingTourId.tourId.imageTour}
                                                                    alt="Tour"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            )
                                                        ) : (
                                                            // Hotel room image
                                                            bill?.imageRoom && bill.imageRoom.length > 0 ? (
                                                                <img
                                                                    src={bill.imageRoom[0]}
                                                                    alt="Room"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Room Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900 truncate">
                                                            {bill?.BookingTourId?.tourId?.nameTour || bill?.nameRoom || 'Không có tên'}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.payment_status || '')}`}>
                                                            {getStatusText(bill.payment_status || '')}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center space-x-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>
                                                                {bill?.BookingTourId?.tourId?.nameTour
                                                                    ? 'Tour du lịch'
                                                                    : bill?.locationId || 'N/A'
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>
                                                                {bill?.BookingTourId?.tourId?.nameTour
                                                                    ? 'Du lịch'
                                                                    : `${bill?.capacityRoom || 1} người`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Room Features */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {bill?.BookingTourId?.tourId?.nameTour ? (
                                                            // Tour features
                                                            <>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                    Tour
                                                                </span>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Du lịch
                                                                </span>
                                                            </>
                                                        ) : (
                                                            // Hotel room features
                                                            <>
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {bill?.typeRoom || 'Standard'}
                                                                </span>
                                                                {bill?.amenitiesRoom && bill.amenitiesRoom.slice(0, 2).map((amenity, idx) => (
                                                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        {amenity}
                                                                    </span>
                                                                ))}
                                                                {bill?.amenitiesRoom && bill.amenitiesRoom.length > 2 && (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                        +{bill.amenitiesRoom.length - 2} khác
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side - Price and Actions */}
                                        <div className="flex flex-col items-end space-y-4">
                                            {/* Price */}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {(bill?.priceRoom || bill.amount || bill.total || 0).toLocaleString()}₫
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleViewDetail(bill)}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Chi tiết
                                                </button>
                                                {bill.payment_status === 'pending' && (
                                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        Thanh toán
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section - Additional Info */}
                                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Đặt: {new Date(bill?.createdAt || '').toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Mã: {bill._id?.slice(-8) || bill.id || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <div className={`w-2 h-2 rounded-full ${bill.payment_status === 'completed' ? 'bg-green-500' :
                                                    bill.payment_status === 'pending' ? 'bg-yellow-500' :
                                                        'bg-gray-400'
                                                    }`}></div>
                                                <span className="text-gray-600">
                                                    {getStatusText(bill.payment_status || '')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedBill && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Chi tiết {selectedBill?.BookingTourId?.tourId?.nameTour ? 'Tour' : 'Đặt phòng'}
                            </h2>
                            <button
                                onClick={closeDetailModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {selectedBill?.BookingTourId?.tourId?.nameTour ? (
                                // Tour Detail
                                <div className="space-y-6">
                                    {/* Tour Header */}
                                    <div className="flex items-start space-x-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl overflow-hidden shadow-lg">
                                                {selectedBill?.BookingTourId?.tourId?.imageTour ? (
                                                    <img
                                                        src={selectedBill.BookingTourId.tourId.imageTour}
                                                        alt="Tour"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                                {selectedBill.BookingTourId.tourId.nameTour}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{selectedBill.BookingTourId.tourId.destination || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{selectedBill.BookingTourId.tourId.duration || 0} ngày</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBill.payment_status || '')}`}>
                                                    {getStatusText(selectedBill.payment_status || '')}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Mã: {selectedBill._id?.slice(-8)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tour Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tour</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Điểm đến:</span>
                                                    <span className="font-medium">{selectedBill.BookingTourId.tourId.destination || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Điểm khởi hành:</span>
                                                    <span className="font-medium">{selectedBill.BookingTourId.tourId.departure_location || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Thời gian:</span>
                                                    <span className="font-medium">{selectedBill.BookingTourId.tourId.duration || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Loại tour:</span>
                                                    <span className="font-medium">{selectedBill.BookingTourId.tourId?.tourType || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đặt chỗ</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ngày xuẩt phát:</span>
                                                    <span className="font-medium">
                                                        {new Date(selectedBill.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Số điện thoại:</span>
                                                    <span className="font-medium">{selectedBill.phoneUser || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Email:</span>
                                                    <span className="font-medium">{selectedBill.emailUser || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tổng tiền:</span>
                                                    <span className="font-bold text-lg text-green-600">
                                                        {(selectedBill.amount || 0).toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tour Description */}
                                    {selectedBill.BookingTourId.tourId.description && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Mô tả tour</h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedBill.BookingTourId.tourId.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Booked Rooms for this Tour */}
                                    {Array.isArray(selectedBill.itemRoom) && selectedBill.itemRoom.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Phòng đã đặt kèm tour</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {selectedBill.itemRoom.map((room, idx) => (
                                                    <div key={room._id || idx} className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 shadow-sm">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                {room.imageRoom && room.imageRoom.length > 0 ? (
                                                                    <img src={room.imageRoom[0]} alt={room.nameRoom} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-bold text-lg text-gray-900 truncate">{room.nameRoom}</span>
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">{room.typeRoom}</span>
                                                                </div>
                                                                <div className="text-gray-600 text-sm truncate">{room.locationId}</div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                                    <span>Sức chứa: {room.capacityRoom}</span>
                                                                    <span>•</span>
                                                                    <span>Giá: {room.priceRoom.toLocaleString()}₫</span>
                                                                    <span>•</span>
                                                                    <span>Trạng thái: {room.statusRoom}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {room.amenitiesRoom && room.amenitiesRoom.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {room.amenitiesRoom.map((amenity, i) => (
                                                                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{amenity}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Hotel Room Detail
                                <div className="space-y-6">
                                    {/* Room Header */}
                                    <div className="flex items-start space-x-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden shadow-lg">
                                                {selectedBill?.imageRoom && selectedBill.imageRoom.length > 0 ? (
                                                    <img
                                                        src={selectedBill.imageRoom[0]}
                                                        alt="Room"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                                {selectedBill.nameRoom}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{selectedBill.locationId}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{selectedBill.capacityRoom} người</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBill.payment_status || '')}`}>
                                                    {getStatusText(selectedBill.payment_status || '')}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Mã: {selectedBill._id?.slice(-8)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin phòng</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Loại phòng:</span>
                                                    <span className="font-medium">{selectedBill.typeRoom}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Sức chứa:</span>
                                                    <span className="font-medium">{selectedBill.capacityRoom} người</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Trạng thái:</span>
                                                    <span className="font-medium">{selectedBill.statusRoom}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Giá phòng:</span>
                                                    <span className="font-bold text-lg text-green-600">
                                                        {selectedBill.priceRoom.toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đặt phòng</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ngày đặt:</span>
                                                    <span className="font-medium">
                                                        {new Date(selectedBill.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Cập nhật:</span>
                                                    <span className="font-medium">
                                                        {new Date(selectedBill.updatedAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Mã phòng:</span>
                                                    <span className="font-medium">{selectedBill.roomId}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tổng tiền:</span>
                                                    <span className="font-bold text-lg text-green-600">
                                                        {(selectedBill.priceRoom || 0).toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Amenities */}
                                    {selectedBill.amenitiesRoom && selectedBill.amenitiesRoom.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tiện ích phòng</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedBill.amenitiesRoom.map((amenity, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Room Images Gallery */}
                                    {selectedBill.imageRoom && selectedBill.imageRoom.length > 1 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh phòng</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {selectedBill.imageRoom.map((image, idx) => (
                                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                                                        <img
                                                            src={image}
                                                            alt={`Room ${idx + 1}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={closeDetailModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Đóng
                            </button>
                            {selectedBill?.payment_status === 'pending' && (
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                    Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InfoUser