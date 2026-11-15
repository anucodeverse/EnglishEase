
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
    return <p>Loading...</p>;
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
            (total, result) => total + result.percentage,
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <p className="admin-label">ADMINISTRATION</p>
        <h1>Admin Dashboard</h1>
        <p>Manage exams and monitor student performance.</p>
      </div>

      {loading && <p className="admin-message">Loading dashboard...</p>}

      {error && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <p>Active Exams</p>
              <h2>{exams.length}</h2>
            </div>

            <div className="admin-stat-card">
              <p>Total Submissions</p>
              <h2>{results.length}</h2>
            </div>

            <div className="admin-stat-card">
              <p>Average Score</p>
              <h2>{averageScore}%</h2>
            </div>
          </div>

          <div className="admin-section">
            <h2>Recent Student Results</h2>

            {results.length === 0 ? (
              <p className="admin-message">
                No student submissions available yet.
              </p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Exam</th>
                      <th>Score</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.slice(0, 10).map((result) => (
                      <tr key={result._id}>
                        <td>{result.student?.name || "Unknown"}</td>
                        <td>{result.exam?.title || "Unknown Exam"}</td>
                        <td>
                          {result.score} / {result.totalMarks}
                        </td>
                        <td>{result.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <div className="admin-actions">
        <Link to="/exams" className="admin-action-link">
          View Online Exams
        </Link>

        <Link to="/results" className="admin-action-link">
          My Results
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
