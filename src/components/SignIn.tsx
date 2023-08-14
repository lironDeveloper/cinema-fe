import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { FC, useState, ChangeEvent, FormEvent, useEffect } from 'react';

const defaultTheme = createTheme();

const SignIn: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        window.localStorage.removeItem('token')
        return () => {
            setEmail('')
            setPassword('')
            //   setLoading(false)
        }
    }, [])


    const onEmailChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const onPasswordChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const { login } = useAuth();
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.text();
            if (response.ok) {
                login(data); // Set the JWT token in the context
            }
        } catch (error) {
            console.error('Error making POST request:', error);
        }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        התחברות למערכת
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="כתובת אימייל"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={onEmailChanged}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="סיסמא"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={onPasswordChanged}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            התחברות
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignIn;