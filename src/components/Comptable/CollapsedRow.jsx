import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { Fragment, useContext } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formaterNombre } from '../../shared/functions/functions';
import { useNavigate } from 'react-router-dom';
import { CustomContext } from '../../shared/contexts/CustomContext';

export default function CollapsedRow({ row, isOpenCollapse, handleCollapse }) {

    const { handleGrandGroupeData } = useContext(CustomContext);
    const navigate = useNavigate();

    const goToEditGrandGroupe = (e) => {
        handleGrandGroupeData(row)
        const grandGroupeId = e.target.id
        navigate(`/comptabilite/editgrandgroupe/${grandGroupeId}`)
    }

  return (
    <Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={handleCollapse}
                >
                    {isOpenCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell
                component="th"
                scope="row"
                id={`${row.id}-${row.designation}`}
                role='button'
                onClick={goToEditGrandGroupe}
            >
                {row.designation}
            </TableCell>
            <TableCell>{row.total}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={isOpenCollapse} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Rubriques associées
                        </Typography>
                        <Table size="small" aria-label="rubriques collapsed">
                            <TableHead>
                            <TableRow>
                                <TableCell className='fw-bold'>Nom rubrique</TableCell>
                                <TableCell className='fw-bold'>Pourcentage</TableCell>
                                <TableCell className='fw-bold'>Montant</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {row.id_rubriques.map((rubrique) => (
                                <TableRow key={rubrique.id_rubrique}>
                                    <TableCell component="th" scope="row">
                                        {rubrique.designation}
                                    </TableCell>
                                    <TableCell>{rubrique.pourcentage}</TableCell>
                                    <TableCell>
                                        {formaterNombre(rubrique.montant)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </Fragment>
  )
}
