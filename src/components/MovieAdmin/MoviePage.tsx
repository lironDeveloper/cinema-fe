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
import HeadCell from '../../interfaces/headCell';
import Movie from '../../interfaces/Movie';
import CreateMovieDialog from './CreateMovieDialog';
import Modal from '../../utils/Modal';
import ActionType from '../../interfaces/ActionType';
import DeleteMovieDialog from './DeleteMovieDialog';
import EditMovieDialog from './EditMovieDialog';

const headCells: HeadCell[] = [
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

    const { token } = useAuth();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        const response = await fetch(`http://localhost:8080/api/movie`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const movies = await response.json();
        setMovies(movies);
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

    const onActionMovie = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "סרט");
        changeModalState();
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Table
                editable={true}
                title='סרטים'
                mainColumn='title'
                rows={movies}
                headCells={headCells}
                onAction={onActionMovie}
            />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box >
    );
}

export default MoviePage;