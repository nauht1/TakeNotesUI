import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosToken } from "../../config/ApiConfig.js";
import 'react-toastify/dist/ReactToastify.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosToken.get(`/note/search?searchText=${searchTerm}`);
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`, { state: { searchResults: response.data.body } });
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearchSubmit}>
        <div className="search-input">
          <div className="search-icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
};

export default Search;
