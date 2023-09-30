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

import Table from '../GenericComponents/Table';
import Hall from '../../interfaces/Hall/Hall';
import HeadCell from '../../interfaces/HeadCell';
import Branch from '../../interfaces/Branch/Branch';
import ActionType from '../../interfaces/ActionType';
import Modal from '../../utils/Modal';
import CreateHallDialog from './CreateHallDialog';
import DeleteHallDialog from './DeleteHallDialog';
import EditHallDialog from './EditHallDialog';
import Adminable from '../../interfaces/Adminable';
import notify from '../../utils/ErrorToast';
import Dropdown from '../GenericComponents/Dropdown';
import TableRowDisplay from '../../interfaces/TableRowDisplay';
import HallRow from '../../interfaces/Hall/HallRow';
import HallCreation from '../../interfaces/Hall/HallCreation';
import HallUpdate from '../../interfaces/Hall/HallUpdate';

const headCells: HeadCell<Hall>[] = [
    {
        id: 'name',
        label: 'שם האולם',
    },
    {
        id: 'numOfRows',
        label: 'מספר שורות',
    },
    {
        id: 'numOfColumns',
        label: 'מספר עמודות',
    }
];


const HallPage: FC = () => {
    const [branchesMap, setBranchesMap] = useState<Map<string, number>>(new Map());
    const [currentBranch, setCurrentBranch] = useState<string>('');
    const [halls, setHalls] = useState<Hall[]>([]);
    const [rows, setRows] = useState<HallRow[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");
    const [selectedHalls, setSelectedHalls] = useState<number[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchHalls();
    }, [currentBranch]);

    useEffect(() => {
        parseRows();
    }, [halls]);

    const fetchBranches = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/branch`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                const updatedMap: Map<string, number> = new Map(branchesMap);
                data.forEach((branch: Branch) => {
                    updatedMap.set(branch.name, branch.id);
                });
                setBranchesMap(updatedMap);
                setCurrentBranch(data[0].name);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const fetchHalls = async () => {
        try {
            if (branchesMap.size > 0) {
                const response = await fetch(`http://localhost:8080/api/hall/branch/${branchesMap.get(currentBranch)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setHalls(data);
                } else {
                    throw new Error(data.errors[0])
                }
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const parseRows = () => {
        setRows(halls.map((h: Hall) => {
            return {
                ...h
            }
        }));
    }

    const onCreateSubmited = async (hall: HallCreation) => {
        try {
            const response = await fetch(`http://localhost:8080/api/hall`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hall),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setHalls(halls.concat(data));
                changeModalState();
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onEditSubmited = async (updatedHall: HallUpdate) => {
        const hallId = selectedHalls[0];

        try {
            const response = await fetch(`http://localhost:8080/api/hall/${hallId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedHall),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setHalls((prevHalls) => {
                    const updatedHalls = [...prevHalls];
                    const hallIndex = updatedHalls.findIndex((hall) => hall.id === hallId);
                    if (hallIndex !== -1) {
                        updatedHalls[hallIndex] = { ...updatedHalls[hallIndex], ...updatedHall };
                    }
                    return updatedHalls;
                });
                changeModalState();
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    }

    const onDeleteSubmited = async () => {
        try {
            selectedHalls.forEach(async hall => {
                const response = await fetch(`http://localhost:8080/api/hall/${hall}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.errors[0]);
                }
            });
            setHalls(halls.filter(h => !selectedHalls.includes(h.id)))
            setSelectedHalls([])
            changeModalState();
        } catch (error: any) {
            notify(error.message);
        }
    }

    const handleBranchChange = (event: SelectChangeEvent) => {
        setCurrentBranch(event.target.value);
    };

    const renderModal = () => {
        switch (action) {
            case 'ADD':
                return <CreateHallDialog handleClose={changeModalState} title={modalTitle} branchId={branchesMap.get(currentBranch) as number} onCreateHall={onCreateSubmited} />
            case 'DELETE':
                return <DeleteHallDialog handleClose={changeModalState} title={modalTitle} onDeleteHall={onDeleteSubmited} />
            case 'EDIT':
                return <EditHallDialog
                    handleClose={changeModalState}
                    title={modalTitle}
                    onEditHall={onEditSubmited}
                    hall={halls.find((h: Hall) => h.id === selectedHalls[0]) as Hall} />
            default:
                return <></>
        }
    }

    const changeModalState = () => {
        setOpenModal(!openModal);
    }

    const onEditHall = (actionToPerform: ActionType, title: string, selectedId: number) => {
        setSelectedHalls(Array.of(selectedId));
        onAction(actionToPerform, title);
    }

    const onAddHall = (actionToPerform: ActionType, title: string) => {
        onAction(actionToPerform, title);
    }

    const onDeleteHall = (actionToPerform: ActionType, title: string, selectedIds: number[]) => {
        setSelectedHalls(selectedIds);
        onAction(actionToPerform, title);
    }

    const onAction = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "אולם");
        changeModalState();
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            {branchesMap?.size > 0 &&
                <Box sx={{ maxWidth: 250 }}>
                    <Dropdown
                        items={Array.from(branchesMap.keys())}
                        label='שם סניף'
                        onChange={handleBranchChange}
                        value={currentBranch}
                    />
                </Box>}
            <Table
                editable={true}
                title='אולמות'
                rows={rows}
                headCells={headCells as HeadCell<TableRowDisplay>[]}
                onAdd={onAddHall}
                onDelete={onDeleteHall}
                onEdit={onEditHall}
            />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box>
    );
}

export default HallPage;
