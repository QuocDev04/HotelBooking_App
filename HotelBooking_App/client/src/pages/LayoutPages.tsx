import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const LayoutPages = () => {
  return (
    <div>
      <Header/>
<<<<<<< HEAD
      <div className="pt-20">
  <Outlet />
</div>
=======
      <Outlet/>
>>>>>>> origin/main
      <Footer/>
    </div>
  )
}

export default LayoutPages
