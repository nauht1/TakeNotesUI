import React, { useEffect, useState, useCallback } from "react";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./noteForm.scss";
import {formatDateTime} from "../../utils/Utils.jsx";
import debounce from "lodash.debounce";
import { axiosToken } from "../../config/ApiConfig.js";

const NoteForm = ({ isOpen, onRequestClose, onSubmit, onChange, note, isEdit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showActionsText, setShowActionsText] = useState(false);
  const [initialNote, setInitialNote] = useState(note);
  const [lastModified, setLastModified] = useState(note.created);

  useEffect(() => {
    setTitle(note.title || "");
    setContent(note.content || "");
    setImages(note.image_urls || []);
    setInitialNote(note);
  }, [note]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    const updatedNote = { ...note, title: e.target.value };
    onChange(updatedNote);
    updateModifiedTime();
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    const updatedNote = { ...note, content: e.target.value };
    onChange(updatedNote);
    updateModifiedTime();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      (file.type === "image/jpeg" || file.type === "image/png") && file.size < 20 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error("Invalid file type or size. Only JPG/PNG images less than 20MB are allowed.");
    }
    
    const newImages = validFiles.map(file => ({ src: URL.createObjectURL(file), file }));
    const updatedNote = { ...note, image_urls: [...images, ...newImages] };
    setImages(updatedNote.image_urls);
    onChange(updatedNote);
    updateModifiedTime();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    onRequestClose();
  };

  const hasChanges = () => {
    if (!initialNote) return false;
    return (
      initialNote.title !== title ||
      initialNote.content !== content ||
      initialNote.image_urls?.length !== images.length ||
      initialNote.image_urls?.some((image, index) => image !== images[index])
    );
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

  const handleClose = async () => {
    onRequestClose();
  };
  
  // Trick to update modified time on UI.
  const updateModifiedTime = useCallback(
    debounce(async () => {
      const currentTime = new Date().toISOString();
      setLastModified(currentTime);
    }, [2000]),
    []
  )

  // Remove image on edit modal
  const removeImage = async (imageUrl) => {
    try {
      // Create form data and call api
      const formData = new FormData();
      formData.append("id", note.id);
      formData.append("imageUrl", imageUrl);

      const response = await axiosToken.delete("/note/image/delete", {data: formData});

      // Update UI after successful deletion
      if (response.status === 200) {
        const updatedImages = images.filter(img => img !== imageUrl);
        console.log(updatedImages);
        setImages(updatedImages);
        toast.success('Image deleted successfully');
        onSubmit();
        updateModifiedTime();
      } else {
        throw new Error('Failed to delete image URL from note');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  // Set class for render images in modal rely on total images of note.
  const getGridClass = () => {
    if (images.length === 0) return '';
    if (images.length === 1) return 'images-count-1';
    if (images.length === 2) return 'images-count-2';
    if (images.length === 3) return 'images-count-3';
    return 'images-count-more';
  };

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={handleClose} className="note-form-modal" overlayClassName="overlay">
        <form onSubmit={e => e.preventDefault()} className="note-form">
          {images.length > 0 && (
          <div className={`modal-images-grid ${getGridClass()}`}>
            {images.map((image, index) => (
              <div key={index} className="modal-container">
                <img src={image.src || image} alt={`note-${index}`} className="modal-thumbnail" />
                <button className="remove-image-button" onClick={() => removeImage(image)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          )}
          <textarea
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
            <button type="button" onClick={handleFormSubmit} className="submit-button">Close</button>
          </div>
          {isEdit && <div className="note-form-modified">Last modified: {formatDateTime(lastModified)}</div>}
        </form>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default NoteForm;
