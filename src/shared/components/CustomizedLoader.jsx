import { Backdrop, CircularProgress, Container } from '@mui/material'
import React from 'react'

export default function CustomizedLoader() {
  return (
    <Container>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <h1>
            Veuillez patienter
            </h1>
            <CircularProgress color="inherit" />
        </Backdrop>
    </Container>
  )
}
