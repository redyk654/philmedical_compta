import { Box, Button, CircularProgress } from '@mui/material'
import React from 'react'

export default function CustomButton({ title, handleClick, buttonIsDisabled, isHandlingSubmit }) {
  return (
    <Box sx={{ m: 2, position: 'relative', display: 'inline-block' }}>
        <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={handleClick}
            disabled={buttonIsDisabled()}
        >
            {title}
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
  )
}
