import { useEffect } from 'react'
import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import HomePage from './pages/HomePage';
import Products from './libs/Products';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Marketplace from './libs/Marketplace';
import ProductDetail from './libs/ProductDetail';

function App() {
  const location = useLocation();

  const hasToken = !!localStorage.getItem('token');

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
            <Route path="my-products" element={<Products />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="marketplace/:id" element={<ProductDetail />} />
          </Route>
        </Route>

        <Route 
          path="*" 
          element={hasToken ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} 
        />
      </Routes>

    </>
  )
}

export default App
