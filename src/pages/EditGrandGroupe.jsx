import React, { useContext } from 'react'
import CustomTitle from '../shared/components/CustomTitle'
import { CustomContext } from '../shared/contexts/CustomContext'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

export default function EditGrandGroupe() {

    const { grandGroupeData, handleGrandGroupeData } = useContext(CustomContext);

    const handleChangeDesignation = (e) => {
        const id = e.target.id
        const findRubrique = grandGroupeData.id_rubriques.find(rubrique => parseInt(rubrique.id_rubrique) === parseInt(id))
        findRubrique.designation = e.target.value
        const newRubriques = grandGroupeData.id_rubriques.map(rubrique => {
            if (parseInt(rubrique.id_rubrique) === parseInt(id)) {
                return findRubrique
            }
            return rubrique
        })
        handleGrandGroupeData({...grandGroupeData, id_rubriques: newRubriques})
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
    <div>
        <CustomTitle text={`Editer le grand groupe ${grandGroupeData.designation}`} />
        <TableContainer component={Paper}>
            <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                    Rubriques associées
                </Typography>
                <Table sx={{ minWidth: 650 }} aria-label="table edit groupe">
                    <TableHead>
                        <TableRow>
                            <TableCell className='fw-bold'>Nom rubrique</TableCell>
                            <TableCell className='fw-bold'>Pourcentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grandGroupeData.id_rubriques.map((rubrique) => (
                            <TableRow key={rubrique.id_rubrique}>
                                <TableCell>
                                    <TextField
                                        id={rubrique.id_rubrique}
                                        value={rubrique.designation}
                                        onChange={handleChangeDesignation}
                                        variant="outlined"
                                        size='small'
                                        autoComplete='off'
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        id={rubrique.id_rubrique}
                                        value={rubrique.pourcentage}
                                        onChange={handlePourcentage}
                                        variant="outlined"
                                        size='small'
                                        autoComplete='off'
                                        type='number'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </TableContainer>
    </div>
  )
}
