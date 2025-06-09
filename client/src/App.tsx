import React from 'react'
import Layout from './compoments/layout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import  CruisePage from './pages/cruise.tsx'
import FlightBooking from './pages/FlightBooking.tsx'
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cruise" element={<CruisePage />} />
          <Route path="/flight-booking" element={<FlightBooking />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
