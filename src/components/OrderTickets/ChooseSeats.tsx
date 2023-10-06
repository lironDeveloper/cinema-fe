import { ChangeEvent, FC, useEffect, useState } from "react";
import SeatSelector from "./SeatSelector";
import Point from "../../interfaces/Point";
import Showtime from "../../interfaces/Showtime/Showtime";
import { useAuth } from "../../context/AuthContext";
import notify from "../../utils/ErrorToast";
import { Box, Typography } from "@mui/material";
import MovieInfoCompact from "../MovieInfo/MovieInfoCompact";
import NumericInputField from "../GenericComponents/NumericInputField";
import Seat from "./Seat";

interface Props {
    showtime: Showtime | undefined;
    handleSeatSelection: (seats: Point[]) => void;
    selectedSeats: Point[];
}

interface SeatType {
    label: string,
    state: 'FREE' | 'OCCUPIED' | 'SELECTED'
}

const SeatTypes: SeatType[] = [
    { label: "כיסא פנוי", state: "FREE" },
    { label: "כיסא תפוס", state: "OCCUPIED" },
    { label: "כיסא נבחר", state: "SELECTED" }
]

const ChooseSeats: FC<Props> = (props) => {
    const { showtime, selectedSeats } = props;
    const [numOfTickets, setNumOfTickets] = useState<number>(1);
    const [occupiedSeats, setOccupiedSeats] = useState<Point[]>([]);

    const { token } = useAuth();

    useEffect(() => {
        fetchTicketsInShowtime()
    }, [showtime])

    const fetchTicketsInShowtime = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/ticket/showtime/${showtime?.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                setOccupiedSeats(data);
            } else {
                throw new Error(data.errors[0]);
            }
        } catch (error: any) {
            notify(error.message);
        }
    };

    const handleSeatSelection = (seats: Point[]) => {
        props.handleSeatSelection(seats);
    };

    const onNumTicketsChanges = (event: ChangeEvent<HTMLInputElement>) => {
        let usersInput;
        if (isNaN(parseInt(event.target.value))) {
            usersInput = 0;
        } else {
            usersInput = parseInt(event.target.value);
        }
        const maxAllowed = (showtime?.hall.numOfColumns! * showtime?.hall.numOfRows!) - occupiedSeats.length;
        setNumOfTickets(Math.min(usersInput, maxAllowed, 10))
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, marginTop: 30 }}>
            <MovieInfoCompact showtime={showtime!} size={150} />
            <Box width='60%' display='flex' gap={5} alignItems='center'>
                <NumericInputField value={numOfTickets} onChange={onNumTicketsChanges} label='כמות כרטיסים' />
                <Typography variant="body1">
                    {`נבחרו ${selectedSeats.length} מתוך ${numOfTickets}`}
                </Typography>
            </Box>
            <Box display='flex' gap={5} alignItems='start'>
                <SeatSelector
                    rows={showtime?.hall.numOfRows!}
                    cols={showtime?.hall.numOfColumns!}
                    occupiedSeats={occupiedSeats}
                    selectedSeats={selectedSeats}
                    handleSeatSelection={handleSeatSelection}
                    maxNumOfSeat={numOfTickets} />
                <Box display='flex' flexDirection='column' gap={10} marginTop={'40px'}>
                    {SeatTypes.map((s: SeatType) => {
                        return (
                            <Box display='flex' gap={3} alignItems='center'>
                                <Seat state={s.state} />
                                <Typography variant="body1">
                                    {s.label}
                                </Typography>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </div >
    );
}

export default ChooseSeats;