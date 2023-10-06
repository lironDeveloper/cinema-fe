import { FC } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const MovieInfo: FC = () => {
    const { movieId } = useParams();


    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <div>{movieId}</div>
        </Box>
    );
};

export default MovieInfo;
