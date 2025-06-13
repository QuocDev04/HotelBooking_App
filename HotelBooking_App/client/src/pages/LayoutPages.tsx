import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const LayoutPages = () => {
  return (
    <div>
      <Header />
      <div className="pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default LayoutPages
