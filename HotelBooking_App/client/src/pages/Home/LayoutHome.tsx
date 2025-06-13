import { useEffect } from "react"
import AboutUs from "./Main/About"
import Banner from "./Main/Banner"
import FeaturedDestination from "./Main/FeaturedDestination"
import Internatinal from "./Main/Internatinal"
import News from "./Main/News"
import TourIn from "./Main/TourIn"
import TourOut from "./Main/TourOut"
import TourPromotion from "./Main/TourPromotion"

const LayoutHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div>
      <Banner/>
      <AboutUs/>
      <Internatinal/>
      <FeaturedDestination/>
      <TourPromotion/>
      <TourOut/>
      <TourIn/>
      <News/>
    </div>
  )
}

export default LayoutHome
