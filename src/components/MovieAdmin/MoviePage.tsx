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
import Movie from '../../interfaces/Movie/Movie';
import CreateMovieDialog from './CreateMovieDialog';
import Modal from '../../utils/Modal';
import ActionType from '../../interfaces/ActionType';
import DeleteMovieDialog from './DeleteMovieDialog';
import EditMovieDialog from './EditMovieDialog';
import Adminable from '../../interfaces/Adminable';
import notify from '../../utils/ErrorToast';
import moment from 'moment';
import TableRowDisplay from '../../interfaces/TableRowDisplay';
import MovieRow from '../../interfaces/Movie/MovieRow';
import dayjs from 'dayjs';
import { genresMap } from '../../interfaces/Genre';
import { languageMap } from '../../interfaces/Language';
import MovieUpdate from '../../interfaces/Movie/MovieUpdate';
import MovieCreation from '../../interfaces/Movie/MovieCreation';
import Avatar from '@mui/material/Avatar';

const headCells: HeadCell<MovieRow>[] = [
    {
        id: 'thumbnail',
        label: 'תמונת נושא',
    },
    {
        id: 'title',
        label: 'שם הסרט',
    },
    {
        id: 'description',
        label: 'תיאור',
    },
    {
        id: 'duration',
        label: 'אורך הסרט',
    },
    {
        id: 'releaseDate',
        label: 'תאריך בכורה',
    },
    {
        id: 'genre',
        label: "ז'אנר",
    },
    {
        id: 'director',
        label: 'במאי',
    },
    {
        id: 'language',
        label: 'שפה',
    },
    {
        id: 'minAge',
        label: 'מותר מגיל',
    },
];

const MoviePage: FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieIdToThumbnail, setMovieIdToThumbnail] = useState<Map<number, string>>(new Map<number, string>());
    const [rows, setRows] = useState<MovieRow[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");
    const [selectedMovies, setSelectedMovies] = useState<number[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchMovies();

        // Clean up
        return () => {
            for (const thumbnail of movieIdToThumbnail.values()) {
                URL.revokeObjectURL(thumbnail);
            }
        };
    }, []);

    useEffect(() => {
        fetchMoviesThumbnails();
    }, [movies]);

    useEffect(() => {
        parseRows();
    }, [movieIdToThumbnail]);

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
                setMovies(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const fetchMoviesThumbnails = async () => {
        const updatedMap: Map<number, string> = new Map(movieIdToThumbnail);

        try {
            await Promise.all(movies.map(async (movie: Movie) => {
                const response = await fetch(`http://localhost:8080/api/movie/thumbnail/${movie.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const thumbnail = await response.blob();
                    updatedMap.set(movie.id, URL.createObjectURL(thumbnail));
                } else {
                    updatedMap.set(movie.id, '');
                }
            }));
            setMovieIdToThumbnail(updatedMap);
        } catch (error: any) {
            notify(error.message);
        }
    };

    const parseRows = () => {
        setRows(movies.map((m: Movie) => {
            return {
                ...m,
                duration: m.duration + " דקות",
                releaseDate: dayjs(m.releaseDate).format('DD/MM/YYYY').toString(),
                genre: genresMap.get(m.genre),
                language: languageMap.get(m.language),
                thumbnail: (
                    <Avatar variant="rounded" src={`${movieIdToThumbnail.get(m.id)}`} sx={{ width: 55, height: 55 * 889 / 600 }} />
                )
            }
        }));
    }

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
                    movie={movies.find((m: Movie) => m.id === selectedMovies[0]) as Movie}
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
            setSelectedMovies([]);
            changeModalState();
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onEditSubmited = async (updatedMovie: MovieUpdate) => {
        const movieId = selectedMovies[0];

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

    const onCreateSubmited = async (movie: MovieCreation) => {
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
                rows={rows}
                headCells={headCells as HeadCell<TableRowDisplay>[]}
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