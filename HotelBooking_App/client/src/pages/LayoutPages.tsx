import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

const LayoutPages = () => {
  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        minHeight: '100vh'
      }}
    >
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default LayoutPages
