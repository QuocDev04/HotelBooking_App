import React, { useState } from "react";

const TrangChu = () => {
  // Sample room data
  const [rooms] = useState([
    { id: 101, status: 'available' },
    { id: 102, status: 'available' },
    { id: 103, status: 'available' },
    { id: 104, status: 'available' },
    { id: 105, status: 'available' },
    { id: 106, status: 'available' },
    { id: 107, status: 'available' },
    { id: 108, status: 'occupied' },
    { id: 109, status: 'cleaning' },
    { id: 110, status: 'available' },
    { id: 111, status: 'available' },
    { id: 112, status: 'available' },
    { id: 201, status: 'available' },
    { id: 202, status: 'available' },
    { id: 203, status: 'available' },
    { id: 204, status: 'available' },
    { id: 205, status: 'available' },
    { id: 206, status: 'available' },
    { id: 207, status: 'available' },
    { id: 208, status: 'occupied' },
    { id: 209, status: 'cleaning' },
    { id: 210, status: 'available' },
    { id: 211, status: 'available' },
    { id: 212, status: 'available' },
  ]);

  // Sample reservations data
  const reservations = [
    {
      name: "John Doe",
      room: "Room 105",
      checkIn: "9:00 AM",
      checkOut: "9:00 PM"
    },
    {
      name: "Jane Smith", 
      room: "Room 108",
      checkIn: "10:00 AM",
      checkOut: "11:00 PM"
    },
    {
      name: "Robert Johnson",
      room: "Room 110", 
      checkIn: "12:00 PM",
      checkOut: "11:00 AM"
    }
  ];

  // Sample service usage data
  const services = [
    { room: "Room 105", service: "Breakfast", cost: "$20" },
    { room: "Room 108", service: "Laundry", cost: "$15" },
    { room: "Room 110", service: "Spa", cost: "$50" }
  ];

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg';
      case 'occupied': return 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 shadow-lg';
      case 'cleaning': return 'bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-lg';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg';
    }
  };

  const availableCount = rooms.filter(room => room.status === 'available').length;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Room Status Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Room Status</h2>
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {availableCount} available
            </span>
          </div>
          
          {/* Room Grid */}
          <div className="grid grid-cols-6 gap-3 mb-8">
            {rooms.map((room) => (
              <button
                key={room.id}
                className={`w-14 h-14 rounded-xl text-white font-bold text-sm transform hover:scale-110 transition-all duration-200 ${getRoomStatusColor(room.status)}`}
              >
                {room.id}
              </button>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex space-x-8">
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3 shadow-md"></div>
              <span className="text-sm font-medium text-gray-700">Available</span>
            </div>
            <div className="flex items-center bg-red-50 px-4 py-2 rounded-lg">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full mr-3 shadow-md"></div>
              <span className="text-sm font-medium text-gray-700">Occupied</span>
            </div>
            <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-3 shadow-md"></div>
              <span className="text-sm font-medium text-gray-700">Cleaning</span>
            </div>
          </div>
        </div>

        {/* Reservations Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Reservations</h2>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Add reservation
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search reservations"
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 transition-all duration-200"
            />
          </div>
          
          {/* Reservations List */}
          <div className="space-y-4">
            {reservations.map((reservation, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-4 bg-blue-50 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
                <h3 className="font-bold text-gray-900 text-lg">{reservation.name}</h3>
                <p className="text-sm text-blue-600 font-medium">Room: {reservation.room}</p>
                <p className="text-sm text-gray-600">Check-in: {reservation.checkIn}</p>
                <p className="text-sm text-gray-600">Check-out: {reservation.checkOut}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Usage Card */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Service Usage</h2>
            <button className="text-indigo-400 hover:text-indigo-600 transform hover:scale-110 transition-all duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          
          {/* Service Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg">
                  <th className="text-left py-4 px-6 font-bold text-indigo-800">Room</th>
                  <th className="text-left py-4 px-6 font-bold text-indigo-800">Service</th>
                  <th className="text-left py-4 px-6 font-bold text-indigo-800">Cost</th>
                  <th className="text-right py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 transition-all duration-200">
                    <td className="py-4 px-6 text-gray-900 font-semibold">{service.room}</td>
                    <td className="py-4 px-6 text-indigo-600 font-medium">{service.service}</td>
                    <td className="py-4 px-6 text-gray-900 font-bold text-lg">{service.cost}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-indigo-400 hover:text-indigo-600 transform hover:scale-110 transition-all duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrangChu;
