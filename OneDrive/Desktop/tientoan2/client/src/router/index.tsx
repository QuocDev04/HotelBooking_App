import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import HotelList from "../pages/Tours/HotelsList"
import Transport from "../pages/Tours/Transport"

const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
                <Route path="/hotels" element={<HotelList />} />
                <Route path="/transport" element={<Transport />} />
            </Route>
        </Routes>
    )
       
}
export default Router