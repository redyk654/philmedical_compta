import React, { useContext, useState } from 'react'
import CustomTitle from '../shared/components/CustomTitle'
import { CustomContext } from '../shared/contexts/CustomContext'
import { Box, Container, FormControl, IconButton, InputLabel, MenuItem, Modal, Paper, Select, TableContainer, TextField, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RubriquesAssociesTable from '../components/EditGrandGroupe/RubriquesAssociesTable';
import CustomButton from '../shared/components/CustomButton';
import { postRequest } from '../apis/postRequests';
import { dnsPath } from '../shared/constants/constants';
import { modalStyle } from '../shared/styles/CustomStyles';
import { getRequest } from '../apis/getRequests';
import LoginButton from '../shared/components/LoginButton';

export default function EditGrandGroupe() {

    const { grandGroupeData, handleGrandGroupeData } = useContext(CustomContext);
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [newRubrique, setNewRubrique] = useState({designation: '', pourcentage: 0});
    const [rubriquesDisponible, setRubriquesDisponible] = useState([]);

    const handleOpenModal = () => {
        setIsModal(true)
        getRubriquesDisponible()
    }
    const handleCloseModal = () => {
        setIsModal(false)
        getRubriquesGrandGroupe()
        setNewRubrique({designation: '', pourcentage: 0})
    }

    const handleChangeRubrique = (e) => {
        setNewRubrique({...newRubrique, designation: e.target.value})
    }

    const handleChangePourcentage = (e) => {
        setNewRubrique({...newRubrique, pourcentage: e.target.value})
    }

    const getRubriquesGrandGroupe = async () => {
        const url = `${dnsPath}gestion_rubriques.php?get_rubriques_grand_groupe&id=${grandGroupeData.id}`
        try {
            const response = await getRequest(url)
            handleGrandGroupeData({...grandGroupeData, id_rubriques: response})
        } catch (error) {
            console.log('Error fetching rubrique grand groupe:', error)
        }
    }

    const getRubriquesDisponible = async () => {
        const url = `${dnsPath}gestion_rubriques.php?get_rubriques`
        try {
            const response = await getRequest(url)
            setRubriquesDisponible(response)
        } catch (error) {
            console.log('Error fetching rubriques:', error)
        }
    }

    const ajouterRubriqueAssocie = async (e) => {
        e.preventDefault()
        setIsHandlingSubmit(true)
        const url = `${dnsPath}gestion_rubriques.php?add_rubrique_grand_groupe`
        const data = {
            id_rubrique: rubriquesDisponible.find(rubrique => rubrique.designation.toLowerCase() === newRubrique.designation.toLowerCase()).id,
            id: grandGroupeData.id,
            pourcentage: newRubrique.pourcentage
        }
        try {
            const response = await postRequest(url, data)
            if (response.message === "success") {
                setIsHandlingSubmit(false)
                handleCloseModal()
            }
        } catch (error) {
            console.log('Error adding rubrique associée:', error)
        }
    }

    const updateRubriqueAssocie = async () => {
        setIsHandlingSubmit(true)
        const url = `${dnsPath}gestion_rubriques.php?update_rubrique_grand_groupe`

        try {
            const response = await postRequest(url, grandGroupeData)
            if (response.message === "success") {
                setIsHandlingSubmit(false)
                setIsEdit(false)
            }
        } catch (error) {
            console.log('Error updating rubrique associée:', error)
        }

    }

    const buttonIsDisabled = () => {
        return isHandlingSubmit
    }

    const handlePourcentage = (e) => {
        const id = e.target.id
        const findRubrique = grandGroupeData.id_rubriques.find(rubrique => parseInt(rubrique.id_rubrique) === parseInt(id))
        findRubrique.pourcentage = parseInt(e.target.value)
        const newRubriques = grandGroupeData.id_rubriques.map(rubrique => {
            if (parseInt(rubrique.id_rubrique) === parseInt(id)) {
                return findRubrique
            }
            return rubrique
        })
        handleGrandGroupeData({...grandGroupeData, id_rubriques: newRubriques})
    }

    const deleteRubrique = async (id_rubrique) => {
        const url = `${dnsPath}gestion_rubriques.php?delete_rubrique_grand_groupe`
        const data = {
            id: grandGroupeData.id,
            id_rubrique: id_rubrique
        }

        try {
            const response = await postRequest(url, data)
            if (response.message === "success") {
                getRubriquesGrandGroupe()
            }
        } catch (error) {
            console.log('Error deleting rubrique associée:', error)
        }
    }

  return (
    <Container>
        <CustomTitle text={`Editer le grand groupe ${grandGroupeData.designation}`} />
        <TableContainer component={Paper} sx={{ maxWidth: 850 }}>
            <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    Rubriques associées
                    <IconButton onClick={handleOpenModal}>
                        <AddCircleIcon sx={{ marginLeft: 0, cursor: 'pointer' }} fontSize='medium' />
                    </IconButton>
                </Typography>
                <RubriquesAssociesTable
                    grandGroupeData={grandGroupeData}
                    handlePourcentage={handlePourcentage}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    deleteRubrique={deleteRubrique}
                />
            </Box>
            <CustomButton
                title='Enregistrer les modifications'
                handleClick={updateRubriqueAssocie}
                buttonIsDisabled={buttonIsDisabled}
                isHandlingSubmit={isHandlingSubmit}
            />
        </TableContainer>
        <Modal
            open={isModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom component="div">
                    Ajouter une rubrique associée
                </Typography>
                <form
                    onSubmit={ajouterRubriqueAssocie}
                >
                    <FormControl fullWidth>
                        <InputLabel id="rub">Rubrique</InputLabel>
                        <Select
                            labelId="rub"
                            value={newRubrique.designation}
                            onChange={handleChangeRubrique}
                            label="Rubrique"
                            required
                        >
                            <MenuItem aria-label="None" value="" >
                                <em>Choisir une rubrique</em>
                            </MenuItem>
                            {rubriquesDisponible.map(rubrique => (
                                <MenuItem key={rubrique.id} value={rubrique.designation}>
                                    {rubrique.designation}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt : 2 }}>
                        <TextField 
                            id="pourcentage"
                            label="Pourcentage"
                            type="number"
                            value={newRubrique.pourcentage}
                            onChange={handleChangePourcentage}
                            required
                            autoComplete='off'
                        />
                    </FormControl>
                    <LoginButton isHandlingSubmit={isHandlingSubmit}>
                        Ajouter la rubrique
                    </LoginButton>
                </form>
            </Box>
        </Modal>
    </Container>
  )
}
