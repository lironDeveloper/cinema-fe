import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Table from '../GenericComponents/Table';
import HeadCell from '../../interfaces/HeadCell';
import Movie from '../../interfaces/Movie/Movie';
import Modal from '../../utils/Modal';
import ActionType from '../../interfaces/ActionType';
import notify from '../../utils/ErrorToast';
import Showtime from '../../interfaces/Showtime/Showtime';
import Branch from '../../interfaces/Branch/Branch';
import Dropdown from '../GenericComponents/Dropdown';
import CreateShowtimeDialog from './CreateShowtimeDialog';
import DeleteShowtimeDialog from './DeleteShowtimeDialog';
import EditShowtimeDialog from './EditShowtimeDialog';
import ShowtimeRow from '../../interfaces/Showtime/ShowtimeRow';
import TableRowDisplay from '../../interfaces/TableRowDisplay';
import dayjs from 'dayjs';
import ShowtimeUpdate from '../../interfaces/Showtime/ShowtimeUpdate';
import ShowtimeCreation from '../../interfaces/Showtime/ShowtimeCraetion';

const headCells: HeadCell<ShowtimeRow>[] = [
    {
        id: 'hallName',
        label: 'שם האולם',
    },
    {
        id: 'startDate',
        label: 'תאריך התחלה',
    },
    {
        id: 'startTime',
        label: 'שעת התחלה',
    },
    {
        id: 'endDate',
        label: 'תאריך סיום',
    },
    {
        id: 'endTime',
        label: 'שעת סיום',
    },
];

