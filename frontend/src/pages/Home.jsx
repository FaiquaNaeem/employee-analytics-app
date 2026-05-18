// Landing page component describing the application
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>AI-Powered Employee Analytics</h1>
        <p>Manage your workforce intelligently. Analyze performance, skills, and experience with built-in AI recommendations to drive better HR decisions.</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-large">Get Started</Link>
          <Link to="/login" className="btn btn-secondary btn-large">Login</Link>
        </div>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <h3>📊 Track Performance</h3>
          <p>Easily monitor employee performance scores and track their progress over time.</p>
        </div>
        <div className="feature-card">
          <h3>🤖 AI Recommendations</h3>
          <p>Instantly generate personalized training and promotion recommendations via OpenAI.</p>
        </div>
        <div className="feature-card">
          <h3>🎯 Skill Management</h3>
          <p>Keep a comprehensive directory of your teams' skills and years of experience.</p>
        </div>
      </div>
    </div>
  );
}
