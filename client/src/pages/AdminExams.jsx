
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "../styles/AdminExams.css";

function AdminExams() {
  const { user, loading: authLoading } = useAuth();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    duration: 30,
    totalMarks: 10,
  });

  const [editingExamId, setEditingExamId] = useState(null);

  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
  });

  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Fetch exams
  const fetchExams = async () => {
    try {
      setError("");
      const response = await API.get("/exams");
      const examList = response.data.exams || [];

      setExams(examList);

      if (
        selectedExamId &&
        !examList.some((exam) => exam._id === selectedExamId)
      ) {
        setSelectedExamId("");
        setQuestions([]);
      }
    } catch (err) {
      console.error("Fetch exams error:", err);
      setError("Unable to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchExams();
    }
  }, [user]);

  // Fetch questions for selected exam
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedExamId) {
        setQuestions([]);
        return;
      }

      try {
        setQuestionsLoading(true);
        setError("");

        const response = await API.get(
          `/exams/${selectedExamId}/questions`
        );

        setQuestions(response.data.questions || []);
      } catch (err) {
        console.error("Fetch questions error:", err);
        setError("Unable to load questions for this exam.");
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedExamId]);

  // Handle exam form input
  const handleExamChange = (e) => {
    setExamForm({
      ...examForm,
      [e.target.name]: e.target.value,
    });
  };

  // Create or update exam
  const handleExamSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const examData = {
        ...examForm,
        duration: Number(examForm.duration),
        totalMarks: Number(examForm.totalMarks),
      };

      if (editingExamId) {
        await API.put(`/exams/${editingExamId}`, examData);
        setMessage("Exam updated successfully.");
      } else {
        await API.post("/exams", examData);
        setMessage("Exam created successfully.");
      }

      setExamForm({
        title: "",
        description: "",
        duration: 30,
        totalMarks: 10,
      });

      setEditingExamId(null);
      await fetchExams();
    } catch (err) {
      console.error("Save exam error:", err);
      setError(err.response?.data?.message || "Unable to save exam.");
    }
  };

  // Start editing an exam
  const handleEditExam = (exam) => {
    setEditingExamId(exam._id);

    setExamForm({
      title: exam.title || "",
      description: exam.description || "",
      duration: exam.duration || 30,
      totalMarks: exam.totalMarks || 10,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel exam editing
  const cancelExamEdit = () => {
    setEditingExamId(null);

    setExamForm({
      title: "",
      description: "",
      duration: 30,
      totalMarks: 10,
    });
  };

  // Deactivate exam
  const handleDeactivateExam = async (examId) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this exam?"
    );

    if (!confirmed) return;

    try {
      await API.patch(`/exams/${examId}/deactivate`);

      if (selectedExamId === examId) {
        setSelectedExamId("");
        setQuestions([]);
      }

      if (editingExamId === examId) {
        cancelExamEdit();
      }

      setMessage("Exam deactivated successfully.");
      await fetchExams();
    } catch (err) {
      console.error("Deactivate exam error:", err);
      setError(err.response?.data?.message || "Unable to deactivate exam.");
    }
  };

  // Handle question text and marks
  const handleQuestionChange = (e) => {
    setQuestionForm({
      ...questionForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle the four question options
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionForm.options];
    updatedOptions[index] = value;

    setQuestionForm({
      ...questionForm,
      options: updatedOptions,
      correctAnswer:
        questionForm.correctAnswer === questionForm.options[index]
          ? ""
          : questionForm.correctAnswer,
    });
  };

  // Create or update question
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    if (!selectedExamId) {
      setError("Please select an exam first.");
      return;
    }

    const options = questionForm.options.map((option) => option.trim());

    if (options.some((option) => !option)) {
      setError("Please enter all four options.");
      return;
    }

    if (!questionForm.correctAnswer) {
      setError("Please select the correct answer.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const questionData = {
        questionText: questionForm.questionText.trim(),
        options,
        correctAnswer: questionForm.correctAnswer,
        marks: Number(questionForm.marks),
      };

      if (editingQuestionId) {
        await API.put(
          `/exams/questions/${editingQuestionId}`,
          questionData
        );
        setMessage("Question updated successfully.");
      } else {
        await API.post(
          `/exams/${selectedExamId}/questions`,
          questionData
        );
        setMessage("Question added successfully.");
      }

      resetQuestionForm();

      const response = await API.get(
        `/exams/${selectedExamId}/questions`
      );

      setQuestions(response.data.questions || []);
    } catch (err) {
      console.error("Save question error:", err);
      setError(err.response?.data?.message || "Unable to save question.");
    }
  };

  // Reset question form
  const resetQuestionForm = () => {
    setEditingQuestionId(null);

    setQuestionForm({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: 1,
    });
  };

  // Start editing a question
  const handleEditQuestion = (question) => {
    setEditingQuestionId(question._id);

    setQuestionForm({
      questionText: question.questionText || "",
      options: question.options || ["", "", "", ""],
      correctAnswer: question.correctAnswer || "",
      marks: question.marks || 1,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/exams/questions/${questionId}`);

      setQuestions((previousQuestions) =>
        previousQuestions.filter(
          (question) => question._id !== questionId
        )
      );

      if (editingQuestionId === questionId) {
        resetQuestionForm();
      }

      setMessage("Question deleted successfully.");
    } catch (err) {
      console.error("Delete question error:", err);
      setError(err.response?.data?.message || "Unable to delete question.");
    }
  };

  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const selectedExam = exams.find(
    (exam) => exam._id === selectedExamId
  );

  return (
    <div className="admin-exams-page">
      <header className="admin-exams-header">
        <div>
          <p className="admin-exams-label">ADMIN PANEL</p>
          <h1>Exam Management</h1>
          <p>Create exams and manage their questions.</p>
        </div>

        <Link to="/admin" className="admin-back-button">
          Back to Admin Dashboard
        </Link>
      </header>

      {error && <p className="admin-exams-error">{error}</p>}
      {message && <p className="admin-exams-success">{message}</p>}

      {/* CREATE OR EDIT EXAM */}
      <section className="admin-exams-section">
        <h2>{editingExamId ? "Edit Exam" : "Create New Exam"}</h2>

        <form onSubmit={handleExamSubmit} className="admin-exams-form">
          <label>
            Exam Title
            <input
              type="text"
              name="title"
              value={examForm.title}
              onChange={handleExamChange}
              placeholder="Enter exam title"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={examForm.description}
              onChange={handleExamChange}
              placeholder="Enter exam description"
              rows="3"
            />
          </label>

          <div className="admin-exams-form-row">
            <label>
              Duration (minutes)
              <input
                type="number"
                name="duration"
                min="1"
                value={examForm.duration}
                onChange={handleExamChange}
                required
              />
            </label>

            <label>
              Total Marks
              <input
                type="number"
                name="totalMarks"
                min="1"
                value={examForm.totalMarks}
                onChange={handleExamChange}
                required
              />
            </label>
          </div>

          <div className="admin-exams-actions">
            <button type="submit" className="admin-primary-button">
              {editingExamId ? "Update Exam" : "Create Exam"}
            </button>

            {editingExamId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={cancelExamEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* EXAM LIST */}
      <section className="admin-exams-section">
        <h2>Available Exams</h2>

        {loading && <p>Loading exams...</p>}

        {!loading && exams.length === 0 && (
          <p>No active exams found. Create your first exam above.</p>
        )}

        <div className="admin-exams-list">
          {exams.map((exam) => (
            <article className="admin-exam-card" key={exam._id}>
              <div>
                <h3>{exam.title}</h3>
                <p>{exam.description || "No description available."}</p>

                <span>
                  Duration: {exam.duration} minutes | Marks: {exam.totalMarks}
                </span>
              </div>

              <div className="admin-exam-card-actions">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExamId(exam._id);
                    setMessage("");
                    setError("");
                  }}
                >
                  Manage Questions
                </button>

                <button
                  type="button"
                  onClick={() => handleEditExam(exam)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-delete-button"
                  onClick={() => handleDeactivateExam(exam._id)}
                >
                  Deactivate
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* QUESTION MANAGEMENT */}
      {selectedExam && (
        <section className="admin-exams-section">
          <h2>Questions: {selectedExam.title}</h2>

          <form
            onSubmit={handleQuestionSubmit}
            className="admin-exams-form"
          >
            <label>
              Question
              <textarea
                name="questionText"
                value={questionForm.questionText}
                onChange={handleQuestionChange}
                placeholder="Enter your question"
                rows="3"
                required
              />
            </label>

            <div className="admin-question-options">
              {questionForm.options.map((option, index) => (
                <label key={index}>
                  Option {index + 1}
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value)
                    }
                    placeholder={`Enter option ${index + 1}`}
                    required
                  />
                </label>
              ))}
            </div>

            <label>
              Correct Answer
              <select
                value={questionForm.correctAnswer}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    correctAnswer: e.target.value,
                  })
                }
                required
              >
                <option value="">Select the correct answer</option>

                {questionForm.options
                  .filter((option) => option.trim() !== "")
                  .map((option, index) => (
                    <option value={option.trim()} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            </label>

            <label>
              Marks
              <input
                type="number"
                name="marks"
                min="1"
                value={questionForm.marks}
                onChange={handleQuestionChange}
                required
              />
            </label>

            <div className="admin-exams-actions">
              <button type="submit" className="admin-primary-button">
                {editingQuestionId ? "Update Question" : "Add Question"}
              </button>

              {editingQuestionId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetQuestionForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h3 className="admin-question-list-title">
            Existing Questions
          </h3>

          {questionsLoading && <p>Loading questions...</p>}

          {!questionsLoading && questions.length === 0 && (
            <p>No questions added to this exam yet.</p>
          )}

          <div className="admin-question-list">
            {questions.map((question, index) => (
              <article className="admin-question-card" key={question._id}>
                <h3>
                  {index + 1}. {question.questionText}
                </h3>

                <ul>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>

                <p>
                  <strong>Correct Answer:</strong> {question.correctAnswer}
                </p>

                <p>
                  <strong>Marks:</strong> {question.marks}
                </p>

                <div className="admin-exam-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEditQuestion(question)}
                  >
                    Edit Question
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDeleteQuestion(question._id)}
                  >
                    Delete Question
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminExams;
