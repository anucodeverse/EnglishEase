import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Vocabulary.css";

function Vocabulary() {
  const [words, setWords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const response = await API.get("/learning/vocabulary");
        setWords(response.data.words);
      } catch (err) {
        console.error("Vocabulary fetch error:", err);
        setError("Unable to load vocabulary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  const filteredWords = words.filter((item) =>
    item.word.toLowerCase().includes(search.toLowerCase()) ||
    item.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="vocabulary-page">
      <div className="vocabulary-header">
        <p className="vocabulary-label">BUILD YOUR WORD POWER</p>
        <h1>Vocabulary Practice</h1>
        <p>Discover new words, understand their meanings and improve your English.</p>
      </div>

      <div className="vocabulary-search">
        <input
          type="text"
          placeholder="Search a word or meaning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <p className="vocabulary-message">Loading vocabulary...</p>
      )}

      {error && (
        <p className="vocabulary-error">{error}</p>
      )}

      {!loading && !error && filteredWords.length === 0 && (
        <p className="vocabulary-message">
          {search ? "No matching words found." : "No vocabulary words available yet."}
        </p>
      )}

      <div className="vocabulary-grid">
        {filteredWords.map((item) => (
          <article className="vocabulary-card" key={item._id}>
            <div className="vocabulary-card-top">
              <span className="vocabulary-level">{item.level}</span>
              <span className="vocabulary-part">
                {item.partOfSpeech}
              </span>
            </div>

            <h2>{item.word}</h2>

            {item.pronunciation && (
              <p className="vocabulary-pronunciation">
                / {item.pronunciation} /
              </p>
            )}

            <div className="vocabulary-section">
              <h3>Meaning</h3>
              <p>{item.meaning}</p>
            </div>

            <div className="vocabulary-section">
              <h3>Example</h3>
              <p className="vocabulary-example">{item.example}</p>
            </div>

            {item.synonyms?.length > 0 && (
              <div className="vocabulary-section">
                <h3>Synonyms</h3>
                <div className="vocabulary-synonyms">
                  {item.synonyms.map((synonym, index) => (
                    <span key={index}>{synonym}</span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default Vocabulary;