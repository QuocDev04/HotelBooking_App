# 🎯 Admin Frontend - Hướng dẫn sử dụng

## 📋 Tổng quan

Admin frontend cung cấp giao diện quản lý đặt chỗ tour du lịch với các tính năng:
- Dashboard với thống kê booking
- Quản lý danh sách đặt chỗ
- Xác nhận hủy đặt chỗ
- Thông báo real-time

## 🚀 Cách chạy

### 1. Khởi động server backend
```bash
cd HotelBooking_App/server_HotelBooking
npm install
npm start
```

### 2. Khởi động admin frontend
```bash
cd HotelBooking_App/admin
npm install
npm run dev
```

### 3. Truy cập admin panel
```
http://localhost:5173/admin
```

## 📊 Dashboard Features

### Thống kê Booking
- **Tổng đặt chỗ**: Số lượng booking tất cả
- **Chờ thanh toán**: Booking có trạng thái `pending`
- **Đã thanh toán**: Booking có trạng thái `completed`
- **Đã hủy**: Booking có trạng thái `cancelled`
- **Chờ xác nhận hủy**: Booking có trạng thái `pending_cancel`

### Biểu đồ tỷ lệ
- **Tỷ lệ hoàn thành**: % booking đã thanh toán
- **Tỷ lệ hủy**: % booking đã hủy
- **Cảnh báo**: Hiển thị khi có booking cần xử lý

## 📋 Quản lý Booking

### Truy cập
1. Vào menu **"Quản lý đặt chỗ"** trong sidebar
2. Chọn **"Danh sách đặt chỗ"**

### Tính năng chính

#### 1. Lọc và tìm kiếm
- **Tìm kiếm**: Theo tên khách hàng hoặc email
- **Lọc trạng thái**: 
  - Tất cả
  - Chờ thanh toán
  - Đã thanh toán
  - Chờ xác nhận hủy
  - Đã hủy

#### 2. Thông tin hiển thị
- **Khách hàng**: Tên, email, số điện thoại
- **Tour**: Tên tour, điểm khởi hành
- **Ngày khởi hành**: Định dạng dd/mm/yyyy
- **Số hành khách**: Tổng số người đặt
- **Tổng tiền**: Định dạng VND
- **Trạng thái**: Badge màu sắc tương ứng

#### 3. Thao tác
- **Chi tiết**: Xem thông tin chi tiết booking
- **Xác nhận hủy**: Chỉ hiển thị với booking `pending_cancel`

### Xác nhận hủy booking

#### Quy trình
1. User yêu cầu hủy → Trạng thái chuyển thành `pending_cancel`
2. Admin xem danh sách booking cần xử lý
3. Admin click "Xác nhận hủy"
4. Modal hiển thị thông tin booking
5. Admin nhập lý do (tùy chọn)
6. Xác nhận → Trạng thái chuyển thành `cancelled`

#### Modal xác nhận
- **Thông tin booking**: Tour, khách hàng, ngày khởi hành, tổng tiền
- **Lý do hủy**: Lý do user đã nhập
- **Lý do xác nhận**: Admin có thể nhập thêm
- **Cảnh báo**: Thông tin về hoàn trả ghế và chính sách

## 🔔 Thông báo Real-time

### Navbar Notification
- **Hiển thị**: Khi có booking `pending_cancel`
- **Số lượng**: Badge đỏ hiển thị số booking cần xử lý
- **Click**: Chuyển đến trang quản lý booking
- **Auto-refresh**: Cập nhật mỗi 30 giây
- **Real-time update**: Tự động giảm số lượng khi xác nhận hủy

### Cập nhật thông báo
- **Tức thì**: Thông báo giảm ngay khi xác nhận hủy thành công
- **Toast notification**: Hiển thị thông báo thành công với animation
- **Query invalidation**: Tự động cập nhật cả booking list và stats
- **Optimistic update**: Cập nhật UI trước khi server response

### Dashboard Alert
- **Cảnh báo**: Card màu cam khi có booking cần xử lý
- **Thông tin**: Số lượng booking pending_cancel
- **Icon**: ⚠️ cảnh báo

## 🛠️ API Endpoints

