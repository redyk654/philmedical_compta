import React, { useRef, useState } from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Button } from '@mui/material'
import { formaterNombre } from '../../shared/functions/functions';
import { useReactToPrint } from 'react-to-print';

const calculateNet = (total, percentage) => (total * percentage) / 100;

export default function TableStatesPrescribers({ data }) {
    const [percentages, setPercentages] = useState({});
    const contentRef = useRef();

    // Mise à jour de l'état des pourcentages
    const handlePercentageChange = (medecin, value) => {
        setPercentages((prev) => ({
            ...prev,
            [medecin]: value,
        }));
    };

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Box>
            <Box component='div' ref={contentRef}>
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
                                const percentage = percentages[row.medecin] || 0;
                                const net = calculateNet(row.total, percentage);

                                return (
                                    <TableRow key={row.medecin}>
                                        <TableCell align="left">{row.medecin}</TableCell>
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
