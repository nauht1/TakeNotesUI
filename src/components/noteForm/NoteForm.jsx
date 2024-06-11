import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./noteForm.scss";

const NoteForm = ({ isOpen, onRequestClose, onSubmit, onChange, note, isEdit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showActionsText, setShowActionsText] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setImages(note.images);
  }, [note]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onChange({ ...note, title: e.target.value });
    scheduleAutoSave({ ...note, title: e.target.value });
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    onChange({ ...note, content: e.target.value });
    scheduleAutoSave({ ...note, content: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      (file.type === "image/jpeg" || file.type === "image/png") && file.size < 20 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error("Invalid file type or size. Only JPG/PNG images less than 20MB are allowed.");
    }
    
    const newImages = [...validFiles.map(file => ({id: uuidv4(), src: URL.createObjectURL(file)}))];
    const updatedNote = { ...note, images: [...images, ...newImages] };
    setImages(updatedNote.images);
    onChange(updatedNote);
    scheduleAutoSave(updatedNote);
    // setImages(prevImages => [...prevImages, ...newImages]);
    // onChange({ id: note.id, title, content, images: [...images, ...newImages] });
    // scheduleAutoSave({ id: note.id, title, content, images: [...images, ...newImages] });
  };

  const handleFormSubmit = () => {
    onSubmit({ ...note, modified: new Date().toLocaleString('en-GB', { hour12: false }) });
    // onSubmit({ id: note.id, title, content, images });
    onRequestClose();
  };

  const scheduleAutoSave = (updatedNote) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      updatedNote.modified = new Date().toLocaleString('en-GB', { hour12: false });
      onSubmit(updatedNote);
      // onSubmit(note);
    }, 2000)
    setAutoSaveTimer(timer);
  }

  const removeImage = (imageId) => {
    const updatedImages = images.filter(image => image.id !== imageId);
    const updatedNote = { ...note, images: updatedImages };
    setImages(updatedImages);
    onChange(updatedNote);
    scheduleAutoSave(updatedNote);
    // setImages(updatedImages);
    // onChange({ id: note.id, title, content, images: updatedImages });
    // scheduleAutoSave({ id: note.id, title, content, images: updatedImages });
  };
  
  useEffect(() => {
    let timer;
    if (isHovered) {
      timer = setTimeout(() => {
        setShowActionsText(true);
      }, 500);
    } else {
      setShowActionsText(false);
    }

    return () => clearTimeout(timer);
  }, [isHovered]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    }
  }, [autoSaveTimer]);

  const getGridClass = () => {
    if (images.length === 1) return 'images-count-1';
    if (images.length === 2) return 'images-count-2';
    if (images.length === 3) return 'images-count-3';
    return 'images-count-more';
  };

  return (
    <>
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="note-form-modal" overlayClassName="overlay">
      <form onSubmit={e => e.preventDefault()} className="note-form">
        <div className={`modal-images-grid ${getGridClass()}`}>
          {images.map((image, index) => (
            <div key={image.id} className="modal-container">
              <img src={image.src} alt={`note-${index}`} className="modal-thumbnail" />
              <button className="remove-image-button" onClick={() => removeImage(image.id)}>
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          className="note-form-title"
        />
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Content"
          className="note-form-content"
        />
        <div className="note-form-actions">
          <div className="actions-group"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            <label htmlFor="image-upload" className="image-upload-label">
              <i className="fa-regular fa-image upload-icon"></i>
            </label>
            {showActionsText && <span className="actions-text">Insert images</span>}
            <input 
              id="image-upload" 
              type="file" 
              multiple 
              onChange={handleImageChange} 
              className="image-upload-input" 
            />
          </div>
        </div>
        <div className="note-form-buttons">
          <button type="button" onClick={handleFormSubmit} className="submit-button">Save</button>
        </div>
        {isEdit && <div className="note-form-modified">Last modified: {note.modified}</div>}
      </form>
    </Modal>
    <ToastContainer />
    </>
  );
};

export default NoteForm;
