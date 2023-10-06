import Button from '@mui/material/Button';
import { FC } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Props {
    handleClose: () => void;
    title: string;
    onDeleteShowtime: () => void;
}

const DeleteShowtimeDialog: FC<Props> = (props) => {
    const { handleClose, title, onDeleteShowtime } = props;

    const onSubmit = async () => {
        await onDeleteShowtime();
    }

    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    האם את/ה בטוח/ה שאת/ה רוצה למחוק הקרנות אלו?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>מחיקה</Button>
            </DialogActions>
        </>
    );
}

export default DeleteShowtimeDialog;