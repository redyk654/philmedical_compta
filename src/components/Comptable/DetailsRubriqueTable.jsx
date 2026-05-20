import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { extraireCode, formaterNombre } from '../../shared/functions/functions';

export default function DetailsRubriqueTable({ detailsRubrique, mode = 'standard' }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

  return (
    <Paper sx={{ width: 690, overflow: 'hidden' }}>
        <TableContainer component={Paper} sx={{ maxWidth: 690, maxHeight: 340 }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="rubrique table">
                <TableHead>
                    <TableRow>
                        <TableCell className='fw-bold'>Designation</TableCell>
                        {mode === 'commission' && <TableCell className='fw-bold'>Prix</TableCell>}
                        <TableCell className='fw-bold'>Qté</TableCell>
                        <TableCell className='fw-bold'>{mode === 'commission' ? 'Montant net' : 'Montant'}</TableCell>
                        {mode === 'commission' && <TableCell className='fw-bold'>Commission</TableCell>}
                        {mode === 'commission' && <TableCell className='fw-bold'>Montant calculé</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {detailsRubrique.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow
                            key={row.id_service || row.id}
                        >
                            <TableCell>
                                {extraireCode(row.designation || row.service || '')}
                            </TableCell>
                            {mode === 'commission' && (
                                <TableCell>
                                    <strong>
                                        {formaterNombre(parseInt(row.prix || 0))}
                                    </strong>
                                </TableCell>
                            )}
                            <TableCell>
                                <strong>
                                    {row.qte || row.total_qte}
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    {formaterNombre(Math.round(parseFloat(mode === 'commission' ? row.montant_net || 0 : row.montant || 0)))}
                                </strong>
                            </TableCell>
                            {mode === 'commission' && (
                                <TableCell>
                                    <strong>
                                        {row.type_valeur === 'montant_fixe'
                                            ? formaterNombre(Math.round(parseFloat(row.valeur || 0)))
                                            : `${row.valeur}%`
                                        }
                                    </strong>
                                </TableCell>
                            )}
                            {mode === 'commission' && (
                                <TableCell>
                                    <strong>
                                        {formaterNombre(Math.round(parseFloat(row.montant_calcule || 0)))}
                                    </strong>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={detailsRubrique.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Paper>
  )
}
