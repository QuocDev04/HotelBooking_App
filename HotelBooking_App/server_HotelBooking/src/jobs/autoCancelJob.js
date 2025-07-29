const cron = require('node-cron');
const { autoCancel48hExpiredBookings, checkBookingsNearExpiry } = require('../controller/TourController/AutoCancelController');

// Chạy mỗi giờ để kiểm tra và hủy booking quá hạn
const startAutoCancelJob = () => {
    // Chạy mỗi giờ (0 phút của mỗi giờ)
    cron.schedule('0 * * * *', async () => {
        console.log('🔄 Bắt đầu kiểm tra booking quá hạn thanh toán tiền mặt...');
        
        try {
            // Tự động hủy booking quá hạn
            const result = await autoCancel48hExpiredBookings();
            
            if (result.success && result.cancelledCount > 0) {
                console.log(`✅ Đã tự động hủy ${result.cancelledCount} booking quá hạn`);
                
                // Log chi tiết các booking đã hủy
                result.cancelledBookings.forEach(booking => {
                    console.log(`   - Booking ${booking.bookingId}: ${booking.customerName} (${booking.email})`);
                });
            } else {
                console.log('ℹ️ Không có booking nào quá hạn cần hủy');
            }
            
        } catch (error) {
            console.error('❌ Lỗi trong quá trình tự động hủy booking:', error);
        }
    });
    
    // Chạy mỗi 6 giờ để kiểm tra booking sắp hết hạn (để gửi thông báo)
    cron.schedule('0 */6 * * *', async () => {
        console.log('🔔 Kiểm tra booking sắp hết hạn thanh toán...');
        
        try {
            const result = await checkBookingsNearExpiry();
            
            if (result.success && result.count > 0) {
                console.log(`⚠️ Có ${result.count} booking sắp hết hạn trong 6h tới:`);
                
                result.bookings.forEach(booking => {
                    console.log(`   - ${booking.customerName} (${booking.phone}): ${booking.tourName} - Còn ${booking.hoursRemaining}h`);
                });
                
                // Ở đây có thể thêm logic gửi email/SMS thông báo
                // await sendExpiryWarningNotifications(result.bookings);
            } else {
                console.log('ℹ️ Không có booking nào sắp hết hạn');
            }
            
        } catch (error) {
            console.error('❌ Lỗi khi kiểm tra booking sắp hết hạn:', error);
        }
    });
    
    console.log('🚀 Auto-cancel job đã được khởi động:');
    console.log('   - Kiểm tra hủy booking quá hạn: mỗi giờ');
    console.log('   - Kiểm tra booking sắp hết hạn: mỗi 6 giờ');
};

// Hàm dừng tất cả cron jobs (nếu cần)
const stopAutoCancelJob = () => {
    cron.getTasks().forEach(task => {
        task.stop();
    });
    console.log('🛑 Đã dừng tất cả auto-cancel jobs');
};

module.exports = {
    startAutoCancelJob,
    stopAutoCancelJob
};