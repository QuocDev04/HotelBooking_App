import { Route, Routes } from "react-router-dom"
import LayoutPages from "../pages/LayoutPages"
import Home from "../pages/Home/LayoutHome"


const Router = () => {
    return (
         <Routes>
            <Route path="/" element={<LayoutPages/>}>
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    )
       
}
export default Router