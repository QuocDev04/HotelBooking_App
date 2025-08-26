import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow">
      <button 
        className="text-xl md:hidden" 
        onClick={toggleSidebar}
      >
        ☰
      </button>
      <h1 className="text-lg font-semibold">Hệ thống quản lý khách sạn</h1>
      <button className="text-xl">🔔</button>
    </header>
  );
};

export default Header;
