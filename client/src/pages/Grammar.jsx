
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Grammar.css";

function Grammar() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await API.get("/learning/grammar");
        setLessons(response.data.lessons);
      } catch (err) {
        console.error("Grammar fetch error:", err);
        setError("Unable to load grammar lessons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div className="grammar-page">
      <div className="grammar-header">
        <p className="grammar-label">LEARN ENGLISH</p>
        <h1>Grammar Practice</h1>
        <p>Learn grammar rules and improve your English step by step.</p>
      </div>

      {loading && <p className="grammar-message">Loading lessons...</p>}

      {error && <p className="grammar-error">{error}</p>}

      {!loading && !error && lessons.length === 0 && (
        <p className="grammar-message">No grammar lessons available yet.</p>
      )}

      <div className="grammar-grid">
        {lessons.map((lesson) => (
          <article className="grammar-card" key={lesson._id}>
            <div className="grammar-card-top">
              <span className="grammar-topic">{lesson.topic}</span>
              <span className="grammar-level">{lesson.level}</span>
            </div>

            <h2>{lesson.title}</h2>

            <p className="grammar-explanation">{lesson.explanation}</p>

            <div className="grammar-section">
              <h3>Grammar Rules</h3>
              <ul>
                {lesson.rules?.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            {lesson.examples?.length > 0 && (
              <div className="grammar-section">
                <h3>Examples</h3>

                {lesson.examples.map((example, index) => (
                  <div className="grammar-example" key={index}>
                    <p className="incorrect">
                      ✕ {example.incorrect}
                    </p>
                    <p className="correct">
                      ✓ {example.correct}
                    </p>
                    <p className="example-explanation">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default Grammar;
