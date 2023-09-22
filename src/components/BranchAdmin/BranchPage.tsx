import * as React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Table from '../../utils/Table';
import Branch from '../../interfaces/Branch';
import HeadCell from '../../interfaces/HeadCell';
import ActionType from '../../interfaces/ActionType';
import CreateBranchDialog from './CreateBranchDialog';
import DeleteBranchDialog from './DeleteBranchDialog';
import Modal from '../../utils/Modal';
import notify from '../../utils/ErrorToast';
import Rowable from '../../interfaces/Rowable';

const headCells: HeadCell<Branch>[] = [
    {
        id: 'name',
        disablePadding: true,
        label: 'שם הסניף',
    },
    {
        id: 'city',
        disablePadding: false,
        label: 'עיר',
    },
    {
        id: 'address',
        disablePadding: false,
        label: 'כתובת',
    },
    {
        id: 'contactInfo',
        disablePadding: false,
        label: 'פרטי איש קשר',
    },
];

const BranchPage: FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [action, setAction] = useState<ActionType>("ADD");
    const [selectedBranches, setSelectedBranches] = useState<number[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchBranches();
    }, []);

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
                setBranches(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };


    const changeModalState = () => {
        setOpenModal(!openModal);
    }

    const onCreateBranch = async (branch: Branch) => {
        try {
            const response = await fetch(`http://localhost:8080/api/branch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(branch),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setBranches(branches.concat(data));
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
            selectedBranches.forEach(async branch => {
                const response = await fetch(`http://localhost:8080/api/branch/${branch}`, {
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
            setBranches(branches.filter(b => !selectedBranches.includes(b.id)))
            setSelectedBranches([])
            changeModalState();
        } catch (error: any) {
            notify(error.message);
        }
    }

    const renderModal = () => {
        switch (action) {
            case 'ADD':
                return <CreateBranchDialog handleClose={changeModalState} title={modalTitle} onCreateBranch={onCreateBranch} />
            case 'DELETE':
                return <DeleteBranchDialog handleClose={changeModalState} title={modalTitle} onDeleteBranch={onDeleteSubmited} />
            default:
                return <></>
        }
    }

    const onAddBranch = (actionToPerform: ActionType, title: string) => {
        onAction(actionToPerform, title);
    }

    const onDeleteBranch = (actionToPerform: ActionType, title: string, selectedIds: number[]) => {
        setSelectedBranches(selectedIds);
        onAction(actionToPerform, title);
    }

    const onAction = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "סניף");
        changeModalState();
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Table editable={false} title='סניפים' rows={branches} headCells={headCells as HeadCell<Rowable>[]} onAdd={onAddBranch} onDelete={onDeleteBranch} />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box>
    );
}

export default BranchPage;
