import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';

export default function MovieGallery() {
    // State variables
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [globalFilter, setGlobalFilter] = useState('');

    // Fetch movies on component mount
    useEffect(() => {
        fetchMovies();
    }, []);

    // Fetch movies from the server
   // Fetch movies from the server
const fetchMovies = async () => {
    try {
        const response = await axios.get('http://16.171.19.115:8080/contents');
        // Sort the movies array based on a unique identifier in reverse order
        const sortedMovies = response.data.sort((a, b) => {
            // Assuming the movies have an 'id' field representing a unique identifier
            return b.id - a.id; // Replace 'id' with the actual unique identifier
        });
        setMovies(sortedMovies);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};


    // Open movie details dialog
    const viewDetails = (movie) => {
        setSelectedMovie(movie);
        setDisplayDialog(true);
    };

    // Close movie details dialog
    const onHide = () => {
        setDisplayDialog(false);
    };

    // Filter movies based on search input
    const filteredMovies = movies.filter((movie) => {
        return (
            movie.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
            movie.metadata.actors.toLowerCase().includes(globalFilter.toLowerCase())
        );
    });

    return (
        <div className="movie-gallery grid grid-cols-3  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 grid-auto-rows">
            {/* Search bar */}
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between lg:col-span-5 md:col-span-3 col-span-3">
                <h2 className="m-9">Movies & TV Series Management System </h2>
                <span className="p-input-icon-left mr-9">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>

            {/* Display posters */}
            {filteredMovies.map((movie, index) => (
                <div
                    key={index}
                    className="poster-container relative flex items-center justify-center m-1"
                    onClick={() => viewDetails(movie)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                >
                    <img
                        src={movie.metadata.poster}
                        alt={movie.title}
                        className="poster h-150 w-auto object-cover"
                    />
                    <div
                        className={`poster-title absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-4 text-lg font-bold ${
                            hoveredIndex === index ? 'block' : 'hidden'
                        }`}
                    >
                        {movie.title}
                    </div>
                </div>
            ))}

            {/* Movie details dialog */}
            <Dialog visible={displayDialog} onHide={onHide} className="max-w-7xl">
                {selectedMovie && (
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Movie poster */}
                        <div className="flex justify-center">
                            <img src={selectedMovie.metadata.poster} alt={selectedMovie.title} className="w-auto" />
                        </div>
                        {/* Movie details */}
                        <div className="p-4">
                            <h2 className="text-xxl font-semibold mb-2">{selectedMovie.title}</h2>
                            <p className="text-gray-700 mb-4">{selectedMovie.metadata.plot}</p>
                            <div className="flex flex-col">
                                <p><span className="font-semibold">Type:</span> {selectedMovie.type}</p>
                                <p><span className="font-semibold">Year:</span> {selectedMovie.year}</p>
                                <p><span className="font-semibold">Actors:</span> {selectedMovie.cast.actorName}</p>
                                <p><span className="font-semibold">Awards:</span> {selectedMovie.metadata.awards}</p>
                                <p><span className="font-semibold">Country:</span> {selectedMovie.metadata.country}</p>
                                <p><span className="font-semibold">Director:</span> {selectedMovie.metadata.director}</p>
                                <p><span className="font-semibold">Genre:</span> {selectedMovie.metadata.genre}</p>
                                <p><span className="font-semibold">Language:</span> {selectedMovie.metadata.language}</p>
                                <p><span className="font-semibold">Metascore:</span> {selectedMovie.metadata.metascore}</p>
                                <p><span className="font-semibold">Plot:</span> {selectedMovie.plot}</p>
                                <p><span className="font-semibold">Rated:</span> {selectedMovie.metadata.rated}</p>
                                <p><span className="font-semibold">Ratings:</span> {selectedMovie.metadata.ratings}</p>
                                <p><span className="font-semibold">Released:</span> {selectedMovie.metadata.released}</p>
                                <p><span className="font-semibold">Response:</span> {selectedMovie.metadata.response}</p>
                                <p><span className="font-semibold">Runtime:</span> {selectedMovie.metadata.runtime}</p>
                                <p><span className="font-semibold">Writer:</span> {selectedMovie.metadata.writer}</p>
                                <p><span className="font-semibold">IMDB Rating:</span> {selectedMovie.metadata.imdbRating}</p>
                                <p><span className="font-semibold">IMDB Votes:</span> {selectedMovie.metadata.imdbVotes}</p>
                                <p><span className="font-semibold">Total Seasons:</span> {selectedMovie.metadata.totalSeasons}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
