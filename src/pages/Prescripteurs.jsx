import React, { useContext, useEffect, useState } from 'react'
import { Box, Container, FormControl, InputLabel, Select, MenuItem, Alert, Link, FormGroup, FormControlLabel } from '@mui/material';
import { dnsPath } from '../shared/constants/constants';
import CustomTitle from '../shared/components/CustomTitle';
import { CustomContext } from '../shared/contexts/CustomContext';
import PeriodForm from '../components/Comptable/PeriodForm';
import { getRequest } from '../apis/getRequests';
import { postRequest } from '../apis/postRequests';
import TableStatesPrescribers from '../components/Prescripteurs/TableStatesPrescribers';
import CustomizedLoader from '../shared/components/CustomizedLoader';
import { Checkbox } from '@mui/material'; // ✅ Import correct

export default function Prescripteurs() {

  const { dateDebut,
    handleDateDebut,
    dateFin,
    handleDateFin,
    heureDebut,
    handleHeureDebut,
    heureFin,
    handleHeureFin,
    rubriqueSelected,
    // handleChangeRubrique
  } = useContext(CustomContext);

  const [data, setData] = useState([]);
  // ✅ Changé pour gérer un tableau de sélections
  const [rubriquesSelectionnees, setRubriquesSelectionnees] = useState([]);
  const [rubriquesDisponible, setRubriquesDisponible] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);

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
    
    // ✅ Gérer plusieurs rubriques sélectionnées
    const idsRubriques = rubriquesSelectionnees.map(designation => 
      rubriquesDisponible.find(rubrique => rubrique.designation === designation)?.id
    ).filter(id => id !== undefined);

    const data = {
      debut: debut,
      fin: fin,
      ids_rubriques: idsRubriques // Envoyer un tableau d'IDs
    }

    console.log('Data to send:', data);
    

    const url = `${dnsPath}gestion_prescripteurs.php?get_stats_prescripteurs`
    try {
      const response = await postRequest(url, data)      
      setData(response)
    } catch (error) {
      console.log('Error fetching stats prescripteurs:', error.message)
    } finally {
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    setAlertMessage('');
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

  // ✅ Nouvelle fonction pour gérer la sélection multiple
  const onChangeCheckBox = (event) => {
    const { checked, value } = event.target;
    
    if (checked) {
      // Ajouter la rubrique si elle n'est pas déjà sélectionnée
      setRubriquesSelectionnees(prev => 
        prev.includes(value) ? prev : [...prev, value]
      );
    } else {
      // Retirer la rubrique de la sélection
      setRubriquesSelectionnees(prev => 
        prev.filter(rubrique => rubrique !== value)
      );
    }
  }

  return (
    <Box sx={{ padding: 0 }}>
      {/* Loader */}
      {isLoadingData && <CustomizedLoader />}
      <Container>
        <CustomTitle text='Etats des prescripteurs' />
        {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
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
          <Box sx={{ margin: 2 }}>
            <FormGroup 
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // ✅ Grid responsive
                gap: 1, // Espacement entre les éléments
                maxWidth: '100%'
              }}
            >
              {rubriquesDisponible.map(rubrique => (
                <FormControlLabel 
                  key={rubrique.id}
                  sx={{
                    margin: 0, // ✅ Supprimer la marge par défaut
                    whiteSpace: 'nowrap' // ✅ Éviter le retour à la ligne du texte
                  }}
                  control={
                    <Checkbox 
                      value={rubrique.designation}
                      checked={rubriquesSelectionnees.includes(rubrique.designation)}
                      onChange={onChangeCheckBox}
                      size="small" // ✅ Checkbox plus petite pour économiser l'espace
                    />
                  } 
                  label={rubrique.designation}
                />
              ))}
            </FormGroup>
        </Box>
        
        {/* ✅ Affichage des rubriques sélectionnées pour debug */}
        {rubriquesSelectionnees.length > 0 && (
          <Box sx={{ margin: 2 }}>
            <strong>Rubriques sélectionnées:</strong> {rubriquesSelectionnees.join(', ')}
          </Box>
        )}
        
        <Box>
          {/* <Link component={'a'} style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={masquerPrescriteursAZero}>
            masquer les prescripteurs à 0
          </Link> */}
        </Box>
        <Box sx={{ margin: 2, height: '5vh' }}>
          <TableStatesPrescribers 
            data={data} 
            rubriqueSelected={rubriquesSelectionnees.join(', ')} // ✅ Passer toutes les rubriques sélectionnées
            setData={setData} 
            masquerPrescriteursAZero={masquerPrescriteursAZero} 
          />
        </Box>
      </Container>
    </Box>
  )
}