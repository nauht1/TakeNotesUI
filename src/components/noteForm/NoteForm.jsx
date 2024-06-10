import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
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
    onChange({ title: e.target.value, content, images });
    scheduleAutoSave({ title: e.target.value, content, images });
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    onChange({ title, content: e.target.value, images });
    scheduleAutoSave({ title, content: e.target.value, images });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      (file.type === "image/jpeg" || file.type === "image/png") && file.size < 20 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error("Invalid file type or size. Only JPG/PNG images less than 20MB are allowed.");
    }
    
    const newImages = [...validFiles.map(file => URL.createObjectURL(file))];
    setImages(prevImages => [...prevImages, ...newImages]);
    onChange({ title, content, images: [...images, ...newImages] });
    scheduleAutoSave({ title, content, images: [...images, ...newImages] });
  };

  const handleFormSubmit = () => {
    onSubmit({ title, content, images });
    onRequestClose();
  };

  const scheduleAutoSave = (note) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      onSubmit(note);
    }, 2000)
    setAutoSaveTimer(timer);
  }

  const removeImage = (imageToRemove) => {
    const updatedImages = images.filter(image => image !== imageToRemove);
    setImages(updatedImages);
    onChange({ title, content, images: updatedImages });
    scheduleAutoSave({ title, content, images: updatedImages });
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

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="note-form-modal" overlayClassName="overlay">
      <form onSubmit={e => e.preventDefault()} className="note-form">
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <img src={image} alt={`preview-${index}`} className="image-thumbnail" />
              {isHovered && (
                <button className="remove-image-button" onClick={() => removeImage(image)}>🗑️</button>
              )}
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
      </form>
      <ToastContainer />
    </Modal>
  );
};

export default NoteForm;
