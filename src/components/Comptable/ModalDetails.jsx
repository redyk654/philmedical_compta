import { Box, Button, IconButton, Modal, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { modalStyle } from '../../shared/styles/CustomStyles'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { fetchDetailsRubrique } from '../../apis/comptableRequests';
import DetailsRubriqueTable from './DetailsRubriqueTable';
import CloseIcon from '@mui/icons-material/Close';
import { useReactToPrint } from 'react-to-print';
import PrintDetailsRubrique from './PrintDetailsRubrique';

export default function ModalDetails({ isModalDetails, handleCloseModalDetails, rubriqueSelected }) {

    const contentRef = useRef();

    const { dateDebut, dateFin, heureDebut, heureFin } = useContext(CustomContext);
    const [detailsRubrique, setDetailsRubrique] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        getDetailsRubrique()
    }, [isModalDetails])

    const getDetailsRubrique = async () => {
        setIsLoadingData(true)
        const response = await fetchDetailsRubrique(rubriqueSelected.id, dateDebut, dateFin, heureDebut, heureFin);
        if (response) {
            setDetailsRubrique(response)
            setIsLoadingData(false)
        }
    }

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
            </Typography>
            {isLoadingData ? (
                <Typography className='m-5 text-center' variant="h6">
                    Chargement...
                </Typography>
            ) : (
                detailsRubrique.length > 0 ? (
                    <DetailsRubriqueTable detailsRubrique={detailsRubrique} isLoadingData={isLoadingData} />
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
                <PrintDetailsRubrique detailsRubrique={detailsRubrique} rubriqueSelected={rubriqueSelected} />
            </div>
        </Box>
    </Modal>
  )
}
