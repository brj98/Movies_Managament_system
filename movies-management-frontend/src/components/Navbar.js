import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../img/logoa.png'; // Import your logo image

export default function Navbarr() {
    const navigate = useNavigate();

    const handleNavigateToMovieManage = () => {
        navigate('/MovieManage');
    };

    const handleNavigateToMoviesGallery = () => {
        navigate('/');
    };

    return (
        <nav className="bg-black text-white p-4 flex items-center">
        <img
            src={Logo}
            alt="Logo"
            width="120"
            height="120"
            onClick={() => navigate('/')}
            className="cursor-pointer mr-4"
        />
        <div>
            <button
                onClick={handleNavigateToMovieManage}
                className="mr-4 px-3 py-2 rounded hover:bg-gray-700 focus:outline-none text-lg font-bold"
            >
                Movie Management
            </button>
            <button
                onClick={handleNavigateToMoviesGallery}
                className="px-3 py-2 rounded hover:bg-gray-700 focus:outline-none text-lg font-bold"
            >
                Movies Gallery
            </button>
        </div>
    </nav>
    
    );
}
