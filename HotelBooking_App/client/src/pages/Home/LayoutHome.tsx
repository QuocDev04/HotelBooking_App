import { useEffect } from "react"
import AboutUs from "./Main/About"
import Banner from "./Main/Banner"
import FeaturedDestination from "./Main/FeaturedDestination"
import Internatinal from "./Main/Internatinal"
import News from "./Main/News"
import TourIn from "./Main/TourIn"

import HotelPromotion from "./Main/HotelPromotion"

const LayoutHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (

    <div style={{ background: 'transparent' }}>
      <Banner/>
      <AboutUs/>
      <Internatinal/>
      <FeaturedDestination/>
      <HotelPromotion/>
      <TourIn/>
      <News/>
    </div>
  )
}

export default LayoutHome
