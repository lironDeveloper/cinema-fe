import { styled } from "@mui/material/styles";
import { FC, useEffect, useState } from "react";
import Showtime from "../../interfaces/Showtime/Showtime";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SelectChangeEvent, Typography } from "@mui/material";
import Dropdown from "../GenericComponents/Dropdown";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "../../context/AuthContext";
import Branch from "../../interfaces/Branch/Branch";
import notify from "../../utils/ErrorToast";
import Movie from "../../interfaces/Movie/Movie";
import NumericInputField from "../GenericComponents/NumericInputField";
import MovieCard from "../MovieCard";
import MovieInfoCompact from "../MovieInfo/MovieInfoCompact";

interface Props {
    chooseShowtime: (showtime: Showtime) => void;
}

const ChooseShowtime: FC<Props> = (props) => {
    const [branchesMap, setBranchesMap] = useState<Map<string, Branch>>(new Map());
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [moviesMap, setMoviesMap] = useState<Map<string, Movie>>(new Map());
    const [selectedMovie, setSelectedMovie] = useState<string>('');
    const [showtimes, setShowtimes] = useState<Showtime[] | undefined>();
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | undefined>();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    const { token } = useAuth();

    useEffect(() => {
        fetchBranches();
        fetchMovies();
    }, []);

    useEffect(() => {
        fetchShowtimes();
    }, [selectedBranch, selectedMovie, selectedDate]);

    useEffect(() => {
        props.chooseShowtime(selectedShowtime!);
    }, [selectedShowtime])

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
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const fetchShowtimes = async () => {
        try {
            if (branchesMap.size > 0 && moviesMap.size > 0 && selectedBranch.length > 0 && selectedMovie.length > 0) {
                const response = await fetch(`http://localhost:8080/api/showtime/movie/${moviesMap.get(selectedMovie)!.id}/branch/${branchesMap.get(selectedBranch)!.id}/time?fromDate=${selectedDate?.startOf('day').add(3, 'h').add(1, 'minute').toJSON()}&toDate=${selectedDate?.add(1, 'day').startOf('day').add(3, 'h').toJSON()}`, {
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

    const handleBranchChange = (event: SelectChangeEvent) => {
        setSelectedBranch(event.target.value);
        setSelectedShowtime(undefined);
    };

    const handleMovieChange = (event: SelectChangeEvent) => {
        setSelectedMovie(event.target.value);
        setSelectedShowtime(undefined);
    };

    const onSelectedDateChange = (newDate: Dayjs | null) => {
        setSelectedDate(newDate);
        setSelectedShowtime(undefined);
    }

    const changeSelectedShowtime = (event: React.ChangeEvent<HTMLInputElement>) => {
        const st = showtimes?.filter(s => s.id === parseInt((event.target as HTMLInputElement).value))[0];
        setSelectedShowtime(st);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, marginTop: 30 }}>
            {/* <Typography component="h4" variant="h4">
                תנו לנו למצוא את השעה המתאימה עבורך ❤
            </Typography> */}
            <Box display='flex' gap={5} justifyContent='center' alignItems='center'>

                <Dropdown
                    items={Array.from(branchesMap.keys())}
                    label='בחירת סניף'
                    onChange={handleBranchChange}
                    value={selectedBranch}
                />
                <Dropdown
                    items={Array.from(moviesMap.keys())}
                    label='בחירת סרט'
                    onChange={handleMovieChange}
                    value={selectedMovie}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        autoFocus
                        sx={{ width: '100%', marginTop: '16px', marginBottom: '8px' }}
                        label="תאריך הקרנה"
                        value={selectedDate}
                        minDate={dayjs()}
                        maxDate={dayjs('01-01-2080')}
                        onChange={onSelectedDateChange}
                        format='DD/MM/YYYY'
                    />
                </LocalizationProvider>
            </Box>
            <Box display='flex'>
                {showtimes && <Box display={'flex'} flex={1}>
                    {showtimes.length == 0 ? (
                        <Typography variant="body1" color={'#ee6c4d'}>
                            {`אין הקרנות של הסרט ${moviesMap.get(selectedMovie)?.title} בתאריך הנבחר בסניף ${branchesMap.get(selectedBranch)?.name}, אנא נסו תאריך אחר.`}
                        </Typography>
                    ) : (
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">הקרנות</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={selectedShowtime}
                                onChange={changeSelectedShowtime}
                            >
                                {showtimes.map(st =>
                                    <FormControlLabel value={st.id} control={<Radio />} label={`${dayjs(st.startTime).format('HH:mm')} - ${dayjs(st.endTime).format('HH:mm')}`} />
                                )}
                            </RadioGroup>
                        </FormControl>
                    )}
                </Box>}
                {!selectedShowtime ? null : (
                    <MovieInfoCompact showtime={selectedShowtime} size={150} />
                )}
            </Box>
        </div>
    );
}

export default ChooseShowtime;