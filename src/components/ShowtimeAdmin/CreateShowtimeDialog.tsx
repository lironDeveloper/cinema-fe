import Button from '@mui/material/Button';
import { FC, useEffect, useState } from 'react';
import { Box, DialogActions, DialogContent, DialogTitle, SelectChangeEvent, TextField } from '@mui/material';
import Hall from '../../interfaces/Hall/Hall';
import ShowtimeCreation from '../../interfaces/Showtime/ShowtimeCraetion';
import { useAuth } from '../../context/AuthContext';
import notify from '../../utils/ErrorToast';
import dayjs, { Dayjs } from 'dayjs';
import Dropdown from '../GenericComponents/Dropdown';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Branch from '../../interfaces/Branch/Branch';
import Movie from '../../interfaces/Movie/Movie';

interface Props {
    handleClose: () => void;
    title: string;
    onCreateShowtime: (showtime: ShowtimeCreation) => void;
    branch: Branch;
    movie: Movie;
}


const CreateShowtimeDialog: FC<Props> = (props) => {
    const { handleClose, title, onCreateShowtime, branch, movie } = props;

    const [hallsMap, setHallsMap] = useState<Map<string, number>>(new Map());
    const [currentHall, setCurrentHall] = useState<string>('');
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());

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
                setCurrentHall(parseHallText(data[0]));
            } else {
                throw new Error(data.errors[0])
            }
        }
        catch (error: any) {
            notify(error.message);
        }
    };

    const parseHallText = (hall: Hall) => {
        return `${hall.name} - ${hall.numOfColumns * hall.numOfRows} מקומות`;
    }

    const onSubmit = async () => {
        const showtime: ShowtimeCreation = {
            movieId: movie.id,
            hallId: hallsMap.get(currentHall)!,
            startTime: startTime ? startTime.toISOString() : dayjs().toISOString(),
        };

        await onCreateShowtime(showtime);
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
                <Button onClick={onSubmit}>הוספה</Button>
            </DialogActions>
        </>
    );
}

export default CreateShowtimeDialog;