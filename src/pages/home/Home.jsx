import React, { useEffect, useState, useCallback, useRef } from "react";
import "./home.scss";
import Note from "../../components/note/Note.jsx";
import Modal from "react-modal";
import NoteForm from "../../components/noteForm/NoteForm.jsx";
import { axiosToken } from "../../config/ApiConfig.js";
import debounce from "lodash.debounce";
import { useNotes } from "../../context/NotesContext.jsx";
Modal.setAppElement("#root");

const Home = () => {
  const { notes, fetchNotes, setNotes } = useNotes();
  // const [notes, setNotes] = useState([]);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", content: "", images: [], created: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  //Create a null note when click on 'Note here'
  const createNewNote = async () => {
    try {
      const response = await axiosToken.post("/note/add", new FormData());
      const newNote = response.data.body;
      setCurrentNote({
        id: newNote.id,
        title: "",
        content: "",
        images: [],
        created: newNote.created,
      });
      setIsEdit(false);
      setIsNoteFormOpen(true);
    } catch (error) {
      console.error("Failed to create new note:", error);
    }
  };

  const openNoteForm = (note = { id: "", title: "", content: "", images: [], created: "" }, index = null) => {
    if (note.id) {
      setCurrentNote(note);
      setEditIndex(index);
      setIsEdit(true);
      setIsNoteFormOpen(true);
    } else {
      createNewNote();
    }
  };

  const closeNoteForm = async () => {
    setIsNoteFormOpen(false);
    setCurrentNote({ id: "", title: "", content: "", images: [], created: "" });
    setIsEdit(false);
    setEditIndex(null);
  };

  const saveNote = useCallback(
    debounce(async (note) => {
      try {
        const formData = new FormData();
        if (note.id) formData.append("id", note.id);
        if (note.title) formData.append("title", note.title);
        if (note.content) formData.append("content", note.content);
        if (note.image_urls && note.image_urls.length > 0) {
          note.image_urls.forEach((image) => {
            if (image.file) {
              formData.append("images", image.file);
            }
          });
        }

        let response;
        if (isEdit) {
          response = await axiosToken.post("/note/update", formData);
        } else {
          response = await axiosToken.post("/note/add", formData);
        }

        const updatedNote = response.data.body;

        if (isEdit && editIndex !== null) {
          const updatedNotes = [...notes];
          updatedNotes[editIndex] = { ...updatedNote };
          setNotes(updatedNotes);
        } else {
          setNotes((prevNotes) => {
            const noteIndex = prevNotes.findIndex(n => n.id === updatedNote.id);
            if (noteIndex > -1) {
              const updatedNotes = [...prevNotes];
              updatedNotes[noteIndex] = { ...updatedNote };
              return updatedNotes;
            } else {
              return [...prevNotes, { ...updatedNote }];
            }
          });
        }
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    }, 2000),
    [isEdit, editIndex, notes]
  );

  const saveNoteRef = useRef(saveNote);

  useEffect(() => {
    saveNoteRef.current = saveNote;
  }, [saveNote]);

  const handleNoteChange = (note) => {
    setCurrentNote(note);
    saveNoteRef.current(note);
  };

  return (
    <div className="home-section">
      <div className="create-note" onClick={() => openNoteForm()}>
        <input type="text" placeholder="Note here" readOnly />
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
            created={note.created}
            onEdit={() => openNoteForm(note, index)}
          />
        ))}
      </div>

      {isNoteFormOpen && (
        <NoteForm
          isOpen={isNoteFormOpen}
          onRequestClose={closeNoteForm}
          onSubmit={() => saveNoteRef.current(currentNote)}
          note={currentNote}
          onChange={handleNoteChange}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default Home;
