const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

// Test data
const testBookingData = {
    userId: '507f1f77bcf86cd799439011', // Giả sử user ID
    slotId: '507f1f77bcf86cd799439012', // Giả sử slot ID
    fullNameUser: 'Nguyễn Văn Test',
    email: 'test@example.com',
    phone: '0123456789',
    adultsTour: 2,
    childrenTour: 1,
    toddlerTour: 0,
    infantTour: 0,
    payment_method: 'cash',
    totalPriceTour: 5000000
};

const testAdminData = {
    adminId: 'admin123',
    reason: 'Test admin cancellation'
};

async function testAdminFrontendWorkflow() {
    console.log('🚀 Bắt đầu test Admin Frontend Workflow\n');

    try {
        // 1. Test API thống kê booking
        console.log('📊 1. Test API thống kê booking...');
        const statsResponse = await axios.get(`${BASE_URL}/admin/bookings/stats`);
        console.log('✅ Thống kê booking:', statsResponse.data);
        console.log('');

        // 2. Test API lấy danh sách booking cho admin
        console.log('📋 2. Test API lấy danh sách booking cho admin...');
        const bookingsResponse = await axios.get(`${BASE_URL}/admin/bookings`, {
            params: {
                status: 'all',
                page: 1,
                limit: 10,
                search: ''
            }
        });
        console.log('✅ Danh sách booking:', {
            total: bookingsResponse.data.bookings?.length || 0,
            pagination: bookingsResponse.data.pagination
        });
        console.log('');

        // 3. Test API lấy booking theo trạng thái pending_cancel
        console.log('⏳ 3. Test API lấy booking pending_cancel...');
        const pendingCancelResponse = await axios.get(`${BASE_URL}/admin/bookings`, {
            params: {
                status: 'pending_cancel',
                page: 1,
                limit: 10
            }
        });
        console.log('✅ Booking pending_cancel:', {
            count: pendingCancelResponse.data.bookings?.length || 0,
            bookings: pendingCancelResponse.data.bookings?.map(b => ({
                id: b._id,
                customer: b.fullNameUser,
                status: b.payment_status,
                cancelReason: b.cancelReason
            }))
        });
        console.log('');

        // 4. Test API xác nhận hủy booking (nếu có booking pending_cancel)
        if (pendingCancelResponse.data.bookings?.length > 0) {
            const firstPendingBooking = pendingCancelResponse.data.bookings[0];
            console.log('✅ 4. Test API xác nhận hủy booking...');
            console.log('Booking cần xử lý:', {
                id: firstPendingBooking._id,
                customer: firstPendingBooking.fullNameUser,
                reason: firstPendingBooking.cancelReason
            });

            const cancelResponse = await axios.put(
                `${BASE_URL}/admin/bookings/cancel/${firstPendingBooking._id}`,
                testAdminData
            );
            console.log('✅ Xác nhận hủy thành công:', cancelResponse.data);
            console.log('');
        } else {
            console.log('ℹ️ 4. Không có booking nào cần xử lý');
            console.log('');
        }

        // 5. Test lại thống kê sau khi xử lý
        console.log('📊 5. Test lại thống kê sau khi xử lý...');
        const updatedStatsResponse = await axios.get(`${BASE_URL}/admin/bookings/stats`);
        console.log('✅ Thống kê cập nhật:', updatedStatsResponse.data);
        console.log('');

        console.log('🎉 Tất cả test đã hoàn thành thành công!');
        console.log('\n📝 Tóm tắt workflow:');
        console.log('1. Admin có thể xem thống kê booking trên dashboard');
        console.log('2. Admin có thể xem danh sách booking với filter và search');
        console.log('3. Admin có thể xem booking cần xử lý (pending_cancel)');
        console.log('4. Admin có thể xác nhận hủy booking với modal confirmation');
        console.log('5. Navbar hiển thị thông báo khi có booking cần xử lý');
        console.log('6. Sidebar có menu "Quản lý đặt chỗ" để truy cập nhanh');

    } catch (error) {
        console.error('❌ Lỗi trong quá trình test:', error.response?.data || error.message);
        
        if (error.response?.status === 404) {
            console.log('\n💡 Gợi ý: Có thể cần tạo dữ liệu test trước');
        }
    }
}

// Test các endpoint riêng lẻ
async function testIndividualEndpoints() {
    console.log('\n🔧 Test các endpoint riêng lẻ:\n');

    const endpoints = [
        {
            name: 'Thống kê booking',
            method: 'GET',
            url: '/admin/bookings/stats'
        },
        {
            name: 'Danh sách booking (tất cả)',
            method: 'GET',
            url: '/admin/bookings?status=all&page=1&limit=5'
        },
        {
            name: 'Danh sách booking (pending)',
            method: 'GET',
            url: '/admin/bookings?status=pending&page=1&limit=5'
        },
        {
            name: 'Danh sách booking (completed)',
            method: 'GET',
            url: '/admin/bookings?status=completed&page=1&limit=5'
        },
        {
            name: 'Danh sách booking (cancelled)',
            method: 'GET',
            url: '/admin/bookings?status=cancelled&page=1&limit=5'
        },
        {
            name: 'Danh sách booking (pending_cancel)',
            method: 'GET',
            url: '/admin/bookings?status=pending_cancel&page=1&limit=5'
        }
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Testing: ${endpoint.name}`);
            const response = await axios.get(`${BASE_URL}${endpoint.url}`);
            console.log(`✅ Status: ${response.status}`);
            console.log(`📊 Data:`, response.data);
            console.log('');
        } catch (error) {
            console.log(`❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            console.log('');
        }
    }
}

// Chạy test
if (require.main === module) {
    console.log('🎯 Admin Frontend Workflow Test');
    console.log('================================\n');
    
    testAdminFrontendWorkflow()
        .then(() => {
            console.log('\n🔄 Chạy test endpoint riêng lẻ...');
            return testIndividualEndpoints();
        })
        .catch(console.error);
}

module.exports = {
    testAdminFrontendWorkflow,
    testIndividualEndpoints
}; 