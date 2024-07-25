import { Box, FormGroup, FormLabel } from '@mui/material'
import React from 'react'

export default function PeriodForm({ dateDebut, dateFin, heureDebut, heureFin, handleDateDebut, handleDateFin, handleHeureDebut, handleHeureFin }) {
  return (
    <Box component='div'>
        <FormLabel className='fw-bold'>Choisir une période</FormLabel>
        <FormGroup className='d-flex flex-row mb-1'>
            <FormLabel>Date de début &nbsp;</FormLabel>
            <input
                type="date"
                name="dateD"
                id="dateD"
                value={dateDebut}
                onChange={handleDateDebut}
            />
            <input
                type="time"
                name="heureD"
                id="heureD"
                value={heureDebut}
                onChange={handleHeureDebut}
            />
        </FormGroup>
        <FormGroup className='d-flex flex-row'>
            <FormLabel>Date de fin &nbsp;</FormLabel>
            <input
                type="date"
                name="dateF"
                id="dateF"
                value={dateFin}
                onChange={handleDateFin}
            />
                <input
                type="time"
                name="heureF"
                id="heureF"
                value={heureFin}
                onChange={handleHeureFin}
            />
        </FormGroup>
    </Box>
  )
}
