
import { Route } from "react-router-dom"
import PaymentPage from "./pages/Tour/payment"
import Blog from "./pages/Tour/blog"
import { HotelPolicy } from "./pages/Tour/hotelPolicy"
import TourPage from "./pages/Tour/detailTour"

const App = () => {
  return (
    <div>
      
          <Route path="/payment" element={<PaymentPage />} />Add commentMore actions
          <Route path="/blog" element={<Blog />} />
          <Route path="/hotelPolicy" element={<HotelPolicy />} />
          <Route path="/detailtour" element={<TourPage/>} />

    </div>
  )
}

export default App
