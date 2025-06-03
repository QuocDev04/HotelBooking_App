import { Route, Routes } from "react-router-dom"
import Layout from "../pages/Layout"




const Router = () => {
    return (
       <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                </Route>
            </Routes>
       </>
    )
}
export default Router