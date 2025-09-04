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

// Cron job chạy 8h sáng mỗi ngày
cron.schedule("0 8 * * *", async () => {
    console.log("Chạy cron job gửi mail nhắc nhở...");
    await sendMailTourDayAgo();
    await sendMailHotelDayAgo();
    console.log("Hoàn thành email nhắc nhở");
});

module.exports = { sendMail, sendMailTourDayAgo, sendMailHotelDayAgo };
