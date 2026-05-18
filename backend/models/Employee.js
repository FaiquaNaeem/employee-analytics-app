const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the employee name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide the employee email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    department: {
      type: String,
      required: [true, 'Please provide the department'],
      enum: {
        values: ['Development', 'Marketing', 'HR', 'Sales', 'Design', 'Finance'],
        message: '{VALUE} is not a supported department',
      },
    },
    skills: {
      type: [String],
      required: [true, 'Please provide at least one skill'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'An employee must have at least one skill',
      },
    },
    performanceScore: {
      type: Number,
      required: [true, 'Please provide a performance score'],
      min: [0, 'Performance score cannot be less than 0'],
      max: [100, 'Performance score cannot be more than 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    aiRecommendation: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
