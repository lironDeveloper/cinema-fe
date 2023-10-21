import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { FC, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import notify from '../utils/ErrorToast';
import Movie from '../interfaces/Movie/Movie';
import { useNavigate } from 'react-router-dom';

type MovieCardProps = {
    movie: Movie
    width?: number;
    clickable?: boolean;
}

const goldenRatio = 889 / 600;
const defaultWidth = 180;

const MovieCard: FC<MovieCardProps> = (props) => {
    const { movie } = props;
    const [imageUrl, setImageUrl] = useState<string>('');
    const navigate = useNavigate();
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

    const widthCalc = () => {
        return props.width ? props.width : defaultWidth;
    }

    const heightCalc = () => {
        return props.width ? props.width * goldenRatio : defaultWidth * goldenRatio;
    }

    return (
        <Card sx={{ maxWidth: widthCalc(), maxHeight: heightCalc(), "&:hover": { cursor: 'pointer', opacity: 0.85 } }} onClick={() => {
            if (props.clickable) {
                navigate(`/movie/${movie.id}`);
            }
        }}>
            <CardMedia
                component="img"
                sx={{ height: heightCalc() }}
                image={imageUrl}
            />
        </Card>
    );
}

export default MovieCard;