import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MovieCard from './MovieCard';
import { Stack, Typography, Paper } from '@mui/material'
import Container from '@mui/material/Container';
import notify from '../utils/ErrorToast';

interface MovieData {
    movies: Movie[];
    loading: boolean;
    // loadMoreCounter: number;
    // noMoreVideos: boolean;
}

interface Movie {
    id: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
    genre: string;
    director: string;
    language: string;
    minAge: number;
    createdOn: string;
}

const Genres: any = {
    ACTION: {
        label: 'אקשן',
    },
    COMEDY: {
        label: 'קומדיה',
    },
    HORROR: {
        label: 'אימה',
    },
    DRAMA: {
        label: 'דרמה',
    },
    KIDS: {
        label: 'עולם הילדים',
    },
};

const Home: React.FC = () => {
    const initialState = Object.keys(Genres).reduce((acc: any, key: string) => {
        acc[key] = {
            movies: [],
            loading: true,
        };
        return acc;
    }, {});

    const [moviesByGenre, setMoviesByGenre] = useState<Record<string, MovieData>>(initialState);
    const [movieOrder, setMovieOrder] = useState(Object.keys(Genres));


    const { token } = useAuth();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = () => {
        Object.keys(Genres).forEach(async genre => {
            try {
                const response = await fetch(`http://localhost:8080/api/movie/genre/${genre}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setMoviesByGenre(() => ({
                        [genre]: {
                            movies: data,
                            loading: false,
                        }
                    }));
                } else {
                    throw new Error(data.errors[0]);
                }
            } catch (error: any) {
                notify(error.message);
            }
        });
    };


    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }} >
                {
                    movieOrder.map((genre: string) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>

                            <Typography variant='h6' fontWeight={'bold'}>{Genres[genre].label}</Typography >
                            <Box sx={{ display: 'flex', gap: '3vw' }}>
                                {moviesByGenre[genre]?.movies.map((movie: Movie) => (
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
