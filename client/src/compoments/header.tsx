import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-md">
      <div className="flex items-center space-x-4">
        <img src="./logo.png" alt="Logo" className="w-10 h-10" />
        <span className="text-xl font-bold">Elite Travel</span>
      </div>
      <nav className="justify-center flex-1 hidden space-x-6 font-medium md:flex">
        <Link to="/cruise">Tìm du thuyền</Link>
        <Link to="/flight-booking">Tìm vé máy bay</Link>
        <Link to="/hotels">Tìm khách sạn</Link>
        <Link to="/business">Doanh nghiệp</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="flex items-center space-x-4 text-sm">
        <span>Hotline: 0392595555</span>
        <button className="px-4 py-2 text-sm text-white bg-teal-500 rounded-full hover:bg-teal-600">
          Liên hệ Elite Travel
        </button>
      </div>
    </header>
  );
};

export default Header;