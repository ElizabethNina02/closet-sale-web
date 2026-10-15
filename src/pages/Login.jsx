import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';

function Login() {
  const [errorBackend, setErrorBackend] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    setErrorBackend('');
    setCargando(true);

    try {
      // Petición POST real a tu controlador de Spring Boot
      // data contiene { username: '...', password: '...' }
      const response = await api.post('/auth/token', data);

      /* 
        NOTA: Spring Boot debe retornar un JSON con el token JWT. Ej:
        { "token": "eyJhbGciOi...", "username": "admin" }
      */
      const { token, username } = response.data;

      if (token) {
        // Guardamos el JWT real en el navegador
        localStorage.setItem('token', token);
        if (username) localStorage.setItem('username', username);

        // Redirigimos al HomePage protegido
        navigate('/');
      }
    } catch (err) {
      // Capturamos errores de credenciales inválidas (401/403) o servidor caído
      if (err.response) {
        setErrorBackend(err.response.data.message || 'Usuario o contraseña incorrectos.');
      } else {
        setErrorBackend('No se pudo conectar con el servidor de Spring Boot.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md max-w-sm w-full border dark:border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
          Iniciar Sesión 👗
        </h2>

        {/* Alerta de error real del backend */}
        {errorBackend && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
            ⚠️ {errorBackend}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input de Usuario */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">
              Usuario
            </label>
            <input
              type="text"
              className={`w-full border rounded-lg p-2 transition-colors focus:outline-none dark:bg-slate-700 dark:text-white ${
                errors.username ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'
              }`}
              placeholder="Tu usuario"
              {...register('username', { required: 'El usuario es obligatorio' })}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          {/* Input de Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">
              Contraseña
            </label>
            <input
              type="password"
              className={`w-full border rounded-lg p-2 transition-colors focus:outline-none dark:bg-slate-700 dark:text-white ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500'
              }`}
              placeholder="••••••••"
              {...register('password', { required: 'La contraseña es obligatoria' })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Autenticando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
