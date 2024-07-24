import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React from "react";
import Home from "./component/Home";
import Play from './component/Play';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={<Home></Home>}
        />
        <Route path='/play' element={<Play></Play>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
