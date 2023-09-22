import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { ChangeEvent, FC, useState } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Slider, TextField, Typography } from '@mui/material';
import Hall from '../../interfaces/Hall';

interface Props {
    handleClose: () => void;
    title: string;
    onCreateHall: (hall: Hall) => void;
    branchId: number | undefined;
}

const MIN_NUM_OF_ROWS_AND_COLS = 2;

const CreateHallDialog: FC<Props> = (props) => {
    const { handleClose, title, onCreateHall, branchId } = props;

    const [name, setName] = useState<string>('');
    const [numOfRows, setNumOfRows] = useState<number>(MIN_NUM_OF_ROWS_AND_COLS);
    const [numOfColumns, setNumOfColumns] = useState<number>(MIN_NUM_OF_ROWS_AND_COLS);

    const onSubmit = async () => {
        const hall: Hall = {
            id: 0,
            name,
            numOfRows,
            numOfColumns,
            branchId,
        };

        await onCreateHall(hall);
    }

    const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
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
                    margin="dense"
                    id="name"
                    label="שם האולם"
                    fullWidth
                    variant="filled"
                    value={name}
                    onChange={onNameChanged}
                />
                <Typography id="input-slider" gutterBottom>
                    מספר שורות
                </Typography>
                <Slider
                    size="small"
                    defaultValue={25}
                    aria-label="Small"
                    valueLabelDisplay="on"
                    min={MIN_NUM_OF_ROWS_AND_COLS}
                    max={150}
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
                    min={MIN_NUM_OF_ROWS_AND_COLS}
                    max={150}
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