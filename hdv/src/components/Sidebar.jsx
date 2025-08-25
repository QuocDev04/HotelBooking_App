import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menu = [
    { name: "Tour được giao", path: "/tour", icon: "📋" },
    { name: "Chăm sóc", path: "/chamsoc", icon: "💬" },
    { name: "Thông báo", path: "/thongbao", icon: "🔔" },
    { name: "Hồ sơ", path: "/hoso", icon: "👤" },
  ];

  return (
    <aside className="flex flex-col w-64 h-full text-white bg-gray-800 shadow-lg">
      <div className="flex flex-col items-center py-6 border-b border-gray-700">
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="w-16 h-16 border-2 border-gray-600 rounded-full"
        />
        <h2 className="mt-3 font-semibold">Nguyễn Thanh Tùng</h2>
        <p className="text-sm text-gray-400">Tư vấn viên</p>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    active ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        © 2025 Admin Panel
      </div>
    </aside>
  );
};

export default Sidebar;
