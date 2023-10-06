import { FC } from 'react';
import Seat from './Seat';
import { styled } from '@mui/material/styles';
import Point from '../../interfaces/Point';

interface SeatSelectorProps {
    rows: number;
    cols: number;
    occupiedSeats: Point[];
    handleSeatSelection: (selectedSeats: Point[]) => void;
    maxNumOfSeat: number;
    selectedSeats: Point[];
}

const Map = styled('div')(() => ({
    display: 'flex',
    alignItems: 'flex-end',
    // justifyContent: 'center',
}));

const Screen = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    color: '#b0b0b0',
    borderRadius: '3px',
    height: '30px',
    lineHeight: '30px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
    marginBottom: '10px',
}));

const RowIndexer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column'
}));

const InnerContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column'
}));

const SeatsContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column'
}));

const SeatIndexer = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30px',
    width: '30px',
    margin: '4px',
    backgroundColor: 'transparent',
    color: '#4b4949',
}));

const SeatRow = styled('div')(() => ({
    display: 'flex'
}));

const SeatSelector: FC<SeatSelectorProps> = (props) => {
    const { cols, occupiedSeats, handleSeatSelection, rows, maxNumOfSeat, selectedSeats } = props;

    const handleSeatClick = (row: number, col: number) => {
        const state = calcState(row, col)
        if (state === 'OCCUPIED') {
            return;
        }
        else if (state === 'SELECTED') {
            // Deselect the seat
            handleSeatSelection(selectedSeats.filter((s) => !(s.seatColNum === col && s.seatRowNum === row)));
        } else if (selectedSeats.length < maxNumOfSeat) {
            handleSeatSelection([...selectedSeats, { seatColNum: col, seatRowNum: row }]);
        }
    };

    const checkIfInPointList = (i: number, j: number, list: Point[]) => {
        return list.filter(p => p.seatRowNum === i && p.seatColNum === j).length > 0
    }

    const calcState = (i: number, j: number): 'FREE' | 'OCCUPIED' | 'SELECTED' => {
        if (checkIfInPointList(i, j, occupiedSeats)) {
            return 'OCCUPIED'
        }
        if (checkIfInPointList(i, j, selectedSeats)) {
            return 'SELECTED'
        }

        return 'FREE';
    }

    return (
        <Map>
            <RowIndexer>
                {Array.from({ length: rows }, (_, index) => (
                    <SeatIndexer key={index}>{index + 1}</SeatIndexer>
                ))}
            </RowIndexer>
            <InnerContainer>
                <Screen>מסך</Screen>
                <SeatsContainer>
                    {Array.from({ length: rows }, (_, index) => (
                        <SeatRow key={index}>
                            {Array.from({ length: cols }, (_, j) => (
                                <Seat key={j} state={calcState(index + 1, j + 1)} onSeatSelected={() => handleSeatClick(index + 1, j + 1)} />
                            ))}
                        </SeatRow>
                    ))}
                </SeatsContainer>
            </InnerContainer>
        </Map>
    );
};

export default SeatSelector;
