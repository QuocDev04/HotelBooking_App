const Hotel = require("../../models/Hotel/HotelModel.js");
const DateHotel = require("../../models/Hotel/DateHotel.js");
const Location = require("../../models/Location/locationModel.js");

// Lấy tất cả khách sạn
const getAllHotels = async (req, res) => {
    try {
        const { page = 1, limit = 10, location, starRating, featured, status = true } = req.query;
        
        let filter = { status };
        
        if (location) {
            filter.location = location;
        }
        
        if (starRating) {
            filter.starRating = { $gte: parseInt(starRating) };
        }
        
        if (featured !== undefined) {
            filter.featured = featured === 'true';
        }
        
        const hotels = await Hotel.find(filter)
            .populate('location', 'locationName country')
            .populate('assignedEmployee', 'username email')
            .sort({ featured: -1, averageRating: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Hotel.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            data: hotels,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy khách sạn theo ID
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
            .populate('location', 'locationName country')
            .populate('assignedEmployee', 'username email');
            
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }
        
        res.status(200).json({
            success: true,
            data: hotel
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Tạo khách sạn mới
const createHotel = async (req, res) => {
    try {
        const hotelData = req.body;
        
        // Nếu location là string, tìm hoặc tạo location mới
        if (typeof hotelData.location === 'string') {
            let location = await Location.findOne({ 
                locationName: { $regex: new RegExp(hotelData.location, 'i') } 
            });
            
            if (!location) {
                // Tạo location mới nếu không tìm thấy
                location = new Location({
                    locationName: hotelData.location,
                    country: 'Việt Nam' // Mặc định
                });
                await location.save();
            }
            
            hotelData.location = location._id;
        } else {
            // Kiểm tra location có tồn tại không (nếu là ObjectId)
            const locationExists = await Location.findById(hotelData.location);
            if (!locationExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Địa điểm không tồn tại" 
                });
            }
        }
        
        const newHotel = new Hotel(hotelData);
        await newHotel.save();
        
        const populatedHotel = await Hotel.findById(newHotel._id)
            .populate('location', 'locationName country')
            .populate('assignedEmployee', 'username email');
        
        res.status(201).json({
            success: true,
            message: "Tạo khách sạn thành công",
            data: populatedHotel
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Cập nhật khách sạn
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        console.log('Update hotel request:', {
            id,
            updateData: JSON.stringify(updateData, null, 2)
        });
        
        // Debug amenities structure
        if (updateData.hotelAmenities) {
            console.log('Hotel amenities structure:', updateData.hotelAmenities);
            updateData.hotelAmenities.forEach((amenity, index) => {
                console.log(`Amenity ${index}:`, typeof amenity, amenity);
            });
        }
        
        if (updateData.roomTypes) {
            console.log('Room types structure:', updateData.roomTypes);
            updateData.roomTypes.forEach((roomType, rtIndex) => {
                if (roomType.amenities) {
                    console.log(`Room type ${rtIndex} amenities:`, roomType.amenities);
                    roomType.amenities.forEach((amenity, aIndex) => {
                        console.log(`  Amenity ${aIndex}:`, typeof amenity, amenity);
                    });
                }
            });
        }
        
        // Kiểm tra location nếu có cập nhật
        if (updateData.location) {
            const locationExists = await Location.findById(updateData.location);
            if (!locationExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Địa điểm không tồn tại" 
                });
            }
        }
        
        const updatedHotel = await Hotel.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        )
        .populate('location', 'locationName country')
        .populate('assignedEmployee', 'username email');
        
        if (!updatedHotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Cập nhật khách sạn thành công",
            data: updatedHotel
        });
    } catch (error) {
        console.error('Error in updateHotel:', error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa khách sạn (soft delete)
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        
        const hotel = await Hotel.findByIdAndUpdate(
            id, 
            { status: false }, 
            { new: true }
        );
        
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Xóa khách sạn thành công"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Tìm kiếm khách sạn
const searchHotels = async (req, res) => {
    try {
        const { 
            search,
            city,
            checkIn, 
            checkOut, 
            location, 
            guests = 1, 
            rooms = 1,
            minPrice, 
            maxPrice, 
            starRating,
            amenities,
            page = 1, 
            limit = 10 
        } = req.query;
        
        let filter = { status: true };
        
        // Filter theo search text (tên khách sạn)
        if (search) {
            filter.hotelName = { $regex: search, $options: 'i' };
        }
        
        // Filter theo city (location name)
        if (city) {
            // Tìm location theo tên thành phố
            const locations = await Location.find({ 
                locationName: { $regex: city, $options: 'i' } 
            });
            if (locations.length > 0) {
                filter.location = { $in: locations.map(loc => loc._id) };
            } else {
                // Nếu không tìm thấy location nào, trả về kết quả rỗng
                filter.location = { $in: [] };
            }
        }
        
        // Filter theo location ID (nếu có)
        if (location && !city) {
            filter.location = location;
        }
        
        // Filter theo star rating
        if (starRating) {
            filter.starRating = { $gte: parseInt(starRating) };
        }
        
        // Filter theo amenities
        if (amenities) {
            const amenityList = Array.isArray(amenities) ? amenities : [amenities];
            filter['hotelAmenities.name'] = { $in: amenityList };
        }
        
        // Filter theo giá (dựa trên room types)
        if (minPrice || maxPrice) {
            let priceFilter = {};
            if (minPrice) priceFilter.$gte = parseInt(minPrice);
            if (maxPrice) priceFilter.$lte = parseInt(maxPrice);
            filter['roomTypes.finalPrice'] = priceFilter;
        }
        
        let hotels = await Hotel.find(filter)
            .populate('location', 'locationName country')
            .sort({ featured: -1, averageRating: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        // Nếu có ngày check-in và check-out, kiểm tra tình trạng phòng
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            
            // Lọc hotels có phòng trống trong khoảng thời gian
            const availableHotels = [];
            
            for (const hotel of hotels) {
                const availability = await checkHotelAvailability(
                    hotel._id, 
                    checkInDate, 
                    checkOutDate, 
                    parseInt(rooms), 
                    parseInt(guests)
                );
                
                if (availability.available) {
                    availableHotels.push({
                        ...hotel.toObject(),
                        availability: availability
                    });
                }
            }
            
            hotels = availableHotels;
        }
        
        const total = await Hotel.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            data: hotels,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total: hotels.length
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Kiểm tra tình trạng phòng trống
const checkHotelAvailability = async (hotelId, checkInDate, checkOutDate, roomsNeeded = 1, guestsNeeded = 1) => {
    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return { available: false, message: "Khách sạn không tồn tại" };
        }
        
        // Tạo danh sách các ngày cần kiểm tra
        const dates = [];
        const currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        const availableRoomTypes = [];
        
        // Kiểm tra từng loại phòng
        for (let i = 0; i < hotel.roomTypes.length; i++) {
            const roomType = hotel.roomTypes[i];
            
            // Kiểm tra capacity
            if (roomType.maxOccupancy * roomsNeeded < guestsNeeded) {
                continue;
            }
            
            let isAvailable = true;
            let minAvailableRooms = roomType.totalRooms;
            
            // Kiểm tra tình trạng phòng cho từng ngày
            for (const date of dates) {
                const dateHotel = await DateHotel.findOne({
                    hotel: hotelId,
                    date: date
                });
                
                if (dateHotel) {
                    const roomAvailability = dateHotel.roomAvailability.find(
                        room => room.roomTypeIndex === i
                    );
                    
                    if (roomAvailability) {
                        if (roomAvailability.availableRooms < roomsNeeded) {
                            isAvailable = false;
                            break;
                        }
                        minAvailableRooms = Math.min(minAvailableRooms, roomAvailability.availableRooms);
                    }
                } else {
                    // Nếu chưa có dữ liệu cho ngày này, tạo mới
                    const newDateHotel = new DateHotel({
                        hotel: hotelId,
                        date: date,
                        roomAvailability: hotel.roomTypes.map((rt, index) => ({
                            roomTypeIndex: index,
                            availableRooms: rt.totalRooms,
                            bookedRooms: 0
                        }))
                    });
                    await newDateHotel.save();
                }
            }
            
            if (isAvailable) {
                availableRoomTypes.push({
                    roomTypeIndex: i,
                    roomType: roomType,
                    availableRooms: minAvailableRooms
                });
            }
        }
        
        return {
            available: availableRoomTypes.length > 0,
            availableRoomTypes: availableRoomTypes,
            message: availableRoomTypes.length > 0 ? "Có phòng trống" : "Không có phòng trống"
        };
    } catch (error) {
        return { available: false, message: "Lỗi kiểm tra tình trạng phòng", error: error.message };
    }
};

// API endpoint để kiểm tra tình trạng phòng
const getHotelAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, rooms = 1, guests = 1 } = req.query;
        
        if (!checkIn || !checkOut) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp ngày check-in và check-out"
            });
        }
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Ngày check-out phải sau ngày check-in"
            });
        }
        
        const availability = await checkHotelAvailability(
            id, 
            checkInDate, 
            checkOutDate, 
            parseInt(rooms), 
            parseInt(guests)
        );
        
        res.status(200).json({
            success: true,
            data: availability
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Thêm loại phòng mới
const addRoomType = async (req, res) => {
    try {
        const { id } = req.params;
        const roomTypeData = req.body;
        
        // Tính finalPrice
        if (roomTypeData.discountPercent && roomTypeData.discountPercent > 0) {
            roomTypeData.finalPrice = roomTypeData.basePrice * (1 - roomTypeData.discountPercent / 100);
        } else {
            roomTypeData.finalPrice = roomTypeData.basePrice;
        }
        
        const hotel = await Hotel.findByIdAndUpdate(
            id,
            { $push: { roomTypes: roomTypeData } },
            { new: true, runValidators: true }
        ).populate('location', 'locationName country');
        
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Thêm loại phòng thành công",
            data: hotel
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Cập nhật loại phòng
const updateRoomType = async (req, res) => {
    try {
        const { id, roomTypeId } = req.params;
        const roomTypeData = req.body;
        
        // Tính finalPrice
        if (roomTypeData.discountPercent && roomTypeData.discountPercent > 0) {
            roomTypeData.finalPrice = roomTypeData.basePrice * (1 - roomTypeData.discountPercent / 100);
        } else {
            roomTypeData.finalPrice = roomTypeData.basePrice;
        }
        
        const hotel = await Hotel.findOneAndUpdate(
            { _id: id, "roomTypes._id": roomTypeId },
            { 
                $set: {
                    "roomTypes.$.typeName": roomTypeData.typeName,
                    "roomTypes.$.basePrice": roomTypeData.basePrice,
                    "roomTypes.$.finalPrice": roomTypeData.finalPrice,
                    "roomTypes.$.maxOccupancy": roomTypeData.maxOccupancy,
                    "roomTypes.$.bedType": roomTypeData.bedType,
                    "roomTypes.$.totalRooms": roomTypeData.totalRooms,
                    "roomTypes.$.discountPercent": roomTypeData.discountPercent || 0,
                    "roomTypes.$.amenities": roomTypeData.amenities || [],
                    "roomTypes.$.images": roomTypeData.images || []
                }
            },
            { new: true, runValidators: true }
        ).populate('location', 'locationName country');
        
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn hoặc loại phòng" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Cập nhật loại phòng thành công",
            data: hotel
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa loại phòng
const deleteRoomType = async (req, res) => {
    try {
        const { id, roomTypeId } = req.params;
        
        const hotel = await Hotel.findByIdAndUpdate(
            id,
            { $pull: { roomTypes: { _id: roomTypeId } } },
            { new: true }
        ).populate('location', 'locationName country');
        
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Xóa loại phòng thành công",
            data: hotel
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tình trạng phòng theo khoảng thời gian
const getRoomAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp ngày bắt đầu và kết thúc"
            });
        }
        
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const availability = [];
        
        // Lấy tất cả booking trong khoảng thời gian
        const HotelBooking = require("../../models/Hotel/HotelBooking.js");
        const bookings = await HotelBooking.find({
            hotelId: id,
            payment_status: { $in: ['confirmed', 'completed', 'deposit_paid'] },
            $or: [
                {
                    checkInDate: { $lte: end },
                    checkOutDate: { $gte: start }
                }
            ]
        });
        
        // Tính toán tình trạng phòng cho từng ngày
        const currentDate = new Date(start);
        while (currentDate <= end) {
            hotel.roomTypes.forEach((roomType, index) => {
                const dateStr = currentDate.toISOString().split('T')[0];
                
                // Đếm số phòng đã đặt cho ngày này
                const bookedRooms = bookings.filter(booking => {
                    const checkIn = new Date(booking.checkInDate);
                    const checkOut = new Date(booking.checkOutDate);
                    return booking.roomTypeIndex === index &&
                           currentDate >= checkIn && currentDate < checkOut;
                }).reduce((sum, booking) => sum + booking.numberOfRooms, 0);
                
                availability.push({
                    date: dateStr,
                    roomTypeIndex: index,
                    roomTypeName: roomType.typeName,
                    totalRooms: roomType.totalRooms,
                    bookedRooms: bookedRooms,
                    availableRooms: Math.max(0, roomType.totalRooms - bookedRooms)
                });
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        res.status(200).json({
            success: true,
            data: {
                hotel: {
                    _id: hotel._id,
                    hotelName: hotel.hotelName,
                    roomTypes: hotel.roomTypes
                },
                availability: availability
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

module.exports = {
    getAllHotels,
    getHotelById,
    createHotel,
    updateHotel,
    deleteHotel,
    searchHotels,
    getHotelAvailability,
    checkHotelAvailability,
    addRoomType,
    updateRoomType,
    deleteRoomType,
    getRoomAvailability
};