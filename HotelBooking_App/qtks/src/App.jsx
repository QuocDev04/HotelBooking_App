import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TrangChu from "./pages/Trangchu";
import ThongBao from "./pages/Thongbao";
import HoSo from "./pages/Hoso";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<TrangChu />} />
            <Route path="/thongbao" element={<ThongBao />} />
            <Route path="/hoso" element={<HoSo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
