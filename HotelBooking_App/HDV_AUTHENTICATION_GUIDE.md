# Hệ thống Authentication cho Hướng Dẫn Viên (HDV)

## 📋 Tổng quan

Hệ thống authentication cho HDV được thiết kế để chỉ cho phép các nhân viên được tạo trong hệ thống admin đăng nhập vào ứng dụng HDV.

## 🔧 Kiến trúc

### Backend (Node.js + Express + MongoDB)

#### 1. Model Employee (`/server_HotelBooking/src/models/People/EmployeeModel.js`)
```javascript
- email: String (unique, required)
- password_hash: String (required)
- firstName, lastName: String (required)
- full_name: String (auto-generated)
- employee_id: String (unique, auto-generated)
- position: enum ['tour_guide', 'customer_service', 'manager', 'other']
- department: enum ['tour', 'hotel', 'transport', 'general']
- status: enum ['active', 'inactive', 'suspended']
- hire_date, last_login: Date
- created_by: ObjectId (reference to Admin)
```

#### 2. Controller Employee (`/server_HotelBooking/src/controller/PeopleController/EmployeeController.js`)
**Employee Functions:**
- `loginEmployee`: Đăng nhập HDV
- `getEmployeeProfile`: Lấy thông tin profile
- `updateEmployeeProfile`: Cập nhật profile
- `changePassword`: Đổi mật khẩu

**Admin Functions:**
- `createEmployee`: Tạo tài khoản nhân viên
- `getAllEmployees`: Lấy danh sách nhân viên
- `updateEmployee`: Cập nhật thông tin nhân viên
- `deleteEmployee`: Xóa nhân viên
- `resetEmployeePassword`: Reset mật khẩu

#### 3. Authentication Middleware (`/server_HotelBooking/src/Middleware/Middleware.js`)
- `verifyEmployeeToken`: Xác thực JWT token cho nhân viên
- Kiểm tra token hợp lệ và trạng thái tài khoản

#### 4. Router (`/server_HotelBooking/src/router/PeopleRouter/EmployeeRouter.js`)
**Employee Routes:**
- `POST /api/employee/login`: Đăng nhập
- `GET /api/employee/profile`: Lấy profile (requires auth)
- `PUT /api/employee/profile`: Cập nhật profile (requires auth)
- `POST /api/employee/change-password`: Đổi mật khẩu (requires auth)

**Admin Routes:**
- `POST /api/employee/admin/create`: Tạo nhân viên (requires admin)
- `GET /api/employee/admin/list`: Danh sách nhân viên (requires admin)
- `PUT /api/employee/admin/:id`: Cập nhật nhân viên (requires admin)
- `DELETE /api/employee/admin/:id`: Xóa nhân viên (requires admin)
- `POST /api/employee/admin/:id/reset-password`: Reset mật khẩu (requires admin)

### Frontend HDV (React + Vite)

#### 1. Authentication Context (`/hdv/src/context/AuthContext.jsx`)
- Quản lý state đăng nhập
- Axios interceptors cho token
- Auto-logout khi token expired

#### 2. Login Component (`/hdv/src/components/Login.jsx`)
- Form đăng nhập với validation
- UI hiện đại với Tailwind CSS
- Hiển thị lỗi và loading state

#### 3. Protected Route (`/hdv/src/components/ProtectedRoute.jsx`)
- Bảo vệ các trang yêu cầu authentication
- Redirect về login nếu chưa đăng nhập

#### 4. Header với User Info (`/hdv/src/components/Header.jsx`)
- Hiển thị thông tin user
- Dropdown menu với logout
- User avatar với initials

#### 5. App với Authentication (`/hdv/src/App.jsx`)
- Wrap toàn bộ app với AuthProvider
- ProtectedRoute bảo vệ MainApp

### Frontend Admin (React + TypeScript)

#### 1. HDV Management (`/admin/src/pages/Account/HdvAccounts.tsx`)
- Quản lý danh sách nhân viên HDV
- Tạo tài khoản mới
- Cập nhật trạng thái (active/inactive/suspended)
- Reset mật khẩu
- Xóa nhân viên
- Tìm kiếm và lọc

