const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Search employees by department
// @route   GET /api/employees/search?department=Development
// @access  Public
const searchEmployees = async (req, res, next) => {
  try {
    const { department } = req.query;
    let query = {};
    if (department) {
      query.department = department;
    }
    const employees = await Employee.find(query).sort({ performanceScore: -1 });
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new employee
// @route   POST /api/employees
// @access  Protected
const addEmployee = async (req, res, next) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const employeeExists = await Employee.findOne({ email });

    if (employeeExists) {
      res.status(400);
      throw new Error('Employee already exists');
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    res.status(201).json({
      message: 'Employee added successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Protected
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Protected
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    await employee.deleteOne();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
