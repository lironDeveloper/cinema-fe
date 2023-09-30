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
import queryString from 'query-string';

const SearchPage: React.FC = () => {
    const [results, setResults] = useState<Movie[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchSearchResults();
    }, [queryString.parse(window.location.search).keyword]);

    const fetchSearchResults = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie/search?keyword=${queryString.parse(window.location.search).keyword}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Box sx={{ display: 'flex', gap: '3vw', flexWrap: 'wrap' }}>
                {results.map((movie: Movie) => (
                    <MovieCard movie={movie} thumnailURL={`http://localhost:8080/api/movie/thumbnail/${movie.id}`} />
                ))}
            </Box>
        </Box>
    );
};

export default SearchPage;
