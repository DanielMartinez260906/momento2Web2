import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleBrandClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
        <img className="brand-logo" src="/public/LOGO CRECIENDO JUNTOS.png" alt="Logo de Creciendo Juntos" />
        <span className="brand-name">Creciendo Juntos</span>
      </div>
      
      <button 
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          {isAuthenticated && (
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
            </li>
          )}
          
          {isAuthenticated ? (
            <>
              
              <li>
                <Link to="/my-courses" onClick={() => setIsMenuOpen(false)}>
                   Mis Cursos
                </Link>
              </li>
              <li>
                <span className="nav-user">Hola, {user?.name}</span>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="btn-logout-nav"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-register">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

