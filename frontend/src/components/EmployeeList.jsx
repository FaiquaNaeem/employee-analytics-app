// Component that displays the list of employees with visual data and AI integration
import { useState } from 'react';
import api from '../utils/axiosConfig';
import AIRecommendation from './AIRecommendation';

export default function EmployeeList({ employees, setEmployees }) {
  const [loadingId, setLoadingId] = useState(null);

  // Helper to visually color code the performance score
  const getScoreColor = (score) => {
    if (score >= 75) return '#22c55e'; // green
    if (score >= 50) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  // Handles deleting an employee and updating UI
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setLoadingId(id);
    try {
      await api.delete(`/employees/${id}`);
      // Remove from list without requiring a full refetch
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      alert('Failed to delete employee');
    } finally {
      setLoadingId(null);
    }
  };

  // Callback to update the AI recommendation of an employee in the list
  const handleRecommendationUpdated = (id, newRecommendation) => {
    setEmployees(employees.map(emp => emp._id === id ? { ...emp, aiRecommendation: newRecommendation } : emp));
  };

  if (!employees || employees.length === 0) {
    return <div className="card text-center">No employees found. Add one to get started!</div>;
  }

  return (
    <div className="employee-list">
      {employees.map(emp => (
        <div key={emp._id} className="card employee-card">
          <div className="employee-header">
            <div>
              <h3>{emp.name}</h3>
              <p className="text-gray">{emp.email}</p>
            </div>
            <button 
              onClick={() => handleDelete(emp._id)} 
              disabled={loadingId === emp._id}
              className="btn btn-danger"
            >
              {loadingId === emp._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          
          <div className="employee-details">
            <p><strong>Department:</strong> {emp.department}</p>
            <p><strong>Experience:</strong> {emp.experience} years</p>
          </div>

          <div className="employee-skills">
            <strong>Skills:</strong>
            <div className="tags-container">
              {emp.skills.map(skill => <span key={skill} className="tag tag-blue">{skill}</span>)}
            </div>
          </div>

          <div className="employee-score">
            <strong>Performance Score: {emp.performanceScore}/100</strong>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${emp.performanceScore}%`, 
                  backgroundColor: getScoreColor(emp.performanceScore) 
                }}
              ></div>
            </div>
          </div>

          <AIRecommendation employee={emp} onRecommendationUpdated={handleRecommendationUpdated} />
        </div>
      ))}
    </div>
  );
}
