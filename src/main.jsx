import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { NotesProvider } from './context/NotesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotesProvider>
    <App />
  </NotesProvider>
);