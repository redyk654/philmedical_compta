import React, { useContext } from 'react'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { convertDate, formaterNombre } from '../../shared/functions/functions';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function PrintRubrique({ rubriques }) {

    const { dateDebut,
            dateFin,
            heureDebut,
            heureFin,
        } = useContext(CustomContext);

  return (
    <div className='p-4'>
        {/* Header with date and time */}
        <div className='d-flex justify-content-between flex-column'>
            <div>
                <h3 className='text-center text-uppercase'>
                    Rapport des revenus par rubrique
                </h3>
            </div>
            <div className='mt-3'>
                <h4 className='text-center text-capitalize'>
                    du &nbsp;
                    <strong>
                        {convertDate(dateDebut)} à {heureDebut} &nbsp;
                    </strong>
                    au &nbsp;
                    <strong>
                        {convertDate(dateFin)} à {heureFin}
                    </strong>
                </h4>
            </div>

            <div className='mt-5'>
                <TableContainer component="div">
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="rubrique table">
                        <TableHead>
                            <TableRow>
                                <TableCell className='fw-bold'>Rubrique</TableCell>
                                <TableCell className='fw-bold'>Montant</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rubriques.map((row) => (
                                <TableRow
                                    key={row.id}
                                >
                                    <TableCell className='text-capitalize fs-6'>
                                        {row.rubrique}
                                    </TableCell>
                                    <TableCell className='fs-6'>
                                        <strong>
                                            {formaterNombre(parseInt(row.montant))}
                                        </strong>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    </div>
  )
}
