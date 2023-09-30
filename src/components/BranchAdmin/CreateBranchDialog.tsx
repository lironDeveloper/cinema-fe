import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { ChangeEvent, FC, useState } from 'react';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import Branch from '../../interfaces/Branch/Branch';
import BranchCreation from '../../interfaces/Branch/BranchCreation';

interface Props {
    handleClose: () => void;
    title: string;
    onCreateBranch: (branch: BranchCreation) => void;
}

const CreateBranchDialog: FC<Props> = (props) => {
    const { handleClose, title, onCreateBranch } = props;
    const [name, setName] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [contactInfo, setContactInfo] = useState<string>('');

    const onSubmit = async () => {
        const branch: BranchCreation = {
            name,
            city,
            address,
            contactInfo
        };

        await onCreateBranch(branch);
    }

    const onNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const onCityChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const onContactInfoChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setContactInfo(event.target.value);
    };

    const onAddressChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };


    return (
        <>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    label="שם הסניף"
                    fullWidth
                    variant="outlined"
                    value={name}
                    onChange={onNameChanged}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    id="city"
                    label="עיר"
                    fullWidth
                    variant="outlined"
                    value={city}
                    onChange={onCityChanged}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    id="contactInfo"
                    label="איש קשר"
                    fullWidth
                    variant="outlined"
                    value={contactInfo}
                    onChange={onContactInfoChanged}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    id="address"
                    label="כתובת"
                    fullWidth
                    variant="outlined"
                    value={address}
                    onChange={onAddressChanged}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button onClick={onSubmit}>הוספה</Button>
            </DialogActions>
        </>
    );
}

export default CreateBranchDialog;