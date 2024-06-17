import React, { useState } from "react";
import Modal from 'react-modal';
import "./note.scss";
import {formatDateTime} from "../../utils/Utils.jsx";

const Note = ({ id, title, content, images, created, onEdit, onMove, onDelete, onRestore, onMark }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setImageModalIsOpen(true);
  };

  const closeImageModal = () => {
    setImageModalIsOpen(false);
    setSelectedImage(null);
  };

  const getGridClass = () => {
    if (images.length === 1) return 'images-count-1';
    if (images.length === 2) return 'images-count-2';
    if (images.length === 3) return 'images-count-3';
    return 'images-count-more';
  };

  const handleEditClick = () => {
    onEdit({ id, title, content, images, created });
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    onMove(id);
  };

  const handleRestoreClick = (e) => {
    e.stopPropagation();
    onRestore(id);
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(id);
  }

  const handleMarkNote = (e) => {
    e.stopPropagation();
    onMark(id);
  }
  
  //Format date time for modified
  const formattedDate = formatDateTime(created);
  
  return (
    <div className="note-container">
      <div className="note" onClick={openModal}>
        <div className="note-images">
          {images.length > 0 && <img src={images[0]} alt="note" className="note-image" />}
          {images.length > 1 && (
            <div className="note-image-overlay">
              <span className="overlay-text">+{images.length - 1}</span>
              <img src={images[1]} alt="note" className="note-image-blur" />
            </div>
          )}
        </div>
        <div className="note-content">
          {title && <h3 className="note-title">{title}</h3>}
          <p className="note-text">{content}</p>
        </div>
        <div className="note-modified">
          <p>Last modified: {formattedDate}</p>
        </div>
        <div className="btn-groups-top">
          {onRestore && <button className="restore-button" onClick={handleRestoreClick}><i className="fa-solid fa-rotate-left"></i></button>}
          {onDelete && <button className="delete-button" onClick={handleDeleteClick}><i className="fa-solid fa-trash-can"></i></button>}
          {onMove && <button className="move-button" onClick={handleMoveClick}><i className="fa-solid fa-trash-can"></i></button>}
        </div>
        <div className="btn-groups-bot">
          <button className="archive-button" onClick={handleMarkNote}><i className="fa-solid fa-box-archive"></i></button>
          <button className="pin-button"><i className="fa-solid fa-thumbtack"></i></button>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        <div className="modal-content">
          <div className={`modal-images-grid ${getGridClass()}`}>
            {images.map((image, index) => (
              <img key={index} src={image} alt={`note-${index}`} className="modal-thumbnail" onClick={() => openImageModal(image)} />
            ))}
          </div>
          <div className="modal-details">
            {title && <h3 className="modal-title">{title}</h3>}
            <p>{content}</p>
          </div>
        </div>
        <div className="note-modified">
          <p>Last modified: {formattedDate}</p>
        </div>
        <div className="btns-group">
          {!onRestore && <button className="edit-button" onClick={() => { closeModal(); handleEditClick(); }}>Edit</button>}
          <button onClick={closeModal} className="close-button">Close</button>
        </div>
      </Modal>
      <Modal isOpen={imageModalIsOpen} onRequestClose={closeImageModal} className="image-modal" overlayClassName="overlay">
        {selectedImage && <img src={selectedImage} alt="selected" className="full-size-image" />}
        <button onClick={closeImageModal} className="close-button">Close</button>
      </Modal>
    </div>
  )
}


export default Note;
