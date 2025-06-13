import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import CruisePage from "../pages/Seach/cruise"
import FlightBooking from "../pages/Seach/FlightBooking"
import HotelPage from "../pages/Seach/Hotels"
import YachtDetailPage from "../pages/Book/yacht"


const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
                <Route path="/a" element={<CruisePage />} />
                <Route path="/b" element={<FlightBooking />} />
                <Route path="/c" element={<HotelPage />} />
                <Route path="/d" element={<YachtDetailPage />} />
            </Route>
        </Routes>
    )
       
}
export default Router