import { MouseEvent, useState, FC, ChangeEvent, } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Logout } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: 'auto',
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
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '47ch',
        '&:focus': {
            width: '35ch',
        },
    },
}));

const LogoWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    "&:hover": {
        cursor: 'pointer'
    }
}));

const Header: FC = () => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [keyword, setKeyword] = useState<string>('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
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
                <LogoWrapper>
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        onClick={() => { navigate("/") }}
                        sx={{
                            mr: 2,
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        סינמה גלקסי
                    </Typography>
                </LogoWrapper>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
                </div>

                {user ?
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                    letterSpacing: '.15rem',
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
                    </div> : null}
            </Toolbar>
        </AppBar>
    );
}
export default Header;