import { Box, IconButton, Modal, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { modalStyle } from '../../shared/styles/CustomStyles'
import { CustomContext } from '../../shared/contexts/CustomContext';
import { fetchDetailsRubrique } from '../../apis/comptableRequests';
import DetailsRubriqueTable from './DetailsRubriqueTable';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalDetails({ isModalDetails, handleCloseModalDetails, rubriqueSelected }) {

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
        </Box>
    </Modal>
  )
}
