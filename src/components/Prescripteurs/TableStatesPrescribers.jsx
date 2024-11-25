import React, { useRef, useState } from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Button } from '@mui/material'
import { formaterNombre } from '../../shared/functions/functions';
import { useReactToPrint } from 'react-to-print';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SumData from './SumData';
import InformationHeader from './InformationHeader';
import { useNavigate } from 'react-router-dom';
import { pathsOfUrls } from '../../shared/constants/constants';

const calculateNet = (total, percentage) => (parseInt(total) * parseInt(percentage)) / 100;

export default function TableStatesPrescribers({ data , rubriqueSelected}) {

    const [percentages, setPercentages] = useState(0);

    const contentRef = useRef();
    const navigate = useNavigate();

    // Mise à jour de l'état des pourcentages
    const handlePercentageChange = (medecin, value) => {
        setPercentages(value);
    };

    const handlePrint = useReactToPrint({ contentRef });

    const detailsForAPrescriber = (id) => {
        // console.log('details for prescriber:', id);
        navigate(`${pathsOfUrls.layoutNavBar}${pathsOfUrls.prescripteurs}/details/${id}`);
    }

    return (
        <Box>
            <Box component='div' ref={contentRef}>
                <InformationHeader rubriqueSelected={rubriqueSelected} />
                <TableContainer component={Paper} style={{ marginTop: '20px', maxWidth: '90%', margin: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Médecins</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantité</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Pourcentage</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Net à percevoir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => {
                                const percentage = percentages;
                                const net = calculateNet(row.total, percentage);

                                return (
                                    <TableRow key={row.medecin}>
                                        <TableCell align="left" onClick={() => detailsForAPrescriber(row.id_medecin)} role='button'>
                                            {row.medecin}
                                            <NavigateNextIcon />
                                        </TableCell>
                                        <TableCell align="center">{row.qte}</TableCell>
                                        <TableCell align="center">{formaterNombre(row.total)}</TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                value={percentage}
                                                onChange={(e) => handlePercentageChange(row.medecin, e.target.value)}
                                                style={{ width: '80px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">{formaterNombre(net)}</TableCell>
                                    </TableRow>
                                );
                            })}
                            <SumData data={data} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginTop: '20px' }}>
                Imprimer
            </Button>
        </Box>
    );
}
