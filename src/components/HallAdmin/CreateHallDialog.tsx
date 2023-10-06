import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { ChangeEvent, FC, useState } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Slider, TextField, Typography } from '@mui/material';
import Hall from '../../interfaces/Hall/Hall';
import HallCreation from '../../interfaces/Hall/HallCreation';
import hebrewPattern from '../../Regex/HebewOnly';

interface Props {
    handleClose: () => void;
    title: string;
    onCreateHall: (hall: HallCreation) => void;
    branchId: number;
}

const MIN_NUM_OF_ROWS_AND_COLS = 2;

const CreateHallDialog: FC<Props> = (props) => {
    const { handleClose, title, onCreateHall, branchId } = props;

    const [name, setName] = useState<string>('');
    const [numOfRows, setNumOfRows] = useState<number>(MIN_NUM_OF_ROWS_AND_COLS);
    const [numOfColumns, setNumOfColumns] = useState<number>(MIN_NUM_OF_ROWS_AND_COLS);

    const onSubmit = async () => {
        const hall: HallCreation = {
            branchId,
            name,
            numOfRows,
            numOfColumns,
        };

        await onCreateHall(hall);
    }

    const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (hebrewPattern.test(event.target.value))
            setName(event.target.value);
    };

    const onNumOfRowsChanged = (event: Event, newValue: number | number[]) => {
        setNumOfRows(newValue as number);
    };

    const onNumOfColumnsChanged = (event: Event, newValue: number | number[]) => {
        setNumOfColumns(newValue as number);
    };

    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="שם האולם"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={onNameChanged}
                />
                <Typography id="input-slider" gutterBottom>
                    מספר שורות
                </Typography>
                <Slider
                    size="small"
                    defaultValue={7}
                    aria-label="Small"
                    valueLabelDisplay="on"
                    min={MIN_NUM_OF_ROWS_AND_COLS}
                    max={15}
                    value={numOfRows}
                    onChange={onNumOfRowsChanged}
                />
                <Typography id="input-slider" gutterBottom>
                    מספר עמודות
                </Typography>
                <Slider
                    size="small"
                    defaultValue={7}
                    aria-label="Small"
                    valueLabelDisplay="on"
                    min={MIN_NUM_OF_ROWS_AND_COLS}
                    max={15}
                    value={numOfColumns}
                    onChange={onNumOfColumnsChanged}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>הוספה</Button>
            </DialogActions>
        </>
    );
}

export default CreateHallDialog;