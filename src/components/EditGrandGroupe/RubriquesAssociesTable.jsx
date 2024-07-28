import { Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import React from 'react'

export default function RubriquesAssociesTable({ grandGroupeData, handlePourcentage, isEdit, setIsEdit }) {
  return (
    <Table sx={{ minWidth: 750 }} aria-label="table edit groupe">
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
                        {rubrique.designation}
                    </TableCell>
                    <TableCell onClick={() => setIsEdit(true)}>
                        {!isEdit ? `${rubrique.pourcentage}%` :
                        <TextField
                            id={`${rubrique.id_rubrique}`}
                            value={rubrique.pourcentage}
                            onChange={handlePourcentage}
                            variant="outlined"
                            size='small'
                            autoComplete='off'
                            type='number'
                            name='pourcentage'
                        />}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  )
}
