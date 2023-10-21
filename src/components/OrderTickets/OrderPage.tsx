import { FC, useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Box, Toolbar, Button, styled, StepIconProps } from '@mui/material';
import Point from '../../interfaces/Point'
import { Check } from '@mui/icons-material';
import ChooseShowtime from './ChooseShowtime';
import ChooseSeats from './ChooseSeats';
import Summary from './Summary';
import Showtime from '../../interfaces/Showtime/Showtime';
import { useAuth } from '../../context/AuthContext';
import notify from '../../utils/ErrorToast';

const steps: string[] = ['בחירת הקרנה', 'בחירת מושבים', 'סיכום הזמנה'];



const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
        color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        ...(ownerState.active && {
            color: theme.palette.secondary.main,
        }),
        '& .QontoStepIcon-completedIcon': {
            color: theme.palette.secondary.main,
            zIndex: 1,
            fontSize: 36,
        },
        '& .QontoStepIcon-circle': {
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
    }),
);

const Container = styled('div')(() => ({
    margin: '0 10% 0 10%'
}));

const QontoStepIcon = (props: StepIconProps) => {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

const StepContainer = styled('div')(() => ({
    margin: '0 10% 0 10%'
}));

const ButtonContainer = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '5% 10% 5% 10%'
}));

const OrderPage: FC = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedShowtime, setSelectedShotime] = useState<Showtime>();
    const [selectedSeats, setSelectedSeats] = useState<Point[]>([]);

    const { token } = useAuth();

    useEffect(() => {

    }, [activeStep])

    const buyTickets = async () => {
        try {
            await Promise.all(selectedSeats.map(async (seat: Point) => {
                const ticket = {
                    showtimeId: selectedShowtime?.id,
                    seat: {
                        rowNum: seat.seatRowNum,
                        colNum: seat.seatColNum
                    }
                }
                const response = await fetch(`http://localhost:8080/api/ticket`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(ticket),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log(data)
                } else {
                    throw new Error(data.errors[0])
                }
            }));
        } catch (error: any) {
            notify(error.message);
        }
    }

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            buyTickets();
        }
    };

    const chooseShowtime = (showtime: Showtime) => {
        setSelectedShotime(showtime);
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <ChooseShowtime chooseShowtime={chooseShowtime} />;
            case 1:
                return <ChooseSeats showtime={selectedShowtime} handleSeatSelection={handleSeatSelection} selectedSeats={selectedSeats} />;
            case 2:
                return <Summary />;
            case 3:
                return <Summary />;
            default:
                return <div>Not Found</div>;
        }
    }

    const handleSeatSelection = (seats: Point[]) => {
        setSelectedSeats(seats);
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Container>
                <Stepper alternativeLabel activeStep={activeStep} connector={null}>
                    {steps.map(label => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <StepContainer>
                    {renderStepContent()}
                </StepContainer>
                {activeStep <= steps.length - 1 &&
                    <ButtonContainer>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={(activeStep === 0 && !selectedShowtime) || (activeStep === 1 && selectedSeats.length === 0)}
                        >
                            {activeStep === steps.length - 1 ? 'ביצוע הזמנה' : 'המשך'}
                        </Button>
                    </ButtonContainer>}
            </Container>

        </Box>
    );
}

export default OrderPage;