#### 2. Navigation Update
- Thay thế menu "Tài khoản Nhân viên" bằng "Tài khoản HDV" trong sidebar admin
- Route `/admin/hdv-accounts` 
- Loại bỏ `/admin/employee-accounts` để tránh confusion

## 🚀 Cách sử dụng

### 1. Tạo tài khoản HDV (Admin)
1. Đăng nhập vào admin panel
2. Vào "Quản lý Tài Khoản" > "Tài khoản HDV"
3. Click "Tạo tài khoản HDV"
4. Điền thông tin và click "Tạo tài khoản"

### 2. Phân công HDV cho Tour (Admin)
1. Vào "Quản lý Tài Khoản" > "Phân công HDV"
2. Hệ thống hiển thị các tour diễn ra trong 7 ngày tới
3. Chọn HDV từ dropdown cho từng tour
4. Click "Lưu" để phân công

### 3. Đăng nhập HDV
1. Mở ứng dụng HDV
2. Nhập email và mật khẩu được admin cấp
3. Click "Đăng nhập"
4. Xem tour được phân công trong "Tour được giao"

### 4. Quản lý HDV (Admin)
- **Xem danh sách**: Tất cả HDV với thông tin chi tiết
- **Thay đổi trạng thái**: Active/Inactive/Suspended
- **Reset mật khẩu**: Tạo mật khẩu mới cho HDV
- **Xóa tài khoản**: Xóa vĩnh viễn (cẩn thận!)
- **Phân công tour**: Assign tour cho HDV cụ thể

## 🔒 Bảo mật

### 1. Authentication Flow
```
Admin creates employee → Employee can login → JWT token issued → Token validates all requests
```

### 2. Password Security
- Passwords hashed với bcrypt (12 rounds)
- Minimum 6 characters required
- No password stored in plain text

### 3. Authorization Levels
- **Admin**: Full CRUD on employee accounts
- **Employee**: Can only view/update own profile
- **Public**: No access to HDV app

### 4. Token Management
- 24-hour expiration
- Auto-refresh on valid requests
- Auto-logout on token expiry

## 📊 Database Schema

### Employee Collection
```javascript
{
  _id: ObjectId,
  email: "hdv@company.com",
  password_hash: "$2b$12$...",
  firstName: "Nguyen",
  lastName: "Van A",
  full_name: "Van A Nguyen",
  employee_id: "EMP502025001",
  position: "tour_guide",
  department: "tour",
  status: "active",
  hire_date: ISODate("2025-01-20"),
  last_login: ISODate("2025-01-20T10:30:00Z"),
  created_by: ObjectId("admin_id"),
  createdAt: ISODate("2025-01-20"),
  updatedAt: ISODate("2025-01-20")
}
```

## 🧪 Testing

### API Testing
```bash
# Test login
curl -X POST http://localhost:8080/api/employee/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hdv@company.com","password":"123456"}'

# Test protected route
curl -X GET http://localhost:8080/api/employee/profile \
  -H "Authorization: Bearer <token>"
```

### Frontend Testing
1. Start backend: `cd server_HotelBooking && npm start`
2. Start HDV frontend: `cd hdv && npm run dev`
3. Start Admin frontend: `cd admin && npm run dev`

## 🐛 Troubleshooting

### Common Issues

1. **"Email không tồn tại"**
   - Kiểm tra admin đã tạo tài khoản HDV chưa
   - Đảm bảo email chính xác

2. **"Tài khoản đã bị vô hiệu hóa"**
   - Admin cần đổi status về "active"

3. **"Token đã hết hạn"**
   - Đăng nhập lại
   - Kiểm tra server time

4. **CORS errors**
   - Đảm bảo server chạy trên port 8080
   - Kiểm tra CORS configuration

## 🔮 Future Enhancements

1. **Password Reset via Email**
2. **Role-based Permissions**
3. **Activity Logging**
4. **2FA Authentication**
5. **Session Management**
6. **Employee Performance Tracking**

## 📝 Notes

- Server backend: `http://localhost:8080`
- HDV frontend: `http://localhost:5173`
- Admin frontend: `http://localhost:5174`
- JWT Secret: Configured in environment variables
- Database: MongoDB connection string in `.env`

---

*Hệ thống được thiết kế với tính bảo mật cao và user experience tốt. Mọi thay đổi nên được test kỹ trước khi deploy production.*
