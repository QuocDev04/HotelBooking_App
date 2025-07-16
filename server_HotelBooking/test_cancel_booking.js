const axios = require('axios');

// Test API hủy đặt chỗ
const testCancelBooking = async () => {
    try {
        const bookingId = '68720bbec7c577def7453e7b'; // ID của booking cần test
        const userId = '6859fadb05bb5fb50699bbeb'; // ID của user sở hữu booking
        
        console.log('🔄 Đang test API hủy đặt chỗ...');
        console.log('📋 Booking ID:', bookingId);
        console.log('👤 User ID:', userId);
        
        const response = await axios.put(`http://localhost:8080/api/bookingTour/cancel/${bookingId}`, {
            userId: userId
        });
        
        console.log('✅ Kết quả:', response.data);
        
    } catch (error) {
        console.error('❌ Lỗi:', error.response?.data || error.message);
    }
};

// Test các trường hợp khác nhau
const testCases = async () => {
    console.log('\n🧪 === TEST CASES ===\n');
    
    // Test 1: Hủy booking hợp lệ
    console.log('📝 Test 1: Hủy booking hợp lệ');
    await testCancelBooking();
    
    // Test 2: Hủy booking không tồn tại
    console.log('\n📝 Test 2: Hủy booking không tồn tại');
    try {
        const response = await axios.put('http://localhost:8080/api/bookingTour/cancel/nonexistentid', {
            userId: '6859fadb05bb5fb50699bbeb'
        });
        console.log('✅ Kết quả:', response.data);
    } catch (error) {
        console.error('❌ Lỗi:', error.response?.data || error.message);
    }
    
    // Test 3: Hủy booking với user không có quyền
    console.log('\n📝 Test 3: Hủy booking với user không có quyền');
    try {
        const response = await axios.put('http://localhost:8080/api/bookingTour/cancel/68720bbec7c577def7453e7b', {
            userId: 'wronguserid'
        });
        console.log('✅ Kết quả:', response.data);
    } catch (error) {
        console.error('❌ Lỗi:', error.response?.data || error.message);
    }
};

// Chạy test
if (require.main === module) {
    testCases();
}

module.exports = { testCancelBooking }; 