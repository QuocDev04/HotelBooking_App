import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FlightBooking from './pages/flight-booking'
import BusinessPage from './pages/business-page'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path="/flight-booking" element={<FlightBooking />} />
        <Route path='/business' element={<BusinessPage />} />

      </Routes>
    </Router>
  )
}

export default App
