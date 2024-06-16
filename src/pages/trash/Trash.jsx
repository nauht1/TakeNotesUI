import React, { useState, useEffect } from "react";
import "./trash.scss";
import { axiosToken } from "../../config/ApiConfig";
import { deleteFormUrlEncoded, postFormUrlEncoded } from "../../utils/ApiUtils";
import Note from "../../components/note/Note";

const Trash = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchTrashNotes();
  }, []);

  const fetchTrashNotes = async () => {
    try {
      const response = await axiosToken.get("note/all/trash");
      setNotes(response.data.body);
    } catch (error) {
      console.error("Falied to fetch notes", error);
    }
  };

  const restoreNote = async (id) => {
    try {
      await postFormUrlEncoded("/note/move", {id});
      fetchTrashNotes();
    } catch (error) {
      console.error("Failed to restore note", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteFormUrlEncoded("/note/delete", {id});
      fetchTrashNotes();
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  };

  return (
    <div className="trash-section">
      <h3 style={{fontStyle: "italic"}}>Notes in trash will be deleted after 7 days</h3>
      <button className="btn-delete-all">Delete all</button>
      <div className="notes-grid">
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            images={note.image_urls}
            created={note.created}
            onDelete={() => deleteNote(note.id)}
            onRestore={() => restoreNote(note.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default Trash;