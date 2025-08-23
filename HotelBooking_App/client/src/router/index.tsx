import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import YachtDetailPage from "../pages/Book/yacht"
import RoomList from "../pages/Room/RoomList/Rooms"
import Transport from "../pages/Tours/Transport"
import DestinationList from "../pages/Tours/DestinationList"
import TransportDetail from "../pages/Tours/TransportDeatil"
import Roomdetail from "../pages/Room/DetailRoom/Roomdetail"
import PaymentPage from "../pages/Payment/payment"
import Blog from "../pages/Blog/blog"
import { HotelPolicy } from "../pages/Blog/hotelPolicy"
import JapanTourPage from "../pages/Tour/detailTour"
import BookingRoom from "../pages/Booking/BookingRoom"
import BookingAll from "../pages/Booking/BookingAll"
import InfoUser from "../components/InfoUser"
import Checkout from "../pages/Booking/Checkout"
import CheckOutTour from "../pages/Booking/CheckOutTour"
import ChatBot from "../components/ChatBot"
const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LayoutPages />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/introduce" element={<InfoAll />} />
                    <Route path="/d" element={<YachtDetailPage />} />
                    <Route path="/rooms" element={<RoomList />} />
                    <Route path="/transport" element={<Transport />} />
                    <Route path="/destinations" element={<DestinationList />} />
                    <Route path="/transports" element={<TransportDetail />} />
                    <Route path="/roomdetail/:id" element={<Roomdetail />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/hotelPolicy" element={<HotelPolicy />} />
                    <Route path="/detailtour/:id" element={<JapanTourPage />} />
                    <Route path="/bookingroom/:id" element={<BookingRoom />} />
                    <Route path="/bookingall/:id" element={<BookingAll />} />
                    <Route path="/infouser" element={<InfoUser />} />
                    <Route path="/date/slot/:id/" element={<Checkout />} />
                    <Route path="/booking/:id" element={<CheckOutTour />} />
                </Route>
            </Routes>
            <ChatBot />
        </>
    )
}
export default Router