### Thống kê
```
GET /api/admin/bookings/stats
Response: {
  success: true,
  stats: {
    total: number,
    pending: number,
    completed: number,
    cancelled: number,
    pendingCancel: number
  }
}
```

### Danh sách booking
```
GET /api/admin/bookings?status=all&page=1&limit=10&search=keyword
Response: {
  success: true,
  bookings: [...],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

### Xác nhận hủy
```
PUT /api/admin/bookings/cancel/:id
Body: {
  adminId: string,
  reason: string (optional)
}
Response: {
  success: true,
  message: string,
  booking: {
    _id: string,
    payment_status: string,
    cancelledAt: Date,
    cancelledBy: string,
    cancelReason: string
  }
}
```

## 🎨 UI Components

### BookingStats
- **Location**: `src/pages/dashboad/BookingStats.tsx`
- **Features**: Thống kê, biểu đồ, cảnh báo
- **Dependencies**: Ant Design, React Query

### ListBooking
- **Location**: `src/pages/Tour/ListBooking.tsx`
- **Features**: Danh sách, filter, search, pagination, modal
- **Dependencies**: Ant Design, React Query

### Navbar
- **Location**: `src/components/Navbar.tsx`
- **Features**: Thông báo real-time, user menu
- **Dependencies**: Clerk, React Query

## 🔧 Configuration

### Axios Instance
```typescript
// src/configs/axios.tsx
const instanceAdmin = axios.create({
    baseURL: 'http://localhost:8080/api/'
});
```

### React Query
```typescript
// Tự động refetch mỗi 30 giây
refetchInterval: 30000
```

### Router
```typescript
// src/router/index.tsx
<Route path="/admin/list-booking" element={<ListBooking />} />
```

## 🧪 Testing

### Chạy test script
```bash
cd HotelBooking_App/server_HotelBooking
node test_admin_frontend_workflow.js
node test_realtime_notification.js
```

### Test cases
1. ✅ API thống kê booking
2. ✅ API lấy danh sách booking
3. ✅ API filter theo trạng thái
4. ✅ API xác nhận hủy booking
5. ✅ UI components rendering
6. ✅ Real-time notifications
7. ✅ Toast notifications
8. ✅ Real-time notification update

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- **Mobile-first**: Tối ưu cho mobile
- **Flexible layout**: Grid system responsive
- **Touch-friendly**: Buttons và interactions
- **Readable**: Font size và spacing phù hợp

## 🚨 Troubleshooting

### Lỗi thường gặp

#### 1. API không kết nối
```
Error: Network Error
Solution: Kiểm tra server backend đã chạy chưa
```

#### 2. CORS Error
```
Error: CORS policy
Solution: Kiểm tra CORS config trong backend
```

#### 3. React Query Error
```
Error: Query failed
Solution: Kiểm tra API endpoint và response format
```

#### 4. Component không render
```
Error: Component not found
Solution: Kiểm tra import và route configuration
```

### Debug Tips
1. **Browser DevTools**: Kiểm tra Network tab
2. **React DevTools**: Kiểm tra component state
3. **Console logs**: Xem error messages
4. **API testing**: Sử dụng Postman hoặc curl

## 📈 Performance

### Optimization
- **Lazy loading**: Components load khi cần
- **Pagination**: Giới hạn số lượng data
- **Caching**: React Query cache
- **Debounce**: Search input optimization

### Monitoring
- **Bundle size**: Kiểm tra build size
- **Load time**: Measure component render time
- **API calls**: Monitor network requests
- **Memory usage**: Check for memory leaks

## 🔄 Updates & Maintenance

### Regular tasks
1. **Update dependencies**: npm audit và update
2. **Code review**: Kiểm tra code quality
3. **Performance audit**: Monitor metrics
4. **Security check**: Review security practices

### Version control
- **Feature branches**: Tạo branch cho mỗi feature
- **Code review**: Require review trước merge
- **Testing**: Run tests trước deploy
- **Documentation**: Update docs khi có thay đổi

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng:
1. Kiểm tra documentation này
2. Xem troubleshooting section
3. Chạy test scripts
4. Liên hệ development team

**Happy Admin-ing! 🎉** 