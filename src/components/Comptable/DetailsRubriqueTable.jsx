import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { extraireCode, formaterNombre } from '../../shared/functions/functions';

export default function DetailsRubriqueTable({ detailsRubrique }) {

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
        <TableContainer component={Paper} sx={{ maxWidth: 690, maxHeight: 360 }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="rubrique table">
                <TableHead>
                    <TableRow>
                        <TableCell className='fw-bold'>Designation</TableCell>
                        <TableCell className='fw-bold'>Qté</TableCell>
                        <TableCell className='fw-bold'>Montant</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {detailsRubrique.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow
                            key={row.id}
                        >
                            <TableCell>
                                {extraireCode(row.designation)}
                            </TableCell>
                            <TableCell>
                                <strong>
                                    {row.qte}
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    {formaterNombre(parseInt(row.montant))}
                                </strong>
                            </TableCell>
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
