// Protected Dashboard page that assembles the Employee Form, List, and Search Filter
import { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import SearchFilter from '../components/SearchFilter';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch employees from backend, optionally filtered by department
  const fetchEmployees = async (department = '') => {
    setLoading(true);
    try {
      const endpoint = department ? `/employees/search?department=${department}` : `/employees`;
      const res = await api.get(endpoint);
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on initial mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Callback to add a new employee to the top of the list locally
  const handleEmployeeAdded = (newEmployee) => {
    setEmployees(prev => [newEmployee, ...prev].sort((a, b) => b.performanceScore - a.performanceScore));
  };

  // Callback triggered when the search filter changes
  const handleFilterChange = (department) => {
    fetchEmployees(department);
  };

  // Calculate statistics for the dashboard headers
  const totalEmployees = employees.length;
  const avgPerformance = totalEmployees ? Math.round(employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / totalEmployees) : 0;
  const topPerformer = totalEmployees && employees.length > 0 ? employees[0].name : 'N/A';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Employees</h4>
          <p className="stat-value">{totalEmployees}</p>
        </div>
        <div className="stat-card">
          <h4>Avg Performance</h4>
          <p className="stat-value">{avgPerformance}/100</p>
        </div>
        <div className="stat-card">
          <h4>Top Performer</h4>
          <p className="stat-value">{topPerformer}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-panel">
          <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />
        </div>
        <div className="right-panel">
          <div className="panel-header">
            <h3>Employee Directory</h3>
            <SearchFilter onFilterChange={handleFilterChange} />
          </div>
          
          {error && <p className="alert alert-error">{error}</p>}
          {loading ? (
            <div className="text-center">Loading employees...</div>
          ) : (
            <EmployeeList employees={employees} setEmployees={setEmployees} />
          )}
        </div>
      </div>
    </div>
  );
}
