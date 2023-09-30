import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Table from '../GenericComponents/Table';
import HeadCell from '../../interfaces/HeadCell';
import notify from '../../utils/ErrorToast';
import TableRowDisplay from '../../interfaces/TableRowDisplay';
import User from '../../interfaces/User';
import UserRow from '../../interfaces/UserRow';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { Role } from '../../interfaces/Role';

const headCells: HeadCell<UserRow>[] = [
    {
        id: 'fullName',
        label: 'שם המשתמש',
    },
    {
        id: 'email',
        label: 'אימייל',
    },
    {
        id: 'isAdmin',
        label: 'האם המשתמש הוא מנהל?',
    }
];

const ManageUsersPage: FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [rows, setRows] = useState<UserRow[]>([]);

    const { token, user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        parseRows();
    }, [users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const parseRows = () => {
        setRows(users.map((u: User) => {
            return {
                ...u,
                isAdmin: (
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                checked={u.role === "ROLE_ADMIN"}
                                onChange={() => chnageUsersRole(u)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />} label={undefined} />
                    </FormGroup>
                )
            }
        }));
    }

    const chnageUsersRole = async (userToChange: User) => {
        const basicRole: Role = "ROLE_CLIENT"
        let roleToAssign: Role = userToChange.role !== "ROLE_ADMIN" ? "ROLE_ADMIN" : basicRole
        userToChange.role = roleToAssign
        try {
            if (user && userToChange.id === user.id) {
                throw new Error("לא ניתן לשנות תפקיד לעצמך.");
            }
            const response = await fetch(`http://localhost:8080/api/user/update-role/${userToChange.id}?role=${roleToAssign}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                setUsers((prevUsers) => {
                    const updatedUsers = [...prevUsers];
                    const userIndex = updatedUsers.findIndex((u) => u.id === userToChange.id);
                    if (userIndex !== -1) {
                        updatedUsers[userIndex] = {
                            ...updatedUsers[userIndex],
                            ...updatedUsers
                        };
                    }
                    return updatedUsers;
                });
            } else {
                const data = await response.json();
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Table
                editable={false}
                title='משתמשים'
                rows={rows as TableRowDisplay[]}
                headCells={headCells as HeadCell<TableRowDisplay>[]}
            />
        </Box >
    );
}

export default ManageUsersPage;