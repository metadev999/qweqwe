import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate}
    from 'react-router-dom';
import Navbar from './navbar';
import Home from './home';
import Tosatsuyu from './tosatsuyu';
import Tsuyutosa from './tsuyutosa';
  
function App() {
return (
    <Router>
    <Navbar />
    <Routes>
        <Route exact path='/home' element={<Home />} />  
        
        <Route path="/" element={<Navigate replace to="/home" />} />
     
      
        <Route path='/tosatsuyu' element={<Tosatsuyu/>} />
        <Route path='/tsuyutosa' element={<Tsuyutosa/>} />
    </Routes>
    </Router>
);
}
  
export default App;