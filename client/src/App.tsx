import React from 'react'
import Layout from './compoments/layout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import PaymentPage from './pages/payment.tsx'
import Blog from './pages/blog.tsx'
import { HotelPolicy } from './pages/FAQ.tsx'
import { FAQ } from './pages/hotelPolicy.tsx'


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/hotelPolicy" element={<HotelPolicy />} />
          <Route path="/FAQ" element={<FAQ />} />

        </Routes>
      </Layout>
    </Router>
  )
}

export default App