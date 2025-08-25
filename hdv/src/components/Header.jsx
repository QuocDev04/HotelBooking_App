import React from "react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow">
      <button className="text-2xl md:hidden" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="flex-1 hidden mx-4 md:block">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-xl cursor-pointer">🔔</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="w-10 h-10 border rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
