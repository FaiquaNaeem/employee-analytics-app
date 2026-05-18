const axios = require('axios');
const Employee = require('../models/Employee');

// @desc    Get AI Recommendation for Employee
// @route   POST /api/ai/recommend
// @access  Protected
const getAIRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      res.status(400);
      throw new Error('Please provide an employeeId');
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const prompt = `You are an HR analytics expert. Based on the following employee data, 
provide specific recommendations. 
Employee: ${employee.name}, Department: ${employee.department}, Skills: ${employee.skills.join(', ')}, 
Performance Score: ${employee.performanceScore}/100, Experience: ${employee.experience} years.

Provide:
1. Promotion Recommendation (Yes/No with reason)
2. Training Suggestions (2-3 specific skills to learn)
3. Performance Feedback (2-3 sentences)
4. Overall Ranking: Excellent/Good/Average/Needs Improvement

Keep response concise and structured.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'Content-Type': 'application/json'
        }
      }
    );

    const recommendation = response.data.choices[0].message.content;

    // Save back to DB
    employee.aiRecommendation = recommendation;
    await employee.save();

    res.status(200).json({ recommendation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAIRecommendation
};
