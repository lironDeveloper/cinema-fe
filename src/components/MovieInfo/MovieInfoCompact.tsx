

import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import MovieCard from '../MovieCard';
import dayjs from 'dayjs';
import Showtime from '../../interfaces/Showtime/Showtime';

interface Props {
    showtime: Showtime,
    size: number
}

const MovieInfoCompact: FC<Props> = (props) => {
    const { showtime, size } = props;

    return (
        <Box display='flex' gap={5}>
            <MovieCard movie={showtime.movie} width={size} />
            <Box display='flex' flexDirection='column'>
                <Typography variant="h5" noWrap sx={{ fontWeight: 600 }} >
                    {showtime.movie.title}
                </Typography>
                <Typography variant="body1" noWrap sx={{ fontWeight: 400 }} >
                    {`${showtime.hall.branch.name} באולם ${showtime.hall.name}`}
                </Typography>
                <Typography variant="h6" noWrap sx={{ fontWeight: 400 }} >
                    {dayjs(showtime.startTime).format('DD/MM/YYYY בשעה HH:mm')}
                </Typography>
            </Box>
        </Box>
    );
};

export default MovieInfoCompact;
