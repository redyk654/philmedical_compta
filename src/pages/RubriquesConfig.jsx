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
import CategoryIcon from '@mui/icons-material/Category';
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

export default function RubriquesConfig() {
  const [rubriques, setRubriques] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedRubrique, setSelectedRubrique] = useState('');
  const [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState('');
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
    if (selectedRubrique) {
      fetchParametrages(selectedRubrique);
    } else {
      setDrafts({});
    }
  }, [selectedRubrique]);

  useEffect(() => {
    setPage(0);
  }, [selectedRubrique, search]);

  const fetchInitialData = async () => {
    setIsLoadingInitialData(true);
    try {
      const [rubriquesData, servicesData] = await Promise.all([
        getRequest(`${dnsPath}gestion_rubriques.php?get_rubriques`),
        getRequest(`${dnsPath}recuperer_services.php`)
      ]);

      setRubriques(Array.isArray(rubriquesData) ? rubriquesData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: "Impossible de charger les données de configuration des rubriques."
      });
    } finally {
      setIsLoadingInitialData(false);
    }
  };

  const fetchParametrages = async (idRubrique) => {
    setIsLoadingParametrages(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await getRequest(
        `${dnsPath}gestion_rubriques.php?get_parametrages_rubrique_actes&id_rubrique=${idRubrique}`
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
        text: "Impossible de charger les règles de cette rubrique."
      });
    } finally {
      setIsLoadingParametrages(false);
    }
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
    if (!selectedRubrique) {
      setMessage({
        type: 'warning',
        text: "Choisis d'abord une rubrique."
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
      await postRequest(`${dnsPath}gestion_rubriques.php?save_parametrage_rubrique_acte`, {
        id_rubrique: parseInt(selectedRubrique, 10),
        id_service: parseInt(serviceId, 10),
        type_valeur: draft.type_valeur,
        valeur: valeurNumerique,
        actif: draft.actif ? 1 : 0
      });

      setMessage({
        type: 'success',
        text: "Paramétrage enregistré avec succès."
      });

      fetchParametrages(selectedRubrique);
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
      await postRequest(`${dnsPath}gestion_rubriques.php?delete_parametrage_rubrique_acte`, {
        id: draft.id
      });

      setMessage({
        type: 'success',
        text: "Paramétrage supprimé."
      });

      fetchParametrages(selectedRubrique);
    } catch (error) {
      setMessage({
        type: 'error',
        text: "La suppression du paramétrage a échoué."
      });
    } finally {
      setIsSavingByService((prev) => ({ ...prev, [serviceId]: false }));
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesRubrique = selectedRubrique ? String(service.id_rubrique) === String(selectedRubrique) : true;
    const matchesSearch = service.designation.toLowerCase().includes(search.toLowerCase());
    return matchesRubrique && matchesSearch;
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
          <CustomTitle text="Configuration des actes rubriques" />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Définis les règles de prélèvement pour les actes d'une rubrique.
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type || 'info'} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ border: `1px solid ${COLORSPALETTE.gray}`, borderRadius: 2 }}>
              <CardHeader
                avatar={<CategoryIcon sx={{ color: COLORSPALETTE.primary }} />}
                title="Filtres"
                titleTypographyProps={{ fontWeight: 700, color: COLORSPALETTE.primary }}
                sx={{ borderBottom: `1px solid ${COLORSPALETTE.gray}` }}
              />
              <CardContent>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="rubrique-config-label">Rubrique</InputLabel>
                  <Select
                    labelId="rubrique-config-label"
                    value={selectedRubrique}
                    label="Rubrique"
                    onChange={(event) => setSelectedRubrique(event.target.value)}
                    disabled={isLoadingInitialData}
                  >
                    <MenuItem value="">
                      <em>Choisir une rubrique</em>
                    </MenuItem>
                    {rubriques.map((rubrique) => (
                      <MenuItem key={rubrique.id} value={rubrique.id}>
                        {rubrique.designation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Rechercher un acte"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  disabled={isLoadingInitialData}
                />

                <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${filteredServices.length} actes`}
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
                        <TableCell>{formaterNombre(service.prix)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={Boolean(draft.actif)}
                            onChange={(event) => handleDraftChange(service.id, 'actif', event.target.checked)}
                            color="success"
                            disabled={!selectedRubrique || isLoadingInitialData || isLoadingParametrages}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth size="small">
                            <Select
                              value={draft.type_valeur}
                              onChange={(event) => handleDraftChange(service.id, 'type_valeur', event.target.value)}
                              disabled={!selectedRubrique || isLoadingInitialData || isLoadingParametrages}
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
                            disabled={!selectedRubrique || isLoadingInitialData || isLoadingParametrages}
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
                              disabled={!selectedRubrique || isSaving || isLoadingInitialData || isLoadingParametrages}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => handleDelete(service.id)}
                              disabled={!selectedRubrique || isSaving || isLoadingInitialData || isLoadingParametrages}
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
                      <TableCell colSpan={6} align="center">
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
