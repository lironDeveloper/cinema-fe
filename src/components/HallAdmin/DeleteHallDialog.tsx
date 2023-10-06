import Button from '@mui/material/Button';
import { FC } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Props {
    handleClose: () => void;
    title: string;
    onDeleteHall: () => void;
}

const DeleteHallDialog: FC<Props> = (props) => {
    const { handleClose, title, onDeleteHall } = props;

    const onSubmit = async () => {
        await onDeleteHall();
    }

    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    האם את/ה בטוח/ה שאת/ה רוצה למחוק אולמות אלו?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>מחיקה</Button>
            </DialogActions>
        </>
    );
}

export default DeleteHallDialog;