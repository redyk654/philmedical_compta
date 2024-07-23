import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Drawer, Modal, TextField, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DrawerList from '../components/Comptable/DrawerList';
import TopBar from '../components/Comptable/TopBar';
import CustomTitle from '../shared/components/CustomTitle';
import { modalStyle } from '../shared/styles/CustomStyles';

export default function Comptable() {
    // const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [designationRubrique, setDesignationRubrique] = useState('')
    const [isModal, setIsModal] = useState(false);

    const handleOpenModal = () => setIsModal(true);
    const handleCloseModal = () => setIsModal(false)

    const handleChangeRubrique = (e) => {
        setDesignationRubrique(e.target.value)
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const thisHandleSubmit = (e) => {
        e.preventDefault();
        console.log(designationRubrique);
        // Do something
    }
    
    return (
        <Box sx={{ padding: 0 }}>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
            <TopBar toggleDrawer={toggleDrawer} />
            <Container>
                <CustomTitle text='Comptable' />
                <Typography variant='h6' className='mt-2'>
                    Rubrique
                    <SettingsIcon onClick={handleOpenModal} role="button" />
                </Typography>
            </Container>
            <Modal
                open={isModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={modalStyle}>
                    <Typography className='fw-bold' variant="h6">
                        Nouvelle rubrique
                    </Typography>
                    <form onSubmit={thisHandleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            id="designation-rubrique" 
                            label="Designation"
                            variant="standard"
                            value={designationRubrique}
                            onChange={handleChangeRubrique}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            sx={{ m: 2 }}
                        >
                            Ajouter
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}
