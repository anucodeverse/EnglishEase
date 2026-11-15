
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "../styles/ExamResults.css";

function ExamResults() {
  const { user, loading: authLoading } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await API.get("/exams/results/my");
        setResults(response.data.results || []);
      } catch (err) {
        console.error("Results fetch error:", err);
        setError("Unable to load your exam results.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResults();
    }
  }, [user]);

  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="exam-results-page">
      <div className="exam-results-header">
        <p className="exam-results-label">YOUR PERFORMANCE</p>
        <h1>My Exam Results</h1>
        <p>Review your scores and track your English learning progress.</p>
      </div>

      {loading && <p className="results-message">Loading results...</p>}

      {error && <p className="results-error">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <div className="results-empty">
          <h2>No results yet</h2>
          <p>You haven't completed any exams yet.</p>
          <Link to="/exams" className="results-button">
            Explore Exams
          </Link>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="results-grid">
          {results.map((result) => (
            <article className="result-card" key={result._id}>
              <p className="result-label">EXAM COMPLETED</p>

              <h2>{result.exam?.title || "English Exam"}</h2>

              <div className="result-score">
                {result.percentage}%
              </div>

              <p className="result-marks">
                Score: {result.score} / {result.totalMarks}
              </p>

              <div className="result-status">
                {result.percentage >= 40 ? "Passed" : "Needs Improvement"}
              </div>

              <p className="result-date">
                Submitted:{" "}
                {new Date(result.submittedAt).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      )}

      <Link to="/exams" className="results-back-link">
        Back to Exams
      </Link>
    </div>
  );
}

export default ExamResults;
