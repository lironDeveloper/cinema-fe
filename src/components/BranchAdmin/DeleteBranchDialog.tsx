import Button from '@mui/material/Button';
import { FC } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Props {
    handleClose: () => void;
    title: string;
    onDeleteBranch: () => void;
}

const DeleteBranchDialog: FC<Props> = (props) => {
    const { handleClose, title, onDeleteBranch } = props;

    const onSubmit = async () => {
        await onDeleteBranch();
    }

    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    האם את/ה בטוח/ה שאת/ה רוצה למחוק סניפים אלו?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>מחיקה</Button>
            </DialogActions>
        </>
    );
}

export default DeleteBranchDialog;