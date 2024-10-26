import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export default function NavigationItem({ icon, label, to, isActive }) {
  return (
    <ListItem disablePadding>
        <ListItemButton component={Link} to={to} sx={{ bgcolor: isActive ? 'dark.light' : '' }}>
            <ListItemIcon>
            {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
        </ListItemButton>
    </ListItem>
  )
}
