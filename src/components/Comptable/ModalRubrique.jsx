import { Box, Modal, Typography } from '@mui/material'
import React from 'react'
import RubriqueForm from './RubriqueForm'
import { modalStyle } from '../../shared/styles/CustomStyles'

export default function ModalRubrique({ title, isModal, handleCloseModal, designationRubrique, handleChangeRubrique, thisHandleSubmit, isHandlingSubmit }) {
  return (
    <Modal
        open={isModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={modalStyle}>
            <Typography className='fw-bold' variant="h6">
                {title}
            </Typography>
            <RubriqueForm
                designationRubrique={designationRubrique}
                handleChangeRubrique={handleChangeRubrique}
                thisHandleSubmit={thisHandleSubmit}
                isHandlingSubmit={isHandlingSubmit}
            />
        </Box>
    </Modal>
  )
}
