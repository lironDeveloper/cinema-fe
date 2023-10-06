import Button from '@mui/material/Button';
import { ChangeEvent, FC, useState } from 'react';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import BranchCreation from '../../interfaces/Branch/BranchCreation';
import hebrewPattern from '../../Regex/HebewOnly';
import hebrewNumbersPattern from '../../Regex/HebrewAndNumbers';

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
        if (hebrewPattern.test(event.target.value))
            setName(event.target.value);
    };

    const onCityChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (hebrewPattern.test(event.target.value))
            setCity(event.target.value);
    };

    const onContactInfoChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (hebrewPattern.test(event.target.value))
            setContactInfo(event.target.value);
    };

    const onAddressChanged = (event: ChangeEvent<HTMLInputElement>) => {
        if (hebrewNumbersPattern.test(event.target.value))
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