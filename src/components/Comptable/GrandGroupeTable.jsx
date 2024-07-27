import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useState } from 'react'
import CollapsedRow from './CollapsedRow'

export default function GrandGroupeTable({ grandGoupes }) {

    const [isOpenCollapse, setIsOpenCollapse] = useState({});

    const handleCollapse = (rowId) => {
        setIsOpenCollapse((prevOpenRows) => ({
            ...prevOpenRows,
            [rowId]: !prevOpenRows[rowId],
        }));
    }

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 750 }}>
        <Table sx={{ maxWidth: 750 }} aria-label="grand groupe table">
            <TableHead>
            <TableRow>
                <TableCell />
                <TableCell className='fw-bold'>Nom Grand Groupe</TableCell>
                <TableCell className='fw-bold'>Montant</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {grandGoupes.map((row) => (
                    <CollapsedRow
                        key={row.id}
                        row={row}
                        isOpenCollapse={!!isOpenCollapse[row.id]}
                        handleCollapse={() => handleCollapse(row.id)}
                    />
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  )
}
