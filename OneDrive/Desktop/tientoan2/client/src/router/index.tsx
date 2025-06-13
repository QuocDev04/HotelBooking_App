import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import RoomList from "../pages/Tours/Rooms"
import Transport from "../pages/Tours/Transport"
import DestinationList from "../pages/Tours/DestinationList"

const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
               <Route path="/rooms" element={<RoomList />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/destinations" element={<DestinationList />} />
            </Route>
        </Routes>
    )
       
}
export default Router