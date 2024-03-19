import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'jspdf';
import 'jspdf-autotable';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';

function MovieManage() {
    // Initial state for a new movie
    const emptymovietv = {
        id: '',
        title: '',
        type: '',
        year: '',
        imdbID: '',
        plot: '',
        cast: {
            actorName: ''
        },
        metadata: {
            actor: '',
            poster: '',
            awards: '',
            country: '',
            director: '',
            genre: '',
            language: '',
            metascore: '',
            rated: '',
            ratings: '',
            released: '',
            response: '',
            runtime: '',
            writer: '',
            imdbRating: '',
            imdbVotes: '',
            totalSeasons: ''
        }
    };

    // State variables
    const [movietvs, setmovietvs] = useState([]); // Stores the list of movies
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movieTitles, setMovieTitles] = useState([]); // Stores movie titles for dropdown
    const [searchQuery, setSearchQuery] = useState(''); // Stores search query for movie titles
    const [movietvDialog, setmovietvDialog] = useState(false); // Controls visibility of dialog
    const [movietv, setmovietv] = useState(emptymovietv); // Represents movie details
    const [submitted, setSubmitted] = useState(false); // Flag for form submission
    const [deletemovietvDialog, setDeletemovietvDialog] = useState(false); // Controls visibility of delete movietv dialog
    const toast = useRef(null); // Reference to Toast component
    const dt = useRef(null); // Reference to DataTable component
    const [globalFilter, setGlobalFilter] = useState(null);
    const [duplicateMovieDialog, setDuplicateMovieDialog] = useState(false);



    // Fetch movies when component mounts
    useEffect(() => {
        fetchKullanicilar();
    }, []);

    // Fetch movies from server
    const fetchKullanicilar = async () => {
        try {
            const response = await axios.get('http://16.171.19.115:8080/contents');
            setmovietvs(response.data);
        } catch (error) {
            console.error('Error fetching misafirler:', error);
        }
    };

    // Update search query
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Fetch movies based on search query
    const fetchMovies = async () => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=1181be46&s=${searchQuery}`);
            if (response.data && response.data.Search) {
                const formattedTitles = response.data.Search.map(movie => movie.Title);
                setMovieTitles(formattedTitles);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    // Handle movie selection from dropdown
    const handleMovieSelect = async (title) => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=1181be46&t=${title}`);
            setSelectedMovie(title);

            if (response.data) {
                const movie = response.data;
                setmovietv({
                    ...emptymovietv,
                    poster: movie?.Poster || '',
                    title: movie?.Title || '',
                    type: movie?.Type || '',
                    year: movie?.Year || '',
                    imdbID: movie?.imdbID || '',
                    actors: movie?.Actors || '',
                    awards: movie?.Awards || '',
                    country: movie?.Country || '',
                    director: movie?.Director || '',
                    genre: movie?.Genre || '',
                    language: movie?.Language || '',
                    metascore: movie?.Metascore || '',
                    plot: movie?.Plot || '',
                    rated: movie?.Rated || '',
                    ratings: movie?.Ratings?.[0]?.Value || '',
                    released: movie?.Released || '',
                    response: movie?.Response || '',
                    runtime: movie?.Runtime || '',
                    writer: movie?.Writer || '',
                    imdbRating: movie?.imdbRating || '',
                    imdbVotes: movie?.imdbVotes || '',
                    totalSeasons: movie?.totalSeasons || ''
                });
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    // Open dialog for adding new movie
    const openNew = () => {
        setmovietv(emptymovietv);
        setSubmitted(false);
        setmovietvDialog(true);
    };

    // Hide dialog for adding new movie
    const hideDialog = () => {
        setSubmitted(false);
        setmovietvDialog(false);
    };

    // Hide dialog for deleting movie
    const hideDeletemovietvDialog = () => {
        setDeletemovietvDialog(false);
    };

    // Save new movie
    const savemovietv = async () => {
        try {
            // Check if the movie already exists in the database using its IMDb ID
            const existingMovie = movietvs.find(movie => movie.imdbID === movietv.imdbID);

            if (existingMovie) {
                setDuplicateMovieDialog(true);
                return;
            }

            // If the movie is not a duplicate, proceed with saving
            if (movietv.id) {
                // Update existing movietv using PUT requests
                await axios.put(`http://16.171.19.115:8080/contents/${movietv.id}`, {
                    title: movietv.title,
                    type: movietv.type,
                    year: movietv.year,
                    imdbID: movietv.imdbID,
                    plot: movietv.plot
                });

                await axios.put(`http://16.171.19.115:8080/metadata/${movietv.id}`, {
                    actors: movietv.actors,
                    poster: movietv.poster,
                    awards: movietv.awards,
                    country: movietv.country,
                    director: movietv.director,
                    genre: movietv.genre,
                    language: movietv.language,
                    metascore: movietv.metascore,
                    rated: movietv.rated,
                    ratings: movietv.ratings,
                    released: movietv.released,
                    response: movietv.response,
                    runtime: movietv.runtime,
                    writer: movietv.writer,
                    imdbRating: movietv.imdbRating,
                    imdbVotes: movietv.imdbVotes,
                    totalSeasons: movietv.totalSeasons
                });

                await axios.put(`http://16.171.19.115:8080/casts/${movietv.id}`, {
                    actorName: movietv.actors
                });

                window.location.reload();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'movietv Updated', life: 10000 });
            } else {
                // Create new movietv using a POST request
                const response = await axios.post('http://16.171.19.115:8080/movies', {
                    content: {
                        title: movietv.title,
                        type: movietv.type,
                        year: movietv.year,
                        imdbID: movietv.imdbID,
                        plot: movietv.plot
                    },
                    metadata: {
                        actors: movietv.actors,
                        poster: movietv.poster,
                        awards: movietv.awards,
                        country: movietv.country,
                        director: movietv.director,
                        genre: movietv.genre,
                        language: movietv.language,
                        metascore: movietv.metascore,
                        rated: movietv.rated,
                        ratings: movietv.ratings,
                        released: movietv.released,
                        response: movietv.response,
                        runtime: movietv.runtime,
                        writer: movietv.writer,
                        imdbRating: movietv.imdbRating,
                        imdbVotes: movietv.imdbVotes,
                        totalSeasons: movietv.totalSeasons
                    },
                    cast: {
                        actorName: movietv.actors
                    }
                });

                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'movietv Created', life: 10000 });
                window.location.reload()
                setmovietvs([...movietvs, response.data]);
                setmovietvDialog(false);
                setmovietv(emptymovietv);
            }
        } catch (error) {
            console.error('Error saving movietv:', error);
        }
    };

    // Function to hide duplicate movie warning dialog
    const hideDuplicateMovieDialog = () => {
        setDuplicateMovieDialog(false);
    };

    // Confirm deletion of a movie
    const confirmDeletemovietv = (movietv) => {
        setmovietv(movietv);
        setDeletemovietvDialog(true);
    };

    // Delete movie
    const deletemovietv = async () => {
        try {
            await axios.delete(`http://16.171.19.115:8080/contents/${movietv.id}`);
            await axios.delete(`http://16.171.19.115:8080/metadata/${movietv.id}`);
            await axios.delete(`http://16.171.19.115:8080/casts/${movietv.id}`);
            let _movietvs = movietvs.filter((val) => val.id !== movietv.id);
            setmovietvs(_movietvs);
            setDeletemovietvDialog(false);
            setmovietv(emptymovietv);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'movietv Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    // Edit movie details
    const editmovietv = (rowData) => {
        setmovietv({
            ...rowData,
            actors: rowData.metadata.actors,
            poster: rowData.metadata.poster,
            awards: rowData.metadata.awards,
            country: rowData.metadata.country,
            director: rowData.metadata.director,
            genre: rowData.metadata.genre,
            language: rowData.metadata.language,
            metascore: rowData.metadata.metascore,
            rated: rowData.metadata.rated,
            ratings: rowData.metadata.ratings,
            released: rowData.metadata.released,
            response: rowData.metadata.response,
            runtime: rowData.metadata.runtime,
            writer: rowData.metadata.writer,
            imdbRating: rowData.metadata.imdbRating,
            imdbVotes: rowData.metadata.imdbVotes,
            totalSeasons: rowData.metadata.totalSeasons
        });
        setmovietvDialog(true);
    };


    // Handle input change
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _movietv = { ...movietv };
        _movietv[`${name}`] = val;
        setmovietv(_movietv);
    };

    // Template for left toolbar buttons
    const leftToolbarTemplate = () => {
        return (
            <div className="p-toolbar-group-left">
                <Button label="Add New Movie or TV Serie" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            </div>
        );
    };

    // Template for movie poster in DataTable
    const posterBodyTemplate = (rowData) => {
        if (rowData.metadata && rowData.metadata.poster) {
            return <img src={rowData.metadata.poster} alt={rowData.metadata.poster} style={{ width: '500rem' }} />;
        } else {
            return null; // or render a placeholder image
        }
    };


    // Template for action buttons in DataTable
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-mr-2" onClick={() => editmovietv(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeletemovietv(rowData)} />
            </React.Fragment>
        );
    };

    // Template for footer of movietv dialog
    const movietvDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savemovietv} />
        </React.Fragment>
    );



    // Template for footer of delete movietv dialog
    const deletemovietvDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletemovietvDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletemovietv} />
        </React.Fragment>
    );

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h2 className="m-0">Movies & TV Series Management System </h2>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>

                <DataTable
                    ref={dt}
                    value={movietvs.slice().reverse()}
                    dataKey="id"
                    paginator
                    globalFilter={globalFilter}
                    header={header}
                    rows={3}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                >
                    <Column field="imdbID" header="IMDb ID" style={{ width: '8rem' }} />
                    <Column field="metadata.poster" header="Poster" body={posterBodyTemplate} style={{ width: '200rem' }} />
                    <Column field="plot" header="Plot" style={{ width: '19rem' }} />
                    <Column field="title" header="Title" style={{ width: '12rem' }} />
                    <Column field="type" header="Type" style={{ width: '8rem' }} />
                    <Column field="year" header="Year" style={{ width: '8rem' }} />
                    <Column field="cast.actorName" header="Actors" style={{ width: '12rem' }} />
                    <Column field="metadata.awards" header="Awards" style={{ width: '8rem' }} />
                    <Column field="metadata.country" header="Country" style={{ width: '8rem' }} />
                    <Column field="metadata.director" header="Director" style={{ width: '8rem' }} />
                    <Column field="metadata.genre" header="Genre" style={{ width: '8rem' }} />
                    <Column field="metadata.language" header="Language" style={{ width: '8rem' }} />
                    <Column field="metadata.metascore" header="Metascore" style={{ width: '8rem' }} />
                    <Column field="metadata.rated" header="Rated" style={{ width: '8rem' }} />
                    <Column field="metadata.ratings" header="Ratings" style={{ width: '8rem' }} />
                    <Column field="metadata.released" header="Released" style={{ width: '8rem' }} />
                    <Column field="metadata.response" header="Response" style={{ width: '8rem' }} />
                    <Column field="metadata.runtime" header="Runtime" style={{ width: '8rem' }} />
                    <Column field="metadata.writer" header="Writer" style={{ width: '8rem' }} />
                    <Column field="metadata.imdbRating" header="IMDb Rating" style={{ width: '8rem' }} />
                    <Column field="metadata.imdbVotes" header="IMDb Votes" style={{ width: '8rem' }} />
                    <Column field="metadata.totalSeasons" header="Total Seasons" style={{ width: '8rem' }} />
                    <Column body={actionBodyTemplate} style={{ width: '8rem' }} />

                </DataTable>
            </div>
            <Dialog visible={duplicateMovieDialog} style={{ width: '70vw' }} header="Warning" modal footer={<Button label="OK" icon="pi pi-check" onClick={hideDuplicateMovieDialog} />} onHide={hideDuplicateMovieDialog}>
                <div className="warning-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>This movie already exists in the database!</span>
                </div>
            </Dialog>
            <Dialog visible={movietvDialog} style={{ width: '70vw' }} header="Add New Movie" modal className="max-w-7xl" footer={movietvDialogFooter} onHide={hideDialog} >
                <div className="p-grid p-fluid">
                    <div className="p-field p-col">
                        <label htmlFor="searchQuery" className="font-bold">Search Movies</label>
                        <div className="p-flex p-flex-column">
                            <div className="p-inputgroup p-mb-2">
                                <InputText id="searchQuery" value={searchQuery} onChange={handleSearchInputChange} className="p-mr-2" />
                            </div>
                            <div className="p-inputgroup">
                                <Button label="Search" onClick={fetchMovies} className="p-button-success" style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>


                    <div className="p-field p-col">
                        <label htmlFor="title" className="font-bold">Title</label>
                        <Dropdown
                            id="title"
                            value={selectedMovie}
                            options={movieTitles.map(title => ({ label: title, value: title }))}
                            onChange={(e) => handleMovieSelect(e.value)}
                            placeholder="Select a movie"
                        />
                        {submitted && !movietv.title && <small className="p-error">Title is required.</small>}

                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="poster" className="font-bold">Poster</label>
                        <InputText id="poster" value={movietv.poster} onChange={(e) => onInputChange(e, 'poster')} required autoFocus className={classNames({ 'p-invalid': submitted && !movietv.poster })} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="type" className="font-bold">Type</label>
                        <InputText id="type" value={movietv.type} onChange={(e) => onInputChange(e, 'type')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="year" className="font-bold">Year</label>
                        <InputText id="year" value={movietv.year} onChange={(e) => onInputChange(e, 'year')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="imdbID" className="font-bold">IMDb ID</label>
                        <InputText id="imdbID" value={movietv.imdbID} onChange={(e) => onInputChange(e, 'imdbID')} />
                    </div>

                    {/* Second column */}
                    <div className="p-field p-col">
                        <label htmlFor="actors" className="font-bold">Actors</label>
                        <InputText id="actors" value={movietv.actors} onChange={(e) => onInputChange(e, 'actors')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="awards" className="font-bold">Awards</label>
                        <InputText id="awards" value={movietv.awards} onChange={(e) => onInputChange(e, 'awards')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="country" className="font-bold">Country</label>
                        <InputText id="country" value={movietv.country} onChange={(e) => onInputChange(e, 'country')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="director" className="font-bold">Director</label>
                        <InputText id="director" value={movietv.director} onChange={(e) => onInputChange(e, 'director')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="genre" className="font-bold">Genre</label>
                        <InputText id="genre" value={movietv.genre} onChange={(e) => onInputChange(e, 'genre')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="language" className="font-bold">Language</label>
                        <InputText id="language" value={movietv.language} onChange={(e) => onInputChange(e, 'language')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="metascore" className="font-bold">Metascore</label>
                        <InputText id="metascore" value={movietv.metascore} onChange={(e) => onInputChange(e, 'metascore')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="plot" className="font-bold">Plot</label>
                        <InputText id="plot" value={movietv.plot} onChange={(e) => onInputChange(e, 'plot')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="rated" className="font-bold">Rated</label>
                        <InputText id="rated" value={movietv.rated} onChange={(e) => onInputChange(e, 'rated')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="ratings" className="font-bold">Ratings</label>
                        <InputText id="ratings" value={movietv.ratings} onChange={(e) => onInputChange(e, 'ratings')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="released" className="font-bold">Released</label>
                        <InputText id="released" value={movietv.released} onChange={(e) => onInputChange(e, 'released')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="response" className="font-bold">Response</label>
                        <InputText id="response" value={movietv.response} onChange={(e) => onInputChange(e, 'response')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="runtime" className="font-bold">Runtime</label>
                        <InputText id="runtime" value={movietv.runtime} onChange={(e) => onInputChange(e, 'runtime')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="writer" className="font-bold">Writer</label>
                        <InputText id="writer" value={movietv.writer} onChange={(e) => onInputChange(e, 'writer')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="imdbRating" className="font-bold">IMDb Rating</label>
                        <InputText id="imdbRating" value={movietv.imdbRating} onChange={(e) => onInputChange(e, 'imdbRating')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="imdbVotes" className="font-bold">IMDb Votes</label>
                        <InputText id="imdbVotes" value={movietv.imdbVotes} onChange={(e) => onInputChange(e, 'imdbVotes')} />
                    </div>

                    <div className="p-field p-col">
                        <label htmlFor="totalSeasons" className="font-bold">Total Seasons</label>
                        <InputText id="totalSeasons" value={movietv.totalSeasons} onChange={(e) => onInputChange(e, 'totalSeasons')} />
                    </div>
                </div>
            </Dialog>


            <Dialog visible={deletemovietvDialog} style={{ width: '70vw' }} header="Confirm" modal footer={deletemovietvDialogFooter} onHide={hideDeletemovietvDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {movietv && (
                        <span>
                            Are you sure you want to delete <b>{movietv.title}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}

export default MovieManage;
