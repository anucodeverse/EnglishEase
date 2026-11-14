
import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Sentences.css";

function Sentences() {
  const [sentences, setSentences] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const response = await API.get("/learning/sentences");
        setSentences(response.data.sentences);
      } catch (err) {
        console.error("Sentence fetch error:", err);
        setError("Unable to load sentence lessons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentences();
  }, []);

  const filteredSentences = sentences.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.pattern.toLowerCase().includes(search.toLowerCase());

    const matchesLevel = level === "" || item.level === level;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="sentences-page">
      <div className="sentences-header">
        <p className="sentences-label">IMPROVE YOUR ENGLISH</p>
        <h1>Sentence Practice</h1>
        <p>
          Learn sentence structures and build confidence in English.
        </p>
      </div>

      <div className="sentences-controls">
        <input
          type="text"
          placeholder="Search sentence lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {loading && (
        <p className="sentences-message">Loading sentence lessons...</p>
      )}

      {error && (
        <p className="sentences-error">{error}</p>
      )}

      {!loading && !error && filteredSentences.length === 0 && (
        <p className="sentences-message">
          No sentence lessons found.
        </p>
      )}

      <div className="sentences-grid">
        {filteredSentences.map((item) => (
          <article className="sentence-card" key={item._id}>
            <div className="sentence-card-top">
              <span className="sentence-level">{item.level}</span>
            </div>

            <h2>{item.title}</h2>

            <div className="sentence-pattern">
              <h3>Sentence Pattern</h3>
              <p>{item.pattern}</p>
            </div>

            <div className="sentence-section">
              <h3>Explanation</h3>
              <p>{item.explanation}</p>
            </div>

            <div className="sentence-section">
              <h3>Examples</h3>

              {item.examples?.map((example, index) => (
                <div className="sentence-example" key={index}>
                  <p className="example-sentence">
                    {index + 1}. {example.sentence}
                  </p>

                  {example.meaning && (
                    <p className="example-meaning">
                      {example.meaning}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Sentences;
