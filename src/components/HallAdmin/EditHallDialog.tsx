import Button from '@mui/material/Button';
import { ChangeEvent, FC, useState } from 'react';
import { DialogActions, DialogContent, DialogTitle, Slider, TextField, Typography } from '@mui/material';
import Hall from '../../interfaces/Hall/Hall';
import HallUpdate from '../../interfaces/Hall/HallUpdate';
import hebrewPattern from '../../Regex/HebewOnly';

interface Props {
    handleClose: () => void;
    title: string;
    onEditHall: (hall: HallUpdate) => void;
    hall: Hall;
}

const EditHallDialog: FC<Props> = (props) => {
    const { handleClose, title, onEditHall, hall } = props;

    const [name, setName] = useState<string>(hall.name);
    const [numOfRows, setNumOfRows] = useState<number>(hall.numOfRows);
    const [numOfColumns, setNumOfColumns] = useState<number>(hall.numOfColumns);

    const onSubmit = async () => {
        const updatedHall: HallUpdate = {
            name,
            numOfRows,
            numOfColumns,
        }

        await onEditHall(updatedHall);
    }

    const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (hebrewPattern.test(event.target.value) || event.target.value === '')
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
                    min={2}
                    max={15}
                    value={numOfRows}
                    onChange={onNumOfRowsChanged}
                />
                <Typography id="input-slider" gutterBottom>
                    מספר עמודות
                </Typography>
                <Slider
                    size="small"
                    defaultValue={25}
                    aria-label="Small"
                    valueLabelDisplay="on"
                    min={2}
                    max={15}
                    value={numOfColumns}
                    onChange={onNumOfColumnsChanged}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>עריכה</Button>
            </DialogActions>
        </>
    );
}

export default EditHallDialog;