import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Table from '../../utils/Table';
import Hall from '../../interfaces/hall';
import HeadCell from '../../interfaces/headCell';
import Branch from '../../interfaces/branch';
import ActionType from '../../interfaces/ActionType';
import Modal from '../../utils/Modal';
import CreateHallDialog from './CreateHallDialog';
import DeleteHallDialog from './DeleteHallDialog';
import EditHallDialog from './EditHallDialog';

const headCells: HeadCell[] = [
    {
        id: 'name',
        disablePadding: true,
        label: 'שם האולם',
    },
    {
        id: 'numOfRows',
        disablePadding: false,
        label: 'מספר שורות',
    },
    {
        id: 'numOfColumns',
        disablePadding: false,
        label: 'מספר עמודות',
    }
];


const HallPage: FC = () => {
    const [branchesMap, setBranchesMap] = useState<Map<string, number>>(new Map());
    const [currentBranch, setCurrentBranch] = useState<string>('');
    const [halls, setHalls] = useState<Hall[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");

    const { token } = useAuth();

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchHalls();
    }, [currentBranch])

    const fetchBranches = async () => {
        const response = await fetch(`http://localhost:8080/api/branch`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const branches = await response.json();
        const updatedMap: Map<string, number> = new Map(branchesMap);
        branches.forEach((branch: Branch) => {
            updatedMap.set(branch.name, branch.id);
        });
        setBranchesMap(updatedMap);
        setCurrentBranch(branches[0].name);
    };

    const fetchHalls = async () => {
        if (branchesMap.size > 0) {
            const response = await fetch(`http://localhost:8080/api/hall/branch/${branchesMap.get(currentBranch)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const halls = await response.json();
            setHalls(halls);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setCurrentBranch(event.target.value);
    };

    const renderModal = () => {
        switch (action) {
            case 'ADD':
                return <CreateHallDialog handleClose={changeModalState} title={modalTitle} />
            case 'DELETE':
                return <DeleteHallDialog handleClose={changeModalState} title={modalTitle} />
            case 'EDIT':
                return <EditHallDialog handleClose={changeModalState} title={modalTitle} />
            default:
                return <></>
        }
    }

    const changeModalState = () => {
        setOpenModal(!openModal);
    }

    const onActionHall = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "אולם");
        changeModalState();
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            {branchesMap?.size > 0 &&
                <Box sx={{ maxWidth: 250 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">שם סניף</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currentBranch}
                            label="branch"
                            onChange={handleChange}
                        >
                            {Array.from(branchesMap.keys()).map((branchName) => (
                                <MenuItem
                                    key={branchName}
                                    value={branchName}
                                >
                                    {branchName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>}
            <Table editable={true} title='אולמות' mainColumn='name' rows={halls} headCells={headCells} onAction={onActionHall} />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box>
    );
}

export default HallPage;
