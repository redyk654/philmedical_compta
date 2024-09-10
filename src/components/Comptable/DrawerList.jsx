import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export default function DrawerList({ toggleDrawer }) {

    const navigate = useNavigate()

    const logOut = () => {
        localStorage.clear()
        navigate('/philmedical/compta')
    }

  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <Box component='div' className='d-flex'>
            <AccountCircleIcon />
            <p>Compta</p>
        </Box>
        <Divider />
        <List>
            <ListItem disablePadding>
                <ListItemButton sx={{ bgcolor: 'dark.light' }}>
                    <ListItemIcon>
                        <AccountBalanceWalletIcon />
                    </ListItemIcon>
                    <ListItemText primary="Comptabilité" />
                </ListItemButton>
            </ListItem>
            {/* <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gestion des utilisateurs" />
                </ListItemButton>
            </ListItem> */}
            <Divider />
            <ListItem disablePadding>
                <ListItemButton onClick={logOut}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="deconnection" />
                </ListItemButton>
            </ListItem>
        </List>
    </Box>
  )
}
