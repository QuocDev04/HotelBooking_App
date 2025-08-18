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
    } | string;
    
    // Tour booking fields
    slotId?: {
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
    fullNameUser?: string;
    email?: string;
    phone?: string;
    address?: string;
    totalPriceTour?: number;
    adultsTour?: number;
    childrenTour?: number;
    toddlerTour?: number;
    infantTour?: number;
    adultPassengers?: Array<{
        fullName: string;
        gender: string;
        birthDate: string;
        singleRoom: boolean;
    }>;
    childPassengers?: any[];
    toddlerPassengers?: any[];
    infantPassengers?: any[];

    BookingTourId?: any;
    
    // Common fields
    depositAmount?: number;
    isDeposit?: boolean;
    isFullyPaid?: boolean;
    payment_method: string;
    payment_status: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
    cancelReason?: string;
    cancelRequestedAt?: string;
    note?: string;
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
    const bills: Bill[] = (bill?.data?.bookings || []);
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
        mutationFn: (bookingId: string) => {
            return instanceClient.put(`/bookingTour/request-cancel/${bookingId}`, {
                userId: userId,
                reason: cancelReason
            });
        },
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
                alert(`Yêu cầu hủy đặt tour đã được gửi thành công.`);
            }
        },
        onError: (error) => {
            console.error('Error requesting cancel:', error);
            alert(`Có lỗi xảy ra khi yêu cầu hủy đặt tour. Vui lòng thử lại.`);
        }
    });

    const confirmCancelBooking = () => {
        if (bookingToCancel) {
            requestCancelMutation.mutate(bookingToCancel._id);
        }
    };

    // Xử lý thanh toán ban đầu
    const handlePayment = (bill: Bill) => {
        // Chuyển hướng đến trang thanh toán tour booking
        navigate(`/booking/${bill._id}`, {
            state: { bookingData: bill }
        });
    };

    // Xử lý hoàn tất thanh toán (sau khi đã đặt cọc)
    const handleCompletePayment = (bill: Bill) => {
        // Tính số tiền còn lại cần thanh toán cho tour
        const remainingAmount = (bill.totalPriceTour || 0) - (bill.depositAmount || 0);
        
        // Chuyển hướng đến trang thanh toán tour với số tiền còn lại
        navigate(`/booking/${bill._id}`, {
            state: { 
                bookingData: bill,
                isCompletePayment: true,
                remainingAmount: remainingAmount
            }
        });
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
                        Quản lý và theo dõi các tour du lịch của bạn
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12 mx-2">
                    {/* Tổng đặt chỗ */}
                    <div className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-blue-700 mb-1">Tổng đặt chỗ</p>
                                <p className="text-3xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors">{bills.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Đã thanh toán đủ */}
                    <div className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-green-200 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="p-3 rounded-xl bg-green-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-green-700 mb-1">Đã thanh toán đủ</p>
                                <p className="text-3xl font-bold text-green-900 group-hover:text-green-800 transition-colors">
                                    {bills.filter(bill => bill.payment_status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chờ hoàn tất thanh toán */}
                    <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="p-3 rounded-xl bg-indigo-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-indigo-700 mb-1">Chờ hoàn tất thanh toán</p>
                                <p className="text-3xl font-bold text-indigo-900 group-hover:text-indigo-800 transition-colors">
                                    {bills.filter((bill: any) => bill.payment_status === 'deposit_paid' || (bill.isDeposit && !bill.isFullyPaid)).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chờ thanh toán */}
                    <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-yellow-200 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="p-3 rounded-xl bg-yellow-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-yellow-700 mb-1">Chờ thanh toán</p>
                                <p className="text-3xl font-bold text-yellow-900 group-hover:text-yellow-800 transition-colors">
                                    {bills.filter(bill => bill.payment_status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tổng chi tiêu */}
                    <div className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="p-3 rounded-xl bg-purple-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-purple-700 mb-1">Tổng chi tiêu</p>
                                <p className="text-2xl font-bold text-purple-900 group-hover:text-purple-800 transition-colors">
                                    {bills
                                        .filter(bill => bill.payment_status === 'completed')
                                        .reduce((sum, bill) => sum + (bill.totalPriceTour || 0), 0)
                                        .toLocaleString()}₫
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Đã hủy */}
                    <div className="group bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-red-200 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <div className="p-3 rounded-xl bg-red-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-red-700 mb-1">Đã hủy</p>
                                <p className="text-3xl font-bold text-red-900 group-hover:text-red-800 transition-colors">
                                    {bills.filter(bill => bill.payment_status === 'cancelled').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100 mx-2">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <h2 className="text-2xl font-bold text-gray-900">Lịch sử đặt tour</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedStatus("all")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedStatus === "all"
                                        ? "bg-blue-500 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Tất cả ({bills.length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus("pending")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedStatus === "pending"
                                        ? "bg-yellow-500 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Chờ thanh toán ({bills.filter(bill => bill.payment_status === 'pending').length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus("deposit_paid")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedStatus === "deposit_paid"
                                        ? "bg-indigo-500 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Chờ hoàn tất ({bills.filter((bill: any) => bill.payment_status === 'deposit_paid' || (bill.isDeposit && !bill.isFullyPaid)).length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus("completed")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedStatus === "completed"
                                        ? "bg-green-500 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Đã thanh toán ({bills.filter(bill => bill.payment_status === 'completed').length})
                            </button>
                            <button
                                onClick={() => setSelectedStatus("cancelled")}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedStatus === "cancelled"
                                        ? "bg-red-500 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Đã hủy ({bills.filter(bill => bill.payment_status === 'cancelled').length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bills List */}
                <div className="space-y-6 mx-2">
                    {currentBills.length > 0 ? (
                        currentBills.map((bill) => (
                            <div key={bill._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                                        {/* Tour Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={bill.slotId?.tour?.imageTour?.[0] || '/default-tour.jpg'}
                                                        alt={bill.slotId?.tour?.nameTour || 'Tour'}
                                                        className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                                                        {bill.slotId?.tour?.nameTour || 'Tour không xác định'}
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>Ngày khởi hành: {bill.slotId?.dateTour ? new Date(bill.slotId.dateTour).toLocaleDateString('vi-VN') : 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            <span>Số người: {(bill.adultsTour || 0) + (bill.childrenTour || 0) + (bill.toddlerTour || 0) + (bill.infantTour || 0)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                            <span className="font-semibold text-gray-900">Tổng tiền: {(bill.totalPriceTour || 0).toLocaleString()}₫</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>Ngày đặt: {new Date(bill.createdAt).toLocaleDateString('vi-VN')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex flex-col items-end space-y-4">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(bill.payment_status)}`}>
                                                {getStatusText(bill.payment_status)}
                                            </span>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(bill)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    Xem chi tiết
                                                </button>
                                                
                                                {bill.payment_status === 'pending' && (
                                                    <button
                                                        onClick={() => handlePayment(bill)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        Thanh toán ngay
                                                    </button>
                                                )}
                                                
                                                {(bill.payment_status === 'deposit_paid' || (bill.isDeposit && !bill.isFullyPaid)) && (
                                                    <button
                                                        onClick={() => handleCompletePayment(bill)}
                                                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        Hoàn tất thanh toán
                                                    </button>
                                                )}
                                                
                                                {canCancelBooking(bill) && (
                                                    <button
                                                        onClick={() => handleCancelBooking(bill)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                                                    >
                                                        Yêu cầu hủy
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đặt chỗ nào</h3>
                            <p className="text-gray-600 mb-6">Bạn chưa có đặt chỗ nào trong danh mục này.</p>
                            <Link
                                to="/tour"
                                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Đặt tour ngay
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {sortedBills.length > itemsPerPage && (
                    <div className="flex justify-center mt-12">
                        <Pagination
                            current={currentPage}
                            total={sortedBills.length}
                            pageSize={itemsPerPage}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
                            className="custom-pagination"
                        />
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Chi tiết đặt tour</h2>
                                        <p className="text-blue-100 text-sm mt-1">Thông tin chi tiết về chuyến đi của bạn</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeDetailModal}
                                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-60"></div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Tour Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                                <div className="flex items-start space-x-4">
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-2xl text-gray-900 mb-3">
                                            {selectedBill?.slotId?.tour?.nameTour || 'Tour không xác định'}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">Điểm đến:</span>
                                                    <span className="text-sm font-semibold text-gray-900">{selectedBill?.slotId?.tour?.destination || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">Ngày khởi hành:</span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {selectedBill?.slotId?.dateTour ? new Date(selectedBill.slotId.dateTour).toLocaleDateString('vi-VN') : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">Thời gian:</span>
                                                    <span className="text-sm font-semibold text-gray-900">{selectedBill?.slotId?.tour?.duration || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">Số người:</span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {(selectedBill?.adultsTour || 0) + (selectedBill?.childrenTour || 0) + (selectedBill?.toddlerTour || 0) + (selectedBill?.infantTour || 0)} người
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">Tổng tiền:</span>
                                                    <span className="text-lg font-bold text-red-600">
                                                        {(selectedBill?.totalPriceTour || 0).toLocaleString()}₫
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">Trạng thái:</span>
                                                    <span className={`text-sm font-semibold ${getStatusColor(selectedBill?.payment_status || '')}`}>
                                                        {getStatusText(selectedBill?.payment_status || '')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Thông tin khách hàng
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Họ và tên:</label>
                                        <p className="text-sm font-semibold text-gray-900">{selectedBill?.fullNameUser || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email:</label>
                                        <p className="text-sm font-semibold text-gray-900">{selectedBill?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                                        <p className="text-sm font-semibold text-gray-900">{selectedBill?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Địa chỉ:</label>
                                        <p className="text-sm font-semibold text-gray-900">{selectedBill?.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tour Images */}
                            {selectedBill?.slotId?.tour?.imageTour && selectedBill.slotId.tour.imageTour.length > 0 && (
                                <div className="bg-white rounded-xl p-5 border border-gray-200">
                                    <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Hình ảnh tour
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedBill.slotId.tour.imageTour.slice(0, 6).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Tour image ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform duration-200"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tour Description */}
                            {(selectedBill?.BookingTourId?.tourId?.description || selectedBill?.slotId?.tour?.description) && (
                                <div className="bg-white rounded-xl p-5 border border-gray-200">
                                    <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Mô tả tour
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        {selectedBill?.BookingTourId?.tourId?.description || selectedBill?.slotId?.tour?.description}
                                    </p>
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
                                <button
                                    onClick={() => {
                                        closeDetailModal();
                                        handlePayment(selectedBill);
                                    }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                >
                                    Thanh toán ngay
                                </button>
                            )}
                            {(selectedBill?.payment_status === 'deposit_paid' || (selectedBill?.isDeposit && !selectedBill?.isFullyPaid)) && (
                                <button
                                    onClick={() => {
                                        closeDetailModal();
                                        handleCompletePayment(selectedBill);
                                    }}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                                >
                                    Hoàn tất thanh toán
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
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

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Booking Info */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-900 mb-3">
                                            {bookingToCancel?.slotId?.tour?.nameTour || 'Tour không xác định'}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm text-gray-600">Ngày khởi hành:</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {bookingToCancel?.slotId?.dateTour ? new Date(bookingToCancel.slotId.dateTour).toLocaleDateString('vi-VN') : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                                <span className="text-sm text-gray-600">Tổng tiền:</span>
                                                <span className="text-sm font-bold text-red-600">
                                                    {(bookingToCancel?.totalPriceTour || 0).toLocaleString()}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cancel Reason */}
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

                            {/* Warning */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-800">
                                Yêu cầu hủy sẽ được gửi đến quản trị viên để xác nhận. Bạn sẽ được thông báo khi có kết quả.
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-100">
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={closeCancelModal}
                                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                    disabled={requestCancelMutation.isPending}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={confirmCancelBooking}
                                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
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
                                        <span>Gửi yêu cầu hủy</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InfoUser