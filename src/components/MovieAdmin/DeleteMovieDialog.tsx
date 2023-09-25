import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

interface Props {
    handleClose: () => void;
    title: string;
    onDeleteMovie: () => void;
}

const DeleteMovieDialog: FC<Props> = (props) => {
    const { handleClose, title, onDeleteMovie } = props;

    const onSubmit = async () => {
        await onDeleteMovie();
    }

    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    האם את/ה בטוח/ה שאת/ה רוצה למחוק סרטים אלו?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>מחיקה</Button>
            </DialogActions>
        </>
    );
}

export default DeleteMovieDialog;