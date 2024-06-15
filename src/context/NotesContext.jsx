import React, { createContext, useContext, useCallback, useState } from "react";
import { axiosToken } from "../config/ApiConfig.js";

const NotesContext = createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  // Fetch notes of auth user from server
  const fetchNotes = useCallback(async () => {
    try {
      const response = await axiosToken.get("/note/all");
      setNotes(response.data.body);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }, []);

  return (
    <NotesContext.Provider value={{ notes, fetchNotes, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};
