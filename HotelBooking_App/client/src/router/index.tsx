import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import CruisePage from "../pages/Seach/cruise"
import FlightBooking from "../pages/Seach/FlightBooking"
import HotelPage from "../pages/Seach/Hotels"
import Roomdetail from "../pages/Room/Roomdetail"
import PaymentPage from "../pages/Tour/payment"
import Blog from "../pages/Tour/blog"
import { HotelPolicy } from "../pages/Tour/hotelPolicy"
import JapanTourPage from "../pages/Tour/detailTour"
import BookingRoom from "../pages/Booking/BookingRoom"


const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
                <Route path="/a" element={<CruisePage />} />
                <Route path="/b" element={<FlightBooking />} />
                <Route path="/c" element={<HotelPage />} />
                <Route path="/roomdetail" element={<Roomdetail />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/hotelPolicy" element={<HotelPolicy />} />
                <Route path="/detailtour" element={<JapanTourPage />} />
                <Route path="/bookingroom" element={<BookingRoom />} />

            </Route>
        </Routes>
    )
       
}
export default Router