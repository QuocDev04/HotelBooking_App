import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg">
      {/* Logo H */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 shadow-md transform hover:scale-110 transition-transform duration-200">
          <span className="text-blue-600 font-bold text-xl">H</span>
        </div>
        <h1 className="text-2xl font-bold text-white drop-shadow-md">Reception</h1>
      </div>
      
      {/* Logout Button */}
      <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 hover:shadow-lg">
        Logout
      </button>
    </header>
  );
};

export default Header;
