import React, { useState } from "react";
import Modal from 'react-modal';
import "./note.scss";

const Note = ({ title, content, images, onEdit }) => {
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
        <div className="btns-group">
          <button className="edit-button" onClick={() => { closeModal(); onEdit(); }}>Edit</button>
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
