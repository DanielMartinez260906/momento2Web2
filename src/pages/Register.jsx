import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchPost } from '../api/config';
import { ENDPOINTS } from '../api/endpoints';
import { cursos } from '../data/courses';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // 'student' o 'teacher'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    profesionalCard: '',
    subject: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const requiredFields = [formData.name, formData.email, formData.password, formData.confirmPassword, formData.age];
    if (userType === 'teacher') {
      requiredFields.push(formData.profesionalCard, formData.subject);
    }
    
    if (requiredFields.some(field => !field)) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas no coinciden',
        text: 'Las contraseñas deben ser iguales',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await fetchPost(ENDPOINTS.AUTH.REGISTER, dataToSend);

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente. Ahora inicia sesión.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error('Error en registro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en registro',
        text: error.message || 'No se pudo completar el registro. Intenta de nuevo.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>¿Cómo deseas registrarte?</h1>
          <button
            className="btn-back"
            onClick={() => navigate('/')}
            style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
          >
            ← Volver a inicio
          </button>
          <div className="user-type-selection">
            <button
              className="btn-user-type"
              onClick={() => setUserType('student')}
            >
              📚 Registrar como Estudiante
            </button>
            <button
              className="btn-user-type"
              onClick={() => setUserType('teacher')}
            >
              👨‍🏫 Registrar como Docente
            </button>
          </div>
          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registrarse como {userType === 'student' ? 'Estudiante' : 'Docente'}</h1>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            className="btn-back"
            onClick={() => setUserType(null)}
            style={{ flex: 1, padding: '8px 16px', cursor: 'pointer', minWidth: '150px' }}
          >
            ← Volver a seleccionar tipo
          </button>
          <button
            className="btn-back"
            onClick={() => navigate('/')}
            style={{ flex: 1, padding: '8px 16px', cursor: 'pointer', minWidth: '150px' }}
          >
            🏠 Ir a inicio
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Edad</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Tu edad"
              min="5"
              max="120"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          {userType === 'teacher' && (
            <>
              <div className="form-group">
                <label htmlFor="profesionalCard">Tarjeta Profesional</label>
                <input
                  type="text"
                  id="profesionalCard"
                  name="profesionalCard"
                  value={formData.profesionalCard}
                  onChange={handleChange}
                  placeholder="Número de tarjeta profesional"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Materia a Enseñar</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-select"
                >
                  <option value="">Selecciona una materia</option>
                  {cursos.map(curso => (
                    <option key={curso.id} value={curso.nombre}>
                      {curso.emoji} {curso.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
