# Workflow Admin Xác Nhận Hủy Đặt Chỗ

## Tổng quan

Hệ thống hủy đặt chỗ đã được cập nhật để yêu cầu admin xác nhận trước khi thực sự hủy đặt chỗ. Điều này giúp kiểm soát tốt hơn và tránh việc hủy không hợp lý.

## Workflow

### 1. User Yêu Cầu Hủy
- User gửi yêu cầu hủy đặt chỗ
- Trạng thái chuyển từ `pending/completed` → `pending_cancel`
- Lưu lý do hủy và thời gian yêu cầu

### 2. Admin Xem Danh Sách
- Admin xem danh sách booking với filter theo trạng thái
- Đặc biệt chú ý các booking có trạng thái `pending_cancel`
- Có thể search theo tên khách hàng hoặc email

### 3. Admin Xác Nhận Hủy
- Admin xem chi tiết booking cần hủy
- Xác nhận hủy với lý do (tùy chọn)
- Trạng thái chuyển từ `pending_cancel` → `cancelled`
- Hoàn trả số ghế về slot

## API Endpoints

### User Endpoints

#### 1. Yêu cầu hủy đặt chỗ
```
PUT /api/bookingTour/request-cancel/:id
```

**Request Body:**
```json
{
  "userId": "string",
  "reason": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Yêu cầu hủy đặt chỗ đã được gửi và đang chờ admin xác nhận",
  "booking": {
    "_id": "booking_id",
    "payment_status": "pending_cancel",
    "cancelRequestedAt": "2025-01-12T10:30:00.000Z",
    "cancelReason": "Lý do hủy"
  }
}
```

### Admin Endpoints

#### 1. Lấy danh sách booking
```
GET /api/admin/bookings
```

**Query Parameters:**
- `status`: Filter theo trạng thái (all, pending, completed, pending_cancel, cancelled)
- `search`: Tìm kiếm theo tên khách hàng hoặc email
- `page`: Số trang (default: 1)
- `limit`: Số lượng item mỗi trang (default: 10)

**Response:**
```json
{
  "success": true,
  "bookings": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### 2. Admin xác nhận hủy
```
PUT /api/admin/bookings/cancel/:id
```

**Request Body:**
```json
{
  "adminId": "string",
  "reason": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin đã xác nhận hủy đặt chỗ thành công",
  "booking": {
    "_id": "booking_id",
    "payment_status": "cancelled",
    "cancelledAt": "2025-01-12T10:30:00.000Z",
    "cancelledBy": "admin_id",
    "cancelReason": "Lý do xác nhận hủy",
    "refundInfo": {
      "amount": 8000000,
      "policy": "Hoàn tiền theo chính sách của công ty"
    }
  }
}
```

## Trạng Thái Mới

### `pending_cancel`
- Đặt chỗ đã được user yêu cầu hủy
- Đang chờ admin xác nhận
- Hiển thị màu cam trong UI

### `cancelled`
- Đặt chỗ đã được admin xác nhận hủy
- Số ghế đã được hoàn trả về slot
- Hiển thị màu đỏ trong UI

## Business Rules

### User Rules
1. Chỉ có thể yêu cầu hủy booking của chính mình
2. Không thể yêu cầu hủy khi tour khởi hành trong vòng 3 ngày
3. Không thể yêu cầu hủy booking đã bị hủy
4. Không thể yêu cầu hủy khi đã có yêu cầu đang chờ xử lý

### Admin Rules
1. Có thể xem tất cả booking
2. Có thể xác nhận hủy bất kỳ booking nào
3. Phải cung cấp adminId khi xác nhận hủy
4. Có thể thêm lý do xác nhận hủy

## Database Schema Updates

### TourBooking Model
```javascript
{
  // ... existing fields
  payment_status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'pending_cancel'],
    default: 'pending',
  },
  cancelledAt: { type: Date },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  cancelReason: { type: String },
  cancelRequestedAt: { type: Date },
}
```

## Frontend Updates

### User Interface
- Thay đổi nút "Hủy" thành "Yêu cầu hủy"
- Thêm form nhập lý do hủy
- Hiển thị trạng thái `pending_cancel` với màu cam
- Thông báo yêu cầu đã được gửi

### Admin Interface
- Trang quản lý booking với filter và search
- Modal xác nhận hủy với thông tin chi tiết
- Hiển thị lý do yêu cầu hủy từ user
- Form nhập lý do xác nhận hủy

## Testing

### Chạy test workflow
```bash
cd HotelBooking_App/server_HotelBooking
node test_admin_cancel_workflow.js
```

### Test cases
1. User yêu cầu hủy thành công
2. Admin xem danh sách booking
3. Admin xác nhận hủy thành công
4. Kiểm tra trạng thái sau khi hủy
5. Test các trường hợp lỗi

## Lưu ý

- Cần thêm authentication middleware cho admin routes
- Có thể thêm notification system để thông báo cho user khi admin xác nhận hủy
- Có thể thêm email notification cho user
- Có thể thêm log để theo dõi lịch sử thay đổi trạng thái
- Có thể thêm policy về thời gian cho phép yêu cầu hủy 