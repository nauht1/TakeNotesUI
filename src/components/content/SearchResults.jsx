// SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NotesContent from "../content/NotesContent.jsx";
import "./searchResults.scss";

const SearchResults = () => {
  const location = useLocation();
  const { searchResults } = location.state || { searchResults: [] };
  // const [notes, setNotes] = useState(searchResults);
  const [archiveNotes, setArchiveNotes] = useState([]);
  const [regularNotes, setRegularNotes] = useState([]);

  useEffect(() => {
    const important = searchResults.filter(note => note.important);
    const regular = searchResults.filter(note => !note.important);
    setArchiveNotes(important);
    setRegularNotes(regular);
  }, [searchResults]);

  return (
    <div>
      <h1>Search Results</h1>
      <div className="regular-note">
        <h3>Regular Notes</h3>
        <NotesContent notes={regularNotes} setNotes={setRegularNotes} />
      </div>
      <div className="archive-note">
        <h3>Marked Notes</h3>
        <NotesContent notes={archiveNotes} setNotes={setArchiveNotes} />
      </div>
    </div>
  );
};

export default SearchResults;
