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
  assignedEmployee?: Employee;
}

interface Employee {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  full_name: string;
  phone_number?: string;
  employee_id: string;
  position: 'tour_guide' | 'customer_service' | 'manager' | 'other';
  department: 'tour' | 'hotel' | 'transport' | 'general';
  status: 'active' | 'inactive' | 'suspended';
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
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      
      // Fetch tours with populated assignedEmployee
      const toursResponse = await fetch('http://localhost:8080/api/tour', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Fetch employees (HDV)
      const employeesResponse = await fetch('http://localhost:8080/api/employee/admin/list', {
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

      if (!toursResponse.ok || !employeesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const toursData = await toursResponse.json();
      const employeesData = await employeesResponse.json();
      
      console.log("Tours data:", toursData);
      setTours(toursData.tours || toursData.tour || []);
      // Filter only active employees for assignment
      const activeEmployees = (employeesData.employees || []).filter((emp: Employee) => emp.status === 'active');
      setEmployees(activeEmployees);
      
      if (dateSlotsResponse.ok) {
        const dateSlotsData = await dateSlotsResponse.json();
        console.log("DateSlots data:", dateSlotsData);
        setDateSlots(dateSlotsData.dateSlots || dateSlotsData.data || []);
      } else {
        console.warn("DateSlots API failed:", dateSlotsResponse.status);
        // Tạm thời set empty array để tránh lỗi
        setDateSlots([]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = (tourId: string, employeeId: string) => {
    setAssignments(prev => ({
      ...prev,
      [tourId]: employeeId
    }));
  };

  const saveAssignment = async (tourId: string) => {
    try {
      const employeeId = assignments[tourId];
      if (!employeeId) return;
      
      const token = await getToken();
      
      // Gọi API để lưu phân công
      const response = await fetch(`http://localhost:8080/api/tour/${tourId}/assign-employee`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign employee');
      }
      
      const result = await response.json();
      
      // Cập nhật local state với dữ liệu từ server
      setTours(prev => prev.map(tour => 
        tour._id === tourId 
          ? { ...tour, assignedEmployee: employees.find(emp => emp._id === employeeId) }
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
      console.error('Error assigning employee:', err);
      alert('Có lỗi xảy ra khi phân công!');
    }
  };

  const getUpcomingToursForTour = (tourId: string) => {
    return dateSlots.filter(slot => {
      const slotTourId = typeof slot.tour === 'string' ? slot.tour : slot.tour?._id;
      return slotTourId === tourId && slot.status === 'upcoming';
    }).length;
  };

  const getOngoingToursForTour = (tourId: string) => {
    return dateSlots.filter(slot => {
      const slotTourId = typeof slot.tour === 'string' ? slot.tour : slot.tour?._id;
      return slotTourId === tourId && slot.status === 'ongoing';
    }).length;
  };

  // Kiểm tra tour có date slots trong 7 ngày tới không
  const hasUpcomingDatesIn7Days = (tourId: string) => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    
    console.log(`Checking tour ${tourId} for dates between ${now.toISOString()} and ${sevenDaysLater.toISOString()}`);
    
    const relevantSlots = dateSlots.filter(slot => {
      // Kiểm tra tour ID (có thể là string hoặc object)
      const slotTourId = typeof slot.tour === 'string' ? slot.tour : slot.tour?._id;
      if (slotTourId !== tourId) return false;
      
      const slotDate = new Date(slot.dateTour);
      const isInRange = slotDate >= now && slotDate <= sevenDaysLater;
      const isUpcoming = slot.status === 'upcoming';
      
      console.log(`  Slot ${slot._id}: date=${slotDate.toISOString()}, status=${slot.status}, inRange=${isInRange}, isUpcoming=${isUpcoming}`);
      
      return isInRange && isUpcoming;
    });
    
    console.log(`  Found ${relevantSlots.length} relevant slots for tour ${tourId}`);
    return relevantSlots.length > 0;
  };

  const filteredTours = tours.filter(tour => {
    // Chỉ hiển thị tour có lịch trình trong 7 ngày tới
    const hasUpcomingDates = hasUpcomingDatesIn7Days(tour._id);
    if (!hasUpcomingDates) return false;

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Phân công HDV cho Tour</h1>
        <p className="text-gray-600">Quản lý và phân công hướng dẫn viên cho các tour diễn ra trong 7 ngày tới</p>
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
          <h3 className="text-lg font-semibold text-blue-800">Tour 7 ngày tới</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredTours.length}</p>
          <p className="text-xs text-blue-600 mt-1">Cần phân công HDV</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Đã phân công</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredTours.filter(tour => tour.assignedEmployee).length}
          </p>
          <p className="text-xs text-green-600 mt-1">Trong 7 ngày tới</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800">Chưa phân công</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredTours.filter(tour => !tour.assignedEmployee).length}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Cần HDV</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">HDV có sẵn</h3>
          <p className="text-2xl font-bold text-purple-600">{employees.length}</p>
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
                  Thời gian diễn ra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HDV phụ trách
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
                      {/* Hiển thị thông tin thời gian tour gần nhất trong 7 ngày tới */}
                      {(() => {
                        const now = new Date();
                        const sevenDaysLater = new Date();
                        sevenDaysLater.setDate(now.getDate() + 7);
                        
                        const upcomingSlot = dateSlots
                          .filter(slot => {
                            const slotTourId = typeof slot.tour === 'string' ? slot.tour : slot.tour?._id;
                            if (slotTourId !== tour._id) return false;
                            const slotDate = new Date(slot.dateTour);
                            return slotDate >= now && slotDate <= sevenDaysLater && slot.status === 'upcoming';
                          })
                          .sort((a, b) => new Date(a.dateTour).getTime() - new Date(b.dateTour).getTime())[0];
                        
                        if (upcomingSlot) {
                          const departureTime = tour.departure_time || "06:00";
                          const returnTime = tour.return_time || "18:00";
                          const tourDate = new Date(upcomingSlot.dateTour);
                          
                          return (
                            <div className="space-y-1">
                              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                🚀 Bắt đầu: {tourDate.toLocaleDateString('vi-VN')} - {departureTime}
                              </div>
                              <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                🏁 Kết thúc: {tour.duration === "1 ngày" ? 
                                  tourDate.toLocaleDateString('vi-VN') : 
                                  "Tính theo duration"} - {returnTime}
                              </div>
                              <div className="text-xs text-gray-500">
                                ⏱️ Thời lượng: {tour.duration}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="text-xs text-gray-500 italic">
                              Không có lịch trình trong 7 ngày tới
                            </div>
                          );
                        }
                      })()}
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
                        <option value="">Chọn HDV</option>
                        {employees.map(employee => (
                          <option key={employee._id} value={employee._id}>
                            {employee.full_name} - {employee.position === 'tour_guide' ? 'HDV' : employee.position} ({employee.employee_id})
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tour trong 7 ngày tới</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Không có tour nào phù hợp với từ khóa tìm kiếm trong 7 ngày tới.' : 'Không có tour nào diễn ra trong 7 ngày tới.'}
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
              <p>• Chọn HDV từ dropdown và nhấn "Lưu" để phân công</p>
              <p>• Mỗi tour có thể được phân công cho một HDV</p>
              <p>• HDV được phân công sẽ chịu trách nhiệm hướng dẫn tour đó</p>
              <p>• Chỉ HDV có trạng thái "Hoạt động" mới xuất hiện trong danh sách</p>
              <p>• Có thể thay đổi phân công bất cứ lúc nào</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAssignment;