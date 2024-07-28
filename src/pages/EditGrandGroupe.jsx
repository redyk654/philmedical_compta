import React, { useContext, useState } from 'react'
import CustomTitle from '../shared/components/CustomTitle'
import { CustomContext } from '../shared/contexts/CustomContext'
import { Box, Container, Paper, TableContainer, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RubriquesAssociesTable from '../components/EditGrandGroupe/RubriquesAssociesTable';
import CustomButton from '../shared/components/CustomButton';
import { postRequest } from '../apis/postRequests';
import { dnsPath } from '../shared/constants/constants';

export default function EditGrandGroupe() {

    const { grandGroupeData, handleGrandGroupeData } = useContext(CustomContext);
    const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const updateRubriqueAssocie = async (e) => {
        e.preventDefault()
        setIsHandlingSubmit(true)
        const url = `${dnsPath}/gestion_rubriques.php?update_rubrique_grand_groupe`

        try {
            const response = await postRequest(url, grandGroupeData)
            console.log(response)
            if (response.message === "success") {
                setIsHandlingSubmit(false)
                setIsEdit(false)
            }
        } catch (error) {
            console.log(error)
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

  return (
    <Container>
        <CustomTitle text={`Editer le grand groupe ${grandGroupeData.designation}`} />
        <TableContainer component={Paper} sx={{ maxWidth: 850 }}>
            <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    Rubriques associées
                    <AddCircleIcon sx={{ marginLeft: 1, cursor: 'pointer' }} fontSize='medium' />
                </Typography>
                <RubriquesAssociesTable
                    grandGroupeData={grandGroupeData}
                    handlePourcentage={handlePourcentage}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            </Box>
            <CustomButton
                title='Enregistrer les modifications'
                handleClick={updateRubriqueAssocie}
                buttonIsDisabled={buttonIsDisabled}
                isHandlingSubmit={isHandlingSubmit}
            />
        </TableContainer>
    </Container>
  )
}
