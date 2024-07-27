import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { formaterNombre } from '../../shared/functions/functions';
import { useNavigate } from 'react-router-dom';

const RubriqueTable = ({ rubriques }) => {

    const navigate = useNavigate()

    const goToEditRubrique = (e) => {
        const rubriqueId = e.target.id
        navigate(`/comptabilite/editrubrique/${rubriqueId}`)
    }

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
            <Table sx={{ minWidth: 650 }} aria-label="rubrique table">
                <TableHead>
                    <TableRow>
                        <TableCell className='fw-bold'>Nom Rubrique</TableCell>
                        <TableCell className='fw-bold'>Montant</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rubriques.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell
                                id={`${row.id}-${row.rubrique}`}
                                component="th"
                                scope="row"
                                role='button'
                                onClick={goToEditRubrique}
                            >
                                {row.rubrique}
                            </TableCell>
                            <TableCell>{formaterNombre(row.montant)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RubriqueTable;