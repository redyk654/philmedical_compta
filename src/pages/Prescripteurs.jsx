import React, { useContext, useEffect, useState } from 'react'
import { 
  Box, 
  Container, 
  Alert, 
  FormGroup, 
  FormControlLabel, 
  Paper,
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField
} from '@mui/material';
import { dnsPath } from '../shared/constants/constants';
import CustomTitle from '../shared/components/CustomTitle';
import { CustomContext } from '../shared/contexts/CustomContext';
import PeriodForm from '../components/Comptable/PeriodForm';
import { getRequest } from '../apis/getRequests';
import { postRequest } from '../apis/postRequests';
import TableStatesPrescribers from '../components/Prescripteurs/TableStatesPrescribers';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import { Checkbox } from '@mui/material';
import { COLORSPALETTE } from '../shared/global/palette';

export default function Prescripteurs() {

  const { 
    dateDebut,
    handleDateDebut,
    dateFin,
    handleDateFin,
    heureDebut,
    handleHeureDebut,
    heureFin,
    handleHeureFin,
    rubriqueSelected,
  } = useContext(CustomContext);

  const [data, setData] = useState([]);
  const [rubriquesSelectionnees, setRubriquesSelectionnees] = useState([]);
  const [rubriquesDisponible, setRubriquesDisponible] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  // Search state for rubriques
  const [rubriqueSearch, setRubriqueSearch] = useState('');

  // Derived filtered list of rubriques based on search input
  const filteredRubriques = rubriqueSearch
    ? rubriquesDisponible.filter(r =>
        String(r.designation || '').toLowerCase().includes(rubriqueSearch.toLowerCase())
      )
    : rubriquesDisponible;

  const getRubriquesDisponible = async () => {
    const url = `${dnsPath}gestion_rubriques.php?get_rubriques`
    try {
        const response = await getRequest(url)
        setRubriquesDisponible(response)
    } catch (error) {
        console.log('Error fetching rubriques:', error)
    } finally {
    }
  }

  const getStatsPrescripteurs = async () => {
    setIsLoadingData(true);
    const debut = dateDebut + ' ' + heureDebut;
    const fin = dateFin + ' ' + heureFin;
    
    const idsRubriques = rubriquesSelectionnees.map(designation => 
      rubriquesDisponible.find(rubrique => rubrique.designation === designation)?.id
    ).filter(id => id !== undefined);

    const data = {
      debut: debut,
      fin: fin,
      ids_rubriques: idsRubriques
    }

    const url = `${dnsPath}gestion_prescripteurs.php?get_stats_prescripteurs`
    try {
      const response = await postRequest(url, data)
      setData(response)
      console.log('Data to send:', response);
    } catch (error) {
      console.log('Error fetching stats prescripteurs:', error.message)
    } finally {
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    setAlertMessage('');
    setData([])
    if (dateDebut && heureDebut && dateFin && heureFin && rubriquesSelectionnees.length > 0 && rubriquesDisponible.length > 0) {      
      getStatsPrescripteurs();
    }
  }, [rubriquesSelectionnees, dateDebut, dateFin, heureDebut, heureFin]);

  useEffect(() => {
    getRubriquesDisponible();
  }, []);

  const masquerPrescriteursAZero = () => {
    setData(data.filter(prescripteur => parseInt(prescripteur.total) > 0));
  }

  const onChangeCheckBox = (event) => {
    const { checked, value } = event.target;
    
    if (checked) {
      setRubriquesSelectionnees(prev => 
        prev.includes(value) ? prev : [...prev, value]
      );
    } else {
      setRubriquesSelectionnees(prev => 
        prev.filter(rubrique => rubrique !== value)
      );
    }
  }

  const removeRubrique = (rubriqueToRemove) => {
    setRubriquesSelectionnees(prev => 
      prev.filter(rubrique => rubrique !== rubriqueToRemove)
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      paddingY: 3
    }}>
      {isLoadingData && <CustomizedLoader />}
      
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ 
          textAlign: 'center', 
          marginBottom: 4,
          paddingY: 2
        }}>
          <CustomTitle text='États des prescripteurs' />
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ marginTop: 1, fontSize: '1.1rem' }}
          >
            Consultez et analysez les statistiques de prescription par période et rubrique
          </Typography>
        </Box>

        {alertMessage && (
          <Alert 
            severity="error" 
            sx={{ 
              marginBottom: 3,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {alertMessage}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Configuration Panel */}
          <Grid item xs={12} lg={4}>
            <Card 
              elevation={2}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${COLORSPALETTE.gray}`,
                height: 'fit-content'
              }}
            >
              <CardHeader
                title="Configuration"
                titleTypographyProps={{ 
                  variant: 'h6', 
                  fontWeight: 600,
                  color: COLORSPALETTE.primary 
                }}
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  borderBottom: `1px solid ${COLORSPALETTE.gray}`
                }}
              />
              <CardContent sx={{ padding: 3 }}>
                {/* Period Selection */}
                <Box sx={{ marginBottom: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      marginBottom: 2,
                      color: COLORSPALETTE.primary 
                    }}
                  >
                    Période de consultation
                  </Typography>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      padding: 2, 
                      backgroundColor: '#f8f9fa',
                      border: `1px solid ${COLORSPALETTE.gray}`,
                      borderRadius: 2
                    }}
                  >
                    <PeriodForm
                      dateDebut={dateDebut}
                      dateFin={dateFin}
                      heureDebut={heureDebut}
                      heureFin={heureFin}
                      handleDateDebut={handleDateDebut}
                      handleDateFin={handleDateFin}
                      handleHeureDebut={handleHeureDebut}
                      handleHeureFin={handleHeureFin}
                    />
                  </Paper>
                </Box>

                <Divider sx={{ marginY: 3 }} />

                {/* Rubrique Selection */}
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      marginBottom: 2,
                      color: COLORSPALETTE.primary 
                    }}
                  >
                    Sélection des rubriques
                  </Typography>
                  
                  {rubriquesDisponible.length > 0 ? (
                    <Paper 
                      elevation={0}
                      sx={{ 
                        padding: 2, 
                        backgroundColor: '#f8f9fa',
                        border: `1px solid ${COLORSPALETTE.gray}`,
                        borderRadius: 2,
                        maxHeight: 300,
                        overflowY: 'auto'
                      }}
                    >
                      {/* Search field for rubriques */}
                      <Box sx={{ marginBottom: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Rechercher une rubrique..."
                          value={rubriqueSearch}
                          onChange={(e) => setRubriqueSearch(e.target.value)}
                        />
                      </Box>
                      <FormGroup>
                        {filteredRubriques.map(rubrique => (
                          <FormControlLabel 
                            key={rubrique.id}
                            sx={{ 
                              margin: 0.5,
                              padding: 1,
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(62, 70, 115, 0.04)'
                              }
                            }}
                            control={
                              <Checkbox 
                                value={rubrique.designation}
                                checked={rubriquesSelectionnees.includes(rubrique.designation)}
                                onChange={onChangeCheckBox}
                                size="small"
                                sx={{ 
                                  color: COLORSPALETTE.primary,
                                  '&.Mui-checked': {
                                    color: COLORSPALETTE.primary,
                                  }
                                }}
                              />
                            } 
                            label={
                              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                {rubrique.designation}
                              </Typography>
                            }
                          />
                        ))}
                        {filteredRubriques.length === 0 && (
                          <Box sx={{ padding: 2, color: 'text.secondary' }}>
                            Aucune rubrique trouvée
                          </Box>
                        )}
                      </FormGroup>
                    </Paper>
                  ) : (
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        padding: 3,
                        color: 'text.secondary'
                      }}
                    >
                      <Typography variant="body2">
                        Chargement des rubriques...
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Selected Rubriques Display */}
                {rubriquesSelectionnees.length > 0 && (
                  <Box sx={{ marginTop: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600, 
                        marginBottom: 1,
                        color: COLORSPALETTE.success 
                      }}
                    >
                      Rubriques sélectionnées ({rubriquesSelectionnees.length})
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1,
                      marginTop: 1
                    }}>
                      {rubriquesSelectionnees.map((rubrique, index) => (
                        <Chip
                          key={index}
                          label={rubrique}
                          onDelete={() => removeRubrique(rubrique)}
                          size="small"
                          sx={{ 
                            backgroundColor: COLORSPALETTE.success,
                            color: COLORSPALETTE.white,
                            '& .MuiChip-deleteIcon': {
                              color: COLORSPALETTE.white,
                              '&:hover': {
                                color: '#f0f0f0'
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} lg={8}>
            <Card 
              elevation={2}
              sx={{ 
                borderRadius: 3,
                border: `1px solid ${COLORSPALETTE.gray}`,
                minHeight: 400
              }}
            >
              <CardHeader
                title="Résultats"
                titleTypographyProps={{ 
                  variant: 'h6', 
                  fontWeight: 600,
                  color: COLORSPALETTE.primary 
                }}
                sx={{ 
                  backgroundColor: '#f8f9fa',
                  borderBottom: `1px solid ${COLORSPALETTE.gray}`
                }}
              />
              <CardContent sx={{ padding: 0 }}>
                {data.length > 0 ? (
                  <TableStatesPrescribers 
                    data={data} 
                    rubriqueSelected={rubriquesSelectionnees.join(', ')}
                    setData={setData} 
                    masquerPrescriteursAZero={masquerPrescriteursAZero} 
                  />
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    padding: 6,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                      Aucune donnée disponible
                    </Typography>
                    <Typography variant="body2">
                      {rubriquesSelectionnees.length === 0 
                        ? "Veuillez sélectionner au moins une rubrique pour afficher les résultats"
                        : "Aucun prescripteur trouvé pour la période et les rubriques sélectionnées"
                      }
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}