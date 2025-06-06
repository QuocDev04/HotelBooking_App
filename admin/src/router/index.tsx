import { Route, Routes } from "react-router-dom"
import Layout from "../pages/Layout"
import ListDashboad from "../pages/dashboad/ListDashboad"
import ListRoom from "../pages/Room/ListRoom"
import AddRoom from "../pages/Room/AddRoom"
import EditRoom from "../pages/Room/EditRoom"
import ListTour from "../pages/Tour/ListTour"
import AddTour from "../pages/Tour/AddTour"
import EditTour from "../pages/Tour/EditTour"
import ListTransport from "../pages/Transport/ListTransport"
import AddTransport from "../pages/Transport/AddTransport"
import EditTransport from "../pages/Transport/EditTransport"
import ListTSchedule from "../pages/TransportSchedule/ListTSchedule"
import AddTSchedule from "../pages/TransportSchedule/AddTSchedule"
import EditTSchedule from "../pages/TransportSchedule/EditTSchedule"
import AddTourSchedule from "../pages/TourSchedule/AddTourSchedule"




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
                    <Route path="/edit-tour/:id" element={<EditTour />} />

                    <Route path="/list-transport" element={<ListTransport />} />
                    <Route path="/add-transport" element={<AddTransport />} />
                    <Route path="/edit-transport/:id" element={<EditTransport />} />


                    <Route path="/list-Transport_Schedule" element={<ListTSchedule />} />
                    <Route path="/add-Transport_Schedule" element={<AddTSchedule />} />
                    <Route path="/edit-Transport_Schedule/:id" element={<EditTSchedule />} />

                    <Route path="/add-tourschedule" element={<AddTourSchedule />} />


                </Route>
            </Routes>
       </>
    )
}
export default Router