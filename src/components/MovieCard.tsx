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
import { Avatar, CardHeader } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/he';

type MovieCardProps = {
    movie: Movie,
    thumnailURL: string
}

const stringAvatar = (name: string) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

const MovieCard: FC<MovieCardProps> = (props) => {
    const { movie, thumnailURL } = props;
    const [imageUrl, setImageUrl] = useState<string>('');

    const { token } = useAuth();

    useEffect(() => {
        fetchMovieThumbnail();
    }, []);

    const fetchMovieThumbnail = async () => {
        try {
            const response = await fetch(thumnailURL, {
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
        <Card sx={{ maxWidth: 220 }} >
            {/* <CardHeader
                avatar={
                    <Avatar {...stringAvatar(movie.director)} />
                }
                title={movie.director}
                subheader={dayjs(movie.releaseDate).locale('he').format('YYYY ,MMMM').toString()}
                sx={{ direction: 'ltr' }}
            /> */}
            <CardMedia
                component="img"
                // sx={{ paddingTop: '150%' }}
                image={imageUrl}
            />
            <CardContent sx={{ padding: '5px 16px 5px 16px' }}>
                {/* <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '2', '-webkit-box-orient': 'vertical', textOverflow: 'ellipsis', }}>
                    {movie.title}
                </Typography> */}
                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '2', '-webkit-box-orient': 'vertical', textOverflow: 'ellipsis', }}>
                    {movie.title}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MovieCard;