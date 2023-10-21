import { FC, useEffect, useState } from 'react';
import Review from '../../interfaces/Review/Review';
import { Avatar, Box, Paper, Rating, Typography } from '@mui/material';
import dayjs from 'dayjs';

type CommentProps = {
    review: Review,
}

const Comment: FC<CommentProps> = (props) => {
    const { review } = props;

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

    const stringAvatar = (name: string) => {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return (
        <>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Box display="flex" alignItems="center">
                    <Avatar {...stringAvatar(review.user.fullName)} />
                    <Box marginLeft={2}>
                        <Typography variant="body2">
                            <strong>{review.user.fullName} </strong>
                            {dayjs(review.createdOn).format('DD/MM/YYYY בשעה HH:mm')}
                        </Typography>
                        <Rating value={review.rating} precision={0.5} readOnly />
                    </Box>
                </Box>
                <Typography variant="body1" style={{ marginTop: '8px' }}>
                    {review.comment}
                </Typography>
            </Paper>
        </>
    );
}

export default Comment;