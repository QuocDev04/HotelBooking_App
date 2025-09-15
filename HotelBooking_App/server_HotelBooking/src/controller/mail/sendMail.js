require('dotenv/config');
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const Booking = require("../../models/Tour/TourBooking");
const Slot = require("../../models/Tour/DateTour");
const HotelBooking = require("../../models/Hotel/HotelBooking");

// Hàm gửi mail chung
const sendMail = async ({ email, subject, html }) => {
    if (!email || !subject || !html) {
        throw new Error("Thiếu email, subject hoặc html");
    }

    let transporter;
    try {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            auth: {
                user: process.env.Mail_User,
                pass: process.env.Mail_Pass,
            },
            tls: { rejectUnauthorized: false },
        });

        const message = { from: process.env.Mail_User, to: email, subject, html };
        return await transporter.sendMail(message);
    } catch (error) {
        console.error("Gửi mail thất bại:", error.message);
    } finally {
        if (transporter && typeof transporter.close === "function") {
            transporter.close();
        }
    }
};

// Hàm gửi mail nhắc nhở tour
const sendMailTourDayAgo = async () => {
    try {
        const todayVN = moment().tz("Asia/Ho_Chi_Minh").startOf("day");
        const tomorrowVN = todayVN.clone().add(1, "day");

        const slots = await Slot.find({
            dateTour: {
                $gte: tomorrowVN.toDate(),
                $lt: tomorrowVN.clone().endOf("day").toDate(),
            },
        });

        console.log("Slots tìm được:", slots.map(s => ({ id: s._id, dateTour: s.dateTour })));

        for (let slot of slots) {
            const bookings = await Booking.find({ slotId: slot._id });

            for (let booking of bookings) {
                const tourDateFormatted = moment(slot.dateTour).tz("Asia/Ho_Chi_Minh")
                    .format("dddd, DD/MM/YYYY HH:mm");

                await sendMail({
                    email: booking.email,
                    subject: "Nhắc nhở tour của bạn",
                    html: `
                        <p>Xin chào <b>${booking.fullNameUser}</b>,</p>
                        <p>Bạn đã đặt tour có slot vào ngày <b>${tourDateFormatted}</b>.</p>
                        <p><b>Tổng tiền:</b> ${booking.totalPriceTour.toLocaleString("vi-VN")} VND</p>
                        <p><b>Trạng thái thanh toán:</b> ${booking.payment_status}</p>
                        <p>Chúc bạn có chuyến đi vui vẻ!</p>
                    `,
                });

                console.log(`Đã gửi mail cho ${booking.email}`);
            }
        }
    } catch (error) {
        console.error("Lỗi khi gửi mail nhắc nhở tour:", error);
    }
};

// Hàm gửi mail nhắc nhở hotel
const sendMailHotelDayAgo = async () => {
    try {
        const todayVN = moment().tz("Asia/Ho_Chi_Minh").startOf("day");
        const tomorrowVN = todayVN.clone().add(1, "day");

        const bookings = await HotelBooking.find({
            checkInDate: {
                $gte: tomorrowVN.toDate(),
                $lt: tomorrowVN.clone().endOf("day").toDate(),
            },
        });

        console.log("Hotel bookings tìm được:", bookings.map(b => ({ id: b._id, checkInDate: b.checkInDate })));

        for (let booking of bookings) {
            const checkInFormatted = moment(booking.checkInDate).tz("Asia/Ho_Chi_Minh")
                .format("dddd, DD/MM/YYYY HH:mm");
            const checkOutFormatted = moment(booking.checkOutDate).tz("Asia/Ho_Chi_Minh")
                .format("dddd, DD/MM/YYYY HH:mm");

            await sendMail({
                email: booking.email,
                subject: "Nhắc nhở đặt phòng khách sạn của bạn",
                html: `
                    <p>Xin chào <b>${booking.fullNameUser}</b>,</p>
                    <p>Bạn đã đặt khách sạn, ngày nhận phòng là <b>${checkInFormatted}</b> và trả phòng <b>${checkOutFormatted}</b>.</p>
                    <p><b>Số đêm:</b> ${booking.numberOfNights}</p>
                    <p><b>Số khách:</b> ${booking.totalGuests}</p>
                    <p><b>Tổng tiền:</b> ${booking.totalPrice.toLocaleString("vi-VN")} VND</p>
                    <p><b>Trạng thái thanh toán:</b> ${booking.payment_status}</p>
                    <p>Chúc bạn có kỳ nghỉ thoải mái!</p>
                `,
            });

            console.log(`Đã gửi mail nhắc nhở hotel cho ${booking.email}`);
        }
    } catch (error) {
        console.error("Lỗi khi gửi mail nhắc nhở hotel:", error);
    }
};

