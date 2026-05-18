// Component for adding a new employee to the system
import { useState } from 'react';
import api from '../utils/axiosConfig';

export default function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Development',
    performanceScore: 50,
    experience: 0,
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const departments = ['Development', 'Marketing', 'HR', 'Sales', 'Design', 'Finance'];

  // Handle standard input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add skill to array on enter or add button click
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // Remove skill from array
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Submit the new employee data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (skills.length === 0) {
      setMessage('Please add at least one skill.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, skills };
      // api instance automatically adds JWT token headers
      const res = await api.post('/employees', payload);
      
      setMessage('Employee added successfully!');
      
      // Reset form
      setFormData({ name: '', email: '', department: 'Development', performanceScore: 50, experience: 0 });
      setSkills([]);
      
      // Notify parent component to update the list
      if (onEmployeeAdded) onEmployeeAdded(res.data.employee);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Add New Employee</h3>
      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Employee Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select name="department" value={formData.department} onChange={handleChange}>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Years of Experience</label>
          <input type="number" name="experience" min="0" value={formData.experience} onChange={handleChange} required />
        </div>
        <div className="form-group full-width">
          <label>Performance Score: {formData.performanceScore}</label>
          <input type="range" name="performanceScore" min="0" max="100" value={formData.performanceScore} onChange={handleChange} className="slider" />
        </div>
        <div className="form-group full-width">
          <label>Skills</label>
          <div className="skill-input-container">
            <input 
              type="text" 
              value={skillInput} 
              onChange={(e) => setSkillInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter') handleAddSkill(e) }}
              placeholder="Type a skill and press Add or Enter" 
            />
            <button type="button" onClick={handleAddSkill} className="btn btn-secondary">Add</button>
          </div>
          <div className="tags-container">
            {skills.map(skill => (
              <span key={skill} className="tag">
                {skill} <button type="button" onClick={() => handleRemoveSkill(skill)}>&times;</button>
              </span>
            ))}
          </div>
        </div>
        <div className="form-group full-width">
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
