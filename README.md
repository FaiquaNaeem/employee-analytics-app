# Employee Performance Analytics

An AI-powered MERN stack application designed to help HR departments track employee performance and instantly generate personalized promotion and training recommendations using OpenAI.

## Features
- **User Authentication:** Secure JWT-based login and registration system.
- **Employee Management:** Add, delete, and view a complete directory of employees.
- **Search & Filter:** Instantly filter employees by their department.
- **AI Recommendations:** Generates structured feedback (Promotions, Training, Ranking) automatically via OpenAI/OpenRouter APIs.
- **Performance Tracking:** Visual color-coded progress bars based on performance scores.

## Tech Stack
- **Frontend:** React, Vite, React Router DOM, Axios, standard CSS
- **Backend:** Node.js, Express, Mongoose, JSONWebToken, BcryptJS
- **Database:** MongoDB
- **AI Integration:** OpenAI / OpenRouter (gpt-3.5-turbo)

## Environment Variables
Before running the application, ensure you have set up your `.env` files in both the frontend and backend folders.

**`backend/.env`**
```env
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET_KEY=your_jwt_secret_here
OPENAI_API_KEY=your_openai_key_here
PORT=5000
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

## How to Run Locally

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Start Backend Server:**
   ```bash
   npm run dev
   ```
3. **Install Frontend Dependencies (in a new terminal):**
   ```bash
   cd frontend
   npm install
   ```
4. **Start Frontend Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (or the port specified by Vite) in your browser.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login to receive JWT token
- `GET /profile` - (Protected) Get user details

### Employees (`/api/employees`)
- `GET /` - Get all employees
- `GET /search?department=XYZ` - Get filtered employees
- `POST /` - (Protected) Add a new employee
- `PUT /:id` - (Protected) Update an employee
- `DELETE /:id` - (Protected) Delete an employee

### AI Recommendations (`/api/ai`)
- `POST /recommend` - (Protected) Generate or retrieve an AI performance recommendation

## Deployment Instructions
1. **Frontend:** Can be deployed seamlessly on Vercel or Netlify. Set `VITE_API_URL` to your production backend URL.
2. **Backend:** Can be deployed on Render, Heroku, or DigitalOcean. Ensure all environment variables are added to your hosting provider's dashboard. Ensure MongoDB network access allows connections from anywhere (`0.0.0.0/0`).
