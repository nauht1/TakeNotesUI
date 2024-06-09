import React from "react";
import "./home.scss";
import Note from "../../components/note/Note.jsx";
import Modal from "react-modal";
import { DragDropContext } from "react-beautiful-dnd";

// Modal.setAppElement("#root");

const notes = [
  { title: "Giao diện tối đã ra mắt", content: "Tận hưởng trải nghiệm đọc thoải mái hơn. Bật hoặc tắt tính năng này trong phần Cài đặt.", images: ["./take_notes.png"] },
  { title: "", content: "4545454545", images: [] },
  { title: "", content: "0357008151\n123456789", images: ["./relax.jpg"] },
  { title: "", content: "k", images: ["./relax.jpg", "./relax.jpg"] },
  { title: "", content: "dasdas\ndasdas", images: [] },
  { title: "", content: "", images: ["./app_logo.png", "./app_logo.png", "./relax.jpg"] },
  { title: "", content: "6/11 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30 \n 7h30\n 7h30sáng phòng 2 (dưới)\nR 75 L 45p\nP:\nilovejesus#\n5370CD#", images: ["./take_notes.png"] },
  { title: "HIHIIHIHI", content: "dasdsdsds dasdasasdsdsdddddds asdsdsddddddsas dsdsdddddds asdsdsddddddsasdsdsdddd ddsasddddddddddddddddddddddddddddddddddddddddddsdsd ddddds asdsdsdd ddddsas dsdsdddddd sasdsds dddddd", images: ["./app_logo.png", "./take_notes.png", "./take_notes.png", "./relax.jpg", "./relax.jpg", "./relax.jpg"] }
];

const Home = () => {
  return (
    <div className="home-section">
      <div className="notes-grid">
        {notes.map((note, index) => (
          <Note key={index} title={note.title} content={note.content} images={note.images} />
        ))}
      </div>
    </div>
  )
}

export default Home;