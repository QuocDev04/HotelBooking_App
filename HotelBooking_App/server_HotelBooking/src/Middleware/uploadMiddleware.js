const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '../../uploads/payment-confirmations');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Tạo tên file unique với timestamp và booking ID
        const bookingId = req.params.id;
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const filename = `payment-${bookingId}-${timestamp}${ext}`;
        cb(null, filename);
    }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
    // Chỉ cho phép file ảnh
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload file ảnh!'), false);
    }
};

// Cấu hình multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

// Middleware để xử lý upload single image
const uploadPaymentImage = upload.single('paymentImage');

// Middleware wrapper để xử lý lỗi
const handleUploadError = (req, res, next) => {
    uploadPaymentImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File quá lớn. Kích thước tối đa là 5MB.'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Lỗi upload file: ' + err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        // File upload là tùy chọn, không bắt buộc
        // Admin có thể xác nhận thanh toán mà không cần upload ảnh
        
        next();
    });
};

module.exports = {
    uploadPaymentImage: handleUploadError
};