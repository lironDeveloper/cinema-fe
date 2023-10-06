import { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
    value: string | undefined;
    items: string[];
    onChange: (event: SelectChangeEvent) => void;
    label: string;
}

const Dropdown: FC<Props> = (props) => {
    const { value, onChange, label, items } = props;
    return (
        <FormControl variant="outlined" fullWidth margin='normal'>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                label={label}
            >
                {items.map((item: string) => (
                    <MenuItem
                        value={item}
                        key={item}
                    >
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default Dropdown;
