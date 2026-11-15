
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
        console.error("Results loading error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load your exam results."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResults();
    }
  }, [user]);

  if (authLoading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <p>Loading your results...</p>;

  if (error) {
    return (
      <div className="exam-results-page">
        <h2>Unable to Load Results</h2>
        <p>{error}</p>
        <Link to="/exams">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="exam-results-page">
      <div className="exam-results-header">
        <p className="exam-results-label">YOUR PERFORMANCE</p>
        <h1>My Exam Results</h1>
        <p>View your completed exam results.</p>
      </div>

      {results.length === 0 ? (
        <div className="result-card">
          <h2>No Results Yet</h2>
          <p>You have not completed any exams.</p>
          <Link to="/exams">Explore Exams</Link>
        </div>
      ) : (
        <div className="results-grid">
          {results.map((result) => (
            <article className="result-card" key={result._id}>
              <h2>{result.exam?.title || "English Exam"}</h2>

              <div className="result-score">
                {result.percentage}%
              </div>

              <p className="result-marks">
                Score: {result.score} / {result.totalMarks}
              </p>

              <div className="result-status">
                {result.percentage >= 40
                  ? "Passed"
                  : "Needs Improvement"}
              </div>

              <p className="result-date">
                Submitted:{" "}
                {result.submittedAt
                  ? new Date(result.submittedAt).toLocaleString()
                  : "Recently"}
              </p>

              <Link
                to={`/exam-result/${result._id}`}
                className="results-button"
              >
                View Result
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="take-exam-actions">
        <Link to="/exams" className="results-back-link">
          Back to Exams
        </Link>
      </div>
    </div>
  );
}
export default ExamResults;