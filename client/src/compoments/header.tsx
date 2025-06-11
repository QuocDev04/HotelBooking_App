import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
   <header className="flex justify-center">
  <div className="w-full max-w-7xl flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 shadow-md bg-white">
    <div className="flex items-center space-x-4">
      <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      <span className="text-xl font-bold">Elite Travel</span>
    </div>
    <nav className="hidden md:flex flex-1 justify-center space-x-6 font-medium">
      <Link to="/cruise">Tìm du thuyền</Link>
      <Link to="/flight-booking">Tìm vé máy bay</Link>
      <Link to="/hotels">Tìm khách sạn</Link>
      <Link to="/business">Doanh nghiệp</Link>
      <Link to="/blog">Blog</Link>
    </nav>
    <div className="flex items-center space-x-4 text-sm">
      <span>Hotline: 0392595555</span>
      <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full text-sm">
        Liên hệ Elite Travel
      </button>
    </div>
  </div>
</header>

  );
};

export default Header;