const ShowtimePage: FC = () => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [rows, setRows] = useState<ShowtimeRow[]>([]);
    const [branchesMap, setBranchesMap] = useState<Map<string, Branch>>(new Map());
    const [currentBranch, setCurrentBranch] = useState<string>('');
    const [moviesMap, setMoviesMap] = useState<Map<string, Movie>>(new Map());
    const [currentMovie, setCurrentMovie] = useState<string>('');

    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");
    const [selectedShowtimes, setSelectedShowtimes] = useState<number[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchBranches();
        fetchMovies();
    }, []);

    useEffect(() => {
        fetchShowtimes();
    }, [currentBranch, currentMovie]);

    useEffect(() => {
        parseRows();
    }, [showtimes]);

    const fetchBranches = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/branch`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                const updatedMap: Map<string, Branch> = new Map(branchesMap);
                data.forEach((branch: Branch) => {
                    updatedMap.set(branch.name, branch);
                });
                setBranchesMap(updatedMap);
                setCurrentBranch(data[0].name);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

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
                const updatedMap: Map<string, Movie> = new Map(moviesMap);
                data.forEach((movie: Movie) => {
                    updatedMap.set(movie.title, movie);
                });
                setMoviesMap(updatedMap);
                setCurrentMovie(data[0].title);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const fetchShowtimes = async () => {
        try {
            if (branchesMap.size > 0 && moviesMap.size > 0) {
                const response = await fetch(`http://localhost:8080/api/showtime/movie/${moviesMap.get(currentMovie)!.id}/branch/${branchesMap.get(currentBranch)!.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setShowtimes(data);
                } else {
                    throw new Error(data.errors[0])
                }
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const parseRows = () => {
        setRows(showtimes.map((st: Showtime) => {
            return {
                id: st.id,
                hallName: st.hall.name,
                startDate: dayjs(st.startTime).format('DD/MM/YYYY').toString(),
                startTime: dayjs(st.startTime).format('HH:mm').toString(),
                endDate: dayjs(st.endTime).format('DD/MM/YYYY').toString(),
                endTime: dayjs(st.endTime).format('HH:mm').toString()
            }
        }));
    }

    const handleBranchChange = (event: SelectChangeEvent) => {
        setCurrentBranch(event.target.value);
    };

    const handleMovieChange = (event: SelectChangeEvent) => {
        setCurrentMovie(event.target.value);
    };

    const changeModalState = () => {
        setOpenModal(!openModal);
    }

    const renderModal = () => {
        switch (action) {
            case 'ADD':
                return <CreateShowtimeDialog
                    handleClose={changeModalState}
                    title={modalTitle}
                    branch={branchesMap.get(currentBranch) as Branch}
                    movie={moviesMap.get(currentMovie) as Movie}
                    onCreateShowtime={onCreateSubmited}
                />
            case 'DELETE':
                return <DeleteShowtimeDialog
                    handleClose={changeModalState}
                    title={modalTitle}
                    onDeleteShowtime={onDeleteSubmited}
                />
            case 'EDIT':
                return <EditShowtimeDialog
                    handleClose={changeModalState}
                    title={modalTitle}
                    branch={branchesMap.get(currentBranch) as Branch}
                    movie={moviesMap.get(currentMovie) as Movie}
                    onEditShowtime={onEditSubmited}
                    showtime={showtimes.find((st: Showtime) => st.id === selectedShowtimes[0]) as Showtime} />
            default:
                return <></>
        }
    }

    const onAction = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "הקרנה");
        changeModalState();
    }

    const onEditShowtime = (actionToPerform: ActionType, title: string, selectedId: number) => {
        setSelectedShowtimes(Array.of(selectedId));
        onAction(actionToPerform, title);
    }

    const onAddShowtime = (actionToPerform: ActionType, title: string) => {
        onAction(actionToPerform, title);
    }

    const onDeleteShowtime = (actionToPerform: ActionType, title: string, selectedIds: number[]) => {
        setSelectedShowtimes(selectedIds);
        onAction(actionToPerform, title);
    }

    const onDeleteSubmited = async () => {
        try {
            selectedShowtimes.forEach(async showtime => {
                const response = await fetch(`http://localhost:8080/api/showtime/${showtime}`, {
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
            setShowtimes(showtimes.filter(st => !selectedShowtimes.includes(st.id)))
            setSelectedShowtimes([])
            changeModalState();
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onEditSubmited = async (updatedShowtime: ShowtimeUpdate) => {
        const showtimeId = selectedShowtimes[0];

        try {
            const response = await fetch(`http://localhost:8080/api/showtime/${showtimeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedShowtime),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                let newShowtime: Showtime = data as Showtime;
                setShowtimes((prevShowtimes) => {
                    const updatedShowtimes = [...prevShowtimes];
                    const showtimeIndex = updatedShowtimes.findIndex((showtime) => showtime.id === showtimeId);
                    if (showtimeIndex !== -1) {
                        updatedShowtimes[showtimeIndex] = { ...updatedShowtimes[showtimeIndex], ...newShowtime };
                    }
                    return updatedShowtimes;
                });
                changeModalState();
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onCreateSubmited = async (showtime: ShowtimeCreation) => {
        try {
            const response = await fetch(`http://localhost:8080/api/showtime`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(showtime),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setShowtimes(showtimes.concat(data));
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
            {branchesMap?.size > 0 && moviesMap?.size > 0 &&
                <Box sx={{ maxWidth: 500 }} display='flex' gap={10}>
                    <Dropdown
                        items={Array.from(branchesMap.keys())}
                        label='שם סניף'
                        onChange={handleBranchChange}
                        value={currentBranch}
                    />
                    <Dropdown
                        items={Array.from(moviesMap.keys())}
                        label='שם סרט'
                        onChange={handleMovieChange}
                        value={currentMovie}
                    />
                </Box>}
            <Table
                editable={true}
                title='הקרנות'
                rows={rows as TableRowDisplay[]}
                headCells={headCells as HeadCell<TableRowDisplay>[]}
                onAdd={onAddShowtime}
                onEdit={onEditShowtime}
                onDelete={onDeleteShowtime}
            />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box >
    );
}

export default ShowtimePage;