const sendMailBookingCashSuccess = async (booking, depositAmount, isFullPayment) => {
    try {
        await booking.populate({
            path: 'slotId',
            select: 'dateTour tour',
            populate: { path: 'tour', select: 'nameTour price finalPrice duration' }
        });

        const tourName = booking.slotId?.tour?.nameTour || 'N/A';
        const tourDate = booking.slotId?.dateTour
            ? moment(booking.slotId.dateTour).tz("Asia/Ho_Chi_Minh").format("dddd, DD/MM/YYYY")
            : 'N/A';
        const duration = booking.slotId?.tour?.duration || 0;
        // Tính ngày về
        const endDate = booking.slotId?.dateTour
            ? moment(booking.slotId.dateTour).tz("Asia/Ho_Chi_Minh").add(duration, 'days').format("dddd, DD/MM/YYYY")
            : 'N/A';
        const tourPrice = booking.slotId?.tour?.finalPrice ?? booking.slotId?.tour?.price ?? 0;
        const totalPrice = tourPrice.toLocaleString("vi-VN");
        const paymentDeadline = booking.cashPaymentDeadline
            ? moment(booking.cashPaymentDeadline).tz("Asia/Ho_Chi_Minh").format("HH:mm DD/MM/YYYY")
            : null;
        const paymentAddress = "Số 81A ngõ 295 - Phố Bằng Liệt - Phường Linh Nam - Quận Hoàng Mai - Hà Nội";
        const workingTime = "9h00 - 17h30 từ thứ 2 - đến thứ 6 và 9h00 - 12h00 thứ 7";

        await sendMail({
            email: booking.email,
            subject: `Xác nhận đặt tour #${booking._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Đặt tour thành công!</h2>
                    <p>Xin chào <b>${booking.fullNameUser}</b>,</p>
                    <p>Bạn đã đặt tour <b>${tourName}</b> thành công và chọn thanh toán tiền mặt tại văn phòng.</p>
                    <p><b>Ngày đi:</b> ${tourDate}</p>
                    <p><b>Ngày về:</b> ${endDate}</p>
                    <p><b>Thời lượng tour:</b> ${duration} ngày</p>
                    <h3>Thông tin thanh toán:</h3>
                    <ul>
                        <li><strong>Mã đặt tour:</strong> ${booking._id}</li>
                        <li><strong>Số tiền cần thanh toán:</strong> ${totalPrice} VNĐ</li>
                        ${!isFullPayment ? `<li><strong>Số tiền đặt cọc:</strong> ${depositAmount?.toLocaleString("vi-VN") || 0} VNĐ</li>` : ""}
                        ${paymentDeadline ? `<li><strong>Hạn thanh toán:</strong> ${paymentDeadline}</li>` : ""}
                        <li><strong>Địa chỉ:</strong> ${paymentAddress}</li>
                        <li><strong>Thời gian:</strong> ${workingTime}</li>
                    </ul>
                    <h3>Thông tin khách đặt:</h3>
                    <ul>
                        <li><strong>Họ tên:</strong> ${booking.fullNameUser}</li>
                        <li><strong>Email:</strong> ${booking.email}</li>
                        <li><strong>Số điện thoại:</strong> ${booking.phoneNumber || 'N/A'}</li>
                        <li><strong>Số lượng người:</strong> ${booking.totalGuests || booking.numberOfGuests || 'N/A'}</li>
                    </ul>
                    <h3>⚠️ LƯU Ý QUAN TRỌNG:</h3>
                    <ul>
                        <li>Bạn có 48 giờ để thanh toán tiền cọc kể từ thời điểm đặt tour</li>
                        <li>Tour sẽ tự động bị hủy nếu quá thời hạn thanh toán</li>
                        <li>Vui lòng đến văn phòng trước thời hạn để hoàn tất thanh toán</li>
                    </ul>
                    <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                </div>
            `,
        });

        console.log(`📧 Đã gửi mail xác nhận cash booking cho ${booking.email}`);
    } catch (error) {
        console.error("❌ Lỗi khi gửi mail cash booking:", error.message);
    }
};

