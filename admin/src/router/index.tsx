import { Route, Routes } from "react-router-dom"
import Layout from "../pages/Layout"
import ListDashboad from "../pages/dashboad/ListDashboad"
import ListRoom from "../pages/Room/ListRoom"
import AddRoom from "../pages/Room/AddRoom"
import EditRoom from "../pages/Room/EditRoom"
import ListTour from "../pages/Tour/ListTour"
import AddTour from "../pages/Tour/AddTour"




const Router = () => {
    return (
       <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<ListDashboad/>}/>

                    <Route path="/list-room" element={<ListRoom />} />
                    <Route path="/add-room" element={<AddRoom />} />
                    <Route path="/edit-room/:id" element={<EditRoom />} />

                    <Route path="/list-tour" element={<ListTour />} />
                    <Route path="/add-tour" element={<AddTour />} />

                </Route>
            </Routes>
       </>
    )
}
export default Router