import React, { useContext, useEffect, useState } from 'react'
import { Box, Container, FormControl, InputLabel, Select, MenuItem, Alert, Link } from '@mui/material';
import { dnsPath } from '../shared/constants/constants';
import CustomTitle from '../shared/components/CustomTitle';
import { CustomContext } from '../shared/contexts/CustomContext';
import PeriodForm from '../components/Comptable/PeriodForm';
import { getRequest } from '../apis/getRequests';
import { postRequest } from '../apis/postRequests';
import TableStatesPrescribers from '../components/Prescripteurs/TableStatesPrescribers';
import CustomizedLoader from '../shared/components/CustomizedLoader';

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
    handleChangeRubrique
  } = useContext(CustomContext);

  const [data, setData] = useState([]);
  const [rubriquesDisponible, setRubriquesDisponible] = useState([]);
  // const [rubriqueSelected, setRubriqueSelected] = useState('');
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
    // if (rubriqueSelected === '' || rubriquesDisponible.length === 0) {
    //   return;
    // }
    setIsLoadingData(true);
    const debut = dateDebut + ' ' + heureDebut;
    const fin = dateFin + ' ' + heureFin;
    const data = {
      debut: debut,
      fin: fin,
      id_rubrique: rubriquesDisponible.find(rubrique => rubrique.designation.toLowerCase() === rubriqueSelected.toLowerCase())?.id
    }

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
    if (dateDebut && heureDebut && dateFin && heureFin && rubriqueSelected && rubriquesDisponible.length > 0) {      
      getStatsPrescripteurs();
    }
  }, [rubriqueSelected, dateDebut, dateFin, heureDebut, heureFin]);

  useEffect(() => {
    getRubriquesDisponible();
  }, []);

  const masquerPrescriteursAZero = (e) => {
    e.preventDefault();
    // console.log(data);
    setData(data.filter(prescripteur => parseInt(prescripteur.total) > 0));
  }

  return (
    <Box sx={{ padding:  0 }}>
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
        <FormControl sx={{ width: '25%', margin: 2 }}>
            <InputLabel id="rub">Rubrique</InputLabel>
            <Select
                labelId="rub"
                id="rub"
                value={rubriqueSelected}
                onChange={handleChangeRubrique}
                label="Rubrique"
            >
                <MenuItem aria-label="None" value="" >
                    <em>Choisir une rubrique</em>
                </MenuItem>
                {rubriquesDisponible.map(rubrique => (
                    <MenuItem key={rubrique.id} value={rubrique.designation}>
                        {rubrique.designation}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <Box>
          <Link component={'a'} style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={masquerPrescriteursAZero}>
            masquer les prescripteurs à 0
          </Link>
        </Box>
        <Box sx={{ margin: 2, height: '5vh' }}>
          {/* <CustomTitleH2>Rubrique {rubriqueSelected}</CustomTitleH2> */}
          <TableStatesPrescribers data={data} rubriqueSelected={rubriqueSelected} />
        </Box>
      </Container>
    </Box>
  )
}
