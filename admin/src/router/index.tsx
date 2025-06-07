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
import ListTourSchedule from "../pages/TourSchedule/ListTourSchedule"
import EditTourSchedule from "../pages/TourSchedule/EditTourSchedule"
import Login from "../components/Login"
import { useUser } from "@clerk/clerk-react"
import AdminRoute from "../components/AdminRouter"




const Router = () => {
    const { isSignedIn } = useUser();

    // Nếu chưa đăng nhập, luôn chuyển về Login page
    if (!isSignedIn) {
        return (
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        );
    }
    return (
       <>
            <Routes>
                <Route path="/admin"
                    element={
                        <AdminRoute>
                            <Layout />
                        </AdminRoute>
                    }>

                    <Route path="/admin/dashboad" element={<ListDashboad/>}/>

                    <Route path="/admin/list-room" element={<ListRoom />} />
                    <Route path="/admin/add-room" element={<AddRoom />} />
                    <Route path="/admin/edit-room/:id" element={<EditRoom />} />

                    <Route path="/admin/list-tour" element={<ListTour />} />
                    <Route path="/admin/add-tour" element={<AddTour />} />
                    <Route path="/admin/edit-tour/:id" element={<EditTour />} />

                    <Route path="/admin/list-transport" element={<ListTransport />} />
                    <Route path="/admin/add-transport" element={<AddTransport />} />
                    <Route path="/admin/edit-transport/:id" element={<EditTransport />} />


                    <Route path="/admin/list-Transport_Schedule" element={<ListTSchedule />} />
                    <Route path="/admin/add-Transport_Schedule" element={<AddTSchedule />} />
                    <Route path="/admin/edit-Transport_Schedule/:id" element={<EditTSchedule />} />

                    <Route path="/admin/list-tourschedule" element={<ListTourSchedule />} />
                    <Route path="/admin/add-tourschedule" element={<AddTourSchedule />} />
                    <Route path="/admin/edit-tourschedule/:id" element={<EditTourSchedule />} />

                </Route>
            </Routes>
       </>
    )
}
export default Router