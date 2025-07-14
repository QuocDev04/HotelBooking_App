/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import instanceClient from "../../configs/instance"
import { useState } from "react"

// Define bill type interface for the new data structure
interface Bill {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    };
    slotId: {
        _id: string;
        tour: {
            _id: string;
            nameTour: string;
            destination: string;
            departure_location: string;
            duration: string;
            finalPrice: number;
            imageTour: string[];
            tourType: string;
        };
        dateTour: string;
        availableSeats: number;
    };
    fullNameUser: string;
    email: string;
    phone: string;
    totalPriceTour: number;
    adultsTour: number;
    childrenTour: number;
    toddlerTour: number;
    infantTour: number;
    adultPassengers: Array<{
        fullName: string;
        gender: string;
        birthDate: string;
        singleRoom: boolean;
    }>;
    childPassengers: any[];
    toddlerPassengers: any[];
    infantPassengers: any[];
    payment_method: string;
    payment_status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const InfoUser = () => {
    const userId = localStorage.getItem("userId");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<Bill | null>(null);
    const [cancelReason, setCancelReason] = useState<string>('');
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => instanceClient.get(`user/${userId}`)
    })
    const users = user?.data?.user
    const { data: bill } = useQuery({
        queryKey: ['/bookingTour/user', userId],
        queryFn: () => instanceClient.get(`/bookingTour/user/${userId}`)
    })
    const bookings = bill?.data?.bookings || []
    console.log(bookings);
    

    // Filter bookings based on status
    const filteredbookings = selectedStatus === "all"
        ? bookings
        : bookings.filter((bill: any) => bill.payment_status === selectedStatus);
    console.log("booo9ing",filteredbookings);
    
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
                return 'Chờ Xác Nhận';
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

    // Hàm kiểm tra có thể hủy
    const canCancelBooking = (bill: Bill) => {
        const tourDate = new Date(bill.slotId.dateTour);
        const now = new Date();
        return (
            bill.payment_status !== 'cancelled' &&
            bill.payment_status !== 'pending_cancel' &&
            tourDate > now
        );
    };

    const handleCancelBooking = (bill: Bill) => {
        setBookingToCancel(bill);
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setBookingToCancel(null);
        setCancelReason('');
    };

    const requestCancelMutation = useMutation({
        mutationFn: (bookingId: string) => 
            instanceClient.put(`/bookingTour/request-cancel/${bookingId}`, {
                userId: userId,
                reason: cancelReason
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/bookingTour/user', userId] });
            setShowCancelModal(false);
            setBookingToCancel(null);
            setCancelReason('');
        },
        onError: (error) => {
            console.error('Error requesting cancel:', error);
            alert('Có lỗi xảy ra khi yêu cầu hủy đặt chỗ. Vui lòng thử lại.');
        }
    });

    const confirmCancelBooking = () => {
        if (bookingToCancel) {
            requestCancelMutation.mutate(bookingToCancel._id);
        }
    };

    return (
        <div className="min-h-screen">
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
                                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
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
                                    {bookings.filter((bill:any) => bill.payment_status === 'completed').length}
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
                                    {bookings.filter((bill: any) => bill.payment_status === 'pending').length}
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
                                    {bookings.reduce((sum: any, bill: any) => sum + (bill.totalPriceTour || 0), 0).toLocaleString()}₫
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

                {/* bookings Grid */}
                {filteredbookings.length === 0 ? (
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
                        {filteredbookings.map((bill: Bill, index: number) => (
                            <div key={bill._id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1 mb-6 lg:mb-0">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                                                        {bill?.slotId?.tour?.imageTour && bill.slotId.tour.imageTour.length > 0 ? (
                                                            <img
                                                                src={bill.slotId.tour.imageTour[0]}
                                                                alt="Tour"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900 truncate">
                                                            {bill?.slotId?.tour?.nameTour || 'Không có tên'}
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
                                                            <span>{bill?.slotId?.tour?.departure_location || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{bill?.slotId?.tour?.duration || 'N/A'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            Tour
                                                        </span>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {bill?.slotId?.tour?.tourType === 'noidia' ? 'Nội địa' : 'Quốc tế'}
                                                        </span>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {bill.adultsTour + bill.childrenTour + bill.toddlerTour + bill.infantTour} hành khách
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end space-y-4">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {(bill?.totalPriceTour || 0).toLocaleString()}₫
                                                </div>
                                            </div>

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
                                                {canCancelBooking(bill) && (
                                                    <button 
                                                        onClick={() => handleCancelBooking(bill)}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Hủy
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                                <span>Mã: {bill._id?.slice(-8) || 'N/A'}</span>
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
                                Chi tiết Tour
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
                            <div className="space-y-6">
                                {/* Tour Header */}
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl overflow-hidden shadow-lg">
                                            {selectedBill?.slotId?.tour?.imageTour && selectedBill.slotId.tour.imageTour.length > 0 ? (
                                                <img
                                                    src={selectedBill.slotId.tour.imageTour[0]}
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
                                            {selectedBill.slotId.tour.nameTour}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{selectedBill.slotId.tour.departure_location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{selectedBill.slotId.tour.duration}</span>
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
                                                <span className="text-gray-600">Điểm khởi hành:</span>
                                                <span className="font-medium">{selectedBill.slotId.tour.departure_location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Thời gian:</span>
                                                <span className="font-medium">{selectedBill.slotId.tour.duration}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Loại tour:</span>
                                                <span className="font-medium">{selectedBill.slotId.tour.tourType === 'noidia' ? 'Nội địa' : 'Quốc tế'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ngày khởi hành:</span>
                                                <span className="font-medium">
                                                    {new Date(selectedBill.slotId.dateTour).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đặt chỗ</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Họ tên:</span>
                                                <span className="font-medium">{selectedBill.fullNameUser}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Số điện thoại:</span>
                                                <span className="font-medium">{selectedBill.phone}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Email:</span>
                                                <span className="font-medium">{selectedBill.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tổng tiền:</span>
                                                <span className="font-bold text-lg text-green-600">
                                                    {selectedBill.totalPriceTour.toLocaleString()}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Passenger Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hành khách</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Adults */}
                                        {selectedBill.adultPassengers.length > 0 && (
                                            <div>
                                                <h5 className="text-md font-medium text-gray-900 mb-3">Người lớn ({selectedBill.adultsTour})</h5>
                                                <div className="space-y-3">
                                                    {selectedBill.adultPassengers.map((passenger, idx) => (
                                                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-medium">{passenger.fullName}</span>
                                                                <span className="text-sm text-gray-500">{passenger.gender}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <div>Ngày sinh: {new Date(passenger.birthDate).toLocaleDateString('vi-VN')}</div>
                                                                <div>Phòng riêng: {passenger.singleRoom ? 'Có' : 'Không'}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Children */}
                                        {selectedBill.childrenTour > 0 && (
                                            <div>
                                                <h5 className="text-md font-medium text-gray-900 mb-3">Trẻ em ({selectedBill.childrenTour})</h5>
                                                <div className="space-y-3">
                                                    {selectedBill.childPassengers.map((passenger, idx) => (
                                                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-medium">{passenger.fullName}</span>
                                                                <span className="text-sm text-gray-500">{passenger.gender}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <div>Ngày sinh: {new Date(passenger.birthDate).toLocaleDateString('vi-VN')}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Toddlers */}
                                        {selectedBill.toddlerTour > 0 && (
                                            <div>
                                                <h5 className="text-md font-medium text-gray-900 mb-3">Trẻ nhỏ ({selectedBill.toddlerTour})</h5>
                                                <div className="space-y-3">
                                                    {selectedBill.toddlerPassengers.map((passenger, idx) => (
                                                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-medium">{passenger.fullName}</span>
                                                                <span className="text-sm text-gray-500">{passenger.gender}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <div>Ngày sinh: {new Date(passenger.birthDate).toLocaleDateString('vi-VN')}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Infants */}
                                        {selectedBill.infantTour > 0 && (
                                            <div>
                                                <h5 className="text-md font-medium text-gray-900 mb-3">Em bé ({selectedBill.infantTour})</h5>
                                                <div className="space-y-3">
                                                    {selectedBill.infantPassengers.map((passenger, idx) => (
                                                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="font-medium">{passenger.fullName}</span>
                                                                <span className="text-sm text-gray-500">{passenger.gender}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <div>Ngày sinh: {new Date(passenger.birthDate).toLocaleDateString('vi-VN')}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Phương thức thanh toán:</span>
                                                <span className="font-medium">
                                                    {selectedBill.payment_method === 'cash' ? 'Tiền mặt' : 
                                                     selectedBill.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 
                                                     selectedBill.payment_method}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Trạng thái:</span>
                                                <span className={`font-medium ${getStatusColor(selectedBill.payment_status)}`}>
                                                    {getStatusText(selectedBill.payment_status)}
                                                </span>
                                            </div>
                                        </div>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
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

            {/* Modal xác nhận hủy booking */}
            {showCancelModal && bookingToCancel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Xác nhận hủy đặt chỗ
                            </h2>
                            <button
                                onClick={closeCancelModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Xác nhận hủy đặt chỗ này?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tour: <span className="font-medium">{bookingToCancel.slotId.tour.nameTour}</span>
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Ngày khởi hành:</span>
                                            <span className="font-medium">
                                                {new Date(bookingToCancel.slotId.dateTour).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tổng tiền:</span>
                                            <span className="font-medium text-red-600">
                                                {bookingToCancel.totalPriceTour.toLocaleString()}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Trạng thái:</span>
                                            <span className={`font-medium ${getStatusColor(bookingToCancel.payment_status)}`}>
                                                {getStatusText(bookingToCancel.payment_status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lý do yêu cầu hủy
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Nhập lý do yêu cầu hủy..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    Lưu ý: Yêu cầu hủy sẽ được gửi đến admin để xác nhận. Bạn sẽ được thông báo khi có kết quả.
                                </p>
                            </div>
                        </div>
                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={closeCancelModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                disabled={requestCancelMutation.isPending}
                            >
                                Không, giữ lại
                            </button>
                            <button
                                onClick={confirmCancelBooking}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={requestCancelMutation.isPending}
                            >
                                {requestCancelMutation.isPending ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang gửi yêu cầu...
                                    </div>
                                ) : (
                                    'Gửi yêu cầu hủy'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InfoUser