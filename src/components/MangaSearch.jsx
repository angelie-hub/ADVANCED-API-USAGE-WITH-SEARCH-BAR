import React, { useState, useEffect, useCallback } from "react";
import "./MangaSearch.css";

export default function MangaSearch() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [manga, setManga] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const fetchManga = useCallback(async () => { 
    setLoading(true);
    setNoResults(false);
    try {
      const limit = 10;
      const baseUrl = `https://api.jikan.moe/v4/manga`;
  
      const searchUrl = searchTerm
        ? `${baseUrl}?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`
        : `${baseUrl}?page=${page}&limit=${limit}`;
  
      const res = await fetch(searchUrl);
      const data = await res.json();
  
      console.log("Full API Response:", data);

      if (data.data.length === 0) {
        setManga([]);
        setNoResults(true);
        setLoading(false);
        return;
      }

      const mangasWithCovers = data.data.map((manga) => {
        const coverUrl = manga.images ? manga.images.jpg.image_url : ""; 
        console.log(`Cover URL for "${manga.title}":`, coverUrl); 

        return {
          id: manga.mal_id,
          title: manga.title,
          coverUrl: coverUrl || "", 
        };
      });

      console.log("Manga with Covers:", mangasWithCovers); 

      setManga(mangasWithCovers);
      setNoResults(false);
    } catch (err) {
      console.error("Failed to fetch manga:", err);
    }
    setLoading(false);
  }, [searchTerm, page]);

  useEffect(() => {
    fetchManga();
  }, [fetchManga]);

  return (
    <div className="manga-container">
      <h1 className="manga-title">
        <img src="/assets/icon.gif" alt="icon" className="iconq" />
        Mang-Durugas
      </h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for manga..."
          className="manga-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="search-button"
          onClick={() => {
            setPage(1);
            setSearchTerm(query);
          }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <img src="/assets/loading.gif" alt="Loading..." className="loading-gif" />
        </div>
      ) : noResults ? (
        <div className="no-results">
          <img src="/assets/noresult.gif" alt="No Result..." className="noresult-gif" />
          <p>No result found for "{searchTerm}".</p>
        </div>
      ) : (
        <ul className="manga-list">
          {manga.map((m) => (
            <li key={m.id} className="manga-item">
              {m.coverUrl ? (
                <img src={m.coverUrl} alt={m.title} className="manga-cover" />
              ) : (
                <div className="manga-cover" style={{ background: '#ccc' }}></div> 
              )}
              <span className="manga-title-text">{m.title}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="page-btn"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
