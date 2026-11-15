
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "../styles/TakeExam.css";

function TakeExam() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await API.get(`/exams/${id}`);

        setExam(response.data.exam);
        setQuestions(response.data.questions || []);
      } catch (err) {
        console.error("Exam loading error:", err);
        setError(
          err.response?.data?.message || "Unable to load this exam."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchExam();
    }
  }, [id, user]);

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: selectedAnswer
    }));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError("This exam has no questions.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to submit this exam?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers = questions.map((question) => ({
        question: question._id,
        selectedAnswer: answers[question._id] || ""
      }));

      const response = await API.post(`/exams/${id}/submit`, {
        answers: formattedAnswers
      });

      // Navigate to the result page with the submitted result.
      window.location.href = `/exam-result/${response.data.result._id}`;
    } catch (err) {
      console.error("Exam submission error:", err);
      setError(
        err.response?.data?.message || "Unable to submit exam."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p className="take-exam-message">Loading exam...</p>;
  }

  if (error && !exam) {
    return (
      <div className="take-exam-page">
        <p className="take-exam-error">{error}</p>
        <Link to="/exams">Back to Exams</Link>
      </div>
    );
  }

  if (!exam) {
    return <Navigate to="/exams" replace />;
  }

  return (
    <div className="take-exam-page">
      <div className="take-exam-header">
        <p className="take-exam-label">ONLINE ASSESSMENT</p>
        <h1>{exam.title}</h1>

        <p>{exam.description}</p>

        <div className="take-exam-info">
          <span>Duration: {exam.duration} minutes</span>
          <span>Total Marks: {exam.totalMarks}</span>
          <span>Questions: {questions.length}</span>
        </div>
      </div>

      <div className="take-exam-questions">
        {questions.map((question, index) => (
          <article className="take-question-card" key={question._id}>
            <h2>
              Question {index + 1}
            </h2>

            <p className="take-question-text">
              {question.questionText}
            </p>

            <p className="take-question-marks">
              Marks: {question.marks}
            </p>

            <div className="take-options">
              {question.options.map((option, optionIndex) => (
                <label
                  className="take-option"
                  key={optionIndex}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() =>
                      handleAnswerChange(question._id, option)
                    }
                  />

                  <span>{option}</span>
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>

      {error && (
        <p className="take-exam-error">{error}</p>
      )}

      <div className="take-exam-actions">
        <Link to="/exams" className="take-back-button">
          Back to Exams
        </Link>

        <button
          onClick={handleSubmit}
          disabled={submitting || questions.length === 0}
          className="take-submit-button"
        >
          {submitting ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </div>
  );
}

export default TakeExam;
