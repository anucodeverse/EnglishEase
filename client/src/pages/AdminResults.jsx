
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import "../styles/AdminResults.css";

function AdminResults() {
  const { user, loading: authLoading } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await API.get("/exams/results/all");
        setResults(response.data.results || []);
      } catch (err) {
        console.error("Admin results error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load student results."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchResults();
    }
  }, [user]);

  if (authLoading) {
    return <div className="admin-results-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-results-layout">
      <Sidebar />

      <main className="admin-results-main">
        <header className="admin-results-header">
          <div>
            <p className="admin-results-label">
              ENGLISHEASE / ADMINISTRATION
            </p>
            <h1>Student Exam Results</h1>
            <p>View and monitor all student exam submissions.</p>
          </div>

          <Link to="/admin" className="admin-results-back">
            Back to Dashboard
          </Link>
        </header>

        <section className="admin-results-summary">
          <div>
            <span>Total Submissions</span>
            <h2>{loading ? "—" : results.length}</h2>
          </div>

          <div>
            <span>Average Score</span>
            <h2>
              {loading
                ? "—"
                : results.length > 0
                ? `${(
                    results.reduce(
                      (total, result) =>
                        total + (result.percentage || 0),
                      0
                    ) / results.length
                  ).toFixed(1)}%`
                : "0.0%"}
            </h2>
          </div>
        </section>

        <section className="admin-results-content">
          <div className="admin-results-section-heading">
            <div>
              <p className="admin-results-label">PERFORMANCE</p>
              <h2>All Student Results</h2>
            </div>
          </div>

          {loading && <p>Loading student results...</p>}

          {error && (
            <div className="admin-results-error">{error}</div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="admin-results-empty">
              <h3>No exam submissions yet</h3>
              <p>Student results will appear here after exams are completed.</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="admin-results-table-wrapper">
              <table className="admin-results-table">
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>EMAIL</th>
                    <th>EXAM</th>
                    <th>SCORE</th>
                    <th>PERCENTAGE</th>
                    <th>SUBMITTED ON</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td>
                        <strong>
                          {result.student?.name || "Unknown Student"}
                        </strong>
                      </td>

                      <td>
                        {result.student?.email || "Not available"}
                      </td>

                      <td>
                        {result.exam?.title || "Unknown Exam"}
                      </td>

                      <td>
                        {result.score} / {result.totalMarks}
                      </td>

                      <td>
                        <span className="admin-results-score">
                          {result.percentage}%
                        </span>
                      </td>

                      <td>
                        {result.submittedAt
                          ? new Date(result.submittedAt).toLocaleString()
                          : "Not available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminResults;
