import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import instanceClient from "../../configs/instance"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "antd";

// Define bill type interface
interface Bill {
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
            description?: string;
        };
    };
    fullNameUser: string;
    email: string;
    phone: string;
    address?: string;
    totalPriceTour: number;
    
    // Thông tin đặt cọc
    depositAmount?: number;
    isDeposit?: boolean;
    isFullyPaid?: boolean;
    
    // Số lượng khách
    adultsTour: number;
    childrenTour: number;
    toddlerTour: number;
    infantTour: number;
    
    // Danh sách hành khách
    adultPassengers: Array<{
        fullName: string;
        gender: string;
        birthDate: string;
        singleRoom: boolean;
    }>;
    childPassengers: any[];
    toddlerPassengers: any[];
    infantPassengers: any[];
    
    // Thông tin thanh toán
    payment_method: string;
    payment_status: string;
    
    // Thông tin thời gian
    createdAt: string;
    updatedAt: string;
    
    // Thông tin hủy
    cancelledAt?: string;
    cancelReason?: string;
    cancelRequestedAt?: string;
    
    // Các trường bổ sung
    note?: string;
    itemRoom?: any[];
    BookingTourId?: any;
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
    const navigate = useNavigate();
    
    // Add pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;

    const { data: user } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => instanceClient.get(`user/${userId}`)
    })
    console.log('user', user?.data?.user);
    const users = user?.data?.user || [];

    // Thay đổi API endpoint để lấy danh sách booking trực tiếp
    const { data: bill } = useQuery({
        queryKey: ['bookingTour', userId],
        queryFn: () => instanceClient.get(`bookingTour/user/${userId}`)
    })

    // Điều chỉnh cách lấy dữ liệu từ response
    const bills: Bill[] = bill?.data?.bookings || [];
    console.log('Danh sách đặt tour:', bills);

    // Filter bills based on status
    const filteredBills = selectedStatus === "all"
        ? bills
        : bills.filter(bill => bill.payment_status === selectedStatus);

    // Filter bookings based on status
    const filteredbookings = selectedStatus === "all"
        ? bills
        : selectedStatus === "deposit_paid"
            ? bills.filter((bill: any) => bill.payment_status === 'deposit_paid' || (bill.isDeposit && !bill.isFullyPaid))
            : bills.filter((bill: any) => bill.payment_status === selectedStatus);
    console.log("booo9ing",filteredbookings);
    
    // Sort bills to show newest first based on creation date
    const sortedBills = [...filteredBills].sort((a, b) => {
        // First sort by creation date (newest first)
        const dateComparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return dateComparison;
    });
    
    // Paginate bills
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBills = sortedBills.slice(indexOfFirstItem, indexOfLastItem);
    
    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'deposit_paid':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Đã thanh toán đầy đủ';
            case 'pending':
                return 'Chờ thanh toán';
            case 'cancelled':
                return 'Đã hủy';
            case 'deposit_paid':
                return 'Chờ hoàn tất thanh toán';
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

    // Hàm kiểm tra có thể hủy
    const canCancelBooking = (bill: Bill) => {
        // Kiểm tra an toàn cấu trúc dữ liệu
        if (!bill || !bill.slotId || !bill.slotId.dateTour) {
            console.warn('Dữ liệu booking không hợp lệ:', bill);
            return false;
        }
        
        try {
            const tourDate = new Date(bill.slotId.dateTour);
            const now = new Date();
            
            // Kiểm tra ngày hợp lệ
            if (isNaN(tourDate.getTime())) {
                console.warn('Ngày tour không hợp lệ:', bill.slotId.dateTour);
                return false;
            }
            
            return (
                bill.payment_status !== 'cancelled' &&
                bill.payment_status !== 'pending_cancel' &&
                tourDate > now
            );
        } catch (error) {
            console.error('Lỗi khi kiểm tra canCancelBooking:', error);
            return false;
        }
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
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['bookingTour', userId] });
            setShowCancelModal(false);
            setBookingToCancel(null);
            setCancelReason('');
            
            // Kiểm tra nếu đơn đã đặt cọc và cần hoàn tiền
            if (bookingToCancel && bookingToCancel.isDeposit) {
                // Chuyển hướng đến trang hoàn tiền với thông tin booking
                navigate(`/refund/${bookingToCancel._id}`, {
                    state: { bookingData: bookingToCancel }
                });
            } else {
                // Hiển thị thông báo thành công
                alert('Yêu cầu hủy đặt chỗ đã được gửi thành công.');
            }
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
                {/* Header Section */}
                <div className="text-center mb-16 pt-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Thông tin người dùng
                    </h1>
                    <p className="text-lg text-gray-600">
                        Quản lý và theo dõi các đặt phòng và tour du lịch của bạn
                    </p>
                </div>

                {/* User Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl p-10 mb-16 border border-gray-100 mx-2">
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 mx-2">
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
                                <p className="text-sm font-medium text-gray-600">Đã thanh toán đủ</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bills.filter(bill => bill.payment_status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chờ hoàn tất thanh toán</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bills.filter((bill: any) => bill.payment_status === 'deposit_paid' || (bill.isDeposit && !bill.isFullyPaid)).length}
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
                                    {bills.reduce((sum, bill) => sum + (bill.totalPriceTour || 0), 0).toLocaleString()}₫
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-100 mx-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <h3 className="text-2xl font-bold text-gray-900">Danh sách đặt chỗ</h3>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => {
                                    setSelectedStatus("all");
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "all"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedStatus("completed");
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "completed"
                                    ? "bg-green-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Đã thanh toán đủ
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedStatus("deposit_paid");
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "deposit_paid"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Chờ hoàn tất thanh toán
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedStatus("pending");
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedStatus === "pending"
                                    ? "bg-yellow-600 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Chờ thanh toán
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bills Grid */}
                <div className="mx-2">
                    {filteredBills.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chưa có đặt chỗ nào</h3>
                            <p className="text-gray-600">Bạn chưa có lịch sử đặt phòng hoặc tour du lịch nào.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {currentBills.map((bill: Bill, index: number) => (
                                <div key={bill._id || bill.id || index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative">
                                {/* Thông tin đặt cọc ở góc phải trên cùng */}
                                {bill.isDeposit && !bill.isFullyPaid && (
                                    <div className="absolute top-0 right-0 bg-white py-1 px-3 rounded-bl-lg shadow-sm border-l border-b border-gray-100">
                                        <div className="text-xs text-right">
                                            <div className="text-blue-600">Đã đặt cọc: {(bill.depositAmount || 0).toLocaleString()}đ</div>
                                            <div className="text-red-600">Còn lại: {((bill.totalPriceTour || 0) - (bill.depositAmount || 0)).toLocaleString()}đ</div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Payment Status Indicator - Only show for certain statuses */}
                                {bill.payment_status === 'pending' && !bill.isDeposit && (
                                    <div className="bg-yellow-50 px-8 py-3 border-b border-yellow-100">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="font-medium text-yellow-800">Chờ thanh toán</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-medium text-yellow-700">Vui lòng thanh toán trước: {bill?.slotId?.dateTour ? new Date(new Date(bill.slotId.dateTour).getTime() - (3 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {(bill.payment_status === 'deposit_paid' || (bill.isDeposit && !bill.isFullyPaid)) && (
                                    <div className="bg-blue-50 px-8 py-3 border-b border-blue-100">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="font-medium text-blue-800">Chờ thanh toán</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Đã đặt cọc: </span>
                                                    <span className="font-medium">{(bill.depositAmount || 0).toLocaleString()}đ</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Còn lại: </span>
                                                    <span className="font-medium text-red-600">{((bill.totalPriceTour || 0) - (bill.depositAmount || 0)).toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {bill.payment_status === 'completed' && (
                                    <div className="bg-green-50 px-8 py-3 border-b border-green-100">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="font-medium text-green-800">Đã thanh toán đầy đủ</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-600">Tổng thanh toán: </span>
                                                <span className="font-medium text-green-700">{(bill.totalPriceTour || 0).toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {bill.payment_status === 'cancelled' && (
                                    <div className="bg-red-50 px-8 py-3 border-b border-red-100">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="font-medium text-red-800">Đã hủy</span>
                                            </div>
                                            {bill.cancelReason && (
                                                <div className="text-sm">
                                                    <span className="text-gray-600">Lý do: </span>
                                                    <span className="font-medium">{bill.cancelReason}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Main Content */}
                                <div className="p-10">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        {/* Left Side - Room Info */}
                                        <div className="flex-1 mb-6 lg:mb-0">
                                            <div className="flex items-start space-x-4">
                                                {/* Room Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                                                        {bill.slotId?.tour?.imageTour && bill.slotId.tour.imageTour[0] ? (
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

                                                {/* Room Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900 truncate">
                                                            {bill.slotId?.tour?.nameTour || 'Không có tên'}
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
                                                                {bill.slotId?.tour?.destination || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>
                                                                {bill.slotId?.tour?.duration || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Room Features */}
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            Tour
                                                        </span>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {bill.slotId?.tour?.tourType || 'Du lịch'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side - Price and Actions */}
                                        <div className="flex flex-col items-end space-y-4">
                                            {/* Price */}
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {(bill.totalPriceTour || 0).toLocaleString()}đ
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                <button
                                                    onClick={() => handleViewDetail(bill)}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex-shrink-0"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Chi tiết
                                                </button>
                                                {bill.payment_status === 'pending' && !bill.isDeposit && (
                                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 flex-shrink-0">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        Thanh toán
                                                    </button>
                                                )}
                                                {/* Nếu đã đặt cọc nhưng chưa thanh toán đầy đủ và không bị hủy */}
                                                {bill.isDeposit && !bill.isFullyPaid && bill.payment_status !== 'cancelled' && (
                                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex-shrink-0">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        Hoàn tất thanh toán
                                                    </button>
                                                )}
                                                {canCancelBooking(bill) && (
                                                    <button 
                                                        onClick={() => handleCancelBooking(bill)}
                                                        className="group relative inline-flex items-center px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-600 hover:to-red-700 hover:text-white hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0"
                                                    >
                                                        <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span className="relative z-10">Hủy</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section - Additional Info */}
                                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                                    {/* Remove deposit information section */}
                                    
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
                                                <span>Ngày đi: {new Date(bill?.slotId?.dateTour || '').toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Ngày về: {bill?.slotId?.dateTour ? new Date(new Date(bill.slotId.dateTour).getTime() + (parseInt(bill?.slotId?.tour?.duration?.split(' ')[0] || "0") * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <div className={`w-2 h-2 rounded-full ${bill.payment_status === 'completed' ? 'bg-green-500' :
                                                    bill.payment_status === 'pending' ? 'bg-yellow-500' :
                                                    bill.payment_status === 'deposit_paid' ? 'bg-blue-500' :
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
                        
                        {/* Pagination */}
                        <div className="flex justify-center mt-8 mb-8 px-4">
                            <Pagination 
                                current={currentPage} 
                                total={filteredBills.length}
                                pageSize={itemsPerPage}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                className="custom-pagination"
                                showTotal={(total) => `Tổng ${total} đặt chỗ`}
                            />
                        </div>
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
                            {selectedBill?.BookingTourId?.tourId?.nameTour || selectedBill?.slotId?.tour?.nameTour ? (
                                // Tour Detail
                                <div className="space-y-6">
                                    {/* Tour Header */}
                                    <div className="flex items-start space-x-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl overflow-hidden shadow-lg">
                                                {(selectedBill?.BookingTourId?.tourId?.imageTour || (selectedBill?.slotId?.tour?.imageTour && selectedBill.slotId.tour.imageTour[0])) ? (
                                                    <img
                                                        src={selectedBill?.BookingTourId?.tourId?.imageTour || (selectedBill?.slotId?.tour?.imageTour && selectedBill.slotId.tour.imageTour[0])}
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
                                                {selectedBill?.BookingTourId?.tourId?.nameTour || selectedBill?.slotId?.tour?.nameTour || 'Tour du lịch'}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{selectedBill?.BookingTourId?.tourId?.destination || selectedBill?.slotId?.tour?.destination || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{selectedBill?.BookingTourId?.tourId?.duration || selectedBill?.slotId?.tour?.duration || 0} ngày</span>
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
                                                    <span className="font-medium">{selectedBill?.BookingTourId?.tourId?.destination || selectedBill?.slotId?.tour?.destination || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Điểm khởi hành:</span>
                                                    <span className="font-medium">{selectedBill?.BookingTourId?.tourId?.departure_location || selectedBill?.slotId?.tour?.departure_location || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Thời gian:</span>
                                                    <span className="font-medium">{selectedBill?.BookingTourId?.tourId?.duration || selectedBill?.slotId?.tour?.duration || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Loại tour:</span>
                                                    <span className="font-medium">{selectedBill?.BookingTourId?.tourId?.tourType || selectedBill?.slotId?.tour?.tourType || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đặt chỗ</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ngày xuẩt phát:</span>
                                                    <span className="font-medium">
                                                        {selectedBill?.slotId?.dateTour ? new Date(selectedBill.slotId.dateTour).toLocaleDateString('vi-VN') : new Date(selectedBill?.createdAt || Date.now()).toLocaleDateString('vi-VN')}
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
                                                        {(selectedBill?.amount || selectedBill?.total || selectedBill?.totalPriceTour || 0).toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tour Images Gallery */}
                                    {(selectedBill?.BookingTourId?.tourId?.imageTour || selectedBill?.slotId?.tour?.imageTour) && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh tour</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {(selectedBill?.BookingTourId?.tourId?.imageTour || selectedBill?.slotId?.tour?.imageTour || []).map((image, idx) => (
                                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden cursor-pointer group">
                                                        <img
                                                            src={image}
                                                            alt={`Tour ${idx + 1}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 group-hover:brightness-110"
                                                            onClick={() => window.open(image, '_blank')}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tour Description */}
                                    {(selectedBill?.BookingTourId?.tourId?.description || selectedBill?.slotId?.tour?.description) && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Mô tả tour</h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {selectedBill?.BookingTourId?.tourId?.description || selectedBill?.slotId?.tour?.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Booked Rooms for this Tour */}
                                    {Array.isArray(selectedBill?.itemRoom) && selectedBill.itemRoom.length > 0 && (
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
                                            {/* Hiển thị thông tin đặt cọc */}
                                            {selectedBill.isDeposit && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tiền đặt cọc:</span>
                                                    <span className="font-medium text-blue-600">
                                                        {selectedBill.depositAmount.toLocaleString()}₫
                                                    </span>
                                                </div>
                                            )}
                                            {/* Hiển thị số tiền còn lại cần thanh toán */}
                                            {selectedBill.isDeposit && !selectedBill.isFullyPaid && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Còn lại:</span>
                                                    <span className="font-medium text-red-600">
                                                        {(selectedBill.totalPriceTour - selectedBill.depositAmount).toLocaleString()}₫
                                                    </span>
                                                </div>
                                            )}
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
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tổng tiền:</span>
                                                <span className="font-bold text-green-600">
                                                    {selectedBill.totalPriceTour.toLocaleString()}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Images Gallery */}
                                    {selectedBill.imageRoom && selectedBill.imageRoom.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh phòng</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {selectedBill.imageRoom.map((image, idx) => (
                                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden cursor-pointer group">
                                                        <img
                                                            src={image}
                                                            alt={`Room ${idx + 1}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 group-hover:brightness-110"
                                                            onClick={() => window.open(image, '_blank')}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
                            {selectedBill?.payment_status === 'pending' && !selectedBill?.isDeposit && (
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                                    Thanh toán ngay
                                </button>
                            )}
                            {selectedBill?.isDeposit && !selectedBill?.isFullyPaid && selectedBill?.payment_status !== 'cancelled' && (
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    Hoàn tất thanh toán
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận hủy booking */}
            {showCancelModal && bookingToCancel && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Xác nhận hủy đặt chỗ</h2>
              <p className="text-red-100 text-sm mt-1">Vui lòng xem kỹ chính sách hoàn tiền trước khi hủy</p>
            </div>
          </div>
          <button
            onClick={closeCancelModal}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500 opacity-60"></div>
      </div>

      {/* Nội dung */}
      <div className="p-6 space-y-6">
        {/* Thông tin tour */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-3">{bookingToCancel?.slotId?.tour?.nameTour || 'Tour không xác định'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Ngày khởi hành:</span>
                  <span className="text-sm font-semibold text-gray-900">{bookingToCancel?.slotId?.dateTour ? new Date(bookingToCancel.slotId.dateTour).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm text-gray-600">Tổng tiền:</span>
                  <span className="text-sm font-bold text-red-600">{(bookingToCancel?.totalPriceTour || 0).toLocaleString()}₫</span>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <span className={`text-sm font-semibold ${getStatusColor(bookingToCancel?.payment_status || '')}`}>{getStatusText(bookingToCancel?.payment_status || '')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chính sách hoàn tiền */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Chính sách hoàn tiền</h3>
            <Link 
              to="/clause" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem chi tiết
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
              <p><span className="font-medium">Hủy trước 30 ngày:</span> Hoàn 100% tiền đặt cọc</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p><span className="font-medium">Hủy trước 15-29 ngày:</span> Hoàn 70% tiền đặt cọc</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
              <p><span className="font-medium">Hủy trước 7-14 ngày:</span> Hoàn 50% tiền đặt cọc</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
              <p><span className="font-medium">Hủy trước 4-6 ngày:</span> Hoàn 30% tiền đặt cọc</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
              <p><span className="font-medium">Hủy trước 3 ngày:</span> Không hoàn tiền</p>
            </div>
          </div>

          {/* Tính toán số tiền hoàn lại dự kiến */}
          {(() => {
            if (!bookingToCancel?.slotId?.dateTour) {
              return (
                <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-red-800">Không thể tính toán hoàn tiền do thiếu thông tin ngày tour.</p>
                </div>
              );
            }
            
            const departureDate = new Date(bookingToCancel.slotId.dateTour);
            const today = new Date();
            
            if (isNaN(departureDate.getTime())) {
              return (
                <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-red-800">Ngày tour không hợp lệ.</p>
                </div>
              );
            }
            
            const daysUntilDeparture = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            let refundPercentage = 0;
            let refundStatus = "";
            
            if (daysUntilDeparture > 30) {
              refundPercentage = 100;
              refundStatus = "Hoàn 100% tiền đặt cọc";
            } else if (daysUntilDeparture >= 15) {
              refundPercentage = 70;
              refundStatus = "Hoàn 70% tiền đặt cọc";
            } else if (daysUntilDeparture >= 7) {
              refundPercentage = 50;
              refundStatus = "Hoàn 50% tiền đặt cọc";
            } else if (daysUntilDeparture >= 4) {
              refundPercentage = 30;
              refundStatus = "Hoàn 30% tiền đặt cọc";
            } else {
              refundPercentage = 0;
              refundStatus = "Không hoàn tiền";
            }
            
            const depositAmount = bookingToCancel.depositAmount || (bookingToCancel.totalPriceTour * 0.5);
            const estimatedRefund = (depositAmount * refundPercentage / 100);
            
            return (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Dự kiến hoàn tiền của bạn:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Ngày khởi hành:</span>
                    <span className="font-medium">{departureDate.toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số ngày còn lại:</span>
                    <span className="font-medium">{daysUntilDeparture} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chính sách áp dụng:</span>
                    <span className="font-medium">{refundStatus}</span>
                  </div>
                  {bookingToCancel.isDeposit && (
                    <>
                      <div className="flex justify-between">
                        <span>Số tiền đã đặt cọc:</span>
                        <span className="font-medium">{depositAmount.toLocaleString()}₫</span>
                      </div>
                      <div className="flex justify-between text-blue-800 font-bold">
                        <span>Số tiền dự kiến hoàn lại:</span>
                        <span>{estimatedRefund.toLocaleString()}₫</span>
                      </div>
                    </>
                  )}
                  {!bookingToCancel.isDeposit && (
                    <div className="text-blue-800 font-medium">
                      Bạn chưa thanh toán đặt cọc nên không phát sinh phí hủy.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Lý do hủy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do yêu cầu hủy <span className="text-red-500">*</span></label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do yêu cầu hủy..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        {/* Cảnh báo */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-800">
          Yêu cầu hủy sẽ được gửi đến quản trị viên để xác nhận. Bạn sẽ được thông báo khi có kết quả. Số tiền hoàn lại (nếu có) sẽ được tính theo chính sách trên.
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-100">
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={closeCancelModal}
            className="group relative px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            disabled={requestCancelMutation.isPending}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Không, giữ lại
            </span>
          </button>
          <button
            onClick={confirmCancelBooking}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            disabled={requestCancelMutation.isPending || !cancelReason.trim()}
          >
            {requestCancelMutation.isPending ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang gửi yêu cầu...</span>
              </div>
            ) : (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Gửi yêu cầu hủy
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}        </div>    </div>)
}

export default InfoUser