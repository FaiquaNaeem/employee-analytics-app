const express = require('express');
const router = express.Router();
const {
  getEmployees,
  searchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (GET routes are public as per instruction "except GET")
router.get('/', getEmployees);
router.get('/search', searchEmployees);

// Protected routes
router.post('/', protect, addEmployee);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
