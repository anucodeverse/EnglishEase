
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "admin") {
  return <Navigate to="/admin" replace />;
}
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* Top Navigation */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-header-label">STUDENT PORTAL</p>
            <h2>My Dashboard</h2>
          </div>

          <div className="dashboard-header-right">
            <span className="dashboard-user-name">
              Welcome, {user.name}
            </span>
            <div className="dashboard-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-content">

          {/* Welcome Section */}
          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">YOUR LEARNING JOURNEY</p>
              <h1>
                Welcome back, <span>{user.name}!</span>
              </h1>
              <p>
                Ready to improve your English today? Let's keep learning!
              </p>
            </div>

            <div className="welcome-decoration">✦</div>
          </section>

          {/* Statistics */}
          <section className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">📖</span>
              <div>
                <h2>0</h2>
                <p>Lessons Completed</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🎯</span>
              <div>
                <h2>0</h2>
                <p>Exams Attempted</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <div>
                <h2>0</h2>
                <p>Points Earned</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <div>
                <h2>0</h2>
                <p>Learning Streak</p>
              </div>
            </div>
          </section>

          {/* Learning Activities */}
          <section className="dashboard-learning">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">KEEP IMPROVING</p>
                <h2>Your Learning Activities</h2>
              </div>
              <p>Choose an activity to get started.</p>
            </div>

            <div className="learning-grid">
              <div className="learning-card">
                <span className="learning-icon">📚</span>
                <h3>Grammar Practice</h3>
                <p>Learn grammar rules and build correct English sentences.</p>
                <span className="coming-soon">Coming Soon</span>
              </div>

              <div className="learning-card">
                <span className="learning-icon">🔤</span>
                <h3>Vocabulary Building</h3>
                <p>Discover new words and improve your everyday vocabulary.</p>
                <span className="coming-soon">Coming Soon</span>
              </div>

              <div className="learning-card">
                <span className="learning-icon">✍️</span>
                <h3>Sentence Practice</h3>
                <p>Practice creating meaningful and grammatically correct sentences.</p>
                <span className="coming-soon">Coming Soon</span>
              </div>

              <div className="learning-card">
                <span className="learning-icon">📝</span>
                <h3>Online Exams</h3>
                <p>Test your English knowledge and check your performance.</p>
                <span className="coming-soon">Coming Soon</span>
              </div>
            </div>
          </section>

          {/* Motivation */}
          <section className="dashboard-motivation">
            <div>
              <p className="dashboard-eyebrow">DAILY MOTIVATION</p>
              <h2>"Every word you learn makes you more confident."</h2>
              <p>Keep practicing. Your progress starts with one small step.</p>
            </div>
            <span className="motivation-star">✦</span>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;
