const axios = require('axios');

// Test workflow admin xác nhận hủy
const testAdminCancelWorkflow = async () => {
    try {
        const bookingId = '68720bbec7c577def7453e7b'; // ID của booking cần test
        const userId = '6859fadb05bb5fb50699bbeb'; // ID của user sở hữu booking
        const adminId = 'admin123'; // ID của admin
        
        console.log('🔄 === TEST ADMIN CANCEL WORKFLOW ===\n');
        
        // Test 1: User yêu cầu hủy
        console.log('📝 Test 1: User yêu cầu hủy đặt chỗ');
        try {
            const response = await axios.put(`http://localhost:8080/api/bookingTour/request-cancel/${bookingId}`, {
                userId: userId,
                reason: 'Có việc đột xuất, không thể tham gia tour'
            });
            console.log('✅ Kết quả:', response.data);
        } catch (error) {
            console.error('❌ Lỗi:', error.response?.data || error.message);
        }
        
        // Test 2: Admin xem danh sách booking
        console.log('\n📝 Test 2: Admin xem danh sách booking');
        try {
            const response = await axios.get('http://localhost:8080/api/admin/bookings', {
                params: {
                    status: 'pending_cancel',
                    page: 1,
                    limit: 10
                }
            });
            console.log('✅ Kết quả:', response.data);
        } catch (error) {
            console.error('❌ Lỗi:', error.response?.data || error.message);
        }
        
        // Test 3: Admin xác nhận hủy
        console.log('\n📝 Test 3: Admin xác nhận hủy đặt chỗ');
        try {
            const response = await axios.put(`http://localhost:8080/api/admin/bookings/cancel/${bookingId}`, {
                adminId: adminId,
                reason: 'Admin xác nhận hủy theo yêu cầu của khách hàng'
            });
            console.log('✅ Kết quả:', response.data);
        } catch (error) {
            console.error('❌ Lỗi:', error.response?.data || error.message);
        }
        
        // Test 4: Kiểm tra trạng thái sau khi hủy
        console.log('\n📝 Test 4: Kiểm tra trạng thái sau khi hủy');
        try {
            const response = await axios.get(`http://localhost:8080/api/bookingTour/${bookingId}`);
            console.log('✅ Kết quả:', response.data);
        } catch (error) {
            console.error('❌ Lỗi:', error.response?.data || error.message);
        }
        
    } catch (error) {
        console.error('❌ Lỗi chung:', error.message);
    }
};

// Test các trường hợp lỗi
const testErrorCases = async () => {
    console.log('\n🧪 === TEST ERROR CASES ===\n');
    
    // Test 1: User không có quyền yêu cầu hủy
    console.log('📝 Test 1: User không có quyền yêu cầu hủy');
    try {
        const response = await axios.put('http://localhost:8080/api/bookingTour/request-cancel/68720bbec7c577def7453e7b', {
            userId: 'wronguserid',
            reason: 'Test'
        });
        console.log('✅ Kết quả:', response.data);
    } catch (error) {
        console.error('❌ Lỗi:', error.response?.data || error.message);
    }
    
    // Test 2: Booking không tồn tại
    console.log('\n📝 Test 2: Booking không tồn tại');
    try {
        const response = await axios.put('http://localhost:8080/api/bookingTour/request-cancel/nonexistentid', {
            userId: '6859fadb05bb5fb50699bbeb',
            reason: 'Test'
        });
        console.log('✅ Kết quả:', response.data);
    } catch (error) {
        console.error('❌ Lỗi:', error.response?.data || error.message);
    }
    
    // Test 3: Admin xác nhận hủy booking không tồn tại
    console.log('\n📝 Test 3: Admin xác nhận hủy booking không tồn tại');
    try {
        const response = await axios.put('http://localhost:8080/api/admin/bookings/cancel/nonexistentid', {
            adminId: 'admin123',
            reason: 'Test'
        });
        console.log('✅ Kết quả:', response.data);
    } catch (error) {
        console.error('❌ Lỗi:', error.response?.data || error.message);
    }
};

// Chạy test
if (require.main === module) {
    testAdminCancelWorkflow().then(() => {
        testErrorCases();
    });
}

module.exports = { testAdminCancelWorkflow, testErrorCases }; 