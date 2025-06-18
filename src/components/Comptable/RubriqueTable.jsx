import React, { useRef, useState } from 'react';
import './HandlePrint.css';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Button } from '@mui/material';
import { formaterNombre } from '../../shared/functions/functions';
import { useNavigate } from 'react-router-dom';
import { pathsOfUrls } from '../../shared/constants/constants';
import { useReactToPrint } from 'react-to-print';
import InformationHeader from '../Prescripteurs/InformationHeader';
import PrintRubrique from './PrintRubrique';

const RubriqueTable = ({ rubriques, handleOpenModalDetails, masquerRubriquesAZero }) => {
    const navigate = useNavigate();
    const contentRef = useRef();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Nouveaux états pour la sélection et le titre
    const [selectedRubriques, setSelectedRubriques] = useState([]);
    const [showTitleDialog, setShowTitleDialog] = useState(false);
    const [printTitle, setPrintTitle] = useState('');

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const goToEditRubrique = (e) => {
        const rubriqueId = e.target.id;
        navigate(`${pathsOfUrls.layoutNavBar}editrubrique/${rubriqueId}`);
    };

    // Sélection/désélection d'une rubrique
    const handleSelectRubrique = (id) => {
        setSelectedRubriques((prev) =>
            prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
        );
    };

    // Ouvre la boîte de dialogue pour le titre
    const handlePrintClick = () => setShowTitleDialog(true);

    const handleAfterPrint = () => {
        setShowTitleDialog(false);
        setPrintTitle(''); // Réinitialise le titre après impression
        setSelectedRubriques([]); // Réinitialise la sélection après impression
    };

    // Lance l'impression après validation du titre
    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: printTitle || 'Rapport Rubriques',
        onAfterPrint: handleAfterPrint,
    });

    // Rubriques sélectionnées à imprimer
    const rubriquesToPrint = rubriques.filter(r => selectedRubriques.includes(r.id));
    const totalSelected = rubriquesToPrint.reduce((acc, curr) => acc + parseInt(curr.montant), 0);

    return (
        <div>
            <InformationHeader rubriqueSelected={''} />
            <Paper sx={{ width: 690, overflow: 'hidden' }}>
                <TableContainer component={Paper} sx={{ maxWidth: 690, maxHeight: 360 }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="rubrique table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell className='fw-bold'>Nom Rubrique</TableCell>
                                <TableCell className='fw-bold'>Montant</TableCell>
                                <TableCell className='fw-bold'>Détails</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rubriques.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedRubriques.includes(row.id)}
                                            onChange={() => handleSelectRubrique(row.id)}
                                        />
                                    </TableCell>
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
                                                e.preventDefault();
                                                handleOpenModalDetails(row);
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
                <Button variant="contained" color="primary" onClick={masquerRubriquesAZero} style={{ marginTop: '20px' }}>
                    masquer les rubriques à zéro
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrintClick}
                    style={{ marginTop: '20px', marginLeft: '10px' }}
                    disabled={selectedRubriques.length === 0}
                >
                    Imprimer le rapport
                </Button>

                {/* Boîte de dialogue pour le titre */}
                {showTitleDialog && (
                    <div className="dialog-overlay">
                        <div className="dialog-box">
                            <h3>Choisir un titre pour l'impression</h3>
                            <input
                                type="text"
                                value={printTitle}
                                onChange={e => setPrintTitle(e.target.value)}
                                placeholder="Titre du rapport"
                                style={{ width: '100%', marginBottom: 10 }}
                            />
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePrint}
                                    disabled={!printTitle}
                                    style={{ marginRight: 10 }}
                                >
                                    Imprimer
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setShowTitleDialog(false)}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Zone d'impression */}
                <div className="printContent" ref={contentRef}>
                    <PrintRubrique rubriques={rubriquesToPrint} printTitle={printTitle} />
                    <div style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold' }}>
                        Total : {formaterNombre(totalSelected)}
                    </div>
                </div>
            </Paper>
            {/* Styles pour la boîte de dialogue */}
            <style>{`
                .dialog-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 9999;
                }
                .dialog-box {
                    background: #fff; padding: 24px 32px; border-radius: 8px; min-width: 320px; box-shadow: 0 2px 16px rgba(0,0,0,0.15);
                }
            `}</style>
        </div>
    );
};

export default RubriqueTable;