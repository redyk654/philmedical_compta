import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { CustomContext } from '../shared/contexts/CustomContext';
import { postRequest } from '../apis/postRequests';
import { dnsPath } from '../shared/constants/constants';
import { convertDate } from '../shared/functions/functions';
import { getRequest } from '../apis/getRequests';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import BackToHome from '../shared/components/BackToHome';

export default function DetailsPrescripteur() {

    const { dateDebut,
        dateFin,
        heureDebut,
        heureFin,
      } = useContext(CustomContext);

    const [rubriquesData, setRubriquesData] = useState([]);
    const [prescribersList, setPrescribersList] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const params = useParams();

    const fetchPrescribersList = async () => {
        const url = `${dnsPath}gestion_prescripteurs.php?liste`
        try {
            const response = await getRequest(url);
            setPrescribersList(response);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }

    useEffect(() => {
        const fetchDetailsPrescripteur = async () => {
            setIsLoadingData(true);
            const url = `${dnsPath}gestion_prescripteurs.php?details_prescripteur`
            const debut = dateDebut + ' ' + heureDebut;
            const fin = dateFin + ' ' + heureFin;
            const data = {
              debut: debut,
              fin: fin,
              id_prescripteur: params.id
            }
            
            try {
                const response = await postRequest(url, data);                
                setRubriquesData(response);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchPrescribersList();
        fetchDetailsPrescripteur();
    }, []);

    return (
        <div>
                    <div className='p-2'>
            <BackToHome />
        </div>
            {/* Loader */}
            {isLoadingData && <CustomizedLoader />}
            <h3 style={{ margin: '10px', textAlign: 'center' }}>
                Période du
                {" " + convertDate(dateDebut) + " "}
                à
                {" " + heureDebut + " "}
                au
                {" " + convertDate(dateFin) + " "}
                à
                {" " + heureFin  + " "}
            </h3>
            <h4 style={{ margin: '10px', textAlign: 'center' }}>
                Prescripteur
                <strong>{" " + prescribersList.find(prescriber => prescriber.id == params.id)?.designation}</strong>
            </h4>
            {rubriquesData.length > 0 ? rubriquesData.map((rubrique, index) => (
                <RubriqueTable key={index} rubrique={rubrique} />
            )) : <h3 style={{ marginTop: 15, textAlign: 'center' }}>Aucune donnée disponible</h3>}
        </div>
    );

}

const RubriqueTable = ({ rubrique }) => (
    <Container>
        <Box sx={{ marginTop: 5 }}>
            <Typography variant="h6">
                <strong>
                    {rubrique.rubrique.toUpperCase()}
                </strong>
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Désignation</TableCell>
                            <TableCell>Quantité</TableCell>
                            <TableCell>Montant</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubrique.services.map((service, index) => (
                            <TableRow key={index}>
                                <TableCell>{service.designation}</TableCell>
                                <TableCell>{service.total_qte}</TableCell>
                                <TableCell>{service.total_prix}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </Container>
);
