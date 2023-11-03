import { FC } from "react";
import MovieInfoCompact from "../MovieInfo/MovieInfoCompact";
import Point from "../../interfaces/Point";
import Showtime from "../../interfaces/Showtime/Showtime";
import Ticket from "./Ticket";
import { Divider, Typography } from "@mui/material";

interface Props {
    showtime: Showtime | undefined;
    selectedSeats: Point[];
}

const ChooseSeats: FC<Props> = (props) => {
    const { showtime, selectedSeats } = props;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, marginTop: 30, flexWrap: 'wrap' }}>
            <MovieInfoCompact showtime={showtime!} size={150} />
            <Divider />
            <Typography variant="h4" fontWeight={'bold'}>כרטיסים</Typography>
            {selectedSeats.map(seat => (
                <Ticket seat={seat} showtime={showtime!} />
            ))}
        </div >
    );
}

export default ChooseSeats;