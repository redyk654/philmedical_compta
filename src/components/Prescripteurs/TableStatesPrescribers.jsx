import React, { useEffect, useRef, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, Box, Button
} from '@mui/material';
import { formaterNombre } from '../../shared/functions/functions';
import { useReactToPrint } from 'react-to-print';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SumData from './SumData';
import InformationHeader from './InformationHeader';
import { useNavigate } from 'react-router-dom';
import { pathsOfUrls } from '../../shared/constants/constants';

const calculateNet = (total, percentage) => (parseInt(total) * parseInt(percentage)) / 100;

export default function TableStatesPrescribers({ data, rubriqueSelected, setData, masquerPrescriteursAZero }) {
    const [percentages, setPercentages] = useState({});
    const [isPrintPreview, setIsPrintPreview] = useState(false);
    const contentRef = useRef();
    const navigate = useNavigate();

    const handlePercentageChange = (medecinId, value) => {
        setPercentages(prev => ({ ...prev, [medecinId]: value }));
    };

    const handlePrint = useReactToPrint({
        contentRef,
    });

    const detailsForAPrescriber = (id) => {
        navigate(`${pathsOfUrls.layoutNavBar}${pathsOfUrls.prescripteurs}/details/${id}`);
    };

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
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Signature</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => {
                                const percentage = percentages[row.id_medecin] || 0;
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
                                            {!isPrintPreview && (
                                                <TextField
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    value={percentage}
                                                    onChange={(e) => handlePercentageChange(row.id_medecin, e.target.value)}
                                                    style={{ width: '80px' }}
                                                />
                                            )}
                                            {isPrintPreview && (
                                                <span>{percentage}%</span>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">{formaterNombre(net)}</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                );
                            })}
                            <SumData data={data} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                <Button variant="contained" color="primary" onClick={masquerPrescriteursAZero} style={{ marginTop: '20px' }}>
                    masquer les prescripteurs à zéro
                </Button>
                <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginTop: '20px' }}>
                    Imprimer
                </Button>
            </div>
        </Box>
    );
}
