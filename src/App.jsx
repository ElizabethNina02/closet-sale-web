import { useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'

import HomePage from './pages/HomePage';

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
