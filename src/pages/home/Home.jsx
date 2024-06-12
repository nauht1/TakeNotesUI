import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./home.scss";
import Note from "../../components/note/Note.jsx";
import Modal from "react-modal";
import NoteForm from "../../components/noteForm/NoteForm.jsx";
import {axiosToken, axiosNoToken} from "../../config/axiosConfig.js";

Modal.setAppElement("#root");

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", content: "", images: [], modified: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axiosToken.get("/note/all")
      setNotes(response.data.body);
    }
    catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  }

  useEffect(() => {
      fetchNotes();
  }, [])

  const openNoteForm = (note = { id: "", title: "", content: "", images: [], modified: "" }, index = null) => {
    setCurrentNote(note);
    setEditIndex(index);
    setIsEdit(index !== null);
    setIsNoteFormOpen(true);
  }

  const closeNoteForm = () => {
    if ((currentNote.title || currentNote.content || currentNote.images.length > 0) && !isEdit) {
      setNotes(prevNotes => [...prevNotes, currentNote]);
    } else if (isEdit && editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = currentNote;
      setNotes(updatedNotes);
    }
    setIsNoteFormOpen(false);
    setCurrentNote({ id: "", title: "", content: "", images: [], modified: "" });
    setIsEdit(false);
    setEditIndex(null);
  }

  const handleNoteChange = (note) => {
    setCurrentNote(note);
  }

  const autoSaveNote = async (note) => {
    try {
      const formData = new FormData();
      formData.append("id", note.id);
      if (note.title) formData.append("title", note.title);
      if (note.content) formData.append("content", note.content);
      if (note.image_urls.length > 0) {
        note.image_urls.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await axiosToken.post("/note/update", formData);
      note.modified = response.data.created;

      if (isEdit && editIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = note;
        setNotes(updatedNotes);
      } else {
        setCurrentNote(note);
      } 
    } 
    catch (error) {
      console.error("Failed to auto-save note:", error);
    }
    
  }

  return (
    <div className="home-section">
      <div className="create-note" onClick={() => openNoteForm()}>
        <input type="text" placeholder="Note here" readOnly/>
        <div className="icons">
          <span>✏️</span> <span>🖼️</span>
        </div>
      </div>
      <div className="notes-grid">
        {notes.map((note, index) => (
          <Note 
            key={note.id} 
            id={note.id}
            title={note.title} 
            content={note.content} 
            images={note.image_urls} 
            modified={note.created}
            onEdit={() => openNoteForm(note, index)}/>
        ))}
      </div>

      {isNoteFormOpen && (
        <NoteForm 
          isOpen={isNoteFormOpen} 
          onRequestClose={closeNoteForm} 
          onSubmit={autoSaveNote} 
          note={currentNote}
          onChange={handleNoteChange}
          isEdit={isEdit}
        />
      )}
    </div>
  )
}

export default Home;