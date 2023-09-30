import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MovieCard from './MovieCard';
import { Stack, Typography, Paper } from '@mui/material'
import Container from '@mui/material/Container';
import notify from '../utils/ErrorToast';
import Movie from '../interfaces/Movie/Movie';
import { GenreKeys, genresMap } from '../interfaces/Genre';

interface MovieData {
    movies: Movie[];
    loading: boolean;
}

const genresKeysArr: GenreKeys[] = Array.from(genresMap.keys());

const Home: React.FC = () => {
    const [moviesByGenre, setMoviesByGenre] = useState<Map<GenreKeys, Movie[]>>(new Map());

    const { token } = useAuth();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const updatedMap: Map<GenreKeys, Movie[]> = new Map(moviesByGenre);

        try {
            await Promise.all(genresKeysArr.map(async (genre: GenreKeys) => {
                const response = await fetch(`http://localhost:8080/api/movie/genre/${genre}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    updatedMap.set(genre, data);
                } else {
                    throw new Error(data.errors[0]);
                }
            }));

            setMoviesByGenre(updatedMap);
        } catch (error: any) {
            notify(error.message);
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Box  >
                {
                    Array.from(moviesByGenre.entries()).map(([genre, movies]) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
                            <Typography variant='h6' fontWeight={'bold'}>{genresMap.get(genre)}</Typography >
                            <Box sx={{ display: 'flex', gap: '3vw' }}>
                                {movies.map((movie: Movie) => (
                                    <MovieCard title={movie.title} thumnailURL={`http://localhost:8080/api/movie/thumbnail/${movie.id}`} />
                                ))}
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
};

export default Home;
