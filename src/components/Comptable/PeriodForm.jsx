import { Box, FormGroup, FormLabel, TextField, Grid, Paper } from '@mui/material'
import React from 'react'
import { COLORSPALETTE } from '../../shared/global/palette';

export default function PeriodForm({ 
  dateDebut, 
  dateFin, 
  heureDebut, 
  heureFin, 
  handleDateDebut, 
  handleDateFin, 
  handleHeureDebut, 
  handleHeureFin 
}) {
  return (
    <Box component='div'>
      <Grid container spacing={2}>
        {/* Date de début */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ marginBottom: 2 }}>
            <FormLabel 
              sx={{ 
                fontWeight: 600, 
                marginBottom: 1, 
                display: 'block',
                color: COLORSPALETTE.primary,
                fontSize: '0.9rem'
              }} 
            >
              Date de début
            </FormLabel>
            <TextField
              type="date"
              name="dateD"
              id="dateD"
              value={dateDebut}
              onChange={handleDateDebut}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: COLORSPALETTE.white,
                  '&:hover fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  }
                }
              }}
            />
          </Box>
          <Box>
            <FormLabel 
              sx={{ 
                fontWeight: 600, 
                marginBottom: 1, 
                display: 'block',
                color: COLORSPALETTE.primary,
                fontSize: '0.9rem'
              }} 
            >
              Heure de début
            </FormLabel>
            <TextField
              type="time"
              name="heureD"
              id="heureD"
              value={heureDebut}
              onChange={handleHeureDebut}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: COLORSPALETTE.white,
                  '&:hover fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  }
                }
              }}
            />
          </Box>
        </Grid>

        {/* Date de fin */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ marginBottom: 2 }}>
            <FormLabel 
              sx={{ 
                fontWeight: 600, 
                marginBottom: 1, 
                display: 'block',
                color: COLORSPALETTE.primary,
                fontSize: '0.9rem'
              }} 
            >
              Date de fin
            </FormLabel>
            <TextField
              type="date"
              name="dateF"
              id="dateF"
              value={dateFin}
              onChange={handleDateFin}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: COLORSPALETTE.white,
                  '&:hover fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  }
                }
              }}
            />
          </Box>
          <Box>
            <FormLabel 
              sx={{ 
                fontWeight: 600, 
                marginBottom: 1, 
                display: 'block',
                color: COLORSPALETTE.primary,
                fontSize: '0.9rem'
              }} 
            >
              Heure de fin
            </FormLabel>
            <TextField
              type="time"
              name="heureF"
              id="heureF"
              value={heureFin}
              onChange={handleHeureFin}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: COLORSPALETTE.white,
                  '&:hover fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORSPALETTE.primary,
                  }
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
