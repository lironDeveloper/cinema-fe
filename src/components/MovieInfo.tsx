import { FC } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

const MovieInfo: FC = () => {
    const { movieId } = useParams();


    return (
        <div>{movieId}</div>
    );
};

export default MovieInfo;
