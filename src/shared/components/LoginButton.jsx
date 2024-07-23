import { Box, Button } from '@mui/material'
import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

export default function LoginButton({ isHandlingSubmit, children }) {
  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button
        type="submit"
        variant="contained"
        color='dark'
        disabled={isHandlingSubmit}
        fullWidth
      >
          {children}
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
