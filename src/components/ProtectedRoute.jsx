import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige inmediatamente a la página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, permite el acceso al contenido protegido (HomePage y sub-rutas)
  return <Outlet />;
}

export default ProtectedRoute;
