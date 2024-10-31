import React from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { formaterNombre } from '../../shared/functions/functions';
import { useNavigate } from 'react-router-dom';
import { pathsOfUrls } from '../../shared/constants/constants';

const RubriqueTable = ({ rubriques, handleOpenModalDetails }) => {

    const navigate = useNavigate()

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const goToEditRubrique = (e) => {
        const rubriqueId = e.target.id
        navigate(`${pathsOfUrls.layoutNavBar}editrubrique/${rubriqueId}`)
    }

    return (
        <Paper sx={{ width: 690, overflow: 'hidden' }}>
            <TableContainer component={Paper} sx={{ maxWidth: 690, maxHeight: 360 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="rubrique table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='fw-bold'>Nom Rubrique</TableCell>
                            <TableCell className='fw-bold'>Montant</TableCell>
                            <TableCell className='fw-bold'>Détails</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubriques.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow
                                key={row.id}
                            >
                                <TableCell
                                    id={`${row.id}-${row.rubrique}`}
                                    role='button'
                                    onClick={goToEditRubrique}
                                >
                                    {row.rubrique}
                                </TableCell>
                                <TableCell>
                                    <strong>
                                        {formaterNombre(parseInt(row.montant))}
                                    </strong>
                                </TableCell>
                                <TableCell>
                                    <a
                                        href="#"
                                        className='text-primary'
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleOpenModalDetails(row)
                                        }}
                                    >
                                        afficher les détails
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={rubriques.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default RubriqueTable;