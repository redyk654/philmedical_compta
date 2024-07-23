import { Box, Button, CircularProgress, TextField } from '@mui/material'
import React from 'react'

export default function RubriqueForm({ isHandlingSubmit, designationRubrique, handleChangeRubrique, thisHandleSubmit }) {
  return (
    <form onSubmit={thisHandleSubmit} sx={{ mt: 2 }}>
        <TextField
            id="designation-rubrique" 
            label="Designation"
            variant="standard"
            value={designationRubrique}
            onChange={handleChangeRubrique}
            autoComplete='off'
            required
        />
        <Box sx={{ m: 2, position: 'relative', display: 'inline-block' }}>
            <Button
                type="submit"
                variant="contained"
                color='primary'
                disabled={isHandlingSubmit}
            >
                Ajouter
            </Button>
            {isHandlingSubmit && (
                <CircularProgress
                    size={24}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px'
                    }}
                />
            )}
        </Box>
    </form>
  )
}
