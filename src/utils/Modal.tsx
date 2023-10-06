import { FC, ReactElement } from 'react';
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