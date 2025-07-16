# API Hủy Đặt Chỗ Tour

## Endpoint
```
PUT /api/bookingTour/cancel/:id
```

## Mô tả
API này cho phép người dùng hủy đặt chỗ tour của họ.

## Parameters

### Path Parameters
- `id` (string, required): ID của booking cần hủy

### Request Body
```json
{
  "userId": "string" // ID của user sở hữu booking
}
```

## Response

### Success Response (200)
```json
{
  "success": true,
  "message": "Hủy đặt chỗ thành công",
  "booking": {
    "_id": "booking_id",
    "payment_status": "cancelled",
    "cancelledAt": "2025-01-12T10:30:00.000Z",
    "refundInfo": {
      "amount": 8000000,
      "policy": "Hoàn tiền theo chính sách của công ty"
    }
  }
}
```

### Error Responses

#### 404 - Booking không tồn tại
```json
{
  "success": false,
  "message": "Không tìm thấy đặt chỗ cần hủy"
}
```

#### 403 - Không có quyền hủy
```json
{
  "success": false,
  "message": "Bạn không có quyền hủy đặt chỗ này"
}
```

#### 400 - Đã hủy trước đó
```json
{
  "success": false,
  "message": "Đặt chỗ đã được hủy trước đó"
}
```

#### 400 - Không thể hủy (quá gần ngày khởi hành)
```json
{
  "success": false,
  "message": "Không thể hủy đặt chỗ khi tour khởi hành trong vòng 3 ngày tới"
}
```

#### 500 - Lỗi server
```json
{
  "success": false,
  "message": "Lỗi server khi hủy đặt chỗ",
  "error": "error_message"
}
```

## Business Rules

1. **Quyền hủy**: Chỉ chủ đặt chỗ mới được hủy booking của mình
2. **Trạng thái**: Chỉ có thể hủy booking có trạng thái `pending` hoặc `completed`
3. **Thời gian**: Không thể hủy khi tour khởi hành trong vòng 3 ngày tới
4. **Hoàn ghế**: Số ghế sẽ được hoàn trả về slot sau khi hủy
5. **Hoàn tiền**: Nếu đã thanh toán, sẽ có thông tin hoàn tiền

## Ví dụ sử dụng

### JavaScript/Node.js
```javascript
const axios = require('axios');

const cancelBooking = async (bookingId, userId) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/bookingTour/cancel/${bookingId}`, {
      userId: userId
    });
    
    console.log('Hủy thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi hủy booking:', error.response?.data);
    throw error;
  }
};

// Sử dụng
cancelBooking('68720bbec7c577def7453e7b', '6859fadb05bb5fb50699bbeb');
```

### cURL
```bash
curl -X PUT \
  http://localhost:8080/api/bookingTour/cancel/68720bbec7c577def7453e7b \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "6859fadb05bb5fb50699bbeb"
  }'
```

### React/TypeScript
```typescript
import axios from 'axios';

const cancelBooking = async (bookingId: string, userId: string) => {
  try {
    const response = await axios.put(`/api/bookingTour/cancel/${bookingId}`, {
      userId: userId
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

## Test

Chạy file test để kiểm tra API:
```bash
cd HotelBooking_App/server_HotelBooking
node test_cancel_booking.js
```

## Lưu ý

- API này cần được bảo vệ bằng authentication middleware trong production
- Có thể thêm logic hoàn tiền tự động cho các đặt chỗ đã thanh toán
- Có thể thêm notification cho admin khi có đặt chỗ bị hủy
- Có thể thêm log để theo dõi lịch sử hủy đặt chỗ 