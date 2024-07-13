import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom"
import AuthPanel from './Auth/AuthPanel/AuthPanel.jsx';
import Main from './Dashboard/MainDasboard/Main.jsx';
import Todos from './TodoInterface/Todos.jsx';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPanel />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/dashboard" element={<Main />} />
        <Route path="/todo-list/:id" element={<Todos />} />
      </Routes>
    </>
  );
}

export default App;
