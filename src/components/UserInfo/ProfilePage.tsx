import { useAuth } from '../../context/AuthContext';
import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Table from '../GenericComponents/Table';
import HeadCell from '../../interfaces/HeadCell';
import notify from '../../utils/ErrorToast';
import TableRowDisplay from '../../interfaces/TableRowDisplay';
import User from '../../interfaces/User/User';
import UserRow from '../../interfaces/User/UserRow';
import { Divider, FormControlLabel, FormGroup, Grid, Switch, TextField, Typography } from '@mui/material';
import { Role } from '../../interfaces/Role';
import { Ticket as TicketInterface } from '../../interfaces/Ticket/Ticket';
import Ticket from '../OrderTickets/Ticket';

const ProfilePage: FC = () => {
    const [tickets, setTickets] = useState<TicketInterface[]>([]);

    const { token, user } = useAuth();

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/ticket/my-tickets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                setTickets(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                <Typography variant="h4" fontWeight={'bold'}>פרטים אישיים</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
                            name="fullName"
                            id="fullName"
                            label="שם מלא"
                            autoFocus
                            value={user?.fullName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled
                            id="email"
                            label="כתובת אימייל"
                            name="email"
                            value={user?.email}
                        />
                    </Grid>
                    {user?.role != 'ROLE_CLIENT' ? <Grid item xs={12}>
                        <TextField
                            disabled
                            id="role"
                            label="תפקיד במערכת"
                            name="role"
                            value={user?.role}
                        />
                    </Grid> : null}
                </Grid>
                <Divider />
                <Typography variant="h4" fontWeight={'bold'}>היסטוריית כרטיסים</Typography>
                {tickets.map(ticket => (
                    <Ticket seat={{
                        seatColNum: ticket.seat.colNum,
                        seatRowNum: ticket.seat.rowNum,
                    }} showtime={ticket.showtime} />
                ))}
            </div >
        </Box >
    );
}

export default ProfilePage;