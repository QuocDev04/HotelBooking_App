import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import InfoAll from "../pages/Introduce/InfoAll"
import Roomdetail from "../pages/Room/Roomdetail"


const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/introduce" element={<InfoAll />} />
                <Route path="/roomdetail" element={<Roomdetail />} />
            </Route>
        </Routes>
    )
       
}
export default Router