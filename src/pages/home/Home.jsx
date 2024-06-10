import React, { useState } from "react";
import "./home.scss";
import Note from "../../components/note/Note.jsx";
import Modal from "react-modal";
import NoteForm from "../../components/noteForm/NoteForm.jsx";

Modal.setAppElement("#root");

const initialNotes = [
  { title: "Giao diện tối đã ra mắt", content: "Tận hưởng trải nghiệm đọc thoải mái hơn. Bật hoặc tắt tính năng này trong phần Cài đặt.", images: ["./take_notes.png"] },
  { title: "", content: "4545454545", images: [] },
  { title: "", content: "0357008151\n123456789", images: ["./relax.jpg"] },
  { title: "", content: "k", images: ["./relax.jpg", "./relax.jpg"] },
  { title: "", content: "dasdas\ndasdas", images: ["./app_logo.png"] },
  { title: "", content: "", images: ["./app_logo.png", "./app_logo.png", "./relax.jpg"] },
  { title: "", content: "6/11 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30\n 7h30sáng phòng 2 (dưới)\nR 75 L 45p\nP:\nilovejesus#\n5370CD#", images: ["./take_notes.png"] },
  { title: "HIHIIHIHI", content: "dasdsdsds dasdasasdsdsdddddds asdsdsddddddsas dsdsdddddds asdsdsddddddsasdsdsdddd ddsasddddddddddddddddddddddddddddddddddddddddddsdsd ddddds asdsdsdd ddddsas dsdsdddddd sasdsds dddddd", images: ["./app_logo.png", "./take_notes.png", "./take_notes.png", "./relax.jpg", "./relax.jpg", "./relax.jpg"] }
];

const Home = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: "", content: "", images: [] });
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openNoteForm = (note = { title: "", content: "", images: [] }, index = null) => {
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
    setCurrentNote({ title: "", content: "", images: [] });
    setIsEdit(false);
    setEditIndex(null);
  }

  const handleNoteChange = (note) => {
    setCurrentNote(note);
  }

  const autoSaveNote = (note) => {
    // setCurrentNote(note);
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
            key={index} 
            title={note.title} 
            content={note.content} 
            images={note.images} 
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