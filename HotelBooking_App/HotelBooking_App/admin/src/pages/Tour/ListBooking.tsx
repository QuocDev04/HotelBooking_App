import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState<string>('');
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
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
                return 'Đã thanh toán';
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
                                <option value="completed">Đã thanh toán</option>
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
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        // Xem chi tiết booking
                                                        console.log('View booking details:', booking._id);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Chi tiết
                                                </button>
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