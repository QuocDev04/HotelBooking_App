import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { instanceAdmin } from '../../configs/axios';
import Toast from '../../components/Toast';

interface Booking {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    };
    slotId: {
        _id: string;
        dateTour: string;
        availableSeats: number;
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
    };
    fullNameUser: string;
    email: string;
    phone: string;
    totalPriceTour: number;
    adultsTour: number;
    childrenTour: number;
    toddlerTour: number;
    infantTour: number;
    payment_method: string;
    payment_status: string;
    cancelReason?: string;
    cancelRequestedAt?: string;
    cancelledAt?: string;
    cancelledBy?: string;
    createdAt: string;
    updatedAt: string;
}

const ListBooking = () => {
    const { user } = useUser();
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState<string>('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentNote, setPaymentNote] = useState<string>('');
    const [showFullPaymentModal, setShowFullPaymentModal] = useState(false);
    const [fullPaymentNote, setFullPaymentNote] = useState<string>('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [paymentImage, setPaymentImage] = useState<File | null>(null);
    const [fullPaymentImage, setFullPaymentImage] = useState<File | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'info',
        isVisible: false
    });
    const queryClient = useQueryClient();

    // Fetch bookings
    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['admin-bookings', selectedStatus, searchTerm, currentPage],
        queryFn: () => instanceAdmin.get('/admin/bookings', {
            params: {
                status: selectedStatus,
                search: searchTerm,
                page: currentPage,
                limit: 10
            }
        })
    });

    const bookings = bookingsData?.data?.bookings || [];
    const pagination = bookingsData?.data?.pagination;

    // Cancel booking mutation
    const cancelBookingMutation = useMutation({
        mutationFn: (bookingId: string) =>
            instanceAdmin.put(`/admin/bookings/cancel/${bookingId}`, {
                adminId: localStorage.getItem('adminId'),
                reason: cancelReason
            }),
        onSuccess: () => {
            // Invalidate cả booking list và booking stats để cập nhật thông báo
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
            setShowCancelModal(false);
            setSelectedBooking(null);
            setCancelReason('');

            // Hiển thị thông báo thành công
            setToast({
                message: '✅ Xác nhận hủy đặt chỗ thành công! Thông báo đã được cập nhật.',
                type: 'success',
                isVisible: true
            });
        },
        onError: (error) => {
            console.error('Error canceling booking:', error);
            setToast({
                message: '❌ Có lỗi xảy ra khi xác nhận hủy đặt chỗ. Vui lòng thử lại.',
                type: 'error',
                isVisible: true
            });
        }
    });

    // Confirm cash payment mutation
    const confirmPaymentMutation = useMutation({
        mutationFn: ({ bookingId, note, image }: { bookingId: string; note?: string; image?: File }) => {
            const formData = new FormData();
            const adminId = user?.id || '';
            
            console.log('Creating FormData with:', { bookingId, note, image, adminId, user });
            
            formData.append('adminId', adminId);
            if (note) formData.append('note', note);
            if (image) formData.append('paymentImage', image);
            
            // Debug FormData contents
            for (let [key, value] of formData.entries()) {
                console.log('FormData entry:', key, value);
            }
            
            return instanceAdmin.put(`/admin/bookings/confirm-payment/${bookingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
            setShowPaymentModal(false);
            setSelectedBooking(null);
            setPaymentNote('');

            setToast({
                message: '✅ Xác nhận thanh toán cọc thành công!',
                type: 'success',
                isVisible: true
            });
        },
        onError: (error) => {
            console.error('Error confirming payment:', error);
            setToast({
                message: '❌ Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.',
                type: 'error',
                isVisible: true
            });
        }
    });

    // Confirm full payment mutation
    const confirmFullPaymentMutation = useMutation({
        mutationFn: ({ bookingId, note, image }: { bookingId: string; note?: string; image?: File }) => {
            const formData = new FormData();
            const adminId = user?.id || '';
            
            formData.append('adminId', adminId);
            if (note) formData.append('note', note);
            if (image) formData.append('paymentImage', image);
            
            return instanceAdmin.put(`/admin/bookings/confirm-full-payment/${bookingId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
            setShowFullPaymentModal(false);
            setSelectedBooking(null);
            setFullPaymentNote('');

            setToast({
                message: '✅ Xác nhận thanh toán toàn bộ thành công!',
                type: 'success',
                isVisible: true
            });
        },
        onError: (error) => {
            console.error('Error confirming full payment:', error);
            setToast({
                message: '❌ Có lỗi xảy ra khi xác nhận thanh toán toàn bộ. Vui lòng thử lại.',
                type: 'error',
                isVisible: true
            });
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'deposit_paid':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending_cancel':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Thanh toán toàn bộ';
            case 'deposit_paid':
                return 'Đã thanh toán cọc';
            case 'pending':
                return 'Chờ thanh toán';
            case 'pending_cancel':
                return 'Chờ xác nhận hủy';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const handleCancelBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const confirmCancelBooking = () => {
        if (selectedBooking) {
            cancelBookingMutation.mutate(selectedBooking._id);
        }
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setSelectedBooking(null);
        setCancelReason('');
    };

    const handleConfirmPayment = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };

    const confirmPayment = () => {
        if (!paymentImage) {
            setToast({
                message: '❌ Vui lòng chọn hình ảnh xác nhận thanh toán!',
                type: 'error',
                isVisible: true
            });
            return;
        }
        
        if (selectedBooking) {
            const adminId = user?.id || '';
            console.log('AdminId from Clerk user:', adminId);
            console.log('Selected booking:', selectedBooking);
            console.log('Payment note:', paymentNote);
            console.log('Payment image:', paymentImage);
            
            confirmPaymentMutation.mutate({
                bookingId: selectedBooking._id,
                note: paymentNote,
                paymentImage: paymentImage
            });
        } else {
            setToast({
                message: '❌ Vui lòng chọn booking để xác nhận thanh toán!',
                type: 'error',
                isVisible: true
            });
        }
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
        setPaymentNote('');
        setPaymentImage(null);
    };

    const handleConfirmFullPayment = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowFullPaymentModal(true);
    };

    const confirmFullPayment = () => {
        if (!fullPaymentImage) {
            setToast({
                message: '❌ Vui lòng chọn hình ảnh xác nhận thanh toán!',
                type: 'error',
                isVisible: true
            });
            return;
        }
        
        if (selectedBooking) {
            const adminId = user?.id || '';
            console.log('AdminId from Clerk user for full payment:', adminId);
            
            confirmFullPaymentMutation.mutate({
                bookingId: selectedBooking._id,
                note: fullPaymentNote,
                paymentImage: fullPaymentImage
            });
        } else {
            setToast({
                message: '❌ Vui lòng chọn booking để xác nhận thanh toán!',
                type: 'error',
                isVisible: true
            });
        }
    };

    const closeFullPaymentModal = () => {
        setShowFullPaymentModal(false);
        setSelectedBooking(null);
        setFullPaymentNote('');
        setFullPaymentImage(null);
    };

    const handleShowDetail = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedBooking(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý đặt chỗ Tour</h1>
                    <p className="text-gray-600 mt-2">Quản lý và xử lý các đặt chỗ tour du lịch</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Tìm theo tên khách hàng hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="pending">Chờ thanh toán</option>
                                <option value="deposit_paid">Đã thanh toán cọc</option>
                                <option value="completed">Thanh toán toàn bộ</option>
                                <option value="pending_cancel">Chờ xác nhận hủy</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Danh sách đặt chỗ ({bookings.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tour
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày khởi hành
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số hành khách
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking: Booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.fullNameUser}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.email}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking?.slotId?.tour?.nameTour}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {booking?.slotId?.tour?.departure_location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(booking?.slotId?.dateTour).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.adultsTour + booking.childrenTour + booking.toddlerTour + booking.infantTour} người
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {booking.totalPriceTour.toLocaleString()}₫
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                                                {getStatusText(booking.payment_status)}
                                            </span>
                                            {booking.payment_status === 'pending_cancel' && booking.cancelReason && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Lý do: {booking.cancelReason}
                                                </div>
                                            )}

            {/* Detail Modal */}
            {showDetailModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Chi tiết đặt chỗ #{selectedBooking._id.slice(-8)}
                                </h2>
                                <p className="text-blue-100 mt-1">
                                    {selectedBooking?.slotId?.tour?.nameTour}
                                </p>
                            </div>
                            <button
                                onClick={closeDetailModal}
                                className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Thông tin khách hàng */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Thông tin khách hàng</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                                            <p className="text-gray-900 font-semibold">{selectedBooking.fullNameUser}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email</label>
                                            <p className="text-gray-900">{selectedBooking.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                                            <p className="text-gray-900">{selectedBooking.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                                            <p className="text-gray-900">{selectedBooking.address || 'Chưa cung cấp'}</p>
                                        </div>
                                        {selectedBooking.note && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Ghi chú</label>
                                                <p className="text-gray-900 bg-white p-3 rounded-lg border">{selectedBooking.note}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thông tin tour */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Thông tin tour</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Tên tour</label>
                                            <p className="text-gray-900 font-semibold">{selectedBooking?.slotId?.tour?.nameTour}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Điểm khởi hành</label>
                                            <p className="text-gray-900">{selectedBooking?.slotId?.tour?.departure_location}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Ngày khởi hành</label>
                                            <p className="text-gray-900 font-semibold">
                                                {new Date(selectedBooking?.slotId?.dateTour).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Thời gian</label>
                                            <p className="text-gray-900">{selectedBooking?.slotId?.tour?.duration}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border">
                                            <label className="text-sm font-medium text-gray-600">Số lượng hành khách</label>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-blue-600">{selectedBooking.adultsTour}</p>
                                                    <p className="text-xs text-gray-500">Người lớn</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-green-600">{selectedBooking.childrenTour}</p>
                                                    <p className="text-xs text-gray-500">Trẻ em</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-orange-600">{selectedBooking.toddlerTour}</p>
                                                    <p className="text-xs text-gray-500">Trẻ nhỏ</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-purple-600">{selectedBooking.infantTour}</p>
                                                    <p className="text-xs text-gray-500">Em bé</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin thanh toán */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 ml-3">Thông tin thanh toán</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Tổng tiền tour:</span>
                                                <span className="text-2xl font-bold text-red-600">
                                                    {selectedBooking.totalPriceTour.toLocaleString()}₫
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Phương thức:</span>
                                                <span className="font-medium">
                                                    {selectedBooking.payment_method === 'cash' ? 'Tiền mặt' : 'VNPay'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Trạng thái thanh toán</label>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.payment_status)}`}>
                                                    {getStatusText(selectedBooking.payment_status)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Timeline thanh toán */}
                                        <div className="bg-white p-4 rounded-lg border">
                                            <h4 className="font-medium text-gray-900 mb-3">Lịch sử thanh toán</h4>
                                            <div className="space-y-3">
                                                {/* Đặt chỗ */}
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">Đặt chỗ</div>
                                                        <div className="text-sm text-gray-600">
                                                            {new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Thanh toán cọc */}
                                                {(selectedBooking.payment_status === 'deposit_paid' || selectedBooking.payment_status === 'completed') && selectedBooking.depositPaidAt && (
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">Thanh toán cọc</div>
                                                            <div className="text-sm text-gray-600">
                                                                {new Date(selectedBooking.depositPaidAt).toLocaleString('vi-VN')}
                                                            </div>
                                                            {selectedBooking.depositPaymentImage && (
                                                                <div className="mt-2">
                                                                    <img 
                                                                        src={selectedBooking.depositPaymentImage} 
                                                                        alt="Hình ảnh xác nhận thanh toán cọc" 
                                                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                                        onClick={() => window.open(selectedBooking.depositPaymentImage, '_blank')}
                                                                    />
                                                                    <p className="text-xs text-gray-500 mt-1">Hình ảnh xác nhận cọc</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Thanh toán toàn bộ */}
                                                {selectedBooking.payment_status === 'completed' && selectedBooking.fullPaidAt && (
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5"></div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900">Thanh toán toàn bộ</div>
                                                            <div className="text-sm text-gray-600">
                                                                {new Date(selectedBooking.fullPaidAt).toLocaleString('vi-VN')}
                                                            </div>
                                                            {selectedBooking.fullPaymentImage && (
                                                                <div className="mt-2">
                                                                    <img 
                                                                        src={selectedBooking.fullPaymentImage} 
                                                                        alt="Hình ảnh xác nhận thanh toán toàn bộ" 
                                                                        className="w-32 h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                                        onClick={() => window.open(selectedBooking.fullPaymentImage, '_blank')}
                                                                    />
                                                                    <p className="text-xs text-gray-500 mt-1">Hình ảnh xác nhận toàn bộ</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin hành khách chi tiết */}
                            {(selectedBooking.adultPassengers?.length > 0 || selectedBooking.childPassengers?.length > 0 || 
                              selectedBooking.toddlerPassengers?.length > 0 || selectedBooking.infantPassengers?.length > 0) && (
                                <div className="mt-6">
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Danh sách hành khách
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Người lớn */}
                                            {selectedBooking.adultPassengers?.map((passenger, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                                                    <div className="text-xs font-medium text-blue-600 mb-2">NGƯỜI LỚN #{index + 1}</div>
                                                    <div className="font-semibold text-gray-900">{passenger.fullName}</div>
                                                    <div className="text-sm text-gray-600">{passenger.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {passenger.birthDate ? new Date(passenger.birthDate).toLocaleDateString('vi-VN') : 'Chưa cung cấp'}
                                                    </div>
                                                    {passenger.singleRoom && (
                                                        <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mt-2">
                                                            Phòng đơn
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {/* Trẻ em */}
                                            {selectedBooking.childPassengers?.map((passenger, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                                                    <div className="text-xs font-medium text-green-600 mb-2">TRẺ EM #{index + 1}</div>
                                                    <div className="font-semibold text-gray-900">{passenger.fullName}</div>
                                                    <div className="text-sm text-gray-600">{passenger.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {passenger.birthDate ? new Date(passenger.birthDate).toLocaleDateString('vi-VN') : 'Chưa cung cấp'}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {/* Trẻ nhỏ */}
                                            {selectedBooking.toddlerPassengers?.map((passenger, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
                                                    <div className="text-xs font-medium text-orange-600 mb-2">TRẺ NHỎ #{index + 1}</div>
                                                    <div className="font-semibold text-gray-900">{passenger.fullName}</div>
                                                    <div className="text-sm text-gray-600">{passenger.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {passenger.birthDate ? new Date(passenger.birthDate).toLocaleDateString('vi-VN') : 'Chưa cung cấp'}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {/* Em bé */}
                                            {selectedBooking.infantPassengers?.map((passenger, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                                                    <div className="text-xs font-medium text-purple-600 mb-2">EM BÉ #{index + 1}</div>
                                                    <div className="font-semibold text-gray-900">{passenger.fullName}</div>
                                                    <div className="text-sm text-gray-600">{passenger.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {passenger.birthDate ? new Date(passenger.birthDate).toLocaleDateString('vi-VN') : 'Chưa cung cấp'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <div className="text-sm text-gray-500">
                                Mã đặt chỗ: <span className="font-mono font-medium">{selectedBooking._id}</span>
                            </div>
                            <div className="flex space-x-3">
                                {selectedBooking.payment_status === 'pending' && selectedBooking.payment_method === 'cash' && (
                                    <button
                                        onClick={() => {
                                            closeDetailModal();
                                            handleConfirmPayment(selectedBooking);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Xác nhận cọc</span>
                                    </button>
                                )}
                                {selectedBooking.payment_status === 'deposit_paid' && (
                                    <button
                                        onClick={() => {
                                            closeDetailModal();
                                            handleConfirmFullPayment(selectedBooking);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <span>Xác nhận toàn bộ</span>
                                    </button>
                                )}
                                <button
                                    onClick={closeDetailModal}
                                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleShowDetail(booking)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Chi tiết
                                                </button>
                                                {booking.payment_status === 'pending' && booking.payment_method === 'cash' && (
                                                    <button
                                                        onClick={() => handleConfirmPayment(booking)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Xác nhận cọc
                                                    </button>
                                                )}
                                                {booking.payment_status === 'deposit_paid' && (
                                                    <button
                                                        onClick={() => handleConfirmFullPayment(booking)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Xác nhận toàn bộ
                                                    </button>
                                                )}
                                                {booking.payment_status === 'pending_cancel' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Xác nhận hủy
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} đặt chỗ
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-3 py-2 text-sm font-medium text-gray-700">
                                        {currentPage} / {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === pagination.pages}
                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && selectedBooking && (
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
                                    Tour: <span className="font-medium">{selectedBooking.slotId.tour.nameTour}</span>
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Khách hàng:</span>
                                            <span className="font-medium">{selectedBooking.fullNameUser}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ngày khởi hành:</span>
                                            <span className="font-medium">
                                                {new Date(selectedBooking.slotId.dateTour).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tổng tiền:</span>
                                            <span className="font-medium text-red-600">
                                                {selectedBooking.totalPriceTour.toLocaleString()}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Lý do hủy:</span>
                                            <span className="font-medium">
                                                {selectedBooking.cancelReason || 'Không có'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lý do xác nhận hủy (tùy chọn)
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Nhập lý do xác nhận hủy..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    Lưu ý: Việc xác nhận hủy sẽ hoàn trả số ghế về slot và cập nhật trạng thái đặt chỗ.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={closeCancelModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                disabled={cancelBookingMutation.isPending}
                            >
                                Không, giữ lại
                            </button>
                            <button
                                onClick={confirmCancelBooking}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={cancelBookingMutation.isPending}
                            >
                                {cancelBookingMutation.isPending ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Xác nhận hủy'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal */}
            {showPaymentModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Xác nhận thanh toán cọc
                            </h2>
                            <button
                                onClick={closePaymentModal}
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
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Xác nhận đã nhận thanh toán cọc?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tour: <span className="font-medium">{selectedBooking.slotId.tour.nameTour}</span>
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Khách hàng:</span>
                                            <span className="font-medium">{selectedBooking.fullNameUser}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Email:</span>
                                            <span className="font-medium">{selectedBooking.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Số điện thoại:</span>
                                            <span className="font-medium">{selectedBooking.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ngày khởi hành:</span>
                                            <span className="font-medium">
                                                {new Date(selectedBooking.slotId.dateTour).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tổng tiền:</span>
                                            <span className="font-medium text-green-600">
                                                {selectedBooking.totalPriceTour.toLocaleString()}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phương thức:</span>
                                            <span className="font-medium">Tiền mặt</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình ảnh xác nhận thanh toán <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPaymentImage(e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                    {paymentImage && (
                                        <div className="mt-2 text-sm text-green-600">
                                            Đã chọn: {paymentImage.name}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú xác nhận (tùy chọn)
                                    </label>
                                    <textarea
                                        value={paymentNote}
                                        onChange={(e) => setPaymentNote(e.target.value)}
                                        placeholder="Nhập ghi chú về việc xác nhận thanh toán..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={3}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    Lưu ý: Việc xác nhận sẽ chuyển trạng thái đặt chỗ thành "Đã thanh toán".
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={closePaymentModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                disabled={confirmPaymentMutation.isPending}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmPayment}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={confirmPaymentMutation.isPending || !paymentImage}
                            >
                                {confirmPaymentMutation.isPending ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Xác nhận thanh toán'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Payment Confirmation Modal */}
            {showFullPaymentModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                Xác nhận thanh toán toàn bộ
                            </h2>
                            <button
                                onClick={closeFullPaymentModal}
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
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Xác nhận đã nhận thanh toán toàn bộ?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tour: <span className="font-medium">{selectedBooking.slotId.tour.nameTour}</span>
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Khách hàng:</span>
                                            <span className="font-medium">{selectedBooking.fullNameUser}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Email:</span>
                                            <span className="font-medium">{selectedBooking.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Số điện thoại:</span>
                                            <span className="font-medium">{selectedBooking.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ngày khởi hành:</span>
                                            <span className="font-medium">
                                                {new Date(selectedBooking.slotId.dateTour).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tổng tiền:</span>
                                            <span className="font-medium text-blue-600">
                                                {selectedBooking.totalPriceTour.toLocaleString()}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Trạng thái hiện tại:</span>
                                            <span className="font-medium text-blue-600">Đã thanh toán cọc</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình ảnh xác nhận thanh toán <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFullPaymentImage(e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    {fullPaymentImage && (
                                        <div className="mt-2 text-sm text-blue-600">
                                            Đã chọn: {fullPaymentImage.name}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú xác nhận (tùy chọn)
                                    </label>
                                    <textarea
                                        value={fullPaymentNote}
                                        onChange={(e) => setFullPaymentNote(e.target.value)}
                                        placeholder="Nhập ghi chú về việc xác nhận thanh toán toàn bộ..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mb-6">
                                    Lưu ý: Việc xác nhận sẽ chuyển trạng thái đặt chỗ thành "Thanh toán toàn bộ".
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                            <button
                                onClick={closeFullPaymentModal}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                disabled={confirmFullPaymentMutation.isPending}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmFullPayment}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={confirmFullPaymentMutation.isPending || !fullPaymentImage}
                            >
                                {confirmFullPaymentMutation.isPending ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    'Xác nhận thanh toán toàn bộ'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default ListBooking;