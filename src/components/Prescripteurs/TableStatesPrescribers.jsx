import React, { useEffect, useRef, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, Box, Button, Chip, Typography
} from '@mui/material';
import { formaterNombre } from '../../shared/functions/functions';
import { useReactToPrint } from 'react-to-print';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SumData from './SumData';
import InformationHeader from './InformationHeader';
import { useNavigate } from 'react-router-dom';
import { pathsOfUrls } from '../../shared/constants/constants';
import { COLORSPALETTE } from '../../shared/global/palette';

const calculateNet = (total, percentage) => {
  const t = parseFloat(String(total).replace(',', '.')) || 0;
  const p = parseFloat(String(percentage)) || 0;
  return (t * p) / 100;
};

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

                {/* Enhanced Action Buttons - moved above the table */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  gap: 2,
                  padding: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  marginTop: 2,
                  marginBottom: 2
                }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VisibilityOffIcon />}
                      onClick={masquerPrescriteursAZero}
                      sx={{ 
                        borderColor: COLORSPALETTE.warning,
                        color: COLORSPALETTE.warning,
                        fontWeight: 600,
                        borderRadius: 2,
                        paddingX: 3,
                        '&:hover': {
                          borderColor: COLORSPALETTE.warning,
                          backgroundColor: `${COLORSPALETTE.warning}15`
                        }
                      }}
                    >
                      Masquer les prescripteurs à zéro
                    </Button>
                    <Button 
                      variant="contained" 
                      startIcon={<PrintIcon />}
                      onClick={handlePrint}
                      sx={{ 
                        backgroundColor: COLORSPALETTE.primary,
                        color: COLORSPALETTE.white,
                        fontWeight: 600,
                        borderRadius: 2,
                        paddingX: 3,
                        boxShadow: '0 4px 12px rgba(62, 70, 115, 0.3)',
                        '&:hover': {
                          backgroundColor: COLORSPALETTE.primary,
                          boxShadow: '0 6px 16px rgba(62, 70, 115, 0.4)'
                        }
                      }}
                    >
                      Imprimer
                    </Button>
                </Box>
            <Box component='div' ref={contentRef}>
                <InformationHeader rubriqueSelected={rubriqueSelected} />

                {/* Enhanced Table Container */}
                <TableContainer 
                  component={Paper} 
                  elevation={0}
                  sx={{ 
                    marginTop: 2,
                    border: `1px solid ${COLORSPALETTE.gray}`,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                <TableCell 
                                  align="left" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: COLORSPALETTE.primary,
                                    borderBottom: `2px solid ${COLORSPALETTE.gray}`,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  Médecins
                                </TableCell>
                                <TableCell 
                                  align="center" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: COLORSPALETTE.primary,
                                    borderBottom: `2px solid ${COLORSPALETTE.gray}`,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  Quantité
                                </TableCell>
                                <TableCell 
                                  align="center" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: COLORSPALETTE.primary,
                                    borderBottom: `2px solid ${COLORSPALETTE.gray}`,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  Total
                                </TableCell>
                                <TableCell 
                                  align="center" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: COLORSPALETTE.primary,
                                    borderBottom: `2px solid ${COLORSPALETTE.gray}`,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  Pourcentage
                                </TableCell>
                                <TableCell 
                                  align="center" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: COLORSPALETTE.primary,
                                    borderBottom: `2px solid ${COLORSPALETTE.gray}`,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  Net à percevoir
                                </TableCell>
                                <TableCell 
                                  align="center" 
                                  sx={{ 
                                    fontWeight: 700,
                                    color: COLORSPALETTE.primary,
                                    borderBottom: `2px solid ${COLORSPALETTE.gray}`,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  Signature
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => {
                                const percentage = percentages[row.id_medecin] || 0;
                                const net = calculateNet(row.total, percentage);

                                return (
                                    <TableRow 
                                      key={row.id_medecin} 
                                      hover
                                      sx={{ 
                                        backgroundColor: index % 2 === 0 ? '#fafafa' : COLORSPALETTE.white,
                                        '&:hover': {
                                          backgroundColor: 'rgba(62, 70, 115, 0.04)',
                                          cursor: 'pointer'
                                        },
                                        transition: 'background-color 0.2s ease'
                                      }}
                                    >
                                        <TableCell 
                                          align="left" 
                                          onClick={() => detailsForAPrescriber(row.id_medecin)} 
                                          role='button'
                                          sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 500,
                                            color: COLORSPALETTE.primary,
                                            '&:hover': {
                                              color: COLORSPALETTE.info
                                            }
                                          }}
                                        >
                                          {row.medecin}
                                          <NavigateNextIcon sx={{ marginLeft: 1, fontSize: '1.2rem' }} />
                                        </TableCell>
                                        <TableCell 
                                          align="center"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          <Chip 
                                            label={row.qte}
                                            size="small"
                                            sx={{ 
                                              backgroundColor: COLORSPALETTE.info,
                                              color: COLORSPALETTE.white,
                                              fontWeight: 600
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell 
                                          align="center"
                                          sx={{ 
                                            fontWeight: 600,
                                            color: COLORSPALETTE.success
                                          }}
                                        >
                                          {formaterNombre(row.total)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {!isPrintPreview && (
                                                <TextField
                                                    type="number"
                                                    variant="outlined"
                                                    size="small"
                                                    value={percentage}
                                                    onChange={(e) => handlePercentageChange(row.id_medecin, e.target.value)}
                                                    sx={{ 
                                                      width: '80px',
                                                      '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        '&:hover fieldset': {
                                                          borderColor: COLORSPALETTE.primary,
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                          borderColor: COLORSPALETTE.primary,
                                                        }
                                                      }
                                                    }}
                                                />
                                            )}
                                            {isPrintPreview && (
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                  {percentage}%
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell 
                                          align="center"
                                          sx={{ 
                                            fontWeight: 600,
                                            color: net > 0 ? COLORSPALETTE.success : 'text.secondary'
                                          }}
                                        >
                                          {formaterNombre(net)}
                                        </TableCell>
                                        <TableCell align="center">
                                          <Box sx={{ 
                                            width: 60, 
                                            height: 30, 
                                            border: `1px dashed ${COLORSPALETTE.gray}`,
                                            borderRadius: 1
                                          }} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            <SumData data={data} percentages={percentages} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}
