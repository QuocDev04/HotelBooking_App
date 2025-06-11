import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import CruisePage from "../pages/Cruise/Cruise"
import FlightBooking from "../pages/Cruise/FlightBooking"
import HotelPage from "../pages/Cruise/Hotels"
const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
                <Route path="/cruise" element={<CruisePage />} />
                <Route path="/flightBooking" element={<FlightBooking />} />
                <Route path="/hotel" element={<HotelPage />} />
            </Route>
        </Routes>
    )
       
}
export default Router