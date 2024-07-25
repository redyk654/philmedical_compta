import { Typography } from '@mui/material'
import React from 'react'

export default function CustomTitleH2({ children }) {
  return (
    <Typography variant='h5' className='mt-3'>
        {children}
    </Typography>
  )
}
