import { Box, Button, IconButton, Modal, Paper, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { modalStyle } from '../../shared/styles/CustomStyles'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { fetchDetailsRubrique, fetchRapportRubriqueParametre } from '../../apis/comptableRequests';
import DetailsRubriqueTable from './DetailsRubriqueTable';
import CloseIcon from '@mui/icons-material/Close';
import { useReactToPrint } from 'react-to-print';
import PrintDetailsRubrique from './PrintDetailsRubrique';
import { formaterNombre } from '../../shared/functions/functions';

export default function ModalDetails({ isModalDetails, handleCloseModalDetails, rubriqueSelected }) {

    const contentRef = useRef();

    const { dateDebut, dateFin, heureDebut, heureFin } = useContext(CustomContext);
    const [detailsRubrique, setDetailsRubrique] = useState([]);
    const [detailsRubriqueCommission, setDetailsRubriqueCommission] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [activeTab, setActiveTab] = useState('standard');

    useEffect(() => {
        getDetailsRubrique()
    }, [isModalDetails])

    const getDetailsRubrique = async () => {
        setDetailsRubrique([])
        setDetailsRubriqueCommission([])
        setIsLoadingData(true)
        const [response, responseCommission] = await Promise.all([
            fetchDetailsRubrique(rubriqueSelected.id, dateDebut, dateFin, heureDebut, heureFin),
            fetchRapportRubriqueParametre(rubriqueSelected.id, dateDebut, dateFin, heureDebut, heureFin)
        ]);

        if (response) {
            setDetailsRubrique(response)
        }

        if (responseCommission) {
            setDetailsRubriqueCommission(responseCommission)
        }

        setIsLoadingData(false)
    }

    const totalNet = detailsRubrique.reduce((acc, curr) => acc + parseInt(curr.montant), 0);
    const totalCommission = detailsRubriqueCommission.reduce((acc, curr) => acc + parseFloat(curr.montant_calcule || 0), 0);
    const currentData = activeTab === 'commission' ? detailsRubriqueCommission : detailsRubrique;

    const handlePrint = useReactToPrint({ contentRef });

  return (
    <Modal
        open={isModalDetails}
        onClose={handleCloseModalDetails}
    >
        <Box sx={{...modalStyle, width: 'auto', height: 540}}>
            <div>
                <Tooltip title="Fermer">
                    <IconButton onClick={handleCloseModalDetails}>
                        <CloseIcon
                            fontSize='large'
                        />
                    </IconButton>
                </Tooltip>
            </div>
            <Typography className='fw-bold' variant="h6">
                Détails de la rubrique <strong>{rubriqueSelected?.rubrique?.toUpperCase()}</strong>
                <p>
                    {activeTab === 'commission' ? 'Total commission' : 'Montant Total'} :
                    <span className='fw-bold'>
                        {' '}
                        {formaterNombre(Math.round(activeTab === 'commission' ? totalCommission : totalNet))}
                    </span>
                </p>
                <p>Total Net : <span className='fw-bold'>{formaterNombre(parseInt(rubriqueSelected?.montant || 0))}</span></p>
            </Typography>
            <Paper sx={{ mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                >
                    <Tab value="standard" label="Vue standard" />
                    <Tab value="commission" label="Vue commission" />
                </Tabs>
            </Paper>
            {isLoadingData ? (
                <Typography className='m-5 text-center' variant="h6">
                    Chargement...
                </Typography>
            ) : (
                currentData.length > 0 ? (
                    <DetailsRubriqueTable
                        detailsRubrique={currentData}
                        isLoadingData={isLoadingData}
                        mode={activeTab}
                    />
                ) : (
                    <Typography className='m-5 text-center' variant="h6">
                        Aucune donnée disponible
                    </Typography>
                )
            )}
            <div className='d-flex justify-content-center'>
                <Button variant="contained" color="primary" onClick={handlePrint} style={{ marginTop: '20px' }}>
                    Imprimer le rapport
                </Button>
            </div>
            <div className="printContent" ref={contentRef}>
                <PrintDetailsRubrique
                    detailsRubrique={currentData}
                    rubriqueSelected={rubriqueSelected}
                    mode={activeTab}
                />
            </div>
        </Box>
    </Modal>
  )
}
