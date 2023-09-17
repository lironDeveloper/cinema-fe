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
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface ListItem {
    key: string;
    text: string;
    link: string;
    icon: any;
}

const Sidebar: FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const listItems = (obj: ListItem) => (
        <ListItem key={obj.key} disablePadding onClick={() => { navigate(obj.link); }}>
            <ListItemButton>
                <ListItemIcon>
                    {obj.icon}
                </ListItemIcon>
                <ListItemText primary={obj.text} />
            </ListItemButton>
        </ListItem>
    )

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
            anchor="right"
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {[
                        { key: "but-ticket", text: "הזמנת כרטיס", icon: <ConfirmationNumberIcon />, link: "/buy-ticket" },
                    ].map((obj) => listItems(obj))}
                </List>
                {user?.role == 'ROLE_ADMIN' ? (
                    <>
                        <Divider />
                        <List>
                            {[
                                { key: "branch-mgmt", text: "ניהול סניפים", icon: <LocationOnIcon />, link: "/admin/branch" },
                                { key: "hall-mgmt", text: "ניהול אולמות", icon: <EventSeatIcon />, link: "/admin/hall" },
                                { key: "movie-mgmt", text: "ניהול סרטים", icon: <SlideshowIcon />, link: "/admin/movie" },
                                { key: "showtime-mgmt", text: "ניהול הקרנות", icon: <AccessTimeIcon />, link: "/admin/showtime" },
                            ].map((obj) => listItems(obj))
                            }
                        </List>
                    </>) : null}
            </Box>
        </Drawer>
    );
}
export default Sidebar;