
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "../styles/Exams.css";

function Exams() {
  const { user, loading: authLoading } = useAuth();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await API.get("/exams");
        setExams(response.data.exams || []);
      } catch (err) {
        console.error("Exam fetch error:", err);
        setError("Unable to load exams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchExams();
    }
  }, [user]);

  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="exams-page">
      <div className="exams-header">
        <p className="exams-label">TEST YOUR KNOWLEDGE</p>
        <h1>Online Exams</h1>
        <p>
          Take exams, test your English skills, and track your progress.
        </p>
      </div>

      {loading && (
        <p className="exams-message">Loading exams...</p>
      )}

      {error && (
        <p className="exams-error">{error}</p>
      )}

      {!loading && !error && exams.length === 0 && (
        <p className="exams-message">
          No exams are available right now.
        </p>
      )}

      <div className="exams-grid">
        {exams.map((exam) => (
          <article className="exam-card" key={exam._id}>
            <p className="exam-label">ENGLISH ASSESSMENT</p>

            <h2>{exam.title}</h2>

            <p className="exam-description">
              {exam.description || "Test your English knowledge."}
            </p>

            <div className="exam-details">
              <span>Duration: {exam.duration} minutes</span>
              <span>Total Marks: {exam.totalMarks}</span>
            </div>

            <Link
              to={`/exams/${exam._id}`}
              className="exam-start-button"
            >
              Start Exam
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Exams;
