import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import RoomList from "../pages/Tours/Rooms"
import Transport from "../pages/Tours/Transport"
import DestinationList from "../pages/Tours/DestinationList"
import TransportDetail from "../pages/Tours/TransportDeatil"

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
            </Route>
        </Routes>
    )
       
}
export default Router