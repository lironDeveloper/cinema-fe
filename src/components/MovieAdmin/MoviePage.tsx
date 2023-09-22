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

import Table from '../../utils/Table';
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

const genreTranslator = (genre: string) => {
    switch (genre) {
        case ("COMEDY"):
            return "קומדיה";
        case ("HORROR"):
            return "אימה";
        case ("DRAMA"):
            return "דרמה";
        case ("KIDS"):
            return "ילדים"
        case ("ACTION"):
            return "אקשן"
        default:
            return "לא מוכר"
    }
}

const languageTranslator = () => {

}

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
                        duration: movie.duration + " דקות",
                        releaseDate: moment(movie.releaseDate).format('L'),
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
                return <CreateMovieDialog handleClose={changeModalState} title={modalTitle} />
            case 'DELETE':
                return <DeleteMovieDialog handleClose={changeModalState} title={modalTitle} />
            case 'EDIT':
                return <EditMovieDialog handleClose={changeModalState} title={modalTitle} />
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