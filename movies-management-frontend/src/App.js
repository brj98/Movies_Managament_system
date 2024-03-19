import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MovieManage from './components/MovieManage';
import MoviesGallery from './components/MoviesGallery';
import Navbarr from './components/Navbar'; // Import your navbar component

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbarr /> {/* Render your navbar component here */}
        <Routes>
          <Route path="/MovieManage" element={<MovieManage />} />
          <Route path="/" element={ <MoviesGallery />} />
         
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
