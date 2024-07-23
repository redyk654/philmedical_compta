import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Box, Container, Drawer, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DrawerList from '../components/Comptable/DrawerList';
import TopBar from '../components/Comptable/TopBar';
import CustomTitle from '../shared/components/CustomTitle';
import CustomTitleH2 from '../shared/components/CustomTitleH2';
import ModalRubrique from '../components/Comptable/ModalRubrique';
import { dnsPath } from '../shared/constants/constants';
import { addRubrique } from '../apis/postFunctions';

export default function Comptable() {
    // const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [designationRubrique, setDesignationRubrique] = useState('')
    const [isModal, setIsModal] = useState(false);
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);

    const handleOpenModal = () => setIsModal(true);
    const handleCloseModal = () => {
        setIsModal(false);
        setIsHandlingSubmit(false);
        setDesignationRubrique('');
    }

    const handleChangeRubrique = (e) => {
        setDesignationRubrique(e.target.value)
    }

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const thisHandleSubmit = async (e) => {
        e.preventDefault();
        setIsHandlingSubmit(true);
        // Ajouter la rubrique
        const url = `${dnsPath}gestion_rubriques.php?add_rubrique`;
        const data = {
            designation: designationRubrique
        }
        try {
            const res = await addRubrique(url, data);
            if (res.message === 'success') {
                console.log("Rubrique ajoutée avec succès");
            }
            handleCloseModal();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la rubrique", error);
        }
    }
    
    return (
        <Box sx={{ padding: 0 }}>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
            <TopBar toggleDrawer={toggleDrawer} />
            <Container>
                <CustomTitle text='Comptable' />
                <CustomTitleH2>
                    Rubrique
                    <SettingsIcon onClick={handleOpenModal} role="button" />
                </CustomTitleH2>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className='fw-bold'>Dessert (100g serving)</TableCell>
                                <TableCell className='fw-bold'>Calories</TableCell>
                                <TableCell className='fw-bold'>Fat&nbsp;(g)</TableCell>
                                <TableCell className='fw-bold'>Carbs&nbsp;(g)</TableCell>
                                <TableCell className='fw-bold'>Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    name
                                </TableCell>
                                <TableCell>calories</TableCell>
                                <TableCell>fat</TableCell>
                                <TableCell>carbs</TableCell>
                                <TableCell>protein</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Container maxWidth='md'>
            </Container>
            <ModalRubrique
                isModal={isModal}
                handleCloseModal={handleCloseModal}
                designationRubrique={designationRubrique}
                handleChangeRubrique={handleChangeRubrique}
                thisHandleSubmit={thisHandleSubmit}
                isHandlingSubmit={isHandlingSubmit}
            />
        </Box>
    );
}
