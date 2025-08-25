import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import YachtDetailPage from "../pages/Book/yacht"

import Transport from "../pages/Tours/Transport"
import DestinationList from "../pages/Tours/DestinationList"
import TransportDetail from "../pages/Tours/TransportDeatil"
import PaymentPage from "../pages/Payment/payment"
import HotelPaymentPage from "../pages/Payment/HotelPayment"
import CheckOutHotel from "../pages/Hotel/CheckOutHotel"
import PaymentResult from "../pages/Booking/Payment"
import Blog from "../pages/Blog/blog"

import BlogDetail from "../pages/Blog/hotelPolicy"
import JapanTourPage from "../pages/Tour/detailTour"
import BookingAll from "../pages/Booking/BookingAll"
import InfoUser from "../components/InfoUser"
import Checkout from "../pages/Booking/Checkout"
import CheckOutTour from "../pages/Booking/CheckOutTour"


import Clause from "../pages/Introduce/Clause"
import RefundInfo from "../pages/Booking/RefundInfo"
import HotelList from "../pages/Hotel/HotelList"
import HotelDetail from "../pages/Hotel/HotelDetail"
import HotelBookingConfirmation from "../pages/Hotel/HotelBookingConfirmation"

import News from "../pages/Home/Main/News"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutPages />}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
                <Route path="/d" element={<YachtDetailPage />} />

                <Route path="/transport" element={<Transport />} />
                <Route path="/destinations" element={<DestinationList />} />
                <Route path="/transports" element={<TransportDetail />} />
                <Route path="/payment/:bookingId" element={<PaymentPage />} />
                <Route path="/payment/hotel-booking/:bookingId" element={<HotelPaymentPage />} />
                <Route path="/checkout-hotel/:bookingId" element={<CheckOutHotel />} />
                <Route path="/payment-result" element={<PaymentResult />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/detailtour/:id" element={<JapanTourPage />} />

                <Route path="/bookingall/:id" element={<BookingAll />} />
                <Route path="/infouser" element={<InfoUser />} />
                <Route path="/date/slot/:id/" element={<Checkout />} />
                <Route path="/booking/:id" element={<CheckOutTour />} />

                <Route path="/news" element={<News />} />

                <Route path="/clause" element={<Clause />} />
                <Route path="/refund/:bookingId" element={<RefundInfo />} />

                {/* Hotel Routes */}
                <Route path="/hotels" element={<HotelList />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/hotel-booking-confirmation/:id" element={<HotelBookingConfirmation />} />
            </Route>
        </Routes>
    )
}
export default Router