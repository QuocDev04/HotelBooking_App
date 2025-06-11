import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './compoments/layout'
import Introduce from './pages/Introduce'
import Clause from './pages/Clause'
import Privacy from './pages/Privacy'
import Use from './pages/Use'
import InfoAll from './pages/InfoAll'

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<InfoAll />} />
          <Route path="/introduce" element={<Introduce />} />
          <Route path="/clause" element={<Clause />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/use" element={<Use />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
