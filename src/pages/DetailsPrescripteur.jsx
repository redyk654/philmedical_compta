import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { CustomContext } from '../shared/contexts/CustomContext';
import { postRequest } from '../apis/postRequests';
import { dnsPath } from '../shared/constants/constants';
import { convertDate, formaterNombre } from '../shared/functions/functions';
import { getRequest } from '../apis/getRequests';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import BackToHome from '../shared/components/BackToHome';
import { COLORSPALETTE } from '../shared/global/palette';
import PrintRapportPrescripteur from '../components/Prescripteurs/PrintRapportPrescripteur';

export default function DetailsPrescripteur() {
  const { dateDebut, dateFin, heureDebut, heureFin } = useContext(CustomContext);
  const [rubriquesData, setRubriquesData] = useState([]);
  const [rubriquesDataParametres, setRubriquesDataParametres] = useState([]);
  const [prescribersList, setPrescribersList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState('standard');
  const params = useParams();
  const contentRef = useRef();

  useEffect(() => {
    fetchPrescribersList();
    fetchDetailsPrescripteur();
  }, [dateDebut, dateFin, heureDebut, heureFin, params.id]);

  const fetchPrescribersList = async () => {
    const url = `${dnsPath}gestion_prescripteurs.php?liste`;
    try {
      const response = await getRequest(url);
      setPrescribersList(response || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des prescripteurs :', error);
    }
  };

  const fetchDetailsPrescripteur = async () => {
    setIsLoadingData(true);
    const debut = `${dateDebut} ${heureDebut}`;
    const fin = `${dateFin} ${heureFin}`;
    const data = {
      debut,
      fin,
      id_prescripteur: params.id
    };

    try {
      const [standardResponse, parametresResponse] = await Promise.all([
        postRequest(`${dnsPath}gestion_prescripteurs.php?details_prescripteur`, data),
        postRequest(`${dnsPath}gestion_prescripteurs.php?rapport_prescripteur_parametre`, data)
      ]);
      setRubriquesData(standardResponse || []);
      setRubriquesDataParametres(parametresResponse || []);
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport prescripteur :', error);
      setRubriquesData([]);
      setRubriquesDataParametres([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handlePrint = useReactToPrint({ contentRef });

  const prescripteur = prescribersList.find((item) => String(item.id) === String(params.id));
  const totalGlobal = rubriquesDataParametres.reduce(
    (acc, rubrique) => acc + rubrique.services.reduce((sum, service) => sum + parseFloat(service.montant_calcule || 0), 0),
    0
  );
  const totalStandard = rubriquesData.reduce(
    (acc, rubrique) => acc + rubrique.services.reduce((sum, service) => sum + parseFloat(service.total_prix || 0), 0),
    0
  );
  const isTabCommission = activeTab === 'commission';
  const currentData = isTabCommission ? rubriquesDataParametres : rubriquesData;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: 2 }}>
      <Container maxWidth="xl">
        <Box className="p-2">
          <BackToHome />
        </Box>

        {isLoadingData && <CustomizedLoader />}

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Rapport prescripteur
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {prescripteur?.designation || 'Prescripteur'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Période du {convertDate(dateDebut)} à {heureDebut} au {convertDate(dateFin)} à {heureFin}
          </Typography>
        </Box>

        <Paper sx={{ mb: 3, border: `1px solid ${COLORSPALETTE.gray}` }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab value="standard" label="Vue standard" />
            <Tab value="commission" label="Vue commission" />
          </Tabs>
        </Paper>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${COLORSPALETTE.gray}`,
            backgroundColor: '#fff'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORSPALETTE.success }}>
            {isTabCommission
              ? `Total à prélever : ${formaterNombre(Math.round(totalGlobal))}`
              : `Total des actes : ${formaterNombre(Math.round(totalStandard))}`}
          </Typography>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
            Imprimer
          </Button>
        </Box>

        {currentData.length > 0 ? (
          currentData.map((rubrique) => (
            isTabCommission ? (
              <RubriqueCommissionTable key={rubrique.rubrique_id || rubrique.rubrique} rubrique={rubrique} />
            ) : (
              <RubriqueStandardTable key={rubrique.rubrique_id || rubrique.rubrique} rubrique={rubrique} />
            )
          ))
        ) : (
          <Typography sx={{ mt: 3, textAlign: 'center' }} variant="h6">
            Aucune donnée disponible
          </Typography>
        )}

        <Box sx={{ display: 'none' }}>
          <div ref={contentRef}>
            <PrintRapportPrescripteur
              mode={activeTab}
              rubriquesData={currentData}
              prescripteur={prescripteur}
              totalGlobal={isTabCommission ? totalGlobal : totalStandard}
            />
          </div>
        </Box>
      </Container>
    </Box>
  );
}

function RubriqueStandardTable({ rubrique }) {
  const totalRubrique = rubrique.services.reduce(
    (acc, service) => acc + parseFloat(service.total_prix || 0),
    0
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {String(rubrique.rubrique || '').toUpperCase()}
      </Typography>

      <TableContainer component={Paper} sx={{ border: `1px solid ${COLORSPALETTE.gray}` }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 700 }}>Désignation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Quantité</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rubrique.services.map((service) => (
              <TableRow key={service.id_service || service.designation}>
                <TableCell>{service.designation}</TableCell>
                <TableCell>{formaterNombre(parseInt(service.total_qte || 0, 10))}</TableCell>
                <TableCell>{formaterNombre(Math.round(parseFloat(service.total_prix || 0)))}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                Total rubrique
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: COLORSPALETTE.success }}>
                {formaterNombre(Math.round(totalRubrique))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function RubriqueCommissionTable({ rubrique }) {
  const totalRubrique = rubrique.services.reduce(
    (acc, service) => acc + parseFloat(service.montant_calcule || 0),
    0
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {String(rubrique.rubrique || '').toUpperCase()}
      </Typography>

      <TableContainer component={Paper} sx={{ border: `1px solid ${COLORSPALETTE.gray}` }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 700 }}>Désignation</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Prix</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Quantité</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Montant net</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Commission</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Montant calculé</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rubrique.services.map((service) => (
              <TableRow key={service.id_service}>
                <TableCell>{service.designation}</TableCell>
                <TableCell>{formaterNombre(parseInt(service.prix || 0, 10))}</TableCell>
                <TableCell>{formaterNombre(parseInt(service.total_qte || 0, 10))}</TableCell>
                <TableCell>{formaterNombre(Math.round(parseFloat(service.total_net || 0)))}</TableCell>
                <TableCell>
                  {service.type_valeur === 'montant_fixe'
                    ? formaterNombre(Math.round(parseFloat(service.valeur || 0)))
                    : `${service.valeur}%`}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: COLORSPALETTE.success }}>
                  {formaterNombre(Math.round(parseFloat(service.montant_calcule || 0)))}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} sx={{ fontWeight: 700 }}>
                Total rubrique
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: COLORSPALETTE.success }}>
                {formaterNombre(Math.round(totalRubrique))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
