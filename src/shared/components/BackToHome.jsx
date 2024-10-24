import { Box, Button } from '@mui/material'
import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { Link, useNavigate } from 'react-router-dom';
import { pathsOfUrls } from '../constants/constants';

export default function BackToHome() {

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  return (
    <Box>
        <Button variant='text' color='primary' className=' text-lowercase' onClick={goBack}>
            <ArrowBackIosRoundedIcon color='primary' />
            retourner à l'acceuil
        </Button>
    </Box>
  )
}