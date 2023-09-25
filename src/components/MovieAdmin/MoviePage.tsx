import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Table from '../GenericComponents/Table';
import HeadCell from '../../interfaces/HeadCell';
import Movie from '../../interfaces/Movie';
import CreateMovieDialog from './CreateMovieDialog';
import Modal from '../../utils/Modal';
import ActionType from '../../interfaces/ActionType';
import DeleteMovieDialog from './DeleteMovieDialog';
import EditMovieDialog from './EditMovieDialog';
import Rowable from '../../interfaces/Rowable';
import notify from '../../utils/ErrorToast';
import moment from 'moment';

const headCells: HeadCell<Movie>[] = [
    {
        id: 'title',
        disablePadding: true,
        label: 'שם הסרט',
    },
    {
        id: 'description',
        disablePadding: false,
        label: 'תיאור',
    },
    {
        id: 'duration',
        disablePadding: false,
        label: 'אורך הסרט',
    },
    {
        id: 'releaseDate',
        disablePadding: false,
        label: 'תאריך בכורה',
    },
    {
        id: 'genre',
        disablePadding: false,
        label: "ז'אנר",
    },
    {
        id: 'director',
        disablePadding: false,
        label: 'במאי',
    },
    {
        id: 'language',
        disablePadding: false,
        label: 'שפה',
    },
    {
        id: 'minAge',
        disablePadding: false,
        label: 'מותר מגיל',
    },
];

const MoviePage: FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");
    const [selectedMovies, setSelectedMovies] = useState<number[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                const unformattedMovies: Movie[] = data;
                setMovies(unformattedMovies.map((movie: Movie) => {
                    return {
                        ...movie,
                        // duration: movie.duration + " דקות",
                        // releaseDate: moment(movie.releaseDate).format('L'),
                        // genre: 
                    }
                }));
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const changeModalState = () => {
        setOpenModal(!openModal);
    }

    const renderModal = () => {
        switch (action) {
            case 'ADD':
                return <CreateMovieDialog handleClose={changeModalState} dialogTitle={modalTitle} onCreateMovie={onCreateSubmited} />
            case 'DELETE':
                return <DeleteMovieDialog handleClose={changeModalState} title={modalTitle} onDeleteMovie={onDeleteSubmited} />
            case 'EDIT':
                return <EditMovieDialog
                    handleClose={changeModalState}
                    dialogTitle={modalTitle}
                    movie={movies.find((m: Movie) => m.id === selectedMovies[0]) || movies[0]}
                    onEditMovie={onEditSubmited} />
            default:
                return <></>
        }
    }

    const onAction = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "סרט");
        changeModalState();
    }

    const onEditMovie = (actionToPerform: ActionType, title: string, selectedId: number) => {
        setSelectedMovies(Array.of(selectedId));
        onAction(actionToPerform, title);
    }

    const onAddMovie = (actionToPerform: ActionType, title: string) => {
        onAction(actionToPerform, title);
    }

    const onDeleteMovie = (actionToPerform: ActionType, title: string, selectedIds: number[]) => {
        setSelectedMovies(selectedIds);
        onAction(actionToPerform, title);
    }

    const onDeleteSubmited = async () => {
        try {
            selectedMovies.forEach(async movie => {
                const response = await fetch(`http://localhost:8080/api/movie/${movie}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.errors[0]);
                }
            });
            setMovies(movies.filter(m => !selectedMovies.includes(m.id)))
            setSelectedMovies([])
            changeModalState();
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onEditSubmited = async (updatedMovie: Movie) => {
        const movieId = updatedMovie.id;

        try {
            const response = await fetch(`http://localhost:8080/api/movie/${movieId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMovie),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMovies((prevMovies) => {
                    const updatedMovies = [...prevMovies];
                    const movieIndex = updatedMovies.findIndex((movie) => movie.id === movieId);
                    if (movieIndex !== -1) {
                        updatedMovies[movieIndex] = { ...updatedMovies[movieIndex], ...updatedMovie };
                    }
                    return updatedMovies;
                });
                changeModalState();
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onCreateSubmited = async (movie: Movie) => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movie),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMovies(movies.concat(data));
                changeModalState();
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Table
                editable={true}
                title='סרטים'
                rows={movies}
                headCells={headCells as HeadCell<Rowable>[]}
                onAdd={onAddMovie}
                onEdit={onEditMovie}
                onDelete={onDeleteMovie}
            />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box >
    );
}

export default MoviePage;