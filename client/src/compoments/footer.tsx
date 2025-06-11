// src/components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className=" bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-2 object-contain" />
          <p>Công ty TNHH Du lịch và Dịch Vụ Elite Travel</p>
          <p className="mt-2 text-sm break-words leading-snug">
            Tầng 7, số nhà 25, ngõ 38 phố Yên Lãng, phường Láng Hạ, quận Đống Đa, TP. Hà Nội
          </p>
          <p className="mt-2 text-sm break-words leading-snug">
            Mã số doanh nghiệp: 0107367372 do Sở kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 05/06/2023
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">GIỚI THIỆU</h4>
          <ul className="mt-2 text-sm break-words leading-snug">
            <li>Về chúng tôi</li>
            <li className="break-words leading-normal">Điều khoản và điều kiện</li>

            <li>Chính sách riêng tư</li>
            <li>Hướng dẫn sử dụng</li>
            <li>Hình thức thanh toán</li>
            <li>Liên hệ</li>
            <li>Hotline: 0392595555</li>
            <li>Email: info@elitetravel.com</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">ĐIỂM ĐẾN</h4>
          <ul className="mt-2 text-sm break-words leading-snug">
            <li>Vịnh Hạ Long</li>
            <li>Vịnh Lan Hạ</li>
            <li>Đảo Cát Bà</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">DU THUYỀN</h4>
          <ul className="mt-2 text-sm break-words leading-snug">
            <li>Blog</li>
            <li>Quy định chung và lưu ý</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
