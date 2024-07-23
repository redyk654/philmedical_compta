import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';

export default function TopBar({ toggleDrawer }) {
  return (
    <Box
        component='header'
        sx={{ width: '100%', height: 50, bgcolor: 'dark.main' }}
        className='d-flex justify-content-between p-2'
    >
        <Box>
            <Button onClick={toggleDrawer(true)}>
                <MenuIcon color='light' />
            </Button>
        </Box>
        <Box>
            <Typography variant='p' className=' text-light'>Philemedical</Typography>
        </Box>
    </Box>
  )
}
