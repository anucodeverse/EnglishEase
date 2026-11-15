
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "../styles/ExamResults.css";

function ExamResult() {
  const { resultId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await API.get(`/exams/results/${resultId}`);
        setResult(response.data.result);
      } catch (err) {
        console.error("Result loading error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load your exam result."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && resultId) {
      fetchResult();
    }
  }, [user, resultId]);

  if (authLoading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) return <p>Loading your result...</p>;

  if (error || !result) {
    return (
      <div className="exam-results-page">
        <h2>Result unavailable</h2>
        <p>{error || "Result not found."}</p>
        <Link to="/exams">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="exam-results-page">
      <div className="exam-results-header">
        <p className="exam-results-label">EXAM COMPLETED</p>
        <h1>Your Exam Result</h1>
        <p>{result.exam?.title || "English Exam"}</p>
      </div>

      <div className="results-grid">
        <article className="result-card">
          <p className="result-label">YOUR SCORE</p>

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
        </article>
      </div>

      <div className="take-exam-actions">
        <Link to="/results" className="results-button">
          View All Results
        </Link>

        <Link to="/exams" className="results-back-link">
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

export default ExamResult;