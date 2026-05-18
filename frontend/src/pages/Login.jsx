// Login page component. Allows users to authenticate and receive a JWT token.
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import AuthContext from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handles input field changes and updates state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission, sends login request, and updates global auth state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Use the configured api instance (automatically prefixes /api)
      const response = await api.post('/auth/login', formData);
      
      const { token, ...userData } = response.data;
      login(userData, token); // Store in context and localStorage
      
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="alert alert-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
}
