import React, { useEffect, useState, useCallback, useRef } from "react";
import Note from "../../components/note/Note";
import "./archive.scss";
import { axiosToken } from "../../config/ApiConfig";
import debounce from "lodash.debounce";
import Modal from "react-modal";
import NoteForm from "../../components/noteForm/NoteForm";
import { postFormUrlEncoded } from "../../utils/ApiUtils";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/// Duplicated Home component, reusable
Modal.setAppElement("#root");

const Archive = () => {
  const [notes, setNotes] = useState([]);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", content: "", images: [], created: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchArchiveNotes();
  }, []);

  //fetch notes in archive (important = true)
  const fetchArchiveNotes = async () => {
    try {
      const response = await axiosToken.get("note/all/archive");
      setNotes(response.data.body);
    } catch (error) {
      console.error("Falied to fetch notes", error);
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
  
  // auto save note after 2s from the last input
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

  // Move note to trash
  const moveNote = async (id) => {
    try {
      await postFormUrlEncoded("/note/move", { id });
      fetchArchiveNotes();
      toast.success("Successfully moved note");
    } catch (error) {
      console.error("Failed to move note to trash", error);
    }
  };

  // Unmark note
  const markNote = async(id) => {
    try {
      await postFormUrlEncoded("/note/mark", { id });
      fetchArchiveNotes();
      toast.success("Successfully unmarked note");
    } catch (error) {
      console.error("Failed to unmark note", error);
    }
  }

  return (
    <div className="archive-section">
      <h2>My archive</h2>
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
            onMove={() => moveNote(note.id)}
            onMark={() => markNote(note.id)}
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
      <ToastContainer />
    </div>
  )
}

export default Archive;