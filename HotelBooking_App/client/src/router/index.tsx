import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import RoomList from "../pages/Tours/Rooms"
import Transport from "../pages/Tours/Transport"
import DestinationList from "../pages/Tours/DestinationList"
import TransportDetail from "../pages/Tours/TransportDeatil"
import Roomdetail from "../pages/Room/Roomdetail"
import PaymentPage from "../pages/Payment/payment"
import Blog from "../pages/Blog/blog"
import { HotelPolicy } from "../pages/Blog/hotelPolicy"
import JapanTourPage from "../pages/Tour/detailTour"
import BookingRoom from "../pages/Booking/BookingRoom"
import BookingAll from "../pages/Booking/BookingAll"
const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
               <Route path="/rooms" element={<RoomList />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/destinations" element={<DestinationList />} />
                <Route path="/transports" element={<TransportDetail />} />
                <Route path="/roomdetail" element={<Roomdetail />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/hotelPolicy" element={<HotelPolicy />} />
                <Route path="/detailtour/:id" element={<JapanTourPage />} />
                <Route path="/bookingroom" element={<BookingRoom />} />
                <Route path="/bookingall" element={<BookingAll />} />
            </Route>
        </Routes>
    )
}
export default Router