import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FC, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import notify from '../utils/ErrorToast';
import Movie from '../interfaces/Movie/Movie';

type MovieCardProps = {
    movie: Movie
    width?: number;
}

const MovieCard: FC<MovieCardProps> = (props) => {
    const { movie } = props;
    const [imageUrl, setImageUrl] = useState<string>('');

    const { token } = useAuth();

    useEffect(() => {
        fetchMovieThumbnail();

        // Clean up
        return () => URL.revokeObjectURL(imageUrl);
    }, []);

    const fetchMovieThumbnail = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie/thumbnail/${movie.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                const thumbnail = await response.blob();
                setImageUrl(URL.createObjectURL(thumbnail));
            } else {
                const data = await response.json();
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    return (
        <Card sx={{ maxWidth: props.width ? props.width : 180 }} >

            <CardMedia
                component="img"
                sx={{ height: props.width ? props.width : 180 * 889 / 600 }}
                image={imageUrl}
            />
            {/* <CardContent sx={{ padding: '5px 8px 5px 8px !important' }}>
                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '1', '-webkit-box-orient': 'vertical', textOverflow: 'ellipsis', }}>
                    {movie.title}
                </Typography>
            </CardContent> */}
        </Card>
    );
}

export default MovieCard;