import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TuneIcon from '@mui/icons-material/Tune';
import CustomTitle from '../shared/components/CustomTitle';
import { dnsPath } from '../shared/constants/constants';
import { getRequest } from '../apis/getRequests';
import { postRequest } from '../apis/postRequests';
import { COLORSPALETTE } from '../shared/global/palette';
import { formaterNombre } from '../shared/functions/functions';

const defaultDraft = {
  id: null,
  type_valeur: 'pourcentage',
  valeur: '',
  actif: false
};

export default function PrescripteursConfig() {
  const [prescripteurs, setPrescripteurs] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedPrescripteur, setSelectedPrescripteur] = useState('');
  const [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState('');
  const [rubriqueFilter, setRubriqueFilter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);
  const [isLoadingParametrages, setIsLoadingParametrages] = useState(false);
  const [isSavingByService, setIsSavingByService] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedPrescripteur) {
      fetchParametrages(selectedPrescripteur);
    } else {
      setDrafts({});
    }
  }, [selectedPrescripteur]);

  useEffect(() => {
    setPage(0);
  }, [selectedPrescripteur, search, rubriqueFilter]);

  const fetchInitialData = async () => {
    setIsLoadingInitialData(true);
    try {
      const [prescripteursData, servicesData] = await Promise.all([
        getRequest(`${dnsPath}gestion_prescripteurs.php?liste`),
        getRequest(`${dnsPath}recuperer_services.php`)
      ]);

      setPrescripteurs(Array.isArray(prescripteursData) ? prescripteursData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: "Impossible de charger les données de configuration."
      });
    } finally {
      setIsLoadingInitialData(false);
    }
  };

  const fetchParametrages = async (idPrescripteur) => {
    setIsLoadingParametrages(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await getRequest(
        `${dnsPath}gestion_prescripteurs.php?get_parametrages_prescripteur_actes&id_prescripteur=${idPrescripteur}`
      );

      const nextDrafts = {};
      (response || []).forEach((item) => {
        nextDrafts[item.id_service] = {
          id: item.id,
          type_valeur: item.type_valeur,
          valeur: item.valeur,
          actif: parseInt(item.actif, 10) === 1
        };
      });

      setDrafts(nextDrafts);
    } catch (error) {
      setMessage({
        type: 'error',
        text: "Impossible de charger les règles de ce prescripteur."
      });
    } finally {
      setIsLoadingParametrages(false);
    }
  };

  const handleSelectedPrescripteur = (event) => {
    setSelectedPrescripteur(event.target.value);
  };

  const handleDraftChange = (serviceId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || defaultDraft),
        [field]: value
      }
    }));
  };

  const handleSave = async (serviceId) => {
    if (!selectedPrescripteur) {
      setMessage({
        type: 'warning',
        text: "Choisis d'abord un prescripteur."
      });
      return;
    }

    const draft = drafts[serviceId] || defaultDraft;
    const valeurNumerique = parseFloat(draft.valeur);

    if (Number.isNaN(valeurNumerique) || valeurNumerique < 0) {
      setMessage({
        type: 'warning',
        text: "La valeur doit être un nombre positif."
      });
      return;
    }

    setIsSavingByService((prev) => ({ ...prev, [serviceId]: true }));
    setMessage({ type: '', text: '' });

    try {
      await postRequest(`${dnsPath}gestion_prescripteurs.php?save_parametrage_prescripteur_acte`, {
        id_prescripteur: parseInt(selectedPrescripteur, 10),
        id_service: parseInt(serviceId, 10),
        type_valeur: draft.type_valeur,
        valeur: valeurNumerique,
        actif: draft.actif ? 1 : 0
      });

      setMessage({
        type: 'success',
        text: "Paramétrage enregistré avec succès."
      });

      fetchParametrages(selectedPrescripteur);
    } catch (error) {
      setMessage({
        type: 'error',
        text: "L'enregistrement du paramétrage a échoué."
      });
    } finally {
      setIsSavingByService((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleDelete = async (serviceId) => {
    const draft = drafts[serviceId];
    if (!draft?.id) {
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
      return;
    }

    setIsSavingByService((prev) => ({ ...prev, [serviceId]: true }));
    setMessage({ type: '', text: '' });

    try {
      await postRequest(`${dnsPath}gestion_prescripteurs.php?delete_parametrage_prescripteur_acte`, {
        id: draft.id
      });

      setMessage({
        type: 'success',
        text: "Paramétrage supprimé."
      });

      fetchParametrages(selectedPrescripteur);
    } catch (error) {
      setMessage({
        type: 'error',
        text: "La suppression du paramétrage a échoué."
      });
    } finally {
      setIsSavingByService((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const rubriquesDisponibles = [...new Map(
    services
      .filter((service) => service.id_rubrique)
      .map((service) => [service.id_rubrique, { id: service.id_rubrique, designation: service.rubrique }])
  ).values()];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.designation.toLowerCase().includes(search.toLowerCase());
    const matchesRubrique = rubriqueFilter ? String(service.id_rubrique) === String(rubriqueFilter) : true;
    return matchesSearch && matchesRubrique;
  });

  const paginatedServices = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalActifs = Object.values(drafts).filter((item) => item.actif).length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CustomTitle text="Configuration des actes prescripteurs" />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Définis les règles de prélèvement pour chaque prescripteur et chaque acte.
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type || 'info'} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card
              elevation={0}
              sx={{ border: `1px solid ${COLORSPALETTE.gray}`, borderRadius: 2 }}
            >
              <CardHeader
                avatar={<TuneIcon sx={{ color: COLORSPALETTE.primary }} />}
                title="Filtres"
                titleTypographyProps={{ fontWeight: 700, color: COLORSPALETTE.primary }}
                sx={{ borderBottom: `1px solid ${COLORSPALETTE.gray}` }}
              />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="prescripteur-config-label">Prescripteur</InputLabel>
                  <Select
                    labelId="prescripteur-config-label"
                    value={selectedPrescripteur}
                    label="Prescripteur"
                    onChange={handleSelectedPrescripteur}
                    disabled={isLoadingInitialData}
                  >
                    <MenuItem value="">
                      <em>Choisir un prescripteur</em>
                    </MenuItem>
                    {prescripteurs.map((prescripteur) => (
                      <MenuItem key={prescripteur.id} value={prescripteur.id}>
                        {prescripteur.designation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Rechercher un acte"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  sx={{ mb: 2 }}
                  disabled={isLoadingInitialData}
                />

                <FormControl fullWidth>
                  <InputLabel id="rubrique-filter-label">Rubrique</InputLabel>
                  <Select
                    labelId="rubrique-filter-label"
                    value={rubriqueFilter}
                    label="Rubrique"
                    onChange={(event) => setRubriqueFilter(event.target.value)}
                    disabled={isLoadingInitialData}
                  >
                    <MenuItem value="">
                      <em>Toutes les rubriques</em>
                    </MenuItem>
                    {rubriquesDisponibles.map((rubrique) => (
                      <MenuItem key={rubrique.id} value={rubrique.id}>
                        {rubrique.designation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${services.length} actes`}
                    sx={{ backgroundColor: `${COLORSPALETTE.info}18`, color: COLORSPALETTE.info }}
                  />
                  <Chip
                    label={`${totalActifs} règles actives`}
                    sx={{ backgroundColor: `${COLORSPALETTE.success}18`, color: COLORSPALETTE.success }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: `1px solid ${COLORSPALETTE.gray}`, borderRadius: 2 }}
            >
              {(isLoadingInitialData || isLoadingParametrages) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    py: 2,
                    borderBottom: `1px solid ${COLORSPALETTE.gray}`,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <CircularProgress size={22} />
                  <Typography variant="body2" color="text.secondary">
                    Chargement des paramètres...
                  </Typography>
                </Box>
              )}
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Acte</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rubrique</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Prix</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actif</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Valeur</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedServices.map((service) => {
                    const draft = drafts[service.id] || defaultDraft;
                    const isSaving = Boolean(isSavingByService[service.id]);

                    return (
                      <TableRow key={service.id} hover>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600 }}>{service.designation}</Typography>
                        </TableCell>
                        <TableCell>{service.rubrique || '-'}</TableCell>
                        <TableCell>{formaterNombre(service.prix)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={Boolean(draft.actif)}
                            onChange={(event) => handleDraftChange(service.id, 'actif', event.target.checked)}
                            color="success"
                            disabled={!selectedPrescripteur || isLoadingInitialData || isLoadingParametrages}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={draft.type_valeur}
                              onChange={(event) => handleDraftChange(service.id, 'type_valeur', event.target.value)}
                              disabled={!selectedPrescripteur || isLoadingInitialData || isLoadingParametrages}
                            >
                              <MenuItem value="pourcentage">Pourcentage</MenuItem>
                              <MenuItem value="montant_fixe">Montant fixe</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={draft.valeur}
                            onChange={(event) => handleDraftChange(service.id, 'valeur', event.target.value)}
                            disabled={!selectedPrescripteur || isLoadingInitialData || isLoadingParametrages}
                            inputProps={{ min: 0 }}
                            placeholder={draft.type_valeur === 'montant_fixe' ? '2000' : '10'}
                            sx={{
                              minWidth: 120,
                              '& .MuiInputBase-input': {
                                textAlign: 'right'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<SaveIcon />}
                              onClick={() => handleSave(service.id)}
                              disabled={!selectedPrescripteur || isSaving || isLoadingInitialData || isLoadingParametrages}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => handleDelete(service.id)}
                              disabled={!selectedPrescripteur || isSaving || isLoadingInitialData || isLoadingParametrages}
                            >
                              Supprimer
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredServices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Aucun acte ne correspond aux filtres.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredServices.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                labelRowsPerPage="Actes par page"
              />
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
