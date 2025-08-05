import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface Tour {
  _id: string;
  nameTour: string;
  destination: {
    _id: string;
    name: string;
  };
  departure_location: string;
  duration: string;
  price: number;
  finalPrice: number;
  tourType: string;
  status: boolean;
  assignedEmployee?: Admin;
}

interface Admin {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  phone_number?: string;
}

interface DateSlot {
  _id: string;
  tour: string;
  dateTour: Date;
  availableSeats: number;
  bookedSeats: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  totalRevenue: number;
}

const EmployeeAssignment: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTourType, setSelectedTourType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [assignments, setAssignments] = useState<{[tourId: string]: string}>({});
  const { getToken } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Fetch tours
      const toursResponse = await fetch('http://localhost:8080/api/tour', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Fetch admins
      const adminsResponse = await fetch('http://localhost:8080/api/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Fetch date slots
      const dateSlotsResponse = await fetch('http://localhost:8080/api/dateslots', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!toursResponse.ok || !adminsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const toursData = await toursResponse.json();
      const adminsData = await adminsResponse.json();
      
      setTours(toursData.tours || toursData.tour || []);
      setAdmins(adminsData.admins || []);
      
      if (dateSlotsResponse.ok) {
        const dateSlotsData = await dateSlotsResponse.json();
        setDateSlots(dateSlotsData.dateSlots || dateSlotsData.data || []);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = (tourId: string, adminId: string) => {
    setAssignments(prev => ({
      ...prev,
      [tourId]: adminId
    }));
  };

  const saveAssignment = async (tourId: string) => {
    try {
      const adminId = assignments[tourId];
      if (!adminId) return;
      
      const token = await getToken();
      
      // Giả lập API call để lưu phân công
      // Trong thực tế, bạn cần tạo API endpoint để lưu thông tin phân công
      console.log(`Assigning tour ${tourId} to admin ${adminId}`);
      
      // Cập nhật local state
      setTours(prev => prev.map(tour => 
        tour._id === tourId 
          ? { ...tour, assignedEmployee: admins.find(admin => admin._id === adminId) }
          : tour
      ));
      
      // Xóa assignment tạm thời
      setAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[tourId];
        return newAssignments;
      });
      
      alert('Phân công thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi phân công!');
    }
  };

  const getUpcomingToursForTour = (tourId: string) => {
    return dateSlots.filter(slot => 
      slot.tour === tourId && 
      slot.status === 'upcoming'
    ).length;
  };

  const getOngoingToursForTour = (tourId: string) => {
    return dateSlots.filter(slot => 
      slot.tour === tourId && 
      slot.status === 'ongoing'
    ).length;
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.nameTour.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.departure_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTourType === 'all' || tour.tourType === selectedTourType;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && tour.status) ||
                         (selectedStatus === 'inactive' && !tour.status);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const tourTypes = [...new Set(tours.map(tour => tour.tourType))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Lỗi: {error}</p>
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Phân công Nhân viên cho Tour</h1>
        <p className="text-gray-600">Quản lý và phân công nhân viên phụ trách các tour du lịch</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <select
          value={selectedTourType}
          onChange={(e) => setSelectedTourType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả loại tour</option>
          {tourTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Tổng số tour</h3>
          <p className="text-2xl font-bold text-blue-600">{tours.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Tour đã phân công</h3>
          <p className="text-2xl font-bold text-green-600">
            {tours.filter(tour => tour.assignedEmployee).length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800">Tour chưa phân công</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {tours.filter(tour => !tour.assignedEmployee).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">Nhân viên có sẵn</h3>
          <p className="text-2xl font-bold text-purple-600">{admins.length}</p>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại & Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lịch trình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên phụ trách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTours.map((tour) => (
                <tr key={tour._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tour.nameTour}</div>
                      <div className="text-sm text-gray-500">
                        📍 {tour.departure_location} → {tour.destination?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">⏱️ {tour.duration}</div>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tour.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tour.status ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{tour.tourType}</div>
                      <div className="text-green-600 font-semibold">
                        {tour.finalPrice?.toLocaleString() || tour.price?.toLocaleString()} VNĐ
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-blue-600 font-semibold">{getUpcomingToursForTour(tour._id)}</div>
                          <div className="text-xs text-gray-500">Sắp diễn ra</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-semibold">{getOngoingToursForTour(tour._id)}</div>
                          <div className="text-xs text-gray-500">Đang diễn ra</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {tour.assignedEmployee ? (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {tour.assignedEmployee.firstName?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {tour.assignedEmployee.full_name || 
                             `${tour.assignedEmployee.firstName || ''} ${tour.assignedEmployee.lastName || ''}`.trim() || 
                             'Chưa cập nhật'}
                          </div>
                          <div className="text-sm text-gray-500">{tour.assignedEmployee.email}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <select
                        value={assignments[tour._id] || ''}
                        onChange={(e) => handleAssignment(tour._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn nhân viên</option>
                        {admins.map(admin => (
                          <option key={admin._id} value={admin._id}>
                            {admin.full_name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email}
                          </option>
                        ))}
                      </select>
                      {assignments[tour._id] && (
                        <button
                          onClick={() => saveAssignment(tour._id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Lưu
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy tour</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Không có tour nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có tour nào trong hệ thống.'}
            </p>
          </div>
        )}
      </div>

      {/* Assignment Guide */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Hướng dẫn phân công</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Chọn nhân viên từ dropdown và nhấn "Lưu" để phân công</p>
              <p>• Mỗi tour có thể được phân công cho một nhân viên</p>
              <p>• Nhân viên được phân công sẽ chịu trách nhiệm quản lý tour đó</p>
              <p>• Có thể thay đổi phân công bất cứ lúc nào</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAssignment;