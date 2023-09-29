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
import Adminable from '../../interfaces/Adminable';
import notify from '../../utils/ErrorToast';
import moment from 'moment';
import TableRowDisplay from '../../interfaces/TableRowDisplay';
import MovieRow from '../../interfaces/MovieRow';
import dayjs from 'dayjs';
import { genresMap } from '../../interfaces/Genre';
import { languageMap } from '../../interfaces/Language';

const headCells: HeadCell<MovieRow>[] = [
    // {
    //     id: 'thumbnail',
    //     label: 'תמונת נושא',
    // },
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
    const [rows, setRows] = useState<MovieRow[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");
    const [selectedMovies, setSelectedMovies] = useState<number[]>([]);
    const [triggerUnselect, setTriggerUnselect] = useState<boolean>(true);

    const { token } = useAuth();

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        parseRows();
    }, [movies]);

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

    const parseRows = () => {
        let x: MovieRow[] = movies.map((m: Movie) => {
            return {
                ...m,
                duration: m.duration + " דקות",
                releaseDate: dayjs(m.releaseDate).format('DD/MM/YYYY').toString(),
                genre: genresMap.get(m.genre),
                language: languageMap.get(m.language),
                // thumbnail: (
                //     <img src={""} />
                // )
            }
        })
        setRows(x);
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
            setSelectedMovies([]);
            setTriggerUnselect(!triggerUnselect);
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
                rows={rows}
                headCells={headCells as HeadCell<TableRowDisplay>[]}
                onAdd={onAddMovie}
                onEdit={onEditMovie}
                onDelete={onDeleteMovie}
                triggerUnselect={triggerUnselect}
            />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box >
    );
}

export default MoviePage;