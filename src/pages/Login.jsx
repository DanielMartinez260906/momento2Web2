import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchPost } from '../api/config';
import { ENDPOINTS } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetchPost(ENDPOINTS.AUTH.LOGIN, { email, password });
      
      // Simular respuesta exitosa (en producción vendría del backend)
      login(response.user, response.token);
      
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${response.user.name}, has iniciado sesión correctamente`,
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/my-courses');
      });
    } catch (error) {
      console.error('Error en login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en login',
        text: error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Iniciar Sesión</h1>
        <button
          className="btn-back"
          onClick={() => navigate('/')}
          style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
        >
          ← Volver a inicio
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
