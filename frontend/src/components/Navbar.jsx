import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">Employee Analytics</NavLink>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <span className="user-greeting">Welcome, {user?.name}</span>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Login</NavLink>
            <NavLink to="/register" className="btn btn-primary">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
