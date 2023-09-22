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

type MovieCardProps = {
    title: string,
    thumnailURL: string
}

const MovieCard: FC<MovieCardProps> = (props) => {
    const [imageUrl, setImageUrl] = useState<string>('');

    const { token } = useAuth();

    useEffect(() => {
        fetchMovieThumbnail();
    }, []);

    const fetchMovieThumbnail = async () => {
        try {
            const response = await fetch(props.thumnailURL, {
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
        <Card sx={{ maxWidth: 200 }} >
            <CardMedia
                component="img"
                alt="green iguana"
                height="auto"
                image={imageUrl}
            />
            <CardContent>
                <Typography gutterBottom variant="body1" component="div">
                    {props.title}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MovieCard;