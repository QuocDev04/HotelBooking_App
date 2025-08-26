
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Component Accordion cho lịch trình tour
const TourScheduleAccordion = ({ schedules, description }) => {
  const [openDays, setOpenDays] = useState({ 0: true }); // Mở ngày đầu tiên mặc định
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    if (schedules && schedules.length > 0) {
      // Sử dụng data từ TourSchedule API
      parseScheduleFromAPI(schedules);
    } else if (description) {
      // Fallback: parse từ description HTML nếu không có schedules
      parseScheduleFromDescription(description);
    }
  }, [schedules, description]);

  const parseScheduleFromAPI = (apiSchedules) => {
    try {
      console.log("Parsing schedule from API:", apiSchedules);
      
      const formattedSchedules = apiSchedules.map((schedule, index) => ({
        day: parseInt(schedule.dayNumber) || (index + 1),
        title: schedule.location || `Ngày ${schedule.dayNumber}`,
        content: schedule.activity || 'Không có thông tin hoạt động',
        images: schedule.imageTourSchedule || [],
        isExpanded: index === 0 // Mở ngày đầu tiên
      }));

      setScheduleData(formattedSchedules);
      
      // Set ngày đầu tiên mở mặc định
      if (formattedSchedules.length > 0) {
        setOpenDays({ 0: true });
      }
      
      console.log("Formatted schedules:", formattedSchedules);
    } catch (error) {
      console.error('Error parsing API schedule:', error);
      setScheduleData([]);
    }
  };

  const parseScheduleFromDescription = (htmlDescription) => {
    try {
      // Parse HTML để tách lịch trình từng ngày
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlDescription;
      
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Tách theo pattern "Ngày X:" hoặc "Day X:"
      const dayPattern = /(?:Ngày|Day)\s*(\d+):\s*([^]*?)(?=(?:Ngày|Day)\s*\d+:|$)/gi;
      const matches = [];
      let match;
      
      console.log("Parsing schedule from:", textContent.substring(0, 200) + "...");
      
      while ((match = dayPattern.exec(textContent)) !== null) {
        const dayNumber = match[1];
        const content = match[2].trim();
        
        console.log(`Found Day ${dayNumber}:`, content.substring(0, 100) + "...");
        
        // Parse title từ content - lấy phần đầu tiên trước dấu phẩy hoặc dấu chấm
        let title = "Chi tiết hoạt động";
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const firstLine = lines[0].trim();
          // Lấy phần đầu tiên của dòng đầu tiên làm title
          const titleMatch = firstLine.match(/^([^,.]+)/);
          if (titleMatch) {
            title = titleMatch[1].trim();
          }
        }
        
        matches.push({
          day: parseInt(dayNumber),
          title: title,
          content: content,
          isExpanded: parseInt(dayNumber) === 1
        });
      }
      
      console.log("Parsed", matches.length, "days from schedule");
      
      // Nếu không parse được theo pattern, tạo fallback
      if (matches.length === 0) {
        const lines = textContent.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          matches.push({
            day: 1,
            title: 'Lịch trình tour',
            content: textContent,
            isExpanded: true
          });
        }
      }
      
      setScheduleData(matches);
      
      // Set ngày đầu tiên mở mặc định
      if (matches.length > 0) {
        setOpenDays({ 0: true });
      }
      
    } catch (error) {
      console.error('Error parsing schedule:', error);
      setScheduleData([{
        day: 1,
        title: 'Lịch trình tour',
        content: description.replace(/<[^>]*>/g, ''),
        isExpanded: true
      }]);
    }
  };

  const toggleDay = (index) => {
    setOpenDays(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (scheduleData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border">
        <p className="text-gray-500">Không có thông tin lịch trình chi tiết</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scheduleData.map((dayInfo, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          {/* Header - Clickable */}
          <button
            onClick={() => toggleDay(index)}
            className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <span className="font-medium text-blue-700">
                Ngày {dayInfo.day}: {dayInfo.title}
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${openDays[index] ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Content - Collapsible */}
          {openDays[index] && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {dayInfo.content}
              </div>
              
              {/* Ảnh minh họa từ API hoặc placeholder */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                {dayInfo.images && dayInfo.images.length > 0 ? (
                  dayInfo.images.slice(0, 3).map((image, imgIndex) => (
                    <div key={imgIndex} className="aspect-video rounded overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${dayInfo.title} - Ảnh ${imgIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFuaCBsb2k8L3RleHQ+PC9zdmc+';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  // Placeholder khi không có ảnh
                  Array.from({ length: 3 }, (_, imgIndex) => (
                    <div key={imgIndex} className="aspect-video bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Ảnh minh họa</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const TourDuocGiao = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [updatingTours, setUpdatingTours] = useState({}); // Track which tours are being updated
  const { user } = useAuth();

  useEffect(() => {
    fetchAssignedTours();
  }, []);

  const fetchAssignedTours = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/employee/assigned-tours");
      
      console.log("Assigned tours response:", response.data);
      
      if (response.data.success) {
        console.log("Tours data:", response.data.tours);
        response.data.tours.forEach((tour, index) => {
          console.log(`Tour ${index + 1}:`, {
            name: tour.nameTour,
            maxPeople: tour.maxPeople,
            destination: tour.destination
          });
        });
        setTours(response.data.tours);
      } else {
        setError("Không thể lấy danh sách tour");
      }
    } catch (error) {
      console.error("Error fetching assigned tours:", error);
      setError(error.response?.data?.message || "Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerBookings = async (tourId) => {
    try {
      setLoadingCustomers(true);
      // Cần tìm các dateSlot của tour này trước
      const dateSlotsResponse = await axios.get(`http://localhost:8080/api/date/tour/${tourId}`);
      const dateSlots = dateSlotsResponse.data.data || [];
      
      console.log(`Tour ${tourId} có ${dateSlots.length} dateSlots:`, dateSlots.map(s => ({ id: s._id, date: s.dateTour })));
      
      // Lấy bookings cho tất cả dateSlots của tour
      const allBookings = [];
      for (const slot of dateSlots) {
        try {
          const bookingResponse = await axios.get(`http://localhost:8080/api/admin/bookings?slotId=${slot._id}`);
          if (bookingResponse.data.success) {
            console.log(`Slot ${slot._id} có ${bookingResponse.data.bookings.length} bookings`);
            allBookings.push(...bookingResponse.data.bookings);
          }
        } catch (error) {
          console.error(`Error fetching bookings for slot ${slot._id}:`, error);
        }
      }
      
      console.log(`Tổng cộng: ${allBookings.length} bookings cho tour ${tourId}`);
      setCustomerBookings(allBookings);
    } catch (error) {
      console.error("Error fetching customer bookings:", error);
      setCustomerBookings([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const showCustomerList = async (tour) => {
    setSelectedTour(tour);
    setShowCustomerModal(true);
    await fetchCustomerBookings(tour._id);
  };

  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedTour(null);
    setCustomerBookings([]);
  };

  const showSchedule = async (tour) => {
    setSelectedTour(tour);
    setShowScheduleModal(true);
    
    // Fetch tour schedule từ API
    try {
      const response = await axios.get(`http://localhost:8080/api/tour/${tour._id}`);
      if (response.data.success) {
        setSelectedTour({
          ...tour,
          schedules: response.data.tour.schedules || []
        });
      }
    } catch (error) {
      console.error('Error fetching tour schedule:', error);
    }
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedTour(null);
  };

  const handleStatusChange = async (tourId, newStatus) => {
    // Special handling for postponed status
    if (newStatus === 'postponed') {
      const reason = prompt('Vui lòng nhập lý do hoãn tour:');
      if (!reason || !reason.trim()) {
        // Reset select to current status if postponed
        setTours(prev => prev.map(t => t._id === tourId ? t : t));
        return;
      }
      
      setUpdatingTours(prev => ({ ...prev, [tourId]: true }));
      
      try {
        const response = await axios.put(
          `http://localhost:8080/api/tour/status/${tourId}`,
          {
            status: newStatus,
            note: reason,
            updatedBy: user?.employee_id || user?.full_name
          }
        );

        if (response.data.success) {
          // Update tours list with new status
          setTours(prev => 
            prev.map(tour => 
              tour._id === tourId 
                ? { ...tour, tourStatus: newStatus, statusNote: reason }
                : tour
            )
          );
          alert('Cập nhật trạng thái tour thành công!');
        } else {
          alert('Lỗi: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error updating tour status:', error);
        alert('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
      } finally {
        setUpdatingTours(prev => ({ ...prev, [tourId]: false }));
      }
    } else {
      // Handle other status changes without note required
      setUpdatingTours(prev => ({ ...prev, [tourId]: true }));
      
      try {
        const response = await axios.put(
          `http://localhost:8080/api/tour/status/${tourId}`,
          {
            status: newStatus,
            note: `Trạng thái đã được cập nhật thành ${getTourStatusText(newStatus)}`,
            updatedBy: user?.employee_id || user?.full_name
          }
        );

        if (response.data.success) {
          // Update tours list with new status
          setTours(prev => 
            prev.map(tour => 
              tour._id === tourId 
                ? { ...tour, tourStatus: newStatus }
                : tour
            )
          );
          alert('Cập nhật trạng thái tour thành công!');
        } else {
          alert('Lỗi: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error updating tour status:', error);
        alert('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
      } finally {
        setUpdatingTours(prev => ({ ...prev, [tourId]: false }));
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    if (status) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getTourStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'postponed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTourStatusText = (status) => {
    switch (status) {
      case 'preparing': return 'Chuẩn bị diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Hoàn thành';
      case 'postponed': return 'Hoãn tour';
      default: return 'Chưa xác định';
    }
  };

  const getSelectBgColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-blue-50 border-blue-200';
      case 'ongoing': return 'bg-yellow-50 border-yellow-200';
      case 'completed': return 'bg-green-50 border-green-200';
      case 'postponed': return 'bg-red-50 border-red-200';
      default: return 'bg-white border-gray-300';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'deposit_paid': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending_cancel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'deposit_paid': return 'Đã đặt cọc';
      case 'completed': return 'Đã thanh toán';
      case 'cancelled': return 'Đã hủy';
      case 'pending_cancel': return 'Chờ xác nhận hủy';
      default: return 'Không xác định';
    }
  };

  // Function để clean HTML và format text đẹp
  const cleanHtmlDescription = (htmlString) => {
    if (!htmlString) return '';
    
    try {
      // Tạo temporary div để parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      
      // Lấy text content
      let textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Clean up và format
      textContent = textContent
        .replace(/\s+/g, ' ')  // Replace multiple spaces với single space
        .replace(/\n\s*\n/g, '\n\n')  // Keep paragraph breaks
        .trim();
      
      return textContent;
    } catch (error) {
      console.error('Error cleaning HTML:', error);
      // Fallback: simple regex clean
      return htmlString.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Lỗi: {error}</p>
          <button
            onClick={fetchAssignedTours}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tour được giao</h1>
        <p className="text-gray-600">
          Xin chào <span className="font-medium text-blue-600">{user?.full_name}</span>, 
          bạn có {tours.length} tour được phân công
        </p>
      </div>

      {tours.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tour nào được phân công</h3>
          <p className="text-gray-500">Admin sẽ phân công tour cho bạn sớm nhất có thể.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{tour.nameTour}</h2>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{tour.departure_location} → {tour.destination?.locationName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getTourStatusColor(tour.tourStatus || 'preparing')}`}>
                      {getTourStatusText(tour.tourStatus || 'preparing')}
                    </span>
                    <div className="mt-2 text-lg font-bold text-green-600">
                      {formatPrice(tour.finalPrice || tour.price)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <button 
                      onClick={() => showCustomerList(tour)}
                      className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      Danh sách khách hàng
                    </button>
                    <button 
                      onClick={() => showSchedule(tour)}
                      className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Lịch trình tour
                    </button>
                  </div>
                  
                  {/* Status Update Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cập nhật trạng thái tour:
                    </label>
                    <div className="relative">
                      <select
                        value={tour.tourStatus || 'preparing'}
                        onChange={(e) => handleStatusChange(tour._id, e.target.value)}
                        disabled={updatingTours[tour._id]}
                        className={`w-full p-3 pr-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${getSelectBgColor(tour.tourStatus || 'preparing')}`}
                      >
                        <option value="preparing">Chuẩn bị diễn ra</option>
                        <option value="ongoing">Đang diễn ra</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="postponed">Hoãn tour</option>
                      </select>
                      
                      {/* Loading spinner overlay */}
                      {updatingTours[tour._id] && (
                        <div className="absolute inset-y-0 right-8 flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        </div>
                      )}
                      
                      {/* Dropdown arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tour Details */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Số chỗ:</span>
                      <div className="font-medium">{tour.maxPeople || 'Không giới hạn'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Điểm đến:</span>
                      <div className="font-medium">
                        {tour.destination ? 
                          (typeof tour.destination === 'object' ? 
                            `${tour.destination.locationName}, ${tour.destination.country}` : 
                            tour.destination
                          ) : 
                          'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Tạo lúc:</span>
                      <div className="font-medium">{new Date(tour.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal danh sách khách hàng */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Danh sách khách hàng</h2>
                <p className="text-blue-100">{selectedTour?.nameTour}</p>
              </div>
              <button 
                onClick={closeCustomerModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingCustomers ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : customerBookings.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khách hàng đặt tour</h3>
                  <p className="text-gray-500">Tour này chưa có ai đặt chỗ.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Thống kê đơn giản */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-600">Tổng khách hàng</h3>
                      <p className="text-2xl font-bold text-blue-700">
                        {customerBookings.reduce((total, booking) => {
                          const adultCount = booking.adultPassengers?.length || 0;
                          const childCount = booking.childPassengers?.length || 0;
                          const toddlerCount = booking.toddlerPassengers?.length || 0;
                          const infantCount = booking.infantPassengers?.length || 0;
                          return total + adultCount + childCount + toddlerCount + infantCount;
                        }, 0)} người
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-600">Số đơn đặt tour</h3>
                      <p className="text-2xl font-bold text-green-700">{customerBookings.length} đơn</p>
                    </div>
                  </div>

                  {/* Danh sách khách hàng đơn giản */}
                  <div className="space-y-3">
                    {(() => {
                      // Tạo danh sách tất cả khách hàng từ tất cả booking
                      const allPassengers = [];
                      let counter = 1;
                      
                      customerBookings.forEach(booking => {
                        // Thêm người lớn
                        if (booking.adultPassengers) {
                          booking.adultPassengers.forEach(passenger => {
                            allPassengers.push({
                              ...passenger,
                              type: 'Người lớn',
                              color: 'bg-blue-100 text-blue-800',
                              number: counter++
                            });
                          });
                        }
                        
                        // Thêm trẻ em
                        if (booking.childPassengers) {
                          booking.childPassengers.forEach(passenger => {
                            allPassengers.push({
                              ...passenger,
                              type: 'Trẻ em',
                              color: 'bg-green-100 text-green-800',
                              number: counter++
                            });
                          });
                        }
                        
                        // Thêm trẻ nhỏ
                        if (booking.toddlerPassengers) {
                          booking.toddlerPassengers.forEach(passenger => {
                            allPassengers.push({
                              ...passenger,
                              type: 'Trẻ nhỏ',
                              color: 'bg-yellow-100 text-yellow-800',
                              number: counter++
                            });
                          });
                        }
                        
                        // Thêm em bé
                        if (booking.infantPassengers) {
                          booking.infantPassengers.forEach(passenger => {
                            allPassengers.push({
                              ...passenger,
                              type: 'Em bé',
                              color: 'bg-pink-100 text-pink-800',
                              number: counter++
                            });
                          });
                        }
                      });
                      
                      return allPassengers.map((passenger, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full text-sm font-bold mr-4">
                              {passenger.number}
                            </span>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{passenger.fullName}</h4>
                              <p className="text-sm text-gray-500">
                                {passenger.gender} • {new Date(passenger.birthDate).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${passenger.color}`}>
                            {passenger.type}
                          </span>
                        </div>
                      ));
                    })()}
                    
                    {/* Thông báo nếu không có khách */}
                    {customerBookings.every(booking => 
                      (!booking.adultPassengers || booking.adultPassengers.length === 0) &&
                      (!booking.childPassengers || booking.childPassengers.length === 0) &&
                      (!booking.toddlerPassengers || booking.toddlerPassengers.length === 0) &&
                      (!booking.infantPassengers || booking.infantPassengers.length === 0)
                    ) && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Chưa có thông tin chi tiết khách hàng</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Lịch trình Tour */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-green-600 text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Lịch trình tour</h2>
                <p className="text-green-100">{selectedTour?.nameTour}</p>
              </div>
              <button 
                onClick={closeScheduleModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Thông tin tổng quan */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-green-600 mb-1">Điểm khởi hành</h3>
                    <p className="text-lg font-semibold text-green-700">{selectedTour?.departure_location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-600 mb-1">Điểm đến</h3>
                    <p className="text-lg font-semibold text-green-700">
                      {selectedTour?.destination ? 
                        (typeof selectedTour.destination === 'object' ? 
                          `${selectedTour.destination.locationName}, ${selectedTour.destination.country}` : 
                          selectedTour.destination
                        ) : 
                        'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-600 mb-1">Thời gian</h3>
                    <p className="text-lg font-semibold text-green-700">{selectedTour?.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-600 mb-1">Số lượng tối đa</h3>
                    <p className="text-lg font-semibold text-green-700">{selectedTour?.maxPeople} người</p>
                  </div>
                </div>
                
                {/* Thời gian khởi hành và kết thúc */}
                {(selectedTour?.departure_time || selectedTour?.return_time) && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTour?.departure_time && (
                        <div>
                          <h3 className="text-sm font-medium text-green-600 mb-1">Giờ khởi hành</h3>
                          <p className="text-lg font-semibold text-green-700">{selectedTour.departure_time}</p>
                        </div>
                      )}
                      {selectedTour?.return_time && (
                        <div>
                          <h3 className="text-sm font-medium text-green-600 mb-1">Giờ kết thúc</h3>
                          <p className="text-lg font-semibold text-green-700">{selectedTour.return_time}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phương tiện di chuyển */}
              {selectedTour?.itemTransport && selectedTour.itemTransport.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Phương tiện di chuyển
                  </h3>
                  <div className="grid gap-3">
                    {selectedTour.itemTransport.map((transport, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {transport.TransportId?.transportName || 'Phương tiện di chuyển'}
                            </h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="mr-4">
                                <strong>Số hiệu:</strong> {transport.TransportId?.transportNumber || 'N/A'}
                              </span>
                              <span>
                                <strong>Loại:</strong> {transport.TransportId?.transportType || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lịch trình từng ngày */}
              {selectedTour?.descriptionTour && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Chi tiết lịch trình
                  </h3>
                  <TourScheduleAccordion 
                    schedules={selectedTour?.schedules} 
                    description={selectedTour?.descriptionTour} 
                  />
                </div>
              )}

              {/* Giá tour */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Thông tin giá</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Giá người lớn:</span>
                    <div className="font-semibold text-blue-800">{formatPrice(selectedTour?.finalPrice || selectedTour?.price)}</div>
                  </div>
                  {selectedTour?.priceChildren > 0 && (
                    <div>
                      <span className="text-blue-600">Giá trẻ em:</span>
                      <div className="font-semibold text-blue-800">{formatPrice(selectedTour.priceChildren)}</div>
                    </div>
                  )}
                  {selectedTour?.priceLittleBaby > 0 && (
                    <div>
                      <span className="text-blue-600">Giá trẻ nhỏ:</span>
                      <div className="font-semibold text-blue-800">{formatPrice(selectedTour.priceLittleBaby)}</div>
                    </div>
                  )}
                  {selectedTour?.pricebaby > 0 && (
                    <div>
                      <span className="text-blue-600">Giá em bé:</span>
                      <div className="font-semibold text-blue-800">{formatPrice(selectedTour.pricebaby)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default TourDuocGiao;
