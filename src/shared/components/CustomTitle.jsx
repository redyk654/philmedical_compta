import { Typography } from '@mui/material'
import React from 'react'

export default function CustomTitle({ text }) {
  return (
    <Typography variant='h4' className='text-center mt-2 fw-bold'>
        {text}
    </Typography>
)
}
