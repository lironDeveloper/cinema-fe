import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ChangeEvent, FC, useState } from 'react';
import { Box, DialogActions, DialogContent, DialogTitle, SelectChangeEvent, TextField } from '@mui/material';
import NumericInputField from '../GenericComponents/NumericInputField';
import { GenreValues, genresMap, getGenreKeyByValue } from '../../interfaces/Genre';
import Dropdown from '../GenericComponents/Dropdown';
import { LanguageKeys, getLanguageKeyByValue, languageMap } from '../../interfaces/Language';
import ThumbnailUploader from './ThumbnailUploader';
import MovieCreation from '../../interfaces/Movie/MovieCreation';
import hebrewPattern from '../../Regex/HebewOnly';

interface Props {
    handleClose: () => void;
    dialogTitle: string;
    onCreateMovie: (movie: MovieCreation) => void;
}

const CreateMovieDialog: FC<Props> = (props) => {
    const { handleClose, dialogTitle, onCreateMovie } = props;

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [duration, setDuration] = useState<number>(0);
    const [releaseDate, setReleaseDate] = useState<Dayjs | null>(dayjs());
    const [genre, setGenre] = useState<GenreValues | undefined>();
    const [director, setDirector] = useState<string>('');
    const [language, setLanguage] = useState<LanguageKeys | undefined>();
    const [minAge, setMinAge] = useState<number>(0);

    const onSubmit = async () => {
        const movie: MovieCreation = {
            title,
            description,
            duration,
            releaseDate: releaseDate ? releaseDate.toISOString() : dayjs().toISOString(),
            genre: getGenreKeyByValue(genre),
            director,
            language: getLanguageKeyByValue(language),
            minAge,
        }

        await onCreateMovie(movie);
    }

    const onTitleChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const onDescriptionChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const onDurationChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setDuration(parseInt(event.target.value));
    };

    const onMinAgeChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setMinAge(parseInt(event.target.value));
    };

    const onRelaseDateChange = (newReleaseDate: Dayjs | null) => setReleaseDate(newReleaseDate);

    const onGenreChanged = (event: SelectChangeEvent) => {
        setGenre(event.target.value);
    };

    const onDirectorChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (hebrewPattern.test(event.target.value))
            setDirector(event.target.value);
    };

    const onLangugageChanged = (event: SelectChangeEvent) => {
        setLanguage(event.target.value);
    };

    return (
        <>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent >
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="שם הסרט"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={onTitleChanged}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="תיאור"
                    fullWidth
                    variant="outlined"
                    multiline={true}
                    rows={4}
                    value={description}
                    onChange={onDescriptionChanged}
                />
                <Box display={'flex'} gap={5} marginTop={'16px'}>
                    <NumericInputField value={duration} onChange={onDurationChanged} label='אורך הסרט' />
                    <NumericInputField value={minAge} onChange={onMinAgeChanged} label='גיל מינימאלי' />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            autoFocus
                            label="תאריך בכורה"
                            value={releaseDate}
                            minDate={dayjs('01-01-1960')}
                            maxDate={dayjs()}
                            onChange={onRelaseDateChange}
                            format='DD/MM/YYYY'
                        />
                    </LocalizationProvider>
                </Box>
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="שם הבמאי"
                    fullWidth
                    variant="outlined"
                    value={director}
                    onChange={onDirectorChanged}
                />
                <Box display={'flex'} gap={5}>
                    <Dropdown
                        items={Array.from(genresMap.values())}
                        label="ז'אנר"
                        onChange={onGenreChanged}
                        value={genre}
                    />
                    <Dropdown
                        items={Array.from(languageMap.values())}
                        label="שפת הסרט"
                        onChange={onLangugageChanged}
                        value={language}
                    />
                </Box>
                <ThumbnailUploader />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>הוספה</Button>
            </DialogActions>
        </>
    );
}

export default CreateMovieDialog;