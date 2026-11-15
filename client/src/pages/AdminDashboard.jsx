
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [examResponse, resultResponse] = await Promise.all([
          API.get("/exams"),
          API.get("/exams/results/all")
        ]);

        setExams(examResponse.data.exams || []);
        setResults(resultResponse.data.results || []);
      } catch (err) {
        console.error("Admin dashboard error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  if (authLoading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const averageScore =
    results.length > 0
      ? (
          results.reduce(
            (total, result) => total + (result.percentage || 0),
            0
          ) / results.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-label">ENGLISHEASE / ADMINISTRATION</p>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage exams and monitor student performance.
            </p>
          </div>

          <div className="admin-user">
            <div className="admin-user-info">
              <strong>{user.name}</strong>
              <span>Administrator</span>
            </div>
            <div className="admin-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-welcome-tag">ADMIN CONTROL CENTER</span>
            <h2>Welcome back, {user.name}!</h2>
            <p>
              Here's an overview of exams and student performance.
            </p>
          </div>
          <div className="admin-welcome-icon">AD</div>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Exams</span>
              <span className="admin-stat-icon">EX</span>
            </div>
            <h2>{loading ? "—" : exams.length}</h2>
            <p>Exams available in the platform</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Submissions</span>
              <span className="admin-stat-icon">RS</span>
            </div>
            <h2>{loading ? "—" : results.length}</h2>
            <p>Student exam submissions</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Average Score</span>
              <span className="admin-stat-icon">%</span>
            </div>
            <h2>{loading ? "—" : `${averageScore}%`}</h2>
            <p>Average student performance</p>
          </div>
        </section>

        <section className="admin-quick-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-label">QUICK ACCESS</p>
              <h2>Manage Your Platform</h2>
            </div>
          </div>

          <div className="admin-quick-actions">
            <Link to="/exams" className="admin-quick-card">
              <span className="quick-icon">EX</span>
              <div>
                <h3>Manage Exams</h3>
                <p>View available online exams</p>
              </div>
              <span className="quick-arrow">→</span>
            </Link>

            <Link to="/results" className="admin-quick-card">
              <span className="quick-icon">RS</span>
              <div>
                <h3>View Results</h3>
                <p>Check exam results and scores</p>
              </div>
              <span className="quick-arrow">→</span>
            </Link>
          </div>
        </section>

        <section className="admin-results-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-label">PERFORMANCE</p>
              <h2>Recent Student Results</h2>
            </div>

            <Link to="/results" className="admin-view-all">
              View all results →
            </Link>
          </div>

          {loading && (
            <div className="admin-empty">
              Loading student results...
            </div>
          )}

          {error && (
            <div className="admin-error">{error}</div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="admin-empty">
              <div className="admin-empty-icon">RS</div>
              <h3>No submissions yet</h3>
              <p>Student exam results will appear here.</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>EXAM</th>
                    <th>SCORE</th>
                    <th>PERCENTAGE</th>
                  </tr>
                </thead>

                <tbody>
                  {results.slice(0, 10).map((result) => (
                    <tr key={result._id}>
                      <td>
                        <div className="admin-student-cell">
                          <span className="student-avatar">
                            {result.student?.name?.charAt(0).toUpperCase() || "S"}
                          </span>
                          {result.student?.name || "Unknown"}
                        </div>
                      </td>
                      <td>{result.exam?.title || "Unknown Exam"}</td>
                      <td>
                        {result.score} / {result.totalMarks}
                      </td>
                      <td>
                        <span className="score-badge">
                          {result.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="admin-footer">
          <span>EnglishEase Administration</span>
          <span>Learn. Practice. Improve.</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
