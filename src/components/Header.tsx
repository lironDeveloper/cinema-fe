import { MouseEvent, useState, FC, ChangeEvent, } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Logout } from '@mui/icons-material';
import MovieIcon from '@mui/icons-material/Movie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // marginLeft: 0,
    // width: 'auto',
    // [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(1),
    //     width: 'auto',
    // },
    // marginLeft: theme.spacing(1),
    width: 'auto',
    flexGrow: 0.5,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    // pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    "&:hover": {
        cursor: 'pointer'
    }
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        // width: '100%',
        // [theme.breakpoints.up('sm')]: {
        width: '35ch',
        '&:focus': {
            width: '35ch',
        },
        // },
    },
}));

const pages = ['הזמנת כרטיס'];

const Header: FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [keyword, setKeyword] = useState<string>('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const onkeywordChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

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

    const onSearch = () => {
        if (keyword.trim().length > 0) {
            navigate(`/search?keyword=${keyword}`);
        }
    }

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar >
                <MovieIcon sx={{ display: 'flex', mr: 1 }} />
                <Typography
                    variant="h4"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        display: 'flex',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        flexGrow: 1,
                    }}
                >
                    סינמה
                </Typography>
                <Search sx={{ display: { xs: 'none', md: 'inherit' } }}>

                    <StyledInputBase
                        placeholder="חיפוש סרט על פי מילת מפתח..."
                        inputProps={{ 'aria-label': 'search' }}
                        value={keyword}
                        onChange={onkeywordChanged}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                onSearch()
                            }
                        }}
                    />
                    <SearchIconWrapper >
                        <SearchIcon onClick={onSearch} />
                    </SearchIconWrapper>
                </Search>
                {user ?
                    <Box sx={{ flexGrow: 0 }}>
                        <Container sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="משתמש">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar {...stringAvatar(user.fullName)} />
                                </IconButton>
                            </Tooltip>
                            <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                    mr: 1,
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    flexGrow: 1,
                                }}
                            >
                                {user.fullName}
                            </Typography>
                        </Container>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => { setAnchorElUser(null); navigate('/user') }}>
                                <ListItemIcon>
                                    <AccountCircleIcon fontSize="small" />
                                </ListItemIcon> הפרופיל שלי
                            </MenuItem>
                            <MenuItem onClick={() => { setAnchorElUser(null); navigate('/signin'); }}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon> התנתק/י
                            </MenuItem>
                        </Menu>
                    </Box> : null}
            </Toolbar>
        </AppBar>
    );
}
export default Header;