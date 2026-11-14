
import { Link } from "react-router-dom";
import "../styles/Home.css";
function Home() {
  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="home-navbar">
        <Link to="/" className="home-logo">
          English<span>Ease.</span>
        </Link>

        <div className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="home-nav-actions">
          <Link to="/login" className="nav-login">
            Login
          </Link>
          <Link to="/register" className="nav-register">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero" id="home">
        <div className="hero-content">
          <p className="hero-tagline">
            YOUR JOURNEY TO CONFIDENT ENGLISH STARTS HERE
          </p>

          <h1>
            Speak English.
            <br />
            <span>Express Yourself.</span>
            <br />
            Grow Confident.
          </h1>

          <p className="hero-description">
            Improve your English communication skills with interactive
            lessons, practical exercises, and personalized learning.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="hero-primary-btn">
              Start Learning →
            </Link>

            <Link to="/login" className="hero-secondary-btn">
              Login to Continue
            </Link>
          </div>

          <div className="hero-trust">
            <span>Learn at your own pace</span>
            <span>•</span>
            <span>Practice every day</span>
            <span>•</span>
            <span>Build confidence</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-card">
            <div className="hero-image-placeholder">
              <span>HELLO!</span>
              <h2>Your English Journey Starts Today.</h2>
              <p>Learn · Practice · Improve</p>
            </div>
          </div>

          <div className="floating-card floating-card-top">
            <span>✦</span> Learn Something New
          </div>

          <div className="floating-card floating-card-bottom">
            <span>✓</span> Confidence Begins Here
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features" id="features">
        <p className="section-tag">WHAT YOU WILL LEARN</p>

        <h2>Everything You Need to Improve Your English</h2>

        <p className="section-description">
          Practice essential English skills through simple and engaging
          learning activities.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">📖</span>
            <h3>Grammar Practice</h3>
            <p>Understand grammar rules and improve your sentence structure.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h3>Vocabulary Building</h3>
            <p>Learn new words and use them confidently in conversations.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">✍️</span>
            <h3>Sentence Practice</h3>
            <p>Build meaningful sentences and improve your writing skills.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Online Exams</h3>
            <p>Test your knowledge and track your learning progress.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="home-about" id="about">
        <div>
          <p className="section-tag">ABOUT ENGLISHEASE</p>
          <h2>Small Steps Today. Better Communication Tomorrow.</h2>
        </div>

        <p>
          EnglishEase is designed to make English learning easier,
          more practical, and more enjoyable. Learn new concepts,
          practice regularly, and become more confident one step at a time.
        </p>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <Link to="/" className="home-logo">
          English<span>Ease.</span>
        </Link>
        <p>Learn. Practice. Communicate with Confidence.</p>
        <p>© 2026 EnglishEase. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
