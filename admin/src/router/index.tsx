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
import ListBooking from "../pages/Tour/ListBooking"
import ListBlog from "../pages/Blog/ListBlog"
import AddBlog from "../pages/Blog/AddBlog"
import EditBlog from "../pages/Blog/EditBlog"
import Login from "../components/Login"
import { useUser } from "@clerk/clerk-react"
import AdminRoute from "../components/AdminRouter"
import AddTimeTour from "../pages/TimeTour/AddTimeTour"
import ListTime from "../pages/TimeTour/ListTime"
import EditTimeTour from "../pages/TimeTour/EditTimeTour"
// import TourStats from "../pages/dashboad/TourStats" // Đã bỏ trang thống kê tổng quan
import TourStatusList from "../pages/Tour/TourStatusList"
import RefundManagement from "../pages/Tour/RefundManagement"
import TourParticipants from "../pages/Tour/TourParticipants"
import CustomerAccounts from "../pages/Account/CustomerAccounts"
import EmployeeAccounts from "../pages/Account/EmployeeAccounts"
import EmployeeAssignment from "../pages/Account/EmployeeAssignment"
import ListRoomBooking from "../pages/Room/ListRoomBooking"




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

                    <Route path="/admin/dashboad" element={<ListDashboad />} />

                    <Route path="/admin/list-room" element={<ListRoom />} />
                    <Route path="/admin/add-room" element={<AddRoom />} />
                    <Route path="/admin/edit-room/:id" element={<EditRoom />} />
                    <Route path="/admin/room-bookings" element={<ListRoomBooking />} />

                    <Route path="/admin/list-tour" element={<ListTour />} />
                    <Route path="/admin/add-tour" element={<AddTour />} />
                    <Route path="/admin/edit-tour/:id" element={<EditTour />} />
                    <Route path="/admin/list-booking" element={<ListBooking />} />
                    {/* <Route path="/admin/tour-stats" element={<TourStats />} /> */} {/* Đã bỏ trang thống kê tổng quan */}
                    <Route path="/admin/tour-status/:status" element={<TourStatusList />} />
                    <Route path="/admin/refund-management" element={<RefundManagement />} />
                    <Route path="/admin/tour/participants/:slotId" element={<TourParticipants />} />

                    <Route path="/admin/list-transport" element={<ListTransport />} />
                    <Route path="/admin/add-transport" element={<AddTransport />} />
                    <Route path="/admin/edit-transport/:id" element={<EditTransport />} />


                    <Route path="/admin/list-Transport_Schedule" element={<ListTSchedule />} />
                    <Route path="/admin/add-Transport_Schedule" element={<AddTSchedule />} />
                    <Route path="/admin/edit-Transport_Schedule/:id" element={<EditTSchedule />} />

                    <Route path="/admin/list-tourschedule" element={<ListTourSchedule />} />
                    <Route path="/admin/add-tourschedule" element={<AddTourSchedule />} />
                    <Route path="/admin/edit-tourschedule/:id" element={<EditTourSchedule />} />

                    <Route path="/admin/list-blog" element={<ListBlog />} />
                    <Route path="/admin/add-blog" element={<AddBlog />} />
                    <Route path="/admin/edit-blog/:id" element={<EditBlog />} />

                    <Route path="/admin/list-time" element={<ListTime />} />
                    <Route path="/admin/add-timetour" element={<AddTimeTour />} />
                    <Route path="/admin/edit-time-tour/:id" element={<EditTimeTour />} />

                    <Route path="/admin/customer-accounts" element={<CustomerAccounts />} />
                    <Route path="/admin/employee-accounts" element={<EmployeeAccounts />} />
                    <Route path="/admin/employee-assignment" element={<EmployeeAssignment />} />
                </Route>
            </Routes>
        </>
    )
}
export default Router