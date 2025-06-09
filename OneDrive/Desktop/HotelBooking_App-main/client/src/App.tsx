import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FlightBooking from './pages/fight-booking'
import Layout from './compoments/Layout'
import BusinessPage from './pages/business'
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path="/flight-booking" element={<FlightBooking />} />
          <Route path="/business" element={<BusinessPage />} />

        </Routes>
      </Layout>
    </Router>
  )
}

export default App
