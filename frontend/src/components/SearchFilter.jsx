// Filter component to search employees by department
export default function SearchFilter({ onFilterChange }) {
  const departments = ['All Departments', 'Development', 'Marketing', 'HR', 'Sales', 'Design', 'Finance'];

  // Handle dropdown change and notify parent (Dashboard)
  const handleChange = (e) => {
    const value = e.target.value;
    onFilterChange(value === 'All Departments' ? '' : value);
  };

  return (
    <div className="search-filter">
      <label style={{ marginRight: '10px' }}>Filter by Department: </label>
      <select onChange={handleChange} className="filter-select">
        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
      </select>
    </div>
  );
}
