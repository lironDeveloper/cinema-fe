import * as React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Table from '../../utils/Table';
import Branch from '../../interfaces/branch';
import HeadCell from '../../interfaces/headCell';
import ActionType from '../../interfaces/ActionType';
import CreateBranchDialog from './CreateBranchDialog';
import DeleteBranchDialog from './DeleteBranchDialog';
import Modal from '../../utils/Modal';
import notify from '../../utils/errorToast';

const headCells: HeadCell[] = [
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

    const { token } = useAuth();

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        const response = await fetch(`http://localhost:8080/api/branch`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        const branches = await response.json();
        setBranches(branches);
    };


    const changeModalState = () => {
        setOpenModal(!openModal);
    }

    const onCreateBranch = async (branch: object) => {
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

    const renderModal = () => {
        switch (action) {
            case 'ADD':
                return <CreateBranchDialog handleClose={changeModalState} title={modalTitle} onCreateBranch={onCreateBranch} />
            case 'DELETE':
                return <DeleteBranchDialog handleClose={changeModalState} title={modalTitle} />
            default:
                return <></>
        }
    }

    const onActionBranch = (actionToPerform: ActionType, title: string) => {
        setAction(actionToPerform);
        setModalTitle(title + "סניף");
        changeModalState();
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Table editable={false} title='סניפים' mainColumn='name' rows={branches} headCells={headCells} onAction={onActionBranch} />
            <Modal isOpen={openModal} handleClose={changeModalState}>
                {renderModal()}
            </Modal>
        </Box>
    );
}

export default BranchPage;
