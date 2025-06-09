import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FlightBooking from './pages/fight-booking'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path="/flight-booking" element={<FlightBooking />} />

        
      </Routes>
    </Router>
  )
}

export default App
