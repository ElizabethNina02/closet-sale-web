import { useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'

import HomePage from './pages/HomePage';
import Products from './libs/Products';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

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
        {/* 🔑 RUTA PÚBLICA: Cualquiera puede entrar al login sin token */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 RUTAS PROTEGIDAS: Se requiere token para acceder a todo lo que esté aquí dentro */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />}>
            <Route index element={<Products />} />
            {/* <Route path="orders" element={<Orders />} /> */}
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
