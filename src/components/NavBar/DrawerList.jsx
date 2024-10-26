import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { pathsOfUrls } from '../../shared/constants/constants';
import NavigationItem from './NavigationItem';

export default function DrawerList({ toggleDrawer }) {

    const location = useLocation()
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.clear()
        navigate(`${pathsOfUrls.layoutNavBar}${pathsOfUrls.signIn}`)
    }

  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        <Box component='div' className='d-flex'>
            <AccountCircleIcon />
            <p>Compta</p>
        </Box>
        <Divider />

        <List>
            <NavigationItem
                to={`${pathsOfUrls.comptable}`}
                icon={<AccountBalanceWalletIcon />}
                label="Comptabilité"
                isActive={location.pathname.toLowerCase() === pathsOfUrls.layoutNavBar + pathsOfUrls.comptable}
            />
            <NavigationItem
                to={`${pathsOfUrls.prescripteurs}`}
                icon={<MedicationLiquidIcon />}
                label="Prescripteurs"
                isActive={location.pathname.toLowerCase() === pathsOfUrls.layoutNavBar + pathsOfUrls.prescripteurs}
            />
            <NavigationItem
                to={`${pathsOfUrls.prestataires}`}
                icon={<EngineeringIcon />}
                label="Prestataires"
                isActive={location.pathname.toLowerCase() === pathsOfUrls.layoutNavBar + pathsOfUrls.prestataires}
            />
            <Divider />
            <ListItem disablePadding>
                <ListItemButton onClick={logOut}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                </ListItemButton>
            </ListItem>
        </List>
    </Box>
  )
}
