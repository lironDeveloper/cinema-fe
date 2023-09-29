import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { ChangeEvent, FC, useState } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Slider, TextField, Typography } from '@mui/material';
import Hall from '../../interfaces/Hall';
import Showtime from '../../interfaces/Showtime';

interface Props {
    handleClose: () => void;
    title: string;
    onEditShowtime: (showtime: Showtime) => void;
    branchId: number | undefined;
    movieId: number | undefined;

}


const EditShowtimeDialog: FC<Props> = (props) => {
    const { handleClose, title, onEditShowtime, branchId, movieId } = props;

    // const [name, setName] = useState<string>('');
    // const [numOfRows, setNumOfRows] = useState<number>(MIN_NUM_OF_ROWS_AND_COLS);
    // const [numOfColumns, setNumOfColumns] = useState<number>(MIN_NUM_OF_ROWS_AND_COLS);

    const onSubmit = async () => {
        // const hall: Hall = {
        //     id: 0,
        //     name,
        //     numOfRows,
        //     numOfColumns,
        //     branchId,
        // };

        // await onCreateHall(hall);
    }


    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <h1>xd</h1>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>הוספה</Button>
            </DialogActions>
        </>
    );
}

export default EditShowtimeDialog;