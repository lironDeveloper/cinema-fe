import React, { ChangeEvent, FC } from 'react';
import TextField from '@mui/material/TextField';

interface Props {
    value: number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const NumericInputField: FC<Props> = (props) => {
    const { value, onChange, label } = props;
    return (
        <TextField
            autoFocus
            label={label}
            variant="outlined"
            inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
            }}
            value={value}
            onChange={onChange}
        />
    );
}

export default NumericInputField;
