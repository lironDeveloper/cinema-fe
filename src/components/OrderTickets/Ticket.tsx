import { FC, useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import Showtime from '../../interfaces/Showtime/Showtime';
import Point from '../../interfaces/Point';
import dayjs from 'dayjs';


type Props = {
    seat: Point,
    showtime: Showtime
}

const Ticket: FC<Props> = (props) => {
    const { seat, showtime } = props;

    return (
        <>
            <Paper elevation={20} style={{ padding: '16px', backgroundColor: '#D4A35E', width: '45%', color: '#ffffff' }}>
                <Typography variant="h5" fontWeight={'bold'}>{showtime.movie.title}</Typography>
                <Typography variant="body1">{dayjs(showtime.startTime).format('DD/MM/YYYY בשעה HH:mm')}</Typography>
                <Typography variant="body2">{`שורה ${seat.seatRowNum} כסא ${seat.seatColNum}`}</Typography>
                <Typography variant="body1">{`אולם ${showtime.hall.name} סניף ${showtime.hall.branch.name}`}</Typography>
            </Paper>
        </>
    );
}

export default Ticket;