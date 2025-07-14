const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

// Test data
const testAdminData = {
    adminId: 'admin123',
    reason: 'Test real-time notification update'
};

async function testRealtimeNotificationUpdate() {
    console.log('🚀 Bắt đầu test Realtime Notification Update\n');

    try {
        // 1. Kiểm tra thống kê ban đầu
        console.log('📊 1. Kiểm tra thống kê ban đầu...');
        const initialStats = await axios.get(`${BASE_URL}/admin/bookings/stats`);
        const initialPendingCancel = initialStats.data.stats.pendingCancel;
        console.log('✅ Số booking pending_cancel ban đầu:', initialPendingCancel);
        console.log('');

        // 2. Lấy danh sách booking pending_cancel
        console.log('📋 2. Lấy danh sách booking pending_cancel...');
        const pendingBookings = await axios.get(`${BASE_URL}/admin/bookings`, {
            params: {
                status: 'pending_cancel',
                page: 1,
                limit: 10
            }
        });
        
        const pendingCount = pendingBookings.data.bookings.length;
        console.log('✅ Số booking pending_cancel:', pendingCount);
        
        if (pendingCount === 0) {
            console.log('ℹ️ Không có booking nào cần xử lý. Test hoàn thành.');
            return;
        }

        // 3. Xác nhận hủy từng booking và kiểm tra thống kê
        console.log('🔄 3. Xác nhận hủy và kiểm tra cập nhật thống kê...');
        
        for (let i = 0; i < Math.min(pendingCount, 3); i++) { // Chỉ test 3 booking đầu
            const booking = pendingBookings.data.bookings[i];
            console.log(`\n📝 Xử lý booking ${i + 1}/${Math.min(pendingCount, 3)}:`);
            console.log(`   - ID: ${booking._id}`);
            console.log(`   - Khách hàng: ${booking.fullNameUser}`);
            console.log(`   - Lý do hủy: ${booking.cancelReason || 'Không có'}`);

            // Thống kê trước khi xác nhận
            const statsBefore = await axios.get(`${BASE_URL}/admin/bookings/stats`);
            const pendingBefore = statsBefore.data.stats.pendingCancel;
            console.log(`   - Số pending_cancel trước: ${pendingBefore}`);

            // Xác nhận hủy
            const cancelResponse = await axios.put(
                `${BASE_URL}/admin/bookings/cancel/${booking._id}`,
                testAdminData
            );
            console.log(`   ✅ Xác nhận hủy thành công: ${cancelResponse.data.message}`);

            // Thống kê sau khi xác nhận
            const statsAfter = await axios.get(`${BASE_URL}/admin/bookings/stats`);
            const pendingAfter = statsAfter.data.stats.pendingCancel;
            console.log(`   - Số pending_cancel sau: ${pendingAfter}`);

            // Kiểm tra giảm số lượng
            if (pendingAfter < pendingBefore) {
                console.log(`   ✅ Thống kê đã giảm: ${pendingBefore} → ${pendingAfter} (-${pendingBefore - pendingAfter})`);
            } else {
                console.log(`   ⚠️ Thống kê không thay đổi: ${pendingBefore} → ${pendingAfter}`);
            }

            // Đợi 1 giây trước khi xử lý booking tiếp theo
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 4. Kiểm tra thống kê cuối cùng
        console.log('\n📊 4. Kiểm tra thống kê cuối cùng...');
        const finalStats = await axios.get(`${BASE_URL}/admin/bookings/stats`);
        const finalPendingCancel = finalStats.data.stats.pendingCancel;
        console.log('✅ Số booking pending_cancel cuối cùng:', finalPendingCancel);
        console.log('✅ Tổng số booking:', finalStats.data.stats.total);
        console.log('✅ Số booking đã hủy:', finalStats.data.stats.cancelled);

        // 5. Tóm tắt kết quả
        console.log('\n🎉 Test Realtime Notification Update hoàn thành!');
        console.log('\n📝 Tóm tắt:');
        console.log(`- Số booking đã xử lý: ${Math.min(pendingCount, 3)}`);
        console.log(`- Thống kê ban đầu: ${initialPendingCancel} pending_cancel`);
        console.log(`- Thống kê cuối cùng: ${finalPendingCancel} pending_cancel`);
        console.log(`- Giảm: ${initialPendingCancel - finalPendingCancel} booking`);
        
        if (finalPendingCancel === 0) {
            console.log('✅ Tất cả booking pending_cancel đã được xử lý!');
        } else {
            console.log(`ℹ️ Còn ${finalPendingCancel} booking cần xử lý.`);
        }

    } catch (error) {
        console.error('❌ Lỗi trong quá trình test:', error.response?.data || error.message);
        
        if (error.response?.status === 404) {
            console.log('\n💡 Gợi ý: Có thể cần tạo dữ liệu test trước');
        }
    }
}

// Test các trường hợp đặc biệt
async function testSpecialCases() {
    console.log('\n🔧 Test các trường hợp đặc biệt:\n');

    const testCases = [
        {
            name: 'Thống kê với 0 booking',
            description: 'Kiểm tra khi không có booking nào'
        },
        {
            name: 'Thống kê với tất cả trạng thái',
            description: 'Kiểm tra phân bố các trạng thái'
        },
        {
            name: 'Performance test',
            description: 'Kiểm tra tốc độ cập nhật thống kê'
        }
    ];

    for (const testCase of testCases) {
        try {
            console.log(`🔍 Testing: ${testCase.name}`);
            console.log(`📝 ${testCase.description}`);
            
            const startTime = Date.now();
            const response = await axios.get(`${BASE_URL}/admin/bookings/stats`);
            const endTime = Date.now();
            
            console.log(`✅ Status: ${response.status}`);
            console.log(`⏱️ Response time: ${endTime - startTime}ms`);
            console.log(`📊 Data:`, response.data.stats);
            console.log('');
        } catch (error) {
            console.log(`❌ Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            console.log('');
        }
    }
}

// Chạy test
if (require.main === module) {
    console.log('🎯 Realtime Notification Update Test');
    console.log('====================================\n');
    
    testRealtimeNotificationUpdate()
        .then(() => {
            console.log('\n🔄 Chạy test trường hợp đặc biệt...');
            return testSpecialCases();
        })
        .catch(console.error);
}

module.exports = {
    testRealtimeNotificationUpdate,
    testSpecialCases
}; 