const sendMailHotelBookingCashSuccess = async (booking) => {
    try {
        // Populate hotelId để lấy tên khách sạn và địa chỉ
        const populatedBooking = await booking.populate({
            path: 'hotelId',
            select: 'hotelName address'
        });

        const hotelName = populatedBooking.hotelId?.hotelName || 'N/A';
        const hotelAddress = populatedBooking.hotelId?.address || 'N/A';
        const deadline = populatedBooking.cashPaymentDeadline
            ? moment(populatedBooking.cashPaymentDeadline).tz("Asia/Ho_Chi_Minh").format("HH:mm DD/MM/YYYY")
            : null;
        const workingTime = `9h00 - 17h30 (Thứ 2 - Thứ 6) | 9h00 - 12h00 (Thứ 7)`;
        const checkInFormatted = populatedBooking.checkInDate ? moment(populatedBooking.checkInDate).tz("Asia/Ho_Chi_Minh").format("dddd, DD/MM/YYYY HH:mm") : 'N/A';
        const checkOutFormatted = populatedBooking.checkOutDate ? moment(populatedBooking.checkOutDate).tz("Asia/Ho_Chi_Minh").format("dddd, DD/MM/YYYY HH:mm") : 'N/A';

        // Tạo HTML chi tiết các phòng và khách
        const roomDetailsHtml = populatedBooking.roomBookings.map(rb => `
            <li style="margin-bottom: 10px;">
                <b>${rb.roomTypeName}</b> - ${rb.numberOfRooms} phòng<br/>
                Giá/đêm: ${rb.pricePerNight.toLocaleString('vi-VN')} VNĐ<br/>
                Tổng: ${rb.totalPrice.toLocaleString('vi-VN')} VNĐ<br/>
                Khách: ${rb.guests.map(g => g.fullName).join(', ') || 'Chưa nhập'}<br/>
                Số lượng khách: ${rb.guests.length || 'N/A'}
            </li>
        `).join('');

        await sendMail({
            email: populatedBooking.email,
            subject: `Xác nhận đặt phòng khách sạn #${populatedBooking._id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Đặt phòng thành công!</h2>
                    <p>Xin chào <b>${populatedBooking.fullNameUser}</b>,</p>
                    <p>Bạn đã chọn thanh toán tiền mặt tại văn phòng cho khách sạn <b>${hotelName}</b>.</p>
                    <h3>Thông tin đặt phòng:</h3>
                    <ul>
                        <li><strong>Mã đặt phòng:</strong> ${populatedBooking._id}</li>
                        <li><strong>Khách sạn:</strong> ${hotelName}</li>
                        <li><strong>Địa chỉ khách sạn:</strong> ${hotelAddress}</li>
                        <li><strong>Ngày nhận phòng:</strong> ${checkInFormatted}</li>
                        <li><strong>Ngày trả phòng:</strong> ${checkOutFormatted}</li>
                        <li><strong>Số đêm:</strong> ${populatedBooking.numberOfNights}</li>
                        <li><strong>Số khách:</strong> ${populatedBooking.totalGuests}</li>
                        <li><strong>Tổng tiền:</strong> ${populatedBooking.totalPrice.toLocaleString('vi-VN')} VNĐ</li>
                        ${deadline ? `<li><strong>Hạn thanh toán:</strong> ${deadline}</li>` : ""}
                        <li><strong>Thời gian làm việc:</strong> ${workingTime}</li>
                    </ul>
                    <h3>Chi tiết phòng và khách:</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${roomDetailsHtml}
                    </ul>
                    <h3>Thông tin khách đặt:</h3>
                    <ul>
                        <li><strong>Họ tên:</strong> ${populatedBooking.fullNameUser}</li>
                        <li><strong>Email:</strong> ${populatedBooking.email}</li>
                        <li><strong>Số điện thoại:</strong> ${populatedBooking.phoneNumber || 'N/A'}</li>
                    </ul>
                    <h3>⚠️ LƯU Ý QUAN TRỌNG:</h3>
                    <ul>
                        <li>Bạn có 48 giờ để thanh toán tiền cọc kể từ thời điểm đặt phòng</li>
                        <li>Đặt phòng sẽ tự động bị hủy nếu quá thời hạn thanh toán</li>
                        <li>Vui lòng đến văn phòng trước thời hạn để hoàn tất thanh toán</li>
                    </ul>
                    <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                </div>
            `
        });

        console.log(`📧 Đã gửi mail xác nhận cash booking khách sạn cho ${populatedBooking.email}`);
    } catch (error) {
        console.error("❌ Lỗi gửi mail cash booking khách sạn:", error.message);
    }
};

// Cron job chạy 8h sáng mỗi ngày
cron.schedule("0 8 * * *", async () => {
    console.log("Chạy cron job gửi mail nhắc nhở...");
    await sendMailTourDayAgo();
    await sendMailHotelDayAgo();
    console.log("Hoàn thành email nhắc nhở");
});

module.exports = { sendMail, sendMailTourDayAgo, sendMailHotelDayAgo, sendMailBookingCashSuccess, sendMailHotelBookingCashSuccess };
