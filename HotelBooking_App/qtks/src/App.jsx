import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TrangChu from "./pages/Trangchu";
import ThongBao from "./pages/Thongbao";
import HoSo from "./pages/Hoso";


const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Nội dung chính */}
        <div className="flex flex-col flex-1">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<TrangChu />} />
              <Route path="/thongbao" element={<ThongBao />} />
              <Route path="/hoso" element={<HoSo />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
