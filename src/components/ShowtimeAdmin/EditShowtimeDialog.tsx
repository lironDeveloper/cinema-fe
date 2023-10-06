import Button from '@mui/material/Button';
import { FC, useEffect, useState } from 'react';
import { Box, DialogActions, DialogContent, DialogTitle, SelectChangeEvent, TextField } from '@mui/material';
import Hall from '../../interfaces/Hall/Hall';
import Showtime from '../../interfaces/Showtime/Showtime';
import ShowtimeUpdate from '../../interfaces/Showtime/ShowtimeUpdate';
import Branch from '../../interfaces/Branch/Branch';
import Movie from '../../interfaces/Movie/Movie';
import dayjs, { Dayjs } from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import notify from '../../utils/ErrorToast';
import Dropdown from '../GenericComponents/Dropdown';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface Props {
    handleClose: () => void;
    title: string;
    onEditShowtime: (showtime: ShowtimeUpdate) => void;
    branch: Branch;
    movie: Movie;
    showtime: Showtime
}

const parseHallText = (hall: Hall) => {
    return `${hall.name} - ${hall.numOfColumns * hall.numOfRows} מקומות`;
}

const EditShowtimeDialog: FC<Props> = (props) => {
    const { handleClose, title, onEditShowtime, branch, movie, showtime } = props;

    const [hallsMap, setHallsMap] = useState<Map<string, number>>(new Map());
    const [currentHall, setCurrentHall] = useState<string>(parseHallText(showtime.hall));
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(showtime.startTime));

    const { token } = useAuth();

    useEffect(() => {
        fetchHalls();
    }, [branch]);

    const fetchHalls = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/hall/branch/${branch.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                if (data.length === 0) {
                    throw new Error("אין אולמות בסניף זה.")
                }
                const updatedMap: Map<string, number> = new Map(hallsMap);
                data.forEach((hall: Hall) => {
                    updatedMap.set(parseHallText(hall), hall.id);
                });
                setHallsMap(updatedMap);
            } else {
                throw new Error(data.errors[0])
            }
        }
        catch (error: any) {
            notify(error.message);
        }
    };

    const onSubmit = async () => {
        const updatedShowtime: ShowtimeUpdate = {
            movieId: showtime.movie.id,
            hallId: hallsMap.get(currentHall)!,
            startTime: startTime ? startTime.toISOString() : dayjs().toISOString(),
        };

        await onEditShowtime(updatedShowtime);
    }

    const handleHallChange = (event: SelectChangeEvent) => {
        setCurrentHall(event.target.value);
    };

    const onStartTimeChange = (newStartTime: Dayjs | null) => setStartTime(newStartTime);

    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <TextField
                    autoFocus
                    margin="normal"
                    label="שם סניף"
                    disabled
                    fullWidth
                    variant="outlined"
                    value={branch.name}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    label="שם הסרט"
                    disabled
                    fullWidth
                    variant="outlined"
                    value={movie.title}
                />
                <Dropdown
                    items={Array.from(hallsMap.keys())}
                    label="שם האולם"
                    onChange={handleHallChange}
                    value={currentHall}
                />
                <Box display={'flex'} gap={5} marginTop={'16px'}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            autoFocus
                            label="תאריך ושעת תחילת הקרנה"
                            value={startTime}
                            minDate={dayjs()}
                            maxDate={dayjs('01-01-2080')}
                            onChange={onStartTimeChange}
                            format='HH:mm DD/MM/YYYY'
                        />
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>עריכה</Button>
            </DialogActions>
        </>
    );
}

export default EditShowtimeDialog;