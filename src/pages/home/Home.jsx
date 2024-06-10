import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./home.scss";
import Note from "../../components/note/Note.jsx";
import Modal from "react-modal";
import NoteForm from "../../components/noteForm/NoteForm.jsx";

Modal.setAppElement("#root");

const getCurrentTimeString = () => {
  const now = new Date();

  const formatWithLeadingZero = (number) => (number < 10 ? `0${number}` : number.toString());
  const hours = formatWithLeadingZero(now.getHours());
  const minutes = formatWithLeadingZero(now.getMinutes());

  return `${hours}:${minutes} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
}

const initialNotes = [
  { id: uuidv4(), title: "Giao diện tối đã ra mắt", content: "Tận hưởng trải nghiệm đọc thoải mái hơn. Bật hoặc tắt tính năng này trong phần Cài đặt.", images: [{ id: uuidv4(), src: "./take_notes.png" }], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "", content: "4545454545", images: [], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "", content: "0357008151\n123456789", images: [{ id: uuidv4(), src: "./relax.jpg" }], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "", content: "k", images: [{ id: uuidv4(), src: "./relax.jpg" }, { id: uuidv4(), src: "./relax.jpg" }], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "", content: "dasdas\ndasdas", images: [{ id: uuidv4(), src: "./app_logo.png" }], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "", content: "", images: [{ id: uuidv4(), src: "./app_logo.png" }, { id: uuidv4(), src: "./app_logo.png" }, { id: uuidv4(), src: "./relax.jpg" }], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "", content: "6/11 \n 7h30 \n \n 7h30 \n 7h30 \n 7h30 \n 7h30sáng phòng 2 (dưới)\nR 75 L 45p\nP:\nilovejesus#\n5370CD#", images: [{ id: uuidv4(), src: "./take_notes.png" }], modified: getCurrentTimeString() },
  { id: uuidv4(), title: "HIHIIHIHI", content: "dasdsdsds  asdsdsddddddsasdsdsdddd ddsasddddddddddddddddddddddddddsddssssssd ddddds asdsdsdd ddddsas dsdsdddddd sasdsds dddddd", images: [{ id: uuidv4(), src: "./app_logo.png" }, { id: uuidv4(), src: "./take_notes.png" }, { id: uuidv4(), src: "./take_notes.png" }, { id: uuidv4(), src: "./relax.jpg" }, { id: uuidv4(), src: "./relax.jpg" }, { id: uuidv4(), src: "./relax.jpg" }], modified: getCurrentTimeString() }
];

const Home = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: uuidv4(), title: "", content: "", images: [], modified: getCurrentTimeString() });
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openNoteForm = (note = { id: uuidv4(), title: "", content: "", images: [], modified: getCurrentTimeString() }, index = null) => {
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
    setCurrentNote({ id: uuidv4(), title: "", content: "", images: [], modified: getCurrentTimeString() });
    setIsEdit(false);
    setEditIndex(null);
  }

  const handleNoteChange = (note) => {
    // setCurrentNote(note);
    setCurrentNote({ ...note, modified: getCurrentTimeString() });
  }

  const autoSaveNote = (note) => {
    note.modified = getCurrentTimeString();

    if (isEdit && editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = note;
      setNotes(updatedNotes);
    } else {
      setCurrentNote(note);
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
            title={note.title} 
            content={note.content} 
            images={note.images} 
            modified={note.modified}
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