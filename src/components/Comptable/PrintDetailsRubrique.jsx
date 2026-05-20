import React, { useContext } from 'react'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { convertDate, extraireCode, formaterNombre } from '../../shared/functions/functions';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function PrintDetailsRubrique({ detailsRubrique, rubriqueSelected, mode = 'standard' }) {

    const { dateDebut,
            dateFin,
            heureDebut,
            heureFin,
        } = useContext(CustomContext);
    const totalAvantCommission = detailsRubrique.reduce(
        (acc, row) => acc + parseFloat(row.montant_net || 0),
        0
    );
    const totalCommission = detailsRubrique.reduce(
        (acc, row) => acc + parseFloat(row.montant_calcule || 0),
        0
    );
    const totalApresCommission = totalAvantCommission - totalCommission;
    const totalStandard = detailsRubrique.reduce(
        (acc, row) => acc + parseFloat(row.montant || 0),
        0
    );

  return (
    <div className='p-4'>
        {/* Header with date and time */}
        <div className='d-flex justify-content-between flex-column'>
            <div>
                <h3 className='text-center text-uppercase'>
                    {mode === 'commission' ? 'Rapport commission de la rubrique' : 'Rapport de la rubrique'} <strong>{rubriqueSelected?.rubrique?.toUpperCase()}</strong>
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
                                <TableCell className='fw-bold'>Désignation</TableCell>
                                {mode === 'commission' && <TableCell className='fw-bold'>Prix</TableCell>}
                                <TableCell className='fw-bold'>Qte</TableCell>
                                <TableCell className='fw-bold'>{mode === 'commission' ? 'Montant net' : 'Montant'}</TableCell>
                                {mode === 'commission' && <TableCell className='fw-bold'>Commission</TableCell>}
                                {mode === 'commission' && <TableCell className='fw-bold'>Montant calculé</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detailsRubrique.map((row) => (
                                <TableRow
                                    key={row.id_service || row.id}
                                >
                                    <TableCell className='text-capitalize fs-6'>
                                        {extraireCode(row.designation || row.service || '')}
                                    </TableCell>
                                    {mode === 'commission' && (
                                        <TableCell className='fs-6'>
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
                                    <TableCell className='fs-6'>
                                        <strong>
                                            {formaterNombre(Math.round(parseFloat(mode === 'commission' ? row.montant_net || 0 : row.montant || 0)))}
                                        </strong>
                                    </TableCell>
                                    {mode === 'commission' && (
                                        <TableCell className='fs-6'>
                                            <strong>
                                                {row.type_valeur === 'montant_fixe'
                                                    ? formaterNombre(Math.round(parseFloat(row.valeur || 0)))
                                                    : `${row.valeur}%`
                                                }
                                            </strong>
                                        </TableCell>
                                    )}
                                    {mode === 'commission' && (
                                        <TableCell className='fs-6'>
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
            </div>
            <div className='mt-4'>
                {mode === 'commission' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <h4 style={{ margin: 0 }}>
                            Total avant commission : {formaterNombre(Math.round(totalAvantCommission))}
                        </h4>
                        <h4 style={{ margin: 0 }}>
                            Total commission : {formaterNombre(Math.round(totalCommission))}
                        </h4>
                        <h4 style={{ margin: 0 }}>
                            Total après commission : {formaterNombre(Math.round(totalApresCommission))}
                        </h4>
                    </div>
                ) : (
                    <h4 style={{ margin: 0, textAlign: 'right' }}>
                        Total des actes : {formaterNombre(Math.round(totalStandard))}
                    </h4>
                )}
            </div>
        </div>
    </div>
  )
}
