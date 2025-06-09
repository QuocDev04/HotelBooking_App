import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"
import Cruise from "../pages/Cruise/Cruise"


const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
                <Route path="/cruise" element={<Cruise />} />
            </Route>
        </Routes>
    )
       
}
export default Router