import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MovieCard from '../MovieCard';
import Movie from '../../interfaces/Movie/Movie';
import { useAuth } from '../../context/AuthContext';
import notify from '../../utils/ErrorToast';
import { Button, Rating, TextField, Typography, styled } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';
import { languageMap } from '../../interfaces/Language';
import { genresMap } from '../../interfaces/Genre';
import Review from '../../interfaces/Review/Review';
import ReviewCreation from '../../interfaces/Review/ReviewCreation';
import Comment from './Comment';

interface MetadateItem {
    title: string;
    text: string;
}

const Page = styled('div')(() => ({
    margin: '0 20% 0 20%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: '10%'
}));

const Container = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '5%'
}));

const DataContainer = styled('div')(() => ({
    // margin: '0 10% 0 10%'
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
}));

const Subdata = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    gap: '10%'
}));

const DataWithIcon = styled('div')(() => ({
    display: 'flex',
    gap: '5px'
}));

const DataWithIconMetadata = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column'
}));

const CommentContainer = styled('div')(() => ({
    marginTop: '5%'
}));

const MovieInfo: FC = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState<Movie | null>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0);

    const { token } = useAuth();

    useEffect(() => {
        fetchMovie();
        fetchReviews();
    }, [movieId]);

    const fetchMovie = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie/${movieId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMovie(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/movie/${movieId}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setReviews(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const getMetadataComponent = (obj: MetadateItem) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '3px' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }} >
                    {obj.title}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 300 }} >
                    {obj.text}
                </Typography>
            </div>);
    }

    const calcAverageRating = () => {
        if (reviews.length === 0) {
            return 0;
        }

        const totalRating = reviews.reduce((acc, item) => {
            return acc + item.rating;
        }, 0);

        const averageRating = totalRating / reviews.length;
        return averageRating;
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleRatingChange = (newValue: number | null) => {
        if (newValue !== null) {
            setRating(newValue);
        }
    };

    const handleSubmit = async () => {
        const review: ReviewCreation = {
            comment,
            rating,
            movieId: movieId!,
        };

        try {
            const response = await fetch(`http://localhost:8080/api/review`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(review),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setReviews([data].concat(reviews));
                setComment('');
                setRating(0);

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
            {movie &&
                <>
                    <Page>
                        <Container>
                            <DataContainer>
                                <Typography variant="h4" noWrap sx={{ fontWeight: 500 }} >
                                    {movie.title}
                                </Typography>
                                <Subdata>
                                    <DataWithIcon>
                                        <CalendarTodayIcon sx={{ fontSize: '55px' }} color='secondary' />
                                        <DataWithIconMetadata>
                                            <Typography variant="body1" noWrap >
                                                תאריך בכורה
                                            </Typography>
                                            <Typography variant="h6" noWrap >
                                                {dayjs(movie.releaseDate).format('DD/MM/YYYY').toString()}
                                            </Typography>
                                        </DataWithIconMetadata>
                                    </DataWithIcon>
                                    <DataWithIcon>
                                        <ScheduleIcon sx={{ fontSize: '55px' }} color='secondary' />
                                        <DataWithIconMetadata>
                                            <Typography variant="body1" noWrap >
                                                אורך הסרט
                                            </Typography>
                                            <Typography variant="h6" noWrap >
                                                {`${movie.duration} דקות`}
                                            </Typography>
                                        </DataWithIconMetadata>
                                    </DataWithIcon>
                                </Subdata>
                                <Typography variant="body1" sx={{ fontWeight: 300 }} >
                                    {movie.description}
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '3px' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }} >
                                        דירוג ממוצע:
                                    </Typography>
                                    <Rating value={calcAverageRating()} readOnly sx={{ direction: 'ltr' }} />
                                </div>
                                {[
                                    { title: "ז'אנר:", text: genresMap.get(movie.genre)! },
                                    { title: "במאי:", text: movie.director },
                                    { title: "שפה:", text: languageMap.get(movie.language)! },
                                    { title: "גיל מינימאלי לצפייה:", text: movie.minAge + "" },

                                ].map((obj) => getMetadataComponent(obj))
                                }

                            </DataContainer>
                            <MovieCard movie={movie!} width={280} />
                        </Container>
                        <CommentContainer>
                            <Rating
                                sx={{ direction: 'ltr' }}
                                name="rating"
                                value={rating}
                                precision={1}
                                onChange={(event, newValue) => handleRatingChange(newValue)}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '5%', alignItems: 'center' }}>
                                <TextField
                                    placeholder='הוספת דעה על הסרט'
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    value={comment}
                                    fullWidth
                                    onChange={handleCommentChange}
                                />
                                <Button variant="contained" color="primary" onClick={handleSubmit}>
                                    תגובה
                                </Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '25px' }}>
                                {reviews.map(review => (
                                    <Comment review={review} />
                                ))}
                            </div>
                        </CommentContainer>
                    </Page>
                </>
            }
        </Box>
    );
}

export default MovieInfo;
