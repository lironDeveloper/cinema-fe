import { useState, FC } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ListItemIcon from '@mui/material/ListItemIcon';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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
    const [selectedKey, setSelectedKey] = useState<string>(window.location.pathname);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleListItemClick = (
        key: string
    ) => {
        setSelectedKey(key);
    };

    const listItems = (obj: ListItem) => (
        <ListItem key={obj.key} disablePadding onClick={() => { navigate(obj.link); }}>
            <ListItemButton
                selected={selectedKey === obj.link}
                onClick={(event) => handleListItemClick(obj.link)}
            >
                <ListItemIcon>
                    {obj.icon}
                </ListItemIcon>
                <ListItemText primary={obj.text} />
            </ListItemButton>
        </ListItem >
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
                        { key: "home", text: "דף הבית", icon: <HomeIcon />, link: "/" },
                        { key: "buy-ticket", text: "הזמנת כרטיס", icon: <ConfirmationNumberIcon />, link: "/buy-ticket" },
                    ].map((obj) => listItems(obj))}
                </List>
                {user?.role === 'ROLE_ADMIN' ? (
                    <>
                        <Divider />
                        <List>
                            {[
                                { key: "branch-mgmt", text: "ניהול סניפים", icon: <LocationOnIcon />, link: "/admin/branch" },
                                { key: "hall-mgmt", text: "ניהול אולמות", icon: <EventSeatIcon />, link: "/admin/hall" },
                                { key: "movie-mgmt", text: "ניהול סרטים", icon: <SlideshowIcon />, link: "/admin/movie" },
                                { key: "showtime-mgmt", text: "ניהול הקרנות", icon: <AccessTimeIcon />, link: "/admin/showtime" },
                                { key: "change-role", text: "ניהול משתמשים", icon: <AdminPanelSettingsIcon />, link: "/admin/users" },

                            ].map((obj) => listItems(obj))
                            }
                        </List>
                    </>) : null}
            </Box>
        </Drawer>
    );
}
export default Sidebar;