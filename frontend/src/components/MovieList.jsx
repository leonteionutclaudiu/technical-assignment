import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import MovieListComponent from './MovieListComponent';
import { SpinnerContext } from '../contexts/SpinnerContext';
import { useLocation, useParams } from 'react-router-dom';
import MovieModal from './MovieModal';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const MovieList = () => {
    const { genreId } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const endOfListRef = useRef(null);
    const [isScrollActive, setIsScrollActive] = useState(true);
    const { showSpinner, setShowSpinner } = useContext(SpinnerContext);
    const location = useLocation();
    const [lastSearchTerm, setLastSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [totalResults, setTotalResults] = useState('');
    const [genreName, setGenreName] = useState('');


    const openModal = async (movie) => {
        try {
            setShowSpinner(true);
            const response = await axios.get(`${apiUrl}/movie/${movie.id}`, {
                params: {
                    api_key: apiKey,
                },
            });
            setSelectedMovie(response.data);
            setShowSpinner(false);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            setShowSpinner(false);
        }
    };
    const closeModal = () => {
        setSelectedMovie(null);
    };

    // get search query
    const getSearchParamFromUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('q');
    };

    useEffect(() => {
        setShowSpinner(true);
        setMovies([]);
        setPage(1);
    }, [genreId]);

    useEffect(() => {
        const fetchMovies = async () => {
            setShowSpinner(true);
            try {
                const searchParam = getSearchParamFromUrl();
                if (searchParam !== lastSearchTerm) {
                    setMovies([]);
                    setPage(1);
                }

                let response;
                if (searchParam) {
                    response = await axios.get(`${apiUrl}/search/movie`, {
                        params: {
                            api_key: apiKey,
                            query: searchParam,
                            page: page,
                        },
                    });
                } else if (genreId) {

                    const genresResponse = await axios.get(`${apiUrl}/genre/movie/list`, {
                        params: {
                            api_key: apiKey,
                            language: 'en-US',
                        },
                    });
                    const genre = genresResponse.data.genres.find(genre => genre.id === parseInt(genreId));
                    if (genre) {
                        setGenreName(genre.name);
                    }

                    response = await axios.get(`${apiUrl}/discover/movie`, {
                        params: {
                            api_key: apiKey,
                            with_genres: genreId,
                            page: page,
                        },
                    });
                } else {
                    response = await axios.get(`${apiUrl}/movie/popular`, {
                        params: {
                            api_key: apiKey,
                            page: page,
                        },
                    });
                }

                setTotalResults(response.data.total_results);
                setMovies(prevMovies => {
                    if (searchParam !== lastSearchTerm) {
                        return [...response.data.results];
                    } else {
                        return [...prevMovies, ...response.data.results];
                    }
                });

                setShowSpinner(false);
                setLastSearchTerm(searchParam);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setShowSpinner(false);
            }
        };

        fetchMovies();
    }, [location.search, genreId, page]);

    const handleScroll = () => {
        if (
            endOfListRef.current &&
            endOfListRef.current.getBoundingClientRect().top <= window.innerHeight &&
            !showSpinner &&
            isScrollActive
        ) {
            setPage(prevPage => prevPage + 1);
            // setIsScrollActive(false);

            // setTimeout(() => {
            //     setIsScrollActive(true);
            // }, 1000);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isScrollActive]);

    return (
        <>
            {movies && (
                <div>
                    <h2 className='text-center text-primary font-bold text-2xl md:text-3xl mb-10'>                {genreId ? `Genre: ${genreName}` : getSearchParamFromUrl() ? `Search results (${totalResults}) :` : 'Popular movies'}
                    </h2>
                    {totalResults < 1 && <h2 className='text-black text-2xl text-center'>Sorry, no results found ! <FontAwesomeIcon icon={faFaceFrown} /></h2>}
                    <div className='grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 items-stretch'>
                        {movies.map((movie, index) => (
                            <React.Fragment key={index}>
                                {index === movies.length - 1 && (
                                    <div ref={endOfListRef}></div>
                                )}
                                <MovieListComponent
                                    movie={movie}
                                    onOpenModal={() => openModal(movie)}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
        </>
    );
}

export default MovieList;
