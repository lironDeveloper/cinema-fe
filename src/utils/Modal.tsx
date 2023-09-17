import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FC, ReactElement, useState } from 'react';
import { Dialog } from '@mui/material';

interface ModalProps {
    children: ReactElement;
    isOpen: boolean;
    handleClose: () => void;
}

const CinemaModal: FC<ModalProps> = (props) => {
    const { isOpen, handleClose } = props;

    return (
        <Dialog open={isOpen} onClose={handleClose} dir='rtl'>
            {props.children}
        </Dialog>
    );
}

export default CinemaModal;