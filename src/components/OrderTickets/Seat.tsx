import { styled } from "@mui/material/styles";
import { FC } from "react";

type State = 'FREE' | 'OCCUPIED' | 'SELECTED';

interface Props {
    state: State;
    onSeatSelected?: () => void
}


const MovieSeat = styled('div')<Props>(({ state }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    width: '30px',
    minHeight: '30px',
    minWidth: '30px',
    margin: '4px',
    boxSizing: 'border-box',
    borderTopLeftRadius: '7.5px',
    borderTopRightRadius: ' 7.5px',
    userSelect: 'none',
    transition: 'opacity 0.1s ease-in-out',
    backgroundColor: colorCalc(state),

    ...((state === "OCCUPIED") && {
        "&:hover": {
            cursor: 'not-allowed',
            opacity: 1, // Set opacity to 1 to disable hover effect
        },
    }),

    // Enable hover effect when seat is free
    ...((state === "FREE" || state === 'SELECTED') && {
        "&:hover": {
            cursor: 'pointer',
            opacity: 0.7,
        },
    }),
}));

const colorCalc = (state: State) => {
    switch (state) {
        case ('FREE'):
            return '#277da1';
        case ('OCCUPIED'):
            return '#d2d2d2';
        case ('SELECTED'):
            return '#f8961e';
        default:
            return 'lime';
    }
}



const Seat: FC<Props> = (props) => {
    const { state, onSeatSelected } = props;

    return (
        <MovieSeat state={state} onClick={() => {
            if (onSeatSelected)
                onSeatSelected();
        }}>
        </MovieSeat>
    );
}

export default Seat;