import { Button } from '@mui/material'
import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { Link } from 'react-router-dom';

export default function BackToHome() {
  return (
    <Link to='/'>
        <Button variant='text' color='primary' className=' text-lowercase'>
            <ArrowBackIosRoundedIcon color='primary' />
            retourner à l'acceuil
        </Button>
    </Link>
